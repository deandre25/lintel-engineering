#!/usr/bin/env node
/**
 * Computes the SHA-256 hashes of every executable inline script in the build
 * output, so `script-src` can name them and the policy needs neither a nonce
 * nor `unsafe-inline`.
 *
 * Nonces require a per-request value and therefore a server runtime, which §2
 * forbids. On a statically generated site every inline script is known at build
 * time, so hashes are the correct mechanism.
 *
 * Two kinds of `<script>` are skipped:
 *   - any with `src`, which is a same-origin file covered by `'self'`;
 *   - `type="application/ld+json"`, which the browser never executes and which
 *     `script-src` therefore does not govern.
 *
 * The hashes cannot be known when `next.config.ts` builds its headers, because
 * the pages have not been rendered yet. The build therefore runs twice:
 *
 *   next build  →  generate-csp  →  next build  →  generate-csp --verify
 *
 * The second pass picks the hashes up. Adding a response header does not change
 * the HTML, so the hashes are identical across the two passes; `--verify` is
 * what proves that rather than assuming it, and fails the build if a payload
 * moved.
 *
 * Usage: node scripts/generate-csp.mjs [--verify]
 */

import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const APP_DIR = join(ROOT, '.next', 'server', 'app');
const OUTPUT = join(ROOT, 'csp-hashes.json');

const verifyOnly = process.argv.includes('--verify');

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const found = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith('.html')) found.push(path);
  }

  return found;
}

const hashes = new Set();

for (const file of await htmlFiles(APP_DIR)) {
  const html = await readFile(file, 'utf8');

  for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    const [, attributes = '', body = ''] = match;

    if (/\ssrc=/.test(attributes)) continue;
    if (/type="application\/ld\+json"/.test(attributes)) continue;

    hashes.add(`sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}`);
  }
}

const sorted = [...hashes].sort();

let previous = [];
try {
  previous = JSON.parse(await readFile(OUTPUT, 'utf8'));
} catch {
  previous = [];
}

const unchanged =
  previous.length === sorted.length && previous.every((hash, index) => hash === sorted[index]);

if (verifyOnly) {
  /*
   * An empty list means the policy shipped with no hashes and every inline
   * script is blocked — the site renders and does not hydrate. That is what
   * happened on the first deployment: the host ran `next build` directly
   * rather than this package's two-pass script, so the file never existed
   * when the headers were built. A green build and Lighthouse 100 were both
   * true while nothing on the page worked, so this is now an error.
   */
  if (sorted.length === 0) {
    console.error(
      'No inline script hashes were found. The policy would ship with an empty\n' +
        'script-src and nothing would hydrate. Check that the build ran this\n' +
        "package's build script rather than `next build` directly.",
    );
    process.exit(1);
  }

  if (!unchanged) {
    console.error(
      'Inline script hashes changed between build passes.\n' +
        `  recorded: ${String(previous.length)}  rebuilt: ${String(sorted.length)}\n` +
        'The policy in the shipped headers would not match the shipped HTML.',
    );
    process.exit(1);
  }

  console.log(`CSP hashes verified: ${String(sorted.length)} inline scripts, unchanged.`);
  process.exit(0);
}

await writeFile(OUTPUT, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
console.log(
  `Wrote ${String(sorted.length)} inline script hashes to csp-hashes.json` +
    (unchanged ? ' (unchanged).' : '.'),
);
