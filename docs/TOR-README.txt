INTEGRATED TOR ROUTING — ENTERPRISE v3.4.1

X Listening Station now bundles the official Tor Project Expert Bundle into the compiled Windows application.

Normal use:
1. Click CONNECT OVER TOR in the lower-left control.
2. The app starts its own hidden Tor client automatically.
3. X traffic remains fail-closed while Tor bootstraps.
4. The indicator turns green only after check.torproject.org verifies the route as Tor.
5. Click DISCONNECT OVER TOR to stop the app-owned Tor process and intentionally return the X session to direct routing.

No separate Tor Browser installation is required for the compiled Windows build. If the integrated runtime cannot start, the app can fall back to an already-running verified local Tor SOCKS service on 9050 or 9150. It never silently falls back to direct X traffic while the Tor toggle remains enabled.

The build helper downloads Tor Expert Bundle 15.0.19 for Windows x86_64 directly from the Tor Project archive and verifies the published SHA-256 before packaging it.

IMPORTANT: Tor changes the network route, not the identity of a logged-in X account. X can still associate activity with the authenticated account and other browser/session signals.
