import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { locales, routePath } from '../../src/lib/routing';

/**
 * Zero axe violations is a merge requirement (§11), so this asserts an empty
 * array rather than a count below a threshold. Page templates are added here as
 * they are built; in Phase 1 the shell is all there is.
 */
test.describe('accessibility of the document shell', () => {
  for (const locale of locales) {
    test(`/${locale} has no axe violations`, async ({ page }) => {
      await page.goto(routePath(locale, 'home'));

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }
});
