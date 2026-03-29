# ADR 004: Sources of Truth for Public API Contracts

## Status
Accepted

## Context
The repository contains multiple ways to describe behavior:
- integration guides
- Swagger annotations
- runbooks
- release notes

These sources do not all serve the same audience, and drift between them caused external teams to implement the wrong pagination behavior.

## Decision
For externally supported API behavior:
1. `docs/integration/*` is the canonical contract.
2. Release notes may supersede older integration guidance when they explicitly announce a migration or behavioral change.
3. Swagger annotations are useful hints, but if they conflict with the published integration docs they are not authoritative for external clients.
4. Runbooks are operational guidance, not client contracts.

## Consequences
- Benchmarks should reward systems that reconcile conflicting artifacts instead of blindly trusting the closest snippet.
- Contract-drift incidents should be documented and linked to corrective PRs.
