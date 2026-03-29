# Review Thread: PR #241

## Reviewer
Can we confirm whether the bug affected only scheduling or also the attempt header we send to receivers?

## Author
Both. The worker scheduled the retry using the stale count, and the dispatcher exposes the human-visible attempt number through `X-Attempt-Number`.

## Reviewer
Good. Please make sure the dead-letter threshold also uses the completed count so a job does not get one accidental extra try.
