import { isNoindex, locales, routeIds, routePath, routes } from '@/lib/routing';
import { absoluteUrl } from '@/lib/seo';

import type { MetadataRoute } from 'next';

/**
 * robots.txt: allow everything, disallow the routes that carry `noindex`, and
 * point at the sitemap (§9).
 *
 * The disallow list is derived from the registry, so a route marked `noindex`
 * is excluded here and from the sitemap by the same flag rather than by two
 * lists that can disagree.
 */
export default function robots(): MetadataRoute.Robots {
  const noindexPaths = routeIds
    .filter((route) => isNoindex(route) && !routes[route].dynamic)
    .flatMap((route) => locales.map((locale) => routePath(locale, route as 'styleguide')));

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      ...(noindexPaths.length === 0 ? {} : { disallow: noindexPaths }),
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
