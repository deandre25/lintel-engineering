import createMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

import { canonicalLocaleRedirects, localisedRewrites } from './src/lib/rewrites';
import { defaultLocale } from './src/lib/routing';

import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/*
 * MDX is used for the insight articles only. No remark or rehype plugins:
 * the articles use headings, lists, tables and emphasis, all of which MDX
 * handles natively, and every plugin added here is parsed on every build.
 */
const withMDX = createMDX({});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /* `md` is absent deliberately: articles are MDX so they can use components. */
  pageExtensions: ['ts', 'tsx', 'mdx'],

  experimental: {
    /*
     * The Rust MDX compiler. The JavaScript loader path in @next/mdx cannot
     * resolve @mdx-js/loader under Turbopack, and the Rust compiler is both
     * the supported route there and faster on a cold build.
     */
    mdxRs: true,
  },

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

      /*
       * A plausible previous structure, kept because migrations are the normal
       * case: a site that has existed has old URLs, and losing them loses the
       * links pointing at them. Permanent, because these addresses are gone.
       */
      { source: '/services.html', destination: '/en/services', statusCode: 301 },
      { source: '/contact.html', destination: '/en/contact', statusCode: 301 },
      { source: '/about.html', destination: '/en/about', statusCode: 301 },
      { source: '/despre-noi', destination: '/ro/despre-noi', statusCode: 301 },
      { source: '/servicii', destination: '/ro/servicii', statusCode: 301 },
      { source: '/case-studies', destination: '/en/work', statusCode: 301 },
      { source: '/case-studies/:slug', destination: '/en/work/:slug', statusCode: 301 },

      /*
       * One spelling per URL. `trailingSlash: false` makes Next strip a
       * trailing slash already; this states the rule for the paths that a
       * previous structure served with one.
       */
      { source: '/:path*/', destination: '/:path*', statusCode: 301 },
    ]);
  },
};

export default withNextIntl(withMDX(nextConfig));
