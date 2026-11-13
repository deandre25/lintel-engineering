import { expect, test } from '@playwright/test';

/**
 * The contact form and the consent gate, against the production build.
 *
 * The consent test asserts on the network rather than on a flag, because §10
 * is specific: a banner that records a choice and loads everything regardless
 * is worse than none, and the check a reviewer runs is the network tab.
 */

const ANALYTICS_HOST = 'plausible.io';

test.describe('contact form', () => {
  test('an empty submission reports every missing field and sends nothing', async ({ page }) => {
    const sent: string[] = [];
    page.on('request', (request) => {
      if (request.method() === 'POST') sent.push(request.url());
    });

    await page.goto('/en/contact');
    await page.getByRole('button', { name: 'Send enquiry' }).click();

    await expect(
      page.getByText('Enter your name, so we know who we are replying to.'),
    ).toBeVisible();
    await expect(page.getByText('Enter an email address so we can reply.')).toBeVisible();
    await expect(page.getByText(/We need your agreement/)).toBeVisible();

    expect(sent).toEqual([]);
  });

  test('an invalid address is reported after leaving the field, not while typing', async ({
    page,
  }) => {
    await page.goto('/en/contact');

    const email = page.getByLabel('Email');
    await email.fill('not-an-address');

    /* Still focused: validation is on blur, so nothing should be shown yet. */
    await expect(page.getByText(/missing an @/)).toBeHidden();

    await page.getByLabel('Name').click();
    await expect(page.getByText(/missing an @/)).toBeVisible();
  });

  test('a complete submission reaches the success state', async ({ page }) => {
    await page.goto('/en/contact');

    await page.getByLabel('Name').fill('Andrei Popescu');
    await page.getByLabel('Email').fill('a.popescu@example.com');
    await page.getByLabel('What is this about').selectOption({ index: 1 });
    await page
      .getByLabel('What has stalled, and by when does it need resolving')
      .fill('A 1974 hall needs recertifying for a heavier crane, by March.');
    await page.getByRole('checkbox').check();

    /* Past the minimum time-to-submit, which the schema enforces. */
    await page.waitForTimeout(3300);
    await page.getByRole('button', { name: 'Send enquiry' }).click();

    await expect(page.getByRole('status')).toContainText('Your enquiry has reached us');
  });

  test('the honeypot is present and hidden from assistive technology', async ({ page }) => {
    await page.goto('/en/contact');

    const honeypot = page.locator('input[name="website"]');
    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).toHaveAttribute('tabindex', '-1');
    await expect(honeypot).toHaveValue('');
  });
});

test.describe('cookie consent', () => {
  test('loads no analytics before a choice is made', async ({ page }) => {
    const hits: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes(ANALYTICS_HOST)) hits.push(request.url());
    });

    await page.goto('/en');
    await expect(page.getByRole('dialog', { name: /Cookies on this site/ })).toBeVisible();

    expect(hits).toEqual([]);
  });

  test('declining means the analytics request never fires, on this page or the next', async ({
    page,
  }) => {
    const hits: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes(ANALYTICS_HOST)) hits.push(request.url());
    });

    await page.goto('/en');
    await page.getByRole('button', { name: 'Reject all' }).click();

    await expect(page.getByRole('dialog', { name: /Cookies on this site/ })).toBeHidden();

    /* The choice has to survive navigation, not just the current page. */
    await page.goto('/en/services');
    await page.waitForLoadState('networkidle');

    expect(hits).toEqual([]);
  });

  test('rejecting is offered at the same weight as accepting', async ({ page }) => {
    await page.goto('/en');

    const reject = page.getByRole('button', { name: 'Reject all' });
    const accept = page.getByRole('button', { name: 'Accept all' });

    const rejectBox = await reject.boundingBox();
    const acceptBox = await accept.boundingBox();

    expect(rejectBox).not.toBeNull();
    expect(acceptBox).not.toBeNull();
    /* Same height and on the same row: neither is the quiet option. */
    expect(Math.abs((rejectBox?.height ?? 0) - (acceptBox?.height ?? 0))).toBeLessThan(2);
    expect(Math.abs((rejectBox?.y ?? 0) - (acceptBox?.y ?? 0))).toBeLessThan(2);
  });

  test('the choice can be reopened from the footer', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('button', { name: 'Reject all' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();

    await page.getByRole('button', { name: 'Cookie settings' }).click();
    await expect(page.getByRole('dialog', { name: /Cookies on this site/ })).toBeVisible();
  });
});
