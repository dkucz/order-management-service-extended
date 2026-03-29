# Review Thread: PR #176

## Reviewer A
Please be explicit that only the exchange name changes. We should not make downstream teams wonder whether they also need to update routing keys or durability flags.

## Author Response
Added to the migration guide:
- exchange type stays `topic`
- durability stays `true`
- `order.created` is unchanged

## Reviewer B
We still have internal code using `order-events` for the DLQ topology. That is okay for this PR as long as the release notes call it out as an internal legacy constant and not the public integration contract.
