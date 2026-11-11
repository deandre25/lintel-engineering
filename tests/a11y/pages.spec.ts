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
  test('answers 404 and offers a route onward in both languages', async ({ page }) => {
    const response = await page.goto('/en/this-page-does-not-exist');
    expect(response?.status()).toBe(404);

    /* Bilingual, because a path that matched no route has no locale to read. */
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(2);
    await expect(page.getByText('That page does not exist')).toBeVisible();
    await expect(page.getByText('Pagina aceasta nu există')).toBeVisible();

    await expect(page.getByRole('link', { name: 'Go to the home page' })).toHaveAttribute(
      'href',
      '/en',
    );
    await expect(page.getByRole('link', { name: 'Mergeți la pagina principală' })).toHaveAttribute(
      'href',
      '/ro',
    );
  });

  test('has no axe violations other than the document language Next owns', async ({ page }) => {
    await page.goto('/en/this-page-does-not-exist');

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    /*
     * `html-has-lang` is excluded here and only here. The root layout lives at
     * `[locale]/layout.tsx`, so Next renders the 404 in a shell it owns and
     * emits the `<html>` itself, without `lang`. Everything inside the shell is
     * ours and is asserted. See DECISIONS.md for the options for closing it.
     */
    const ours = results.violations.filter((violation) => violation.id !== 'html-has-lang');
    expect(ours).toEqual([]);
  });
});
