#!/usr/bin/env node
/**
 * Validates every JSON-LD block in the build output against the schema.org
 * vocabulary.
 *
 * It reads the prerendered HTML rather than a running server, because what
 * matters is the markup a crawler receives without executing JavaScript.
 *
 * Checks, per node: the type exists in schema.org; every property is defined
 * there; and every property is valid for that type, following the type's
 * supertype chain. Properties in the JSON-LD syntax namespace (`@id`, `@type`,
 * `@context`, `@graph`) are structural and are skipped.
 *
 * Usage: node scripts/validate-jsonld.mjs <path-to-schemaorg.jsonld>
 */

import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const APP_DIR = join(ROOT, '.next', 'server', 'app');
const vocabularyPath = process.argv[2];

if (vocabularyPath === undefined) {
  console.error('Usage: node scripts/validate-jsonld.mjs <path-to-schemaorg.jsonld>');
  process.exit(2);
}

const vocabulary = JSON.parse(await readFile(vocabularyPath, 'utf8'));

const short = (value) => String(value).replace(/^schema:|^https?:\/\/schema\.org\//, '');
const asArray = (value) => (value === undefined ? [] : Array.isArray(value) ? value : [value]);

/** type -> Set of direct supertypes, and property -> Set of types it applies to. */
const supertypes = new Map();
const propertyDomains = new Map();
const knownTypes = new Set();
const knownProperties = new Set();

for (const node of vocabulary['@graph']) {
  const id = short(node['@id']);
  const types = asArray(node['@type']).map(short);

  if (types.includes('rdfs:Class') || types.includes('Class')) {
    knownTypes.add(id);
    supertypes.set(id, new Set(asArray(node['rdfs:subClassOf']).map((x) => short(x['@id'] ?? x))));
  }

  if (types.includes('rdf:Property') || types.includes('Property')) {
    knownProperties.add(id);
    propertyDomains.set(
      id,
      new Set(asArray(node['schema:domainIncludes']).map((x) => short(x['@id'] ?? x))),
    );
  }
}

function ancestorsOf(type) {
  const seen = new Set();
  const queue = [type];
  while (queue.length > 0) {
    const current = queue.pop();
    if (current === undefined || seen.has(current)) continue;
    seen.add(current);
    for (const parent of supertypes.get(current) ?? []) queue.push(parent);
  }
  return seen;
}

const STRUCTURAL = new Set(['@context', '@type', '@id', '@graph']);
const problems = [];

function validateNode(node, where) {
  if (node === null || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const item of node) validateNode(item, where);
    return;
  }

  for (const item of asArray(node['@graph'])) validateNode(item, where);

  const type = node['@type'];
  if (type === undefined) return;

  if (!knownTypes.has(type)) {
    problems.push(`${where}: unknown type "${type}"`);
    return;
  }

  const lineage = ancestorsOf(type);

  for (const [key, value] of Object.entries(node)) {
    if (STRUCTURAL.has(key)) continue;

    if (!knownProperties.has(key)) {
      problems.push(`${where}: "${type}" uses unknown property "${key}"`);
      continue;
    }

    const domains = propertyDomains.get(key) ?? new Set();
    const applies = domains.size === 0 || [...domains].some((domain) => lineage.has(domain));
    if (!applies) {
      problems.push(`${where}: "${key}" is not valid on "${type}"`);
    }

    validateNode(value, where);
  }
}

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

let blocks = 0;
const typesSeen = new Set();

for (const file of await htmlFiles(APP_DIR)) {
  const html = await readFile(file, 'utf8');
  const where = relative(APP_DIR, file);

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    blocks += 1;
    let parsed;
    try {
      parsed = JSON.parse(match[1].replace(/\\u003c/g, '<'));
    } catch (error) {
      problems.push(`${where}: JSON-LD does not parse — ${error.message}`);
      continue;
    }

    if (parsed['@context'] !== 'https://schema.org') {
      problems.push(`${where}: @context is "${parsed['@context']}", expected https://schema.org`);
    }

    for (const node of [parsed, ...asArray(parsed['@graph'])]) {
      if (typeof node['@type'] === 'string') typesSeen.add(node['@type']);
    }

    validateNode(parsed, where);
  }
}

console.log(`Validated ${String(blocks)} JSON-LD blocks across the build output.`);
console.log(`Top-level types: ${[...typesSeen].sort().join(', ')}`);

if (problems.length > 0) {
  console.error(`\n${String(problems.length)} problem(s):`);
  for (const problem of [...new Set(problems)].slice(0, 40)) console.error(`  ${problem}`);
  process.exit(1);
}

console.log('No unknown types, no unknown properties, no property used outside its domain.');
