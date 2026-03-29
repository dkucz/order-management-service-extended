# PR #143: Implement OpenTelemetry propagation for RabbitMQ

## Status
Merged on 2026-03-01

## Changes
- Initialize the OpenTelemetry Node SDK.
- Inject active trace context into RabbitMQ publish headers.
- Extract context on the consumer side.
- Document why OTLP HTTP was chosen over gRPC for this service.

## Reviewer Notes
- Keep the existing `x-correlation-id`; it helps logs even when tracing is degraded.
- Call out the amqplib callback context-loss bug in the PR summary so future maintainers do not remove the workaround casually.
