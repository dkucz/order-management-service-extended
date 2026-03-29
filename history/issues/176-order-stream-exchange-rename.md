# Issue #176: Rename RabbitMQ exchange to `order_stream`

## Opened
2026-03-10

## Motivation
We have three different names floating around in docs and scripts:
- `order_events`
- `order-events`
- `order_stream`

The platform naming convention for shared event buses is `<domain>_stream`, so the order service should converge on `order_stream`.

## Requirements
- Preserve routing keys during the rename.
- Keep the exchange type as `topic`.
- Keep durability enabled.
- Publish migration guidance for downstream consumers.

## Rollout Notes
- T1: canonical external docs said `order_events`.
- T2: canonical external docs say `order_stream`.
- Internal DLQ code may still reference the hyphenated legacy name `order-events` until the topology constants are centralized.

## Done When
- Release notes call out the rename.
- Migration guide tells consumers what changed and what did not.
- New integrations default to `order_stream`.
