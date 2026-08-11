# Network collection design

X follower/following pages are dynamically rendered and virtualized. A DOM-only “read everything after scrolling” collector can lose rows that were removed from the DOM as the operator moves farther down the list.

Enterprise v3 addresses that failure mode by installing an in-page accumulator before scroll progression:

1. Observe visible `UserCell` nodes.
2. Parse and store each encountered username in an in-memory map.
3. Watch DOM mutations and capture newly rendered cells immediately.
4. Scroll in bounded passes.
5. Preserve identities encountered earlier in the same scan even after their DOM rows disappear.
6. Return the accumulated set plus scan telemetry.
7. Deduplicate against the persistent campaign archive.
8. Store a network snapshot and newly-observed identities.

This design addresses virtualized-DOM loss. It does not guarantee that X will expose an entire account network. X may stop loading, reorder results, return partial lists, challenge the session, or change its page structure.

## Interpreting network deltas
A newly observed account is a direct observation from the current scan. An identity that appeared in a prior comparable snapshot but not the current one is labelled “not seen in latest comparable scan.” It is not automatically treated as an unfollow or removed follower.
