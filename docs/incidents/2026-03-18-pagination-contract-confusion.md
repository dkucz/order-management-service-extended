# Incident: Conflicting pagination guidance for `/api/orders`

## Date
2026-03-18

## Summary
Two client teams implemented different pagination schemes because the repo advertised both cursor pagination and page-based pagination.

## Evidence
- `docs/integration/pagination.md` documents `cursor`, `nextCursor`, and `hasMore`.
- Swagger comments on `src/routes/orders.ts` mention `page`, `limit`, and approximate `total`.

## Decision
For external clients, cursor pagination is still canonical. The page-based swagger block came from an internal admin branch and should not be treated as the released contract.

## Follow-up
- Separate internal/admin route docs from public integration docs.
- Add evaluation questions that reward conflict resolution instead of naive nearest-document lookup.
