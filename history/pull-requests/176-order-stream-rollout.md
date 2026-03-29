# PR #176: Roll out `order_stream` as the canonical exchange name

## Status
Merged on 2026-03-12

## Summary
This PR updates the integration contract so new consumers bind to `order_stream` instead of `order_events`.

## Scope
- Add migration guidance for downstream teams.
- Update release notes.
- Preserve the `order.created` routing key.
- Keep exchange type `topic` and `durable=true`.

## Non-Goals
- This PR does not rewrite every internal reference to the legacy hyphenated DLQ topology.
- This PR does not change payload shape.

## Rollout Plan
1. Publish migration guide.
2. Update external integration docs and benchmark fixtures.
3. Give consumers a 7-day warning window before removing the old publisher alias.
