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
import { join, resolve, sep } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const APP_DIR = join(ROOT, '.next', 'server', 'app');
const OUTPUT = join(ROOT, 'csp-hashes.json');

const verifyOnly = process.argv.includes('--verify');

async function htmlFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const found = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith('.html')) found.push(path);
  }

  return found;
}

/**
 * Describes what is actually on disk.
 *
 * Printed when no HTML is found, because the first failure of this script in a
 * hosted build said only that there were no hashes, which does not say whether
 * the build emitted nothing, emitted somewhere else, or ran in another
 * directory. A diagnostic that names the path it looked in costs one round
 * trip and saves several.
 */
async function describe(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const dirs = entries.filter((e) => e.isDirectory()).map((e) => `${e.name}/`);
    const files = entries.filter((e) => e.isFile()).map((e) => e.name);
    return `${String(entries.length)} entries: ${[...dirs, ...files].slice(0, 12).join(' ')}`;
  } catch (error) {
    return `unreadable (${error instanceof Error ? error.message : String(error)})`;
  }
}

let files = await htmlFiles(APP_DIR);

/*
 * Fall back to `.next/server`, and no wider.
 *
 * Scanning all of `.next` was tried and was wrong: it collected enough
 * additional documents that the policy grew past the host's 32 KB limit on
 * its routing configuration, and the build failed with an error that named
 * neither this script nor the policy. The incremental cache is excluded
 * because it holds copies of earlier renders whose hashes are stale.
 */
if (files.length === 0) {
  const serverFiles = await htmlFiles(join(ROOT, '.next', 'server'));
  files = serverFiles.filter((file) => !file.includes(`${sep}cache${sep}`));
  if (files.length > 0) {
    console.warn(
      `No HTML at ${APP_DIR}; using ${String(files.length)} pages found under .next/server.`,
    );
  }
}

if (files.length === 0) {
  console.error('No prerendered HTML found. Looked in:');
  console.error(`  ${APP_DIR}`);
  console.error(`  cwd:            ${process.cwd()}`);
  console.error(`  .next:          ${await describe(join(ROOT, '.next'))}`);
  console.error(`  .next/server:   ${await describe(join(ROOT, '.next', 'server'))}`);
  console.error(`  .next/server/app: ${await describe(APP_DIR)}`);
}

const hashes = new Set();

for (const file of files) {
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
      'WARNING: inline script hashes changed between build passes.\n' +
        `  recorded: ${String(previous.length)}  rebuilt: ${String(sorted.length)}\n` +
        'The policy in the shipped headers would not match the shipped HTML.',
    );
  }

  console.log(`CSP hashes verified: ${String(sorted.length)} inline scripts, unchanged.`);
  process.exit(0);
}

/*
 * A policy that is too large is rejected by the host's routing configuration,
 * which has a 32 KB ceiling across all of it. Failing here names the cause;
 * failing there does not. The limit is set well below the ceiling because the
 * policy is one entry among several.
 */
const headerBytes = sorted.map((hash) => `'${hash}'`).join(' ').length;
const HEADER_LIMIT = 8_000;

console.log(
  `${String(files.length)} prerendered pages, ${String(sorted.length)} distinct inline scripts, ` +
    `${String(headerBytes)} bytes of hashes.`,
);

if (headerBytes > HEADER_LIMIT) {
  /*
   * Truncating would ship a policy that blocks the pages whose hashes were
   * dropped, so the list is emptied instead and the deployment check fails on
   * the live site. A policy that is too large is rejected by the host's
   * routing configuration with an error that names neither this script nor
   * the policy.
   */
  console.error(
    `WARNING: the hash list is ${String(headerBytes)} bytes, over the ${String(HEADER_LIMIT)} byte limit.\n` +
      'Shipping no hashes rather than an oversized policy the host will reject.',
  );
  sorted.length = 0;
}

await writeFile(OUTPUT, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
console.log(
  `Wrote ${String(sorted.length)} inline script hashes to csp-hashes.json` +
    (unchanged ? ' (unchanged).' : '.'),
);
