# Issue #233: Paid orders stay PENDING when PaymentIntent metadata omits `orderId`

## Opened
2026-03-16

## Summary
Support saw orders remain in `PENDING` even though Stripe marked the payment as successful.

## Root Cause
The webhook handler links a payment back to an order using `paymentIntent.metadata.orderId`. Several client implementations created PaymentIntents without that metadata key.

## Evidence
- Webhook delivery succeeds.
- No signature error is logged.
- The order never transitions because no order lookup key is available.

## Action Items
- Update integration docs to show the required metadata payload.
- Add a benchmark question that distinguishes signature failures from missing linkage metadata.
