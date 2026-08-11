import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const rootBat = fs.readdirSync(root).filter((name) => name.toLowerCase().endsWith('.bat')).sort();
assert.deepEqual(rootBat, ['INSTALL_WINDOWS.bat']);
assert.equal(pkg.main, 'electron/main.cjs');
assert.equal(pkg.version, '3.4.1');
assert.equal(pkg.build.win.target[0].target, 'nsis');
assert(fs.existsSync(path.join(root, 'electron', 'main.cjs')));
assert(fs.existsSync(path.join(root, 'electron', 'preload.cjs')));
assert(fs.existsSync(path.join(root, 'src', 'main.tsx')));
assert(fs.existsSync(path.join(root, 'src', 'styles.css')));
console.log('Release layout regression tests passed.');
