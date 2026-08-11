import fs from 'node:fs';
import assert from 'node:assert/strict';

const main = fs.readFileSync(new URL('../electron/main.cjs', import.meta.url), 'utf8');
const preload = fs.readFileSync(new URL('../electron/preload.cjs', import.meta.url), 'utf8');
const renderer = fs.readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8');
const styles = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

assert.equal(pkg.version, '3.4.1');
assert.equal(pkg.main, 'electron/main.cjs');
for (const channel of ['campaigns:create','campaigns:switch','campaigns:update','campaigns:duplicate','campaigns:delete']) {
  assert(main.includes(`handle('${channel}'`), `missing ${channel}`);
}
assert(main.includes("handle('profiles:set-image-mode'"));
assert(main.includes("handle('media:set-campaign-enabled'"));
assert(main.includes("handle('media:get-data-url'"));
assert(main.includes("handle('tor:toggle'"));
assert(main.includes("handle('tor:status'"));
assert(main.includes('socks5://127.0.0.1:${port}'));
assert(main.includes('Tor Project verification did not identify this connection as Tor.'));
assert(main.includes("proxyRules: 'socks5://127.0.0.1:1'"), 'Tor requested state must fail closed');
assert(!main.includes('const routedSessions = [ses, session.defaultSession]'), 'Tor routing must not proxy the Electron default app session');
assert(main.includes('Tor was enabled at shutdown; applying fail-closed bootstrap proxy before UI startup.'), 'Tor restore should fail closed without blocking UI startup');
assert(main.includes('startup.log'), 'startup diagnostics log is required');
assert(main.includes('5-second fallback'), 'main window must have a visibility fallback');
assert(main.includes('Packaged renderer is missing:'), 'packaged renderer presence check is required');
assert(main.includes("mainWindow.webContents.on('preload-error'"), 'preload errors must be logged');
assert(main.includes('MutationObserver'), 'virtualized network collector regression');
assert(main.includes('archiveMediaForPosts'));

for (const api of ['createCampaign','switchCampaign','updateCampaign','duplicateCampaign','deleteCampaign','toggleTor','getTorStatus','setCampaignImages','setProfileImageMode','getPostMediaDataUrl']) {
  assert(preload.includes(`${api}:`), `missing preload API ${api}`);
}
assert(renderer.includes('ACTIVE CAMPAIGN'));
assert(renderer.includes('CONNECT OVER TOR'));
assert(renderer.includes('DISCONNECT OVER TOR'));
assert(renderer.includes('IMAGES:'));
assert(renderer.includes('EDIT HIGHLIGHT PRESET'));
assert(renderer.includes('preset-highlight'));
assert(renderer.includes('PRESET MATCHES ONLY'));
assert(!renderer.includes('.map(renderPost)'), 'renderPost must be wrapped in map callbacks because its second parameter is a boolean highlight flag');
assert(styles.includes('.campaign-dock'));
assert(styles.includes('.tor-box.connected'));
assert(styles.includes('.preset-highlight'));
assert(styles.includes('.image-toggle.on'));

console.log('v3.1 campaign/preset/Tor/media regression tests passed.');
