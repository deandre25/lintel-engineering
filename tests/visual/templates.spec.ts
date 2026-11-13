import { expect, test } from '@playwright/test';

import { CONSENT_COOKIE, DECLINE_ALL } from '../../src/lib/consent';

/**
 * Visual baselines.
 *
 * Deliberately small. A large grid of screenshots is not a stronger gate: it
 * is a slower one that gets its failures waved through. 78 of them across 13
 * templates failed to catch half the site being set in the wrong typeface,
 * because a single diacritic in a fallback face is below the resolution of
 * visual review. So these cover the cases where a pixel diff is the only
 * instrument that would notice, and nothing else:
 *
 * - the styleguide, which is the entire design system on one page, including
 *   the disabled control states. Those have no functional test: a disabled
 *   button that renders at the wrong contrast still refuses the click, and
 *   WCAG exempts inactive controls so axe stays silent. This is the gap left
 *   open in DECISIONS.md at gate 2.
 * - Romanian at 768px, the one intersection where a layout bug actually
 *   shipped -- the header nav overflowed at middle width, and only in the
 *   locale with longer words.
 * - a service page in Romanian, where the glyph coverage of the body face is
 *   on screen in quantity.
 * - the two pages built from prose rather than a template: an insight, and
 *   the global 404, which renders outside every layout and so inherits none
 *   of the site's chrome by default.
 */

/* The banner covers the foot of every page and asks to be dismissed first. */
const DISMISSED = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(DECLINE_ALL))}`;

test.beforeEach(async ({ context, baseURL }) => {
  const { hostname } = new URL(baseURL ?? 'http://127.0.0.1');
  const [name = '', value = ''] = DISMISSED.split('=');
  await context.addCookies([{ name, value, domain: hostname, path: '/' }]);
});

/*
 * Animation is disabled for the shot, not for the run: a transition caught
 * mid-flight is the classic flaky baseline. The site honours
 * prefers-reduced-motion, and that is asserted functionally elsewhere.
 */
const shot = { animations: 'disabled', fullPage: true } as const;

test.describe('page baselines', () => {
  test('the styleguide carries the whole design system', async ({ page }) => {
    await page.goto('/en/styleguide');
    await expect(page).toHaveScreenshot('styleguide-en-desktop.png', shot);
  });

  test('the styleguide at phone width', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/styleguide');
    await expect(page).toHaveScreenshot('styleguide-en-390.png', shot);
  });

  test('the home page', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveScreenshot('home-en-desktop.png', shot);
  });

  test('the home page in Romanian at middle width', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/ro');
    await expect(page).toHaveScreenshot('home-ro-768.png', shot);
  });

  test('a service page in Romanian', async ({ page }) => {
    await page.goto('/ro/servicii/inginerie-structurala');
    await expect(page).toHaveScreenshot('service-ro-desktop.png', shot);
  });

  test('an insight, which is MDX rather than a template', async ({ page }) => {
    await page.goto('/en/insights/fatigue-in-older-welded-connections');
    await expect(page).toHaveScreenshot('insight-en-desktop.png', shot);
  });

  test('the global 404, which renders outside every layout', async ({ page }) => {
    /*
     * A path with more than one segment. A single-segment path matches the
     * `[locale]` route and produces the localised 404 instead, which is a
     * different page rendered a different way -- see DECISIONS.md.
     */
    await page.goto('/no/such/page');
    /* Two h1s, one per language: with no locale in the URL it greets in both. */
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(2);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    await expect(page).toHaveScreenshot('not-found-global.png', shot);
  });
});

test.describe('states with no functional equivalent', () => {
  test('the consent banner as a first-time visitor sees it', async ({ browser }) => {
    /* A fresh context: this is the one page that needs no stored choice. */
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/en');
    await expect(page.getByRole('dialog')).toHaveScreenshot('consent-banner.png', {
      animations: 'disabled',
    });
    await context.close();
  });

  test('the mobile navigation open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en');
    /*
     * The trigger is the only control that owns a panel. Addressing it by
     * role alone picked up the footer instead, and the baseline recorded a
     * corner of the footer while the test passed.
     */
    const trigger = page.locator('button[aria-controls][aria-expanded]').first();
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    /* The panel is fixed to the viewport, so the viewport is the frame. */
    await expect(page).toHaveScreenshot('mobile-nav-open.png', { animations: 'disabled' });
  });
});
