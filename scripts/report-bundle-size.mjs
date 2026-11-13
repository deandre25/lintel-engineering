#!/usr/bin/env node
/**
 * Reports first-load JavaScript per prerendered route.
 *
 * Turbopack builds do not emit `app-build-manifest.json`, and the build summary
 * no longer prints per-route sizes, so this reads the prerendered HTML and sums
 * the gzipped size of exactly the scripts the document asks the browser to
 * fetch. That is the number §12 asks to be recorded, measured the way a visitor
 * experiences it rather than inferred from a manifest.
 *
 * Usage: node scripts/report-bundle-size.mjs [--budget-kb 110] [--json]
 */

import { gzipSync } from 'node:zlib';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const APP_DIR = join(ROOT, '.next', 'server', 'app');
const STATIC_ROOT = join(ROOT, '.next');

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const budgetIndex = args.indexOf('--budget-kb');
const budgetKb = budgetIndex === -1 ? null : Number(args[budgetIndex + 1]);
const landingIndex = args.indexOf('--landing-kb');
const landingKb = landingIndex === -1 ? null : Number(args[landingIndex + 1]);

/** The landing page, per locale. §1 sets its budget specifically. */
const LANDING = new Set(['/en', '/ro']);

/** Routes that are framework internals rather than pages a visitor can reach. */
const INTERNAL = new Set(['_not-found', '_global-error']);

async function findHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findHtmlFiles(path)));
    } else if (entry.name.endsWith('.html')) {
      files.push(path);
    }
  }

  return files;
}

async function gzippedSize(urlPath) {
  /* Chunk names contain `[locale]`, which the HTML carries percent-encoded. */
  const filePath = join(STATIC_ROOT, decodeURIComponent(urlPath).replace(/^\/_next\//, ''));
  try {
    await stat(filePath);
  } catch {
    return null;
  }
  return gzipSync(await readFile(filePath), { level: 9 }).byteLength;
}

async function measure(htmlPath) {
  const html = await readFile(htmlPath, 'utf8');
  const route = `/${relative(APP_DIR, htmlPath).replace(/\.html$/, '')}`;

  const tags = [...html.matchAll(/<script\b[^>]*>/g)]
    .map((match) => match[0])
    .filter((tag) => tag.includes('src='));

  let modern = 0;
  let legacyOnly = 0;
  let missing = 0;
  const seen = new Set();

  for (const tag of tags) {
    const src = /src="([^"]+\.js)"/.exec(tag)?.[1];
    if (src === undefined || seen.has(src)) continue;
    seen.add(src);

    const size = await gzippedSize(src);
    if (size === null) {
      missing += 1;
      continue;
    }

    /*
     * A `noModule` script is only fetched by browsers without ES module
     * support. No browser in the support matrix — and not the Chrome instance
     * Lighthouse drives — downloads it, so counting it against the first-load
     * budget would overstate what any real visitor receives. It is reported
     * separately rather than hidden.
     */
    if (/\bnoModule\b/i.test(tag)) {
      legacyOnly += size;
    } else {
      modern += size;
    }
  }

  return { route, scripts: seen.size, missing, gzipBytes: modern, legacyOnlyBytes: legacyOnly };
}

const htmlFiles = await findHtmlFiles(APP_DIR);
const results = [];

for (const file of htmlFiles) {
  const result = await measure(file);
  const name = result.route.replace(/^\//, '');
  if (INTERNAL.has(name)) continue;
  results.push(result);
}

results.sort((a, b) => b.gzipBytes - a.gzipBytes);

if (asJson) {
  console.log(JSON.stringify(results, null, 2));
} else {
  console.log('First-load JS per route (gzipped, as referenced by the prerendered HTML)\n');
  console.log(
    `  ${'route'.padEnd(30)}${'scripts'.padStart(8)}${'modern'.padStart(11)}${'legacy-only'.padStart(13)}`,
  );
  console.log(`  ${'-'.repeat(62)}`);
  for (const result of results) {
    const kb = `${(result.gzipBytes / 1024).toFixed(1)} KB`;
    const legacy = `${(result.legacyOnlyBytes / 1024).toFixed(1)} KB`;
    console.log(
      `  ${result.route.padEnd(30)}${String(result.scripts).padStart(8)}${kb.padStart(11)}${legacy.padStart(13)}`,
    );
  }
  const unresolved = results.reduce((sum, result) => sum + result.missing, 0);
  if (unresolved > 0) {
    console.error(`\n${unresolved} script reference(s) could not be resolved on disk.`);
    process.exit(1);
  }
}

/*
 * Two budgets, because §1 sets one and it is specific: "First-load JS, landing
 * page". The landing page is what a visitor arrives on and what Lighthouse
 * measures, so it carries the tight figure. Every other route carries a
 * ceiling instead — high enough for a leaf page that genuinely needs a
 * dependency, low enough that a runaway import still fails the build.
 *
 * The contact page is the one route that uses the looser figure: it ships
 * react-hook-form, its resolver and Zod, which the form needs and which no
 * other page pays for.
 */
let failed = false;

if (landingKb !== null && Number.isFinite(landingKb)) {
  const over = results.filter(
    (result) => LANDING.has(result.route) && result.gzipBytes / 1024 > landingKb,
  );
  if (over.length > 0) {
    console.error(
      `\nOver the ${landingKb} KB landing-page budget:\n` +
        over.map((r) => `  ${r.route}: ${(r.gzipBytes / 1024).toFixed(1)} KB`).join('\n'),
    );
    failed = true;
  } else {
    console.log(`\nLanding pages within the ${landingKb} KB budget.`);
  }
}

if (budgetKb !== null && Number.isFinite(budgetKb)) {
  const over = results.filter((result) => result.gzipBytes / 1024 > budgetKb);
  if (over.length > 0) {
    console.error(
      `\nOver the ${budgetKb} KB ceiling for all routes:\n` +
        over.map((r) => `  ${r.route}: ${(r.gzipBytes / 1024).toFixed(1)} KB`).join('\n'),
    );
    failed = true;
  } else {
    console.log(`All ${results.length} routes within the ${budgetKb} KB ceiling.`);
  }
}

if (failed) process.exit(1);
