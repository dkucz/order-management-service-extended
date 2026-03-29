# Issue #87: Stripe webhook signature failures behind JSON-parsing proxy

## Opened
2026-02-11

## Summary
Stripe webhook deliveries started failing in staging with `400` responses after the edge proxy rollout.

## Symptoms
- Stripe retries the same event multiple times.
- The service logs `Webhook Error: No signatures found matching the expected signature for payload`.
- Replaying the exact event directly against the pod succeeds, but replaying through the proxy fails.

## Root Cause
The proxy normalized the request body into JSON before forwarding it. Stripe signs the raw byte stream, so re-serializing the body changes the payload and invalidates the `stripe-signature` header.

## Decision
- Keep the Stripe route mounted before any JSON body parser.
- Use `express.raw({ type: 'application/json' })` on `POST /api/webhooks/stripe`.
- Do not add JWT auth middleware to the Stripe webhook route.

## Acceptance Criteria
- Missing or invalid `stripe-signature` returns `400`.
- Valid signed raw payloads succeed.
- Integration docs explicitly warn test harnesses and proxies not to parse and re-stringify the body.
