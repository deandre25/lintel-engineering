import { getContent } from '@/content/registry';
import { defaultLocale, indexableRouteIds, locales, routePath, routes } from '@/lib/routing';
import { absoluteUrl, buildAlternates } from '@/lib/seo';

import type { DynamicRouteId, Locale, RouteId, StaticRouteId } from '@/lib/routing';
import type { MetadataRoute } from 'next';

/**
 * The sitemap: every indexable route in every locale, each carrying its
 * `hreflang` alternates (§9).
 *
 * Built from the route registry rather than from a list, so a new route or a
 * new locale appears without anyone remembering. `noindex` routes — currently
 * the styleguide — are excluded by the registry itself.
 */

/** Newest content date per route, so `lastModified` means something. */
function lastModifiedFor(locale: Locale, route: RouteId, slug?: string): Date {
  const content = getContent(locale);

  if (route === 'insight' && slug !== undefined) {
    const insight = content.insights.find((item) => item.slug === slug);
    if (insight !== undefined) return new Date(insight.publishedAt);
  }

  if (route === 'privacy' || route === 'cookies' || route === 'terms' || route === 'legalNotice') {
    return new Date(content.legal[route].updated);
  }

  if (route === 'insights') {
    const newest = content.insights
      .map((insight) => insight.publishedAt)
      .sort()
      .at(-1);
    if (newest !== undefined) return new Date(newest);
  }

  /*
   * Everything else is edited with the content modules rather than published on
   * a date, so the build date is the honest answer. A fabricated per-page date
   * would be a claim the repository cannot support.
   */
  return new Date();
}

/**
 * The `hreflang` set for one route, delegated to the same function that builds
 * the `<head>` alternates.
 *
 * These were two implementations until they were unified. A sitemap whose
 * `xhtml:link` set disagrees with the page's `<link rel="alternate">` is worse
 * than having neither, because a crawler reconciles the two and the
 * disagreement is what it reports. One code path means they cannot drift.
 */
function alternatesFor(route: RouteId, slugFor: (locale: Locale) => string | undefined) {
  return buildAlternates({ locale: defaultLocale, route, resolveSlug: slugFor }).languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of indexableRouteIds()) {
      if (!routes[route].dynamic) {
        entries.push({
          url: absoluteUrl(routePath(locale, route as StaticRouteId)),
          lastModified: lastModifiedFor(locale, route),
          alternates: { languages: alternatesFor(route, () => undefined) },
        });
        continue;
      }

      const content = getContent(locale);
      const items =
        route === 'service'
          ? content.services
          : route === 'caseStudy'
            ? content.caseStudies
            : content.insights;

      for (const item of items) {
        entries.push({
          url: absoluteUrl(routePath(locale, route as DynamicRouteId, item.slug)),
          lastModified: lastModifiedFor(locale, route, item.slug),
          alternates: {
            languages: alternatesFor(route, (target) => {
              const source = getContent(target);
              const pool =
                route === 'service'
                  ? source.services
                  : route === 'caseStudy'
                    ? source.caseStudies
                    : source.insights;
              return pool.find((candidate) => candidate.id === item.id)?.slug;
            }),
          },
        });
      }
    }
  }

  return entries;
}
