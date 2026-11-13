import { locales, routePath, routes } from './routing';

import type { DynamicRouteId, Locale, RouteId, StaticRouteId } from './routing';
import type { Metadata } from 'next';

/**
 * Canonical URLs, `hreflang` alternates and social tags.
 *
 * Everything here has to end up in the HTML the server sends: a crawler that
 * runs no JavaScript sees nothing that is added after hydration. The output is
 * therefore built in `generateMetadata`, never in a client component.
 */

const FALLBACK_ORIGIN = 'https://lintel-engineering.com';

/**
 * The site's origin, without a trailing slash.
 *
 * Read from the environment so the same build can be pointed at a preview
 * deployment. Falls back rather than throwing, because a missing variable
 * should not fail a local build — but an origin that is not absolute is a
 * configuration error worth failing on, since every canonical would be wrong.
 */
export function siteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured === undefined || configured === '') return FALLBACK_ORIGIN;

  if (!/^https?:\/\//.test(configured)) {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be an absolute URL including the scheme, received "${configured}"`,
    );
  }

  return configured.replace(/\/+$/, '');
}

export function absoluteUrl(path: string): string {
  return `${siteOrigin()}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Resolves a route's localised slug in another locale. Supplied by content. */
export type SlugResolver = (locale: Locale) => string | undefined;

export interface AlternatesInput {
  locale: Locale;
  route: RouteId;
  /** Required for a route whose template carries a `[slug]`. */
  resolveSlug?: SlugResolver;
}

/**
 * `alternates` for a page: its canonical URL, one `hreflang` per locale, and
 * `x-default` (§9).
 *
 * `x-default` points at the default locale rather than at a language selector,
 * because there is no selector: both locales are prefixed and `/` redirects.
 */
export function buildAlternates({ locale, route, resolveSlug }: AlternatesInput): {
  canonical: string;
  languages: Record<string, string>;
} {
  const pathFor = (target: Locale): string | undefined => {
    if (!routes[route].dynamic) return routePath(target, route as StaticRouteId);

    const slug = resolveSlug?.(target);
    return slug === undefined ? undefined : routePath(target, route as DynamicRouteId, slug);
  };

  const languages: Record<string, string> = {};

  for (const target of locales) {
    const path = pathFor(target);
    if (path !== undefined) languages[target] = absoluteUrl(path);
  }

  const canonicalPath = pathFor(locale);
  if (canonicalPath === undefined) {
    throw new Error(`No path for route "${route}" in locale "${locale}"`);
  }

  const defaultPath = pathFor('en');
  if (defaultPath !== undefined) languages['x-default'] = absoluteUrl(defaultPath);

  return { canonical: absoluteUrl(canonicalPath), languages };
}

export interface PageMetadataInput extends AlternatesInput {
  title: string;
  description: string;
  /** Set on articles so Open Graph can declare `article` rather than `website`. */
  publishedTime?: string;
  authors?: string[];
}

/**
 * Metadata for one page.
 *
 * The title is passed bare: the locale layout owns the `%s — Lintel
 * Engineering` template, so adding the company name here would double it.
 */
export function pageMetadata({
  locale,
  route,
  resolveSlug,
  title,
  description,
  publishedTime,
  authors,
}: PageMetadataInput): Metadata {
  const alternates = buildAlternates(
    resolveSlug === undefined ? { locale, route } : { locale, route, resolveSlug },
  );

  const isArticle = publishedTime !== undefined;

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: isArticle ? 'article' : 'website',
      title,
      description,
      url: alternates.canonical,
      siteName: 'Lintel Engineering',
      locale: locale === 'ro' ? 'ro_RO' : 'en_GB',
      ...(isArticle ? { publishedTime } : {}),
      ...(authors === undefined ? {} : { authors }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
