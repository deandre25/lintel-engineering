import { absoluteUrl } from '@/lib/seo';

import type { MetadataRoute } from 'next';

/**
 * robots.txt: allow everything, and point at the sitemap (§9).
 *
 * The styleguide is deliberately **not** disallowed, although it carries
 * `noindex`. The two directives work against each other: a crawler has to
 * fetch a page to read its `noindex`, and `Disallow` guarantees it never does.
 * A disallowed URL can still appear in results as a bare link if anything
 * points at it, with no description, and with no way for the `noindex` to take
 * effect. Allowing the crawl is what lets the `noindex` be obeyed.
 *
 * No `Host` directive: it is a Yandex extension that Google ignores, and the
 * canonical tags already state the preferred origin.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
