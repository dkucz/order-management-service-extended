# Runbook: Replay dead webhook jobs

## Goal
Safely retry a failed outbound webhook after the receiver or payload issue is fixed.

## Facts To Remember
- The worker polls every 5 seconds.
- Manual retry sets the job back to `pending` and `nextRunAt = now`.
- Manual retry does **not** reset `attemptCount`; operations wants the retry history preserved.
- Jobs in `succeeded` or `processing` cannot be manually retried.

## Steps
1. Authenticate to the admin route.
2. Inspect recent jobs with `GET /webhooks/jobs` or aggregate status counts with `GET /webhooks/stats`.
3. Retry a dead or failed job with `POST /webhooks/jobs/:id/retry`.
4. Carry forward the original `x-correlation-id` when possible for traceability.
