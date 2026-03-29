# Issue #142: Correlation context disappears across RabbitMQ publish/consume path

## Opened
2026-02-27

## Summary
Trace trees stop at the HTTP boundary. The Stripe webhook span and the downstream RabbitMQ work cannot be stitched together reliably.

## Investigation Notes
- HTTP requests have a `x-correlation-id`, but the ID is not enough once work leaves the process.
- RabbitMQ messages were published without OpenTelemetry propagation headers.
- One amqplib callback path dropped the active context entirely.

## Resolution Plan
- Initialize the OpenTelemetry Node SDK.
- Inject active context into RabbitMQ publish headers.
- Extract context on consume.
- Keep the short 50ms RabbitMQ/Stripe timing workaround that avoided a staging race during rollout.

## Why This Matters
The team needs to trace `Stripe webhook -> RabbitMQ publish -> downstream consumer` as a single flow, not as unrelated log lines.
