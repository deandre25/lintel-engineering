#!/usr/bin/env node
/**
 * Writes a Content-Security-Policy into every page this build produced.
 *
 * **Why the policy is markup and not a header.** `script-src` has to name the
 * SHA-256 hash of every inline script that may execute. On the host this build
 * emits 1158 inline scripts across 54 pages, 649 of them distinct, which is
 * 35 KB of hashes -- over four times the host's limit on its whole routing
 * configuration. No amount of trimming closes that. But a page only ever
 * executes its own scripts: injecting the policy into each page names a few
 * dozen hashes instead of 649, and the hashes are computed from the very file
 * they are written into, which removes the whole class of bug where the list
 * was produced from a different build than the one being served.
 *
 * Three earlier attempts failed on exactly that mismatch -- building twice,
 * committing the list, then patching the routing manifest -- because chunk
 * filenames are content-addressed and the streamed payload is flushed
 * differently on different machines. A local build here produces 3 inline
 * scripts per page; the host produces around 21. Any approach that compares
 * one environment's output to another's is wrong before it starts.
 *
 * `frame-ancestors`, `report-to` and `sandbox` are ignored in a `<meta>`
 * policy, so they stay in the header. See `src/lib/securityHeaders.ts`.
 *
 * A nonce would need one value per request and therefore a server runtime.
 * It is rejected not because §2 forbids a runtime but because a per-request
 * nonce makes every page dynamic and destroys the full static generation that
 * is this project's architectural centre.
 *
 * Usage: node scripts/generate-csp.mjs
 */

import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const APP_DIR = join(ROOT, '.next', 'server', 'app');

/** The only third-party origin the site may talk to, and only after consent. */
const ANALYTICS_ORIGIN = 'https://plausible.io';

const MARKER = 'http-equiv="Content-Security-Policy"';

/**
 * One page's policy.
 *
 * The analytics host is named so that declining consent is the only thing
 * that stops it loading. If the policy blocked it too, the consent gate would
 * appear to work for the wrong reason and a regression in it would be
 * invisible. One named host, no wildcard.
 */
function documentPolicy(hashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${ANALYTICS_ORIGIN} ${hashes.map((hash) => `'${hash}'`).join(' ')}`,
    /*
     * `next/font` injects an inline style block for the font-face rules, and
     * style hashes are brittle because the browser normalises CSS text. This
     * is the one relaxation and it is limited to styles, which cannot execute.
     */
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self' ${ANALYTICS_ORIGIN}`,
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}

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
 * `.next/server/app` is where it lands locally and on the GitHub runner, and
 * somewhere else on the host. The search widens in steps and says which step
 * found the pages, because a build that silently rewrites the wrong files is
 * worse than one that fails. The incremental cache is always excluded: it
 * holds copies of earlier renders.
 */
async function findPrerenderedHtml() {
  for (const [label, dir] of [
    ['.next/server/app', APP_DIR],
    ['.next/server', join(ROOT, '.next', 'server')],
    ['.next', join(ROOT, '.next')],
  ]) {
    const found = (await htmlFiles(dir)).filter((file) => !file.includes(`${sep}cache${sep}`));
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

/* An inline script above the meta tag runs before the policy exists. */
const ungoverned = [];
const counts = [];
let widest = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const name = file.slice(ROOT.length + 1);

  if (html.includes(MARKER)) {
    console.error(`${name} already carries a policy. Refusing to inject a second one.`);
    process.exit(1);
  }

  const headAt = html.indexOf('<head>');
  if (headAt === -1) {
    console.error(`${name} has no <head> to inject into.`);
    process.exit(1);
  }
  const insertAt = headAt + '<head>'.length;

  const hashes = new Set();
  for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    const [, attributes = '', body = ''] = match;
    /* `src` is same-origin and covered by `'self'`. */
    if (/\ssrc=/.test(attributes)) continue;
    /* A non-JavaScript MIME type never reaches the script-src check. */
    if (/type="application\/ld\+json"/.test(attributes)) continue;

    if (match.index < insertAt) ungoverned.push(`${name}: ${body.slice(0, 60)}`);
    hashes.add(`sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}`);
  }

  if (hashes.size === 0) {
    console.error(`${name} has no inline scripts. An empty script-src would block hydration.`);
    process.exit(1);
  }

  const content = documentPolicy([...hashes].sort());
  if (content.includes('"')) {
    console.error(`${name}: the policy contains a quote and would break the attribute.`);
    process.exit(1);
  }

  counts.push(hashes.size);
  widest = Math.max(widest, content.length);

  const tag = `<meta http-equiv="Content-Security-Policy" content="${content}">`;
  await writeFile(file, html.slice(0, insertAt) + tag + html.slice(insertAt), 'utf8');
}

counts.sort((a, b) => a - b);
console.log(
  `Injected a policy into ${String(files.length)} pages. ` +
    `Hashes per page: ${String(counts[0])} min, ` +
    `${String(counts[Math.floor(counts.length / 2)])} median, ` +
    `${String(counts[counts.length - 1])} max. ` +
    `Largest policy ${String(widest)} bytes.`,
);

if (ungoverned.length > 0) {
  console.error(`\n${String(ungoverned.length)} inline script(s) sit above the meta tag:`);
  for (const entry of ungoverned.slice(0, 5)) console.error(`  ${entry}`);
  console.error('Those execute before the policy exists and are ungoverned.');
  process.exit(1);
}
