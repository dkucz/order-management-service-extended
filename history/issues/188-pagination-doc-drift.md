# Issue #188: Swagger order pagination docs drifted from public integration contract

## Opened
2026-03-18

## Summary
The Swagger annotations on `src/routes/orders.ts` describe a page-based response with `page`, `limit`, and approximate `total`, but the public integration docs still describe cursor pagination with `nextCursor` and `hasMore`.

## What Happened
The Swagger block was copied from an internal admin console branch and merged before the external API contract changed.

## Current Decision
- External integrators must follow `docs/integration/pagination.md`.
- The public benchmark should treat cursor pagination as canonical for `/api/orders`.
- The Swagger block is evidence of drift, not the released external contract.

## Follow-up
- Split admin pagination docs from public order-list docs.
- Do not promise `estimatedDocumentCount()` behavior to external clients until the admin endpoint ships.
