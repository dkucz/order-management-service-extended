# PR #188: Clarify that cursor pagination remains the public contract

## Status
Merged on 2026-03-19

## Summary
Swagger route comments accidentally advertised a page-based shape that belongs to an unreleased admin console flow. This PR keeps the public integration contract on cursor pagination until a dedicated admin endpoint exists.

## Reviewer Checklist
- Public docs remain cursor-based.
- Benchmark questions should force models to reconcile the swagger drift instead of blindly trusting the nearest snippet.
- No runtime behavior change in this PR; this is documentation and evaluation hygiene.
