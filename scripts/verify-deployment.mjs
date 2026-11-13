#!/usr/bin/env node
/**
 * Asserts that a deployed URL actually works, against the live site.
 *
 * This exists because of a specific failure. The site shipped with a
 * Content-Security-Policy containing no script hashes, so every inline script
 * was blocked and nothing hydrated: the cookie banner would not close, the
 * mobile navigation would not open, the contact form did not validate. CI was
 * green and Lighthouse scored 100 on every category throughout, because both
 * measure a local build and a rendered document, and neither clicks anything.
 *
 * So the checks here are deliberately behavioural and deliberately remote:
 *
 *   1. the policy served actually carries hashes;
 *   2. the browser reports no CSP violation;
 *   3. a control that needs JavaScript responds to a click.
 *
 * The third is the one that matters. The first two can pass while the page is
 * inert, and the point of this script is that a human did not have to be the
 * one to notice.
 *
 * Usage: node scripts/verify-deployment.mjs https://example.com
 */

import { chromium } from '@playwright/test';

const target = process.argv[2];

if (target === undefined) {
  console.error('Usage: node scripts/verify-deployment.mjs <url>');
  process.exit(2);
}

const origin = target.replace(/\/+$/, '');
const failures = [];

function check(ok, description, detail) {
  console.log(`${ok ? '  ok  ' : '  FAIL'}  ${description}`);
  if (!ok) {
    failures.push(description);
    if (detail !== undefined) console.log(`        ${detail}`);
  }
}

console.log(`Verifying ${origin}\n`);

/* 1. The served policy must name hashes, not just 'self'. */
const headResponse = await fetch(`${origin}/en`, { redirect: 'follow' });
const policy = headResponse.headers.get('content-security-policy') ?? '';
const hashCount = (policy.match(/'sha256-/g) ?? []).length;

check(headResponse.status === 200, `GET /en responds 200`, `got ${String(headResponse.status)}`);
check(policy !== '', 'a Content-Security-Policy header is present');
check(
  hashCount > 0,
  'script-src names inline script hashes',
  `found ${String(hashCount)}; an empty list blocks hydration entirely`,
);
check(
  !policy.includes('unsafe-inline') || !/script-src[^;]*unsafe-inline/.test(policy),
  "script-src does not contain 'unsafe-inline'",
);
check(!/script-src[^;]*unsafe-eval/.test(policy), "script-src does not contain 'unsafe-eval'");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.addInitScript(() => {
  window.__cspViolations = [];
  document.addEventListener('securitypolicyviolation', (event) => {
    window.__cspViolations.push(`${event.violatedDirective} ${event.blockedURI}`);
  });
});

await page.goto(`${origin}/en`, { waitUntil: 'networkidle', timeout: 60_000 });

/* 2. No violation at runtime. */
const violations = await page.evaluate(() => window.__cspViolations);
check(
  violations.length === 0,
  'the browser reports no CSP violation',
  violations.slice(0, 3).join('; '),
);

/* 3. The page hydrates, proven by a control that cannot work without it. */
const banner = page.getByRole('dialog');
const bannerShown = await banner.isVisible().catch(() => false);
check(bannerShown, 'the consent banner renders');

if (bannerShown) {
  await page.getByRole('button', { name: /reject all|resping toate/i }).click();
  await page.waitForTimeout(1_000);
  const stillThere = await banner.isVisible().catch(() => false);
  check(!stillThere, 'the consent banner closes when the choice is rejected');
}

/* A second independent control, so one broken component is not read as hydration. */
const trigger = page.locator('button[aria-expanded]').first();
if ((await trigger.count()) > 0) {
  const before = await trigger.getAttribute('aria-expanded');
  await trigger.click();
  await page.waitForTimeout(400);
  const after = await trigger.getAttribute('aria-expanded');
  check(before !== after, 'the navigation trigger toggles aria-expanded', `${before} -> ${after}`);
}

await browser.close();

console.log('');
if (failures.length > 0) {
  console.error(`${String(failures.length)} check(s) failed on the deployed site.`);
  process.exit(1);
}
console.log('The deployed site serves a hashed policy and hydrates.');
