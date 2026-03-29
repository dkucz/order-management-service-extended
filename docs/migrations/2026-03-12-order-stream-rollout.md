# Migration Guide: `order_events` to `order_stream`

## Effective Date
2026-03-12

## Before
- Exchange name: `order_events`

## After
- Exchange name: `order_stream`

## What Changed
Only the exchange name changed.

## What Did Not Change
- Exchange type remains `topic`
- Exchange durability remains `true`
- Routing key `order.created` is unchanged
- Event payload shape is unchanged

## Consumer Action Required
Update bindings, publishers, and IaC modules that still reference `order_events`.

## Warning About Legacy Internal Names
Some internal RabbitMQ setup code still contains the hyphenated legacy name `order-events` for DLQ topology constants. Treat those as implementation leftovers, not as the external contract.
