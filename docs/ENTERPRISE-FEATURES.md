# Enterprise v3 feature map

## Command Board
- Per-source collection health.
- Plateau/error visibility.
- Local post/follower/following counts.
- Oldest archived post and most recent run telemetry.
- Automatic network-overlap summary.

## Follower Network
- Follower/following extraction.
- In-page MutationObserver accumulation for virtualized lists.
- Pairwise common followers and common following.
- Multi-target intersections.
- Per-identity overlap scores.
- Clickable entities and live profile opening.
- Relationship graph.
- Search/export.
- Network snapshots and new/not-seen-latest observations.

## Entity Index
Automatic extraction/indexing of mentions, hashtags, links/domains, email addresses, phone-like strings, crypto-address patterns, and organization-like names.

## Change Intel
- Collection run telemetry.
- Profile metadata snapshots.
- Post live verification/version history.
- Availability observations.
- Network snapshot deltas.

## Evidence & reporting
- First/last observed timestamps.
- SHA-256 evidence hashes.
- JSON/PDF/CSV exports.
- SHA-256 sidecar files for exported artifacts.
- Analyst notes included in finding exports.

## Campaigns
Top-level purpose-defined workspaces for threat intelligence, news monitoring, safeguarding, research, and other user-defined missions. Campaigns isolate their sources, evidence, networks, presets, notes, entities, telemetry, archive state, and image-collection configuration.

## Search intelligence
- Unlimited practical keyword/phrase presets.
- ANY/ALL and case-sensitive matching.
- Campaign/source scoping.
- Create/edit/delete/run controls directly under Search.
- Highlighted matching phrases and preset match badges.

## Tor routing
- Integrated Tor Expert Bundle is packaged with the compiled Windows application.
- Persistent bottom-left Connect over Tor / Disconnect over Tor control.
- Starts and stops an app-owned hidden Tor process automatically.
- Uses a dedicated local SOCKS port and verifies the Tor exit before showing green connected status.
- Fails closed while Tor is starting or unavailable.
- Can use an already-running verified Tor service on 9050/9150 as a fallback.


## Media evidence
- One-click campaign IMAGES ON/OFF command-bar control.
- Per-target image collection overrides.
- Local archived post images with SHA-256 evidence metadata.
