# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

CYBERVS DOMINATVS X Listening Station — an Electron + React + TypeScript desktop OSINT app that monitors X/Twitter accounts through an authenticated in-app Chromium session (no API), archives posts/networks locally, and produces evidence-hashed exports. Packaged as a Windows NSIS installer; development works cross-platform. Requires Node >= 22.12.0 and pnpm (pinned via `packageManager`).

## Commands

```bash
pnpm install --frozen-lockfile
pnpm run dev          # runs Tor prep + ALL validation/regression checks, then Vite + Electron
pnpm run check        # full gate: node --check on .cjs files, all test scripts, typecheck
pnpm run typecheck    # tsc --noEmit
pnpm run dist:win     # Windows installer build (prepare:tor + check + build + electron-builder)
```

Supply-chain settings live in `pnpm-workspace.yaml`: lifecycle scripts are blocked for all packages except `electron` (`onlyBuiltDependencies`), and versions published <7 days ago are refused (`minimumReleaseAge`). Keep `pnpm-lock.yaml` committed; don't switch back to npm — `INSTALL_WINDOWS.bat` and the script chains are pnpm-only, and `test-v3.3.mjs` asserts the pnpm form.

Run a single check:

```bash
node scripts/test-v3.4.mjs           # or test-v3.1/v3.2/v3.3/test-enterprise/test-release-layout
node scripts/validate-page-scripts.mjs
```

## Testing convention (important)

The `scripts/test-*.mjs` files are **static source-text assertions**, not runtime tests: they read `electron/main.cjs`, `preload.cjs`, `enterprise.cjs`, `src/main.tsx`, `styles.css`, and `package.json` as strings and `assert` that specific code fragments exist (or that reverted bug patterns do NOT exist). Consequences:

- Renaming or reformatting a line that a test asserts on will break `pnpm run check` even if behavior is unchanged. Check the test scripts before refactoring `main.cjs` or `main.tsx`.
- When fixing a bug, the convention is to add a string assertion pinning the fix to the current version's test script. Each script also asserts `pkg.version`, so version bumps require updating that assertion.
- Per-version feature/fix notes live in `docs/` (e.g. `V3.4.1-FEATURES.md`).

## Page-injection invariant

All scraping runs via scripts injected into hidden X BrowserWindows. `scripts/validate-page-scripts.mjs` enforces:

- Every injection must be `executeJavaScript(String.raw` + backtick + `..., true)` — plain template literals are rejected (regex escapes must survive).
- No `${}` interpolation inside injected scripts — pass data separately.
- Each injected block must compile via `new Function`.

## Architecture

Nearly all logic lives in three files:

- **`electron/main.cjs`** (~3100 lines) — the whole main process: single JSON app state (campaign-scoped, persisted in `userData`, migrated/normalized on load), all IPC handlers (`registerIpc`), scraping via hidden BrowserWindows on the `persist:x-listening-station` partition, integrated Tor lifecycle (bundled Tor Expert Bundle, private SOCKS port, fail-closed proxying, exit verification), archive/auto-sweep timers, avatar cache, and JSON/PDF/CSV exports with `.sha256.txt` sidecars.
- **`electron/enterprise.cjs`** — pure functions extracted for testability: entity extraction, network analysis, collection health, canonical evidence hashing. No Electron imports.
- **`src/main.tsx`** — the entire React UI in one file. `src/global.d.ts` types the `window.xls` bridge.

Data flow: renderer calls `window.xls.*` (defined in `electron/preload.cjs`, one method per IPC channel) → main process mutates `appState` → `persistState()` + `emitState()` broadcasts `state:changed` back to the renderer. The renderer never touches X pages or cookies directly (context isolation + sandbox on remote windows).

`scripts/prepare-tor.mjs` downloads the official Tor Expert Bundle and verifies its published SHA-256 into `vendor/tor-bundle/` (packaged as an extraResource). `scripts/dev.mjs` is the dev launcher.

## Style

- Surgical diffs: main.cjs and main.tsx are large single files by design — match that pattern rather than splitting modules.
- Deliberate terminology: network deltas say "NOT SEEN IN LATEST COMPARABLE SCAN," never "unfollowed" — X list rendering is not authoritative. Keep that caution in user-facing text.
