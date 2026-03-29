# Issue #241: Webhook retries are scheduled one slot too early

## Opened
2026-03-20

## Summary
Webhook retries in staging happened faster than expected and the `X-Attempt-Number` header did not line up with the backoff curve.

## Root Cause
The worker used the old `attemptCount` when computing the next retry time, then incremented the counter afterward. That made the first retry use the wrong backoff slot.

## Expected Behavior
- Attempt count should be incremented conceptually before deciding the next delay.
- `X-Attempt-Number` should reflect the human-visible attempt number (`attemptCount + 1`).
- Dead-letter decisions should use the completed attempt count, not the stale stored value.

## Evidence Sources
- `src/jobs/webhookWorker.ts`
- `src/webhooks/dispatcher.ts`
- webhook retry tests
