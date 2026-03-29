# PR #241: Fix webhook retry scheduling off-by-one

## Status
Merged on 2026-03-21

## Summary
Use the completed attempt count consistently when deciding whether a job is dead, what `X-Attempt-Number` should be, and when the next retry should run.

## Files Called Out In Review
- `src/jobs/webhookWorker.ts`
- `src/webhooks/dispatcher.ts`
- `tests/unit/webhooks/backoff.spec.ts`
- `tests/unit/webhooks/dispatcher.spec.ts`

## Reviewer Notes
- Preserve full jitter.
- Do not reset `attemptCount` during manual retries; ops wants the historical count.
