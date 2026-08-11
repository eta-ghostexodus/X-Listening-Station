import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOR_VERSION = '15.0.19';
const TOR_FILE = `tor-expert-bundle-windows-x86_64-${TOR_VERSION}.tar.gz`;
const TOR_URL = `https://archive.torproject.org/tor-package-archive/torbrowser/${TOR_VERSION}/${TOR_FILE}`;
const TOR_SHA256 = '6ac067402c7b4a3dc37887ed3754b3914b67fdc220c966190683e9ccf91abf0f';
const vendorRoot = path.join(root, 'vendor');
const bundleRoot = path.join(vendorRoot, 'tor-bundle');
const archivePath = path.join(vendorRoot, TOR_FILE);
const markerPath = path.join(bundleRoot, '.xls-tor-version.json');

function findFile(start, filename) {
  if (!fs.existsSync(start)) return null;
  const stack = [start];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.name.toLowerCase() === filename.toLowerCase()) return full;
    }
  }
  return null;
}

async function sha256File(filePath) {
  const hash = crypto.createHash('sha256');
  await pipeline(fs.createReadStream(filePath), async function* (source) {
    for await (const chunk of source) {
      hash.update(chunk);
      yield chunk;
    }
  }, fs.createWriteStream(process.platform === 'win32' ? 'NUL' : '/dev/null'));
  return hash.digest('hex');
}

async function download() {
  await fsp.mkdir(vendorRoot, { recursive: true });
  console.log(`Downloading Tor Expert Bundle ${TOR_VERSION} from Tor Project...`);
  const response = await fetch(TOR_URL, { redirect: 'follow' });
  if (!response.ok || !response.body) throw new Error(`Tor download failed: HTTP ${response.status}`);
  const hash = crypto.createHash('sha256');
  const source = Readable.fromWeb(response.body);
  async function* hashingStream(iterable) {
    for await (const chunk of iterable) {
      hash.update(chunk);
      yield chunk;
    }
  }
  await pipeline(source, hashingStream, fs.createWriteStream(archivePath));
  const digest = hash.digest('hex');
  if (digest !== TOR_SHA256) {
    await fsp.rm(archivePath, { force: true });
    throw new Error(`Tor bundle SHA-256 mismatch. Expected ${TOR_SHA256}, received ${digest}.`);
  }
  console.log('Tor bundle SHA-256 verified.');
}

async function extract() {
  await fsp.rm(bundleRoot, { recursive: true, force: true });
  await fsp.mkdir(bundleRoot, { recursive: true });
  const result = spawnSync('tar', ['-xzf', archivePath, '-C', bundleRoot], { stdio: 'inherit', windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`tar extraction failed with exit code ${result.status}.`);
  const torExe = findFile(bundleRoot, 'tor.exe');
  if (!torExe) throw new Error('Tor Expert Bundle was extracted, but tor.exe was not found.');
  await fsp.writeFile(markerPath, JSON.stringify({ version: TOR_VERSION, sha256: TOR_SHA256, source: TOR_URL }, null, 2), 'utf8');
  await fsp.rm(archivePath, { force: true });
  console.log(`Integrated Tor runtime prepared: ${path.relative(root, torExe)}`);
}

async function main() {
  const torExe = findFile(bundleRoot, 'tor.exe');
  if (torExe && fs.existsSync(markerPath)) {
    try {
      const marker = JSON.parse(await fsp.readFile(markerPath, 'utf8'));
      if (marker.version === TOR_VERSION && marker.sha256 === TOR_SHA256) {
        console.log(`Integrated Tor runtime already prepared (${TOR_VERSION}).`);
        return;
      }
    } catch {}
  }
  await download();
  await extract();
}

main().catch((error) => {
  console.error(`ERROR preparing integrated Tor runtime: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
