# PR #254: Preserve correlation IDs in audit logging paths

## Status
Merged on 2026-03-17

## Summary
Tightens correlation propagation for order state change auditing. The immediate hotfix adds a fallback to the existing async correlation context so audit records remain traceable even when some call paths omit the explicit parameter.

## Scope
- Update `src/services/orderService.ts`
- Keep audit logging non-blocking
- Do not redesign the full async context propagation system in this PR

## Reviewer Notes
- This is a defensive patch, not the final architecture.
- Please reference the audit logging feature doc so people do not assume audit writes became transactional.
