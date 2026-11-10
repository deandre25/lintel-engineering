import { expect, test } from '@playwright/test';

import { locales, localeTags, routePath } from '../../src/lib/routing';

/**
 * Phase 1 covers the document shell only: the routes that exist, the chrome
 * every page inherits, and the routing rules that make localised URLs work.
 * Page-level journeys arrive with the pages themselves.
 */

test.describe('locale home routes', () => {
  for (const locale of locales) {
    test(`/${locale} renders with the correct document language`, async ({ page }) => {
      await page.goto(routePath(locale, 'home'));

      await expect(page.locator('html')).toHaveAttribute('lang', localeTags[locale]);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).not.toBeEmpty();
    });

    test(`/${locale} exposes the landmark structure`, async ({ page }) => {
      await page.goto(routePath(locale, 'home'));

      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.getByRole('contentinfo')).toBeVisible();
    });
  }
});

test.describe('routing rules', () => {
  test('the bare origin redirects to the default locale', async ({ page }) => {
    const response = await page.goto('/');

    expect(response?.url()).toContain('/en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB');
  });

  test('an unknown locale is a 404, not a silent fallback', async ({ request }) => {
    const response = await request.get('/de', { maxRedirects: 0 });
    expect(response.status()).toBe(404);
  });

  test('an untranslated Romanian path redirects to its localised spelling', async ({ request }) => {
    const response = await request.get('/ro/about', { maxRedirects: 0 });

    expect(response.status()).toBe(308);
    expect(response.headers().location).toContain('/ro/despre-noi');
  });
});

test.describe('skip link', () => {
  test('is the first tab stop and moves focus to main', async ({ page }) => {
    await page.goto(routePath('en', 'home'));

    await page.keyboard.press('Tab');

    const skipLink = page.getByRole('link', { name: 'Skip to content' });
    await expect(skipLink).toBeFocused();
    /* It must be visible once focused, not merely present in the DOM. */
    await expect(skipLink).toBeInViewport();

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);
  });
});

test.describe('language switcher', () => {
  test('moves between locales and keeps the equivalent page', async ({ page }) => {
    await page.goto(routePath('en', 'home'));

    await page.getByRole('link', { name: 'Switch to Română' }).click();

    await expect(page).toHaveURL(/\/ro$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ro-RO');
  });
});
