#!/usr/bin/env node
/**
 * Computes the SHA-256 hash of every executable inline script this build
 * produced, and writes them into the policy the build will serve.
 *
 * Nonces need a per-request value and therefore a server runtime, which §2
 * forbids. On a prerendered site every inline script is known once the build
 * has run, so hashes express the same guarantee without the runtime.
 *
 * **Why this patches the manifest rather than building twice.** `headers()`
 * is evaluated before any page is rendered, so a build cannot know the hashes
 * of its own output. The first approach built twice and had the second pass
 * read a generated file; the deployed site served the first pass's headers
 * and shipped an empty `script-src`, so nothing hydrated. The second approach
 * committed the hash list; CI then showed that all 54 hashes differ between a
 * local build and a CI build of the same commit, because chunk filenames are
 * content-hashed and vary by environment. Both failures have the same root:
 * the hashes must come from the build being deployed, and nothing else.
 *
 * So `next.config.ts` emits a placeholder and this step replaces it in
 * `.next/routes-manifest.json`, which is the file both `next start` and the
 * host read to construct their routing. One build, hashes from its own HTML.
 *
 * Two kinds of `<script>` are skipped: any with `src`, which is a same-origin
 * file covered by `'self'`; and `type="application/ld+json"`, which the
 * browser never executes and which `script-src` does not govern.
 *
 * Usage: node scripts/generate-csp.mjs
 */

import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const APP_DIR = join(ROOT, '.next', 'server', 'app');
const MANIFEST = join(ROOT, '.next', 'routes-manifest.json');
const PLACEHOLDER = "'sha256-REPLACED-AFTER-BUILD'";

/** Keeps the policy inside the host's limit on its whole routing config. */
const HEADER_LIMIT = 8_000;

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
 * Finds the prerendered HTML, wherever this build put it.
 *
 * `.next/server/app` is where it lands locally and on the GitHub runner. On
 * the host it is empty, and the first three attempts at this all failed for
 * that one reason. So the search widens in steps, narrowest first, and says
 * which step found the pages — a build that silently hashes the wrong set is
 * worse than one that fails.
 *
 * The incremental cache is always excluded: it holds copies of earlier
 * renders, and hashing those contributed enough stale entries to push the
 * policy past the host's 32 KB limit on its whole routing configuration.
 */
async function findPrerenderedHtml() {
  const notCached = (paths) => paths.filter((file) => !file.includes(`${sep}cache${sep}`));

  for (const [label, dir] of [
    ['.next/server/app', APP_DIR],
    ['.next/server', join(ROOT, '.next', 'server')],
    ['.next', join(ROOT, '.next')],
  ]) {
    const found = notCached(await htmlFiles(dir));
    if (found.length > 0) {
      console.log(`Found ${String(found.length)} prerendered pages under ${label}.`);
      return found;
    }
  }

  return [];
}

const files = await findPrerenderedHtml();

if (files.length === 0) {
  console.error(`No prerendered HTML anywhere under ${join(ROOT, '.next')}. Nothing to hash.`);
  console.error(`  cwd: ${process.cwd()}`);
  for (const dir of ['.next', '.next/server', '.next/server/app']) {
    try {
      const entries = await readdir(join(ROOT, dir));
      console.error(
        `  ${dir}: ${String(entries.length)} entries — ${entries.slice(0, 10).join(' ')}`,
      );
    } catch (error) {
      console.error(`  ${dir}: unreadable (${error instanceof Error ? error.message : 'unknown'})`);
    }
  }
  process.exit(1);
}

const hashes = new Set();
/** Per-file counts, kept only so an oversized list can explain itself. */
const perFile = [];

for (const file of files) {
  const html = await readFile(file, 'utf8');
  let count = 0;

  for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    const [, attributes = '', body = ''] = match;
    if (/\ssrc=/.test(attributes)) continue;
    if (/type="application\/ld\+json"/.test(attributes)) continue;

    count += 1;
    hashes.add(`sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}`);
  }

  perFile.push({ file: file.slice(ROOT.length + 1), count });
}

const sorted = [...hashes].sort();
const replacement = sorted.map((hash) => `'${hash}'`).join(' ');

console.log(
  `${String(files.length)} prerendered pages, ${String(sorted.length)} distinct inline scripts, ` +
    `${String(replacement.length)} bytes of hashes.`,
);

if (sorted.length === 0) {
  console.error('No inline scripts found. An empty script-src would block hydration entirely.');
  process.exit(1);
}

if (replacement.length > HEADER_LIMIT) {
  console.error(
    `The hash list is ${String(replacement.length)} bytes, over the ${String(HEADER_LIMIT)} byte ` +
      'limit. The host rejects an oversized routing config with an error that names neither ' +
      'this script nor the policy, so it is failed here instead.',
  );
  /*
   * The size is a symptom; the cause is how many inline scripts each page
   * carries, which differs between environments. Locally every page has
   * three. Printing the worst offenders and where they live is what tells
   * the difference between a real policy and a scan of the wrong files.
   */
  perFile.sort((a, b) => b.count - a.count);
  console.error(`  ${String(files.length)} files scanned. Highest inline-script counts:`);
  for (const { file, count } of perFile.slice(0, 8)) {
    console.error(`    ${String(count).padStart(4)}  ${file}`);
  }
  const total = perFile.reduce((sum, entry) => sum + entry.count, 0);
  console.error(`  ${String(total)} inline scripts in total, ${String(sorted.length)} distinct.`);
  process.exit(1);
}

const manifestText = await readFile(MANIFEST, 'utf8');

if (!manifestText.includes(PLACEHOLDER)) {
  console.error(
    `The placeholder ${PLACEHOLDER} is not in ${MANIFEST}.\n` +
      'Either the headers in next.config.ts no longer emit it, or this build did\n' +
      'not produce the manifest. Refusing to ship a policy with no hashes.',
  );
  process.exit(1);
}

await writeFile(MANIFEST, manifestText.replaceAll(PLACEHOLDER, replacement), 'utf8');
console.log(`Wrote ${String(sorted.length)} hashes into the routing manifest.`);
