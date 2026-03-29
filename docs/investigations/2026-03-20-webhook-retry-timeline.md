# Investigation: Webhook retry timing anomaly

## Date
2026-03-20

## Summary
Staging receivers reported bursts of retries earlier than the backoff table predicted.

## Timeline Reconstruction
1. A job failed on its first delivery attempt.
2. The worker marked the attempt as failed.
3. The next retry time was computed from the stale stored `attemptCount`.
4. The dispatcher still exposed the human-visible attempt number as `attemptCount + 1`.
5. Operations compared the header value with the reschedule delay and noticed they did not line up.

## Conclusion
The bug was not in the jitter formula itself. The bug was in when the worker treated an attempt as completed.

## Cross-Checks
- Review the worker logic in `src/jobs/webhookWorker.ts`.
- Compare the attempt header behavior in `src/webhooks/dispatcher.ts`.
- Confirm release packaging in `docs/releases/2026-03-21-v1.6.1.md`.
