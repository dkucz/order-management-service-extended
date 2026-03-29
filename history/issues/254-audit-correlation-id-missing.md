# Issue #254: Audit rows sometimes miss correlation IDs

## Opened
2026-03-17

## Summary
Order state changes were being recorded in the audit log without a correlation ID even though incoming HTTP requests already had one.

## Root Cause
`updateOrderStatus()` accepted an optional correlation ID, but some async call paths did not pass it through. The audit logger is best-effort and intentionally does not throw, so the missing field was silent.

## Fix Direction
- Prefer explicitly passing the correlation ID through service calls.
- Until async context plumbing is cleaned up, fall back to the global correlation context used by the logger.

## Why This Was Hard To Notice
Business behavior still succeeded because audit logging failures are non-blocking.
