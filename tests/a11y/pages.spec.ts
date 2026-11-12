import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { getContent } from '../../src/content/registry';
import { locales, routePath } from '../../src/lib/routing';

import type { Locale } from '../../src/lib/routing';

/**
 * Accessibility of every page template, in both locales.
 *
 * One page per template rather than every page: the templates are what vary,
 * and the content inside them is validated elsewhere. Romanian is scanned as
 * well as English because `lang`, word length and diacritics change how a page
 * wraps, and wrapping is what breaks a layout.
 */

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

function templatePaths(locale: Locale): { name: string; path: string }[] {
  const content = getContent(locale);
  const service = content.services.at(0);
  const caseStudy = content.caseStudies.at(0);
  const insight = content.insights.at(0);

  if (service === undefined || caseStudy === undefined || insight === undefined) {
    throw new Error(`No content to scan for locale ${locale}`);
  }

  return [
    { name: 'home', path: routePath(locale, 'home') },
    { name: 'services index', path: routePath(locale, 'services') },
    { name: 'service', path: routePath(locale, 'service', service.slug) },
    { name: 'work index', path: routePath(locale, 'work') },
    { name: 'case study', path: routePath(locale, 'caseStudy', caseStudy.slug) },
    { name: 'about', path: routePath(locale, 'about') },
    { name: 'insights index', path: routePath(locale, 'insights') },
    { name: 'insight', path: routePath(locale, 'insight', insight.slug) },
    { name: 'contact', path: routePath(locale, 'contact') },
    { name: 'careers', path: routePath(locale, 'careers') },
    { name: 'legal', path: routePath(locale, 'privacy') },
  ];
}

for (const locale of locales) {
  test.describe(`${locale} page templates`, () => {
    for (const { name, path } of templatePaths(locale)) {
      test(`${name} has no axe violations`, async ({ page }) => {
        await page.goto(path);

        const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
        expect(results.violations).toEqual([]);
      });
    }

    test('every template has exactly one h1 and no skipped heading levels', async ({ page }) => {
      for (const { name, path } of templatePaths(locale)) {
        await page.goto(path);
        await expect(page.locator('h1'), `${name}: h1 count`).toHaveCount(1);

        /*
         * A skipped level — h2 straight to h4 — is a real navigation failure
         * for screen-reader users and is not covered by any axe rule here.
         */
        const levels = await page
          .locator('h1, h2, h3, h4, h5, h6')
          .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName.slice(1))));

        const skips = levels
          .map((level, index) => ({ level, previous: levels[index - 1] ?? level }))
          .filter((entry) => entry.level - entry.previous > 1);

        expect(skips, `${name}: skipped heading levels`).toEqual([]);
      }
    });
  });
}

test.describe('the 404', () => {
  test('an unknown slug answers 404 from the prerendered page', async ({ page }) => {
    /*
     * `dynamicParams = false` means an unknown slug is answered from the
     * prerendered 404 rather than rendered on demand, which keeps the site
     * fully static and keeps the hydration payload hashable for the CSP.
     */
    const response = await page.goto('/ro/servicii/nu-exista-acest-serviciu');
    expect(response?.status()).toBe(404);

    await expect(page.getByText('Pagina aceasta nu există')).toBeVisible();
    await expect(page.getByText('That page does not exist')).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    const ours = results.violations.filter((violation) => violation.id !== 'html-has-lang');
    expect(ours).toEqual([]);
  });

  test('a path matching no route is correct apart from the shell Next owns', async ({ page }) => {
    const response = await page.goto('/no-locale-prefix-here');
    expect(response?.status()).toBe(404);

    /*
     * This is the only page without a root layout to wrap it, so Next emits the
     * `<html>` itself and without `lang`. Every block inside carries its own
     * `lang`, asserted below, so no text inherits language from the document.
     */
    await expect(page.locator('section[lang="en-GB"]')).toBeVisible();
    await expect(page.locator('section[lang="ro-RO"]')).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    const ours = results.violations.filter((violation) => violation.id !== 'html-has-lang');
    expect(ours).toEqual([]);
  });
});
