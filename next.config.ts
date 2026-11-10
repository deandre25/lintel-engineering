import createNextIntlPlugin from 'next-intl/plugin';

import { canonicalLocaleRedirects, localisedRewrites } from './src/lib/rewrites';
import { defaultLocale } from './src/lib/routing';

import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /*
   * Trailing slashes are off and enforced by a redirect below, so every URL has
   * exactly one spelling and canonical tags never disagree with the address bar.
   */
  trailingSlash: false,

  /* A build that type-errors must fail, never silently ship. Next 16 dropped
   * `next lint`, so ESLint runs as its own CI job rather than inside the build. */
  typescript: { ignoreBuildErrors: false },

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  /*
   * Serve the localised URLs from the prerendered English-spelled routes. These
   * are routing-table entries resolved before any function runs, which is what
   * keeps localised slugs compatible with the static-only constraint in §2.
   */
  rewrites() {
    return Promise.resolve(localisedRewrites().map((rule) => ({ ...rule })));
  },

  redirects() {
    return Promise.resolve([
      /* Bare origin has no content of its own; the default locale owns it. */
      { source: '/', destination: `/${defaultLocale}`, permanent: false },

      /* Collapse the untranslated duplicates of every localised path. */
      ...canonicalLocaleRedirects().map((rule) => ({ ...rule })),
    ]);
  },
};

export default withNextIntl(nextConfig);
