# Incident: Stripe signature verification failures in staging

## Date
2026-03-05

## Impact
Staging webhook tests failed for 2 hours. Payment success events were retried by Stripe and no orders were updated from `PENDING`.

## Trigger
A new proxy path parsed `application/json` and re-serialized the body before forwarding the request to the order service.

## Root Cause
Stripe signs the original raw bytes. The proxy changed the payload, so the service could no longer validate the `stripe-signature` header.

## Mitigation
- Bypassed the proxy transform for `/api/webhooks/stripe`.
- Reconfirmed the route uses `express.raw({ type: 'application/json' })`.
- Added stronger docs warning against parsed-body forwarding in tests and proxies.

## Lessons
Webhook authenticity depends on transport-level fidelity, not just equivalent JSON content.
