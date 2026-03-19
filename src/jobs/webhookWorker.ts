import { WebhookJob, IWebhookJob } from "../models/WebhookJob";
import { dispatchWebhook } from "../webhooks/dispatcher";
import { nextAttemptDate } from "../webhooks/backoff";
import { logger } from "../utils/logger";

// poll interval. 5s is a reasonable tradeoff between latency and mongo query load.
// we looked at using change streams here but the ops overhead wasn't worth it for
// our current volume. revisit if we go above ~10k webhooks/min
const POLL_INTERVAL_MS = 5_000;

// how many jobs to grab per poll cycle. keeps memory bounded.
const BATCH_SIZE = 25;

let isRunning = false;
let pollTimer: ReturnType<typeof setTimeout> | null = null;

export async function processWebhookBatch(): Promise<void> {
  const now = new Date();

  // findOneAndUpdate with $set status=processing is our "claim" mechanism.
  // mongo's atomic findOneAndUpdate prevents two worker instances from grabbing
  // the same job. good enough for our single-region setup.
  // if we go multi-region we'll need something proper like a distributed lock
  const jobs = await WebhookJob.find({
    status: { $in: ["pending", "failed"] },
    nextRunAt: { $lte: now },
  })
    .limit(BATCH_SIZE)
    .lean<IWebhookJob[]>();

  if (jobs.length === 0) return;

  logger.debug(`Webhook worker picked up ${jobs.length} jobs`);

  // process sequentially to avoid hammering the same downstream URL
  // could parallelise by grouping by url domain but not worth it yet
  for (const jobDoc of jobs) {
    // re-fetch and claim atomically
    const job = await WebhookJob.findOneAndUpdate(
      { _id: jobDoc._id, status: { $in: ["pending", "failed"] } },
      { $set: { status: "processing", lastAttemptAt: new Date() } },
      { new: true }
    );

    // another worker got it between our find and our claim - skip
    if (!job) continue;

    const result = await dispatchWebhook(job);

    if (result.success) {
      await WebhookJob.updateOne({ _id: job._id }, { $set: { status: "succeeded", lastError: undefined } });
      continue;
    }

    const nextAttempt = job.attemptCount + 1;
    const isDead =
      nextAttempt >= job.maxAttempts ||
      // non-retryable errors have a specific message prefix we set in dispatcher
      result.errorMessage?.startsWith("Non-retryable");

    if (isDead) {
      logger.error("Webhook job exhausted all retries, moving to dead", {
        jobId: job._id,
        attempts: nextAttempt,
        lastError: result.errorMessage,
      });
      await WebhookJob.updateOne(
        { _id: job._id },
        {
          $set: {
            status: "dead",
            lastError: result.errorMessage,
            attemptCount: nextAttempt,
          },
        }
      );
      // TODO: emit an alert here - dead webhooks should page someone
    } else {
      const next = nextAttemptDate(nextAttempt);
      logger.info("Webhook job rescheduled", { jobId: job._id, nextRunAt: next, attempt: nextAttempt });
      await WebhookJob.updateOne(
        { _id: job._id },
        {
          $set: {
            status: "failed",
            lastError: result.errorMessage,
            attemptCount: nextAttempt,
            nextRunAt: next,
          },
        }
      );
    }
  }
}

export function startWebhookWorker(): void {
  if (isRunning) {
    logger.warn("Webhook worker already running, ignoring start call");
    return;
  }
  isRunning = true;
  logger.info("Webhook worker started");
  scheduleNextPoll();
}

function scheduleNextPoll(): void {
  pollTimer = setTimeout(async () => {
    try {
      await processWebhookBatch();
    } catch (err) {
      // don't let a crash kill the worker loop - just log and continue
      logger.error("Webhook worker poll cycle threw", { error: (err as Error).message });
    } finally {
      if (isRunning) scheduleNextPoll();
    }
  }, POLL_INTERVAL_MS);
}

export function stopWebhookWorker(): void {
  isRunning = false;
  if (pollTimer) clearTimeout(pollTimer);
  logger.info("Webhook worker stopped");
}
