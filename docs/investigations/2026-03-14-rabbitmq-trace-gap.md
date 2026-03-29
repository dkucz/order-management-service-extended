# Investigation: RabbitMQ trace gap after webhook ingestion

## Date
2026-03-14

## Summary
Operators could see the inbound Stripe webhook span, but the downstream RabbitMQ work appeared as an orphaned trace.

## What We Checked
- HTTP requests already had `x-correlation-id`.
- RabbitMQ publish calls were happening.
- The trace context was not being injected into message headers on every path.
- One callback-based amqplib path lost the active context.

## Result
`x-correlation-id` remained useful for log correlation, but it did not restore a proper distributed trace tree. The missing piece was OpenTelemetry propagation through RabbitMQ headers.

## Related Artifacts
- Issue #142
- PR #143
- `src/events/publisher.ts`
- tracing implementation notes
