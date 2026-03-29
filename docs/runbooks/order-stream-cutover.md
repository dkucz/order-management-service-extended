# Runbook: Order Stream Cutover

## Goal
Move downstream consumers from `order_events` to `order_stream` without changing routing keys or payloads.

## Preconditions
- Consumer currently binds to `order.created`.
- Consumer can update exchange configuration independently of message schema.

## Steps
1. Change the exchange name to `order_stream`.
2. Keep routing key bindings unchanged.
3. Verify the exchange is still declared as `topic` and durable.
4. Replay a non-production `order.created` event through the consumer.

## Do Not Change
- Routing keys
- Event payload shape
- Consumer deserialization logic
