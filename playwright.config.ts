import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright runs against the production build, never the dev server: the dev
 * server has different bundling, no minification and extra client runtime, so a
 * green dev suite would say nothing about what is deployed.
 *
 * Three projects share one server. They are separate so a visual-baseline
 * mismatch cannot be confused with a functional or accessibility failure in CI.
 */

const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${String(PORT)}`;

export default defineConfig({
  testDir: './tests',
  /* §13: no arbitrary waits. A short timeout keeps a hanging wait honest. */
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['github'], ['list']]
    : [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'a11y',
      testDir: './tests/a11y',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual',
      testDir: './tests/visual',
      use: { ...devices['Desktop Chrome'] },
      /* Baselines are committed, so a missing one is a failure, not a pass. */
      ignoreSnapshots: false,
    },
  ],

  webServer: {
    /*
     * The analytics domain is set so the consent tests are meaningful: without
     * it no analytics script exists and "declining prevents the request" would
     * pass for the wrong reason.
     */
    env: { NEXT_PUBLIC_PLAUSIBLE_DOMAIN: 'lintel-engineering.com' },
    command: `npm run build && npx next start --port ${String(PORT)}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
