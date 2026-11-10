#!/usr/bin/env node
/**
 * Prints every page the last build actually produced, as its canonical public
 * URL, one per line. Consumed by the link checker and by Lighthouse CI.
 *
 * It reads the prerendered output rather than the route registry on purpose: a
 * registry entry whose page has not been written yet would make the link
 * checker fail on a route that does not exist, and a list written by hand would
 * drift. Reading the build means this always describes what is deployable.
 *
 * File paths carry the internal English spelling (`/ro/services`), so each one
 * is mapped back through the registry to the localised URL a visitor uses
 * (`/ro/servicii`) — which is the URL that should be link checked.
 *
 * Usage: node scripts/list-urls.mjs [--base http://127.0.0.1:3100]
 */

import { readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

/*
 * The registry is imported straight from TypeScript: Node strips the types
 * natively, so this needs no loader and no build step, and cannot read a stale
 * compiled copy of the routes.
 */
const { matchRoutePath, routePath, routes } = await import('../src/lib/routing.ts');

const ROOT = resolve(import.meta.dirname, '..');
const APP_DIR = join(ROOT, '.next', 'server', 'app');

const args = process.argv.slice(2);
const baseIndex = args.indexOf('--base');
const base = baseIndex === -1 ? '' : (args[baseIndex + 1] ?? '');

/** Framework internals, not pages a visitor can navigate to. */
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

const htmlFiles = await findHtmlFiles(APP_DIR);
const urls = new Set();

for (const file of htmlFiles) {
  const internalPath = `/${relative(APP_DIR, file).replace(/\.html$/, '')}`;
  if (INTERNAL.has(internalPath.replace(/^\//, ''))) continue;

  const matched = matchRoutePath(internalPath);

  if (matched === null) {
    /* A built page the registry does not know about is a bug, not a URL. */
    console.error(`Built page is not in the route registry: ${internalPath}`);
    process.exitCode = 1;
    continue;
  }

  const canonical = routes[matched.id].dynamic
    ? routePath(matched.locale, matched.id, matched.slug)
    : routePath(matched.locale, matched.id);

  urls.add(`${base}${canonical}`);
}

console.log([...urls].sort().join('\n'));
