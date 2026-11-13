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
 *   1. the policy served is present and has not been widened;
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

/*
 * 1. The served policy.
 *
 * `script-src` carries `'unsafe-inline'`, which is a deliberate and recorded
 * compromise — see src/lib/securityHeaders.ts. So this no longer asserts that
 * hashes are present. What it does assert is everything that compromise is
 * not allowed to widen into, plus the thing the original incident broke: that
 * the page actually hydrates and responds.
 */
const headResponse = await fetch(`${origin}/en`, { redirect: 'follow' });
const policy = headResponse.headers.get('content-security-policy') ?? '';

check(headResponse.status === 200, `GET /en responds 200`, `got ${String(headResponse.status)}`);
check(policy !== '', 'a Content-Security-Policy header is present');
check(/script-src/.test(policy), 'the policy constrains script-src at all');
check(!/unsafe-eval/.test(policy), "the policy contains no 'unsafe-eval' anywhere");
check(!/[\s;]\*|\*\s/.test(policy), 'the policy contains no wildcard source');
check(/default-src 'self'/.test(policy), "default-src is 'self'");
check(/object-src 'none'/.test(policy), "object-src is 'none'");
check(/base-uri 'self'/.test(policy), "base-uri is 'self'");
check(/frame-ancestors 'none'/.test(policy), "frame-ancestors is 'none'");

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
console.log('The deployed site serves its policy, hydrates, and responds.');
