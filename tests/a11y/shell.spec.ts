import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { locales, routePath } from '../../src/lib/routing';

/**
 * Zero axe violations is a merge requirement (§11), so these assert an empty
 * array rather than a count under a threshold. Page templates are added as they
 * are built; so far that is the document shell and the styleguide.
 */

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test.describe('accessibility of the document shell', () => {
  for (const locale of locales) {
    test(`/${locale} has no axe violations`, async ({ page }) => {
      await page.goto(routePath(locale, 'home'));

      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

      expect(results.violations).toEqual([]);
    });
  }
});

/*
 * The styleguide renders every primitive on one page, so a single scan covers
 * the whole design system — including the states a page template may not happen
 * to show, such as an invalid field or a disabled button.
 */
test.describe('accessibility of the design system', () => {
  test('the styleguide has no axe violations', async ({ page }) => {
    await page.goto(routePath('en', 'styleguide'));

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    expect(results.violations).toEqual([]);
  });

  test('an expanded disclosure is still free of violations', async ({ page }) => {
    await page.goto(routePath('en', 'styleguide'));

    /* The collapsed panel is unmounted, so its contents need their own scan. */
    await page
      .getByRole('button', { name: 'How long does a technical due diligence take?' })
      .click();
    await expect(page.getByRole('region', { name: /technical due diligence/ })).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    expect(results.violations).toEqual([]);
  });
});
