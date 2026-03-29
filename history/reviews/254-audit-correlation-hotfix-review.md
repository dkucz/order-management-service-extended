# Review Thread: PR #254

## Reviewer
Does this patch make audit logging mandatory for order updates?

## Author
No. The behavior stays best-effort. We only improved correlation propagation so successful business operations produce more traceable audit rows.

## Reviewer
Please make that explicit in the PR notes and release summary so nobody mistakes this for transactional auditing.
