import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mainPath = path.join(root, 'electron', 'main.cjs');
const source = fs.readFileSync(mainPath, 'utf8');

if (/executeJavaScript\(`/.test(source)) {
  throw new Error('Found a non-raw executeJavaScript template. Use String.raw so regex escapes survive injection.');
}

const pattern = /executeJavaScript\(String\.raw`([\s\S]*?)`, true\)/g;
let match;
let count = 0;
while ((match = pattern.exec(source))) {
  count += 1;
  if (/\$\{/.test(match[1])) {
    throw new Error(`Injected script ${count} contains template interpolation. Pass data separately or validate it explicitly.`);
  }
  try {
    // Compile only; scripts require a browser DOM and are not executed here.
    new Function(match[1]);
  } catch (error) {
    throw new Error(`Injected browser script ${count} is invalid: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (count === 0) throw new Error('No injected browser scripts were found to validate.');
console.log(`Validated ${count} Electron page-injection scripts.`);
