import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { getContent } from '../../src/content/registry';
import { locales, routePath } from '../../src/lib/routing';

/**
 * Accessibility of the page templates built in Phase 4.
 *
 * One page per template per locale, rather than every page: the templates are
 * what vary, and the content below them is validated elsewhere. Romanian is
 * scanned as well as English because `lang`, hyphenation and the longer words
 * change how a page lays out.
 */

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

for (const locale of locales) {
  const content = getContent(locale);

  /*
   * `noUncheckedIndexedAccess` makes these possibly-undefined, and a test that
   * silently skipped because content was empty would be worse than one that
   * fails loudly here.
   */
  const service = content.services.at(0);
  const caseStudy = content.caseStudies.at(0);
  if (service === undefined || caseStudy === undefined) {
    throw new Error(`No content to scan for locale ${locale}`);
  }

  test.describe(`${locale} page templates`, () => {
    test('home has no axe violations', async ({ page }) => {
      await page.goto(routePath(locale, 'home'));

      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      expect(results.violations).toEqual([]);
    });

    test('a service page has no axe violations', async ({ page }) => {
      await page.goto(routePath(locale, 'service', service.slug));

      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      expect(results.violations).toEqual([]);
    });

    test('a case study has no axe violations', async ({ page }) => {
      await page.goto(routePath(locale, 'caseStudy', caseStudy.slug));

      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      expect(results.violations).toEqual([]);
    });

    test('every page template has exactly one h1', async ({ page }) => {
      for (const path of [
        routePath(locale, 'home'),
        routePath(locale, 'service', service.slug),
        routePath(locale, 'caseStudy', caseStudy.slug),
      ]) {
        await page.goto(path);
        await expect(page.locator('h1'), path).toHaveCount(1);
      }
    });
  });
}
