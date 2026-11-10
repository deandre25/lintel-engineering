/**
 * The route registry.
 *
 * Every public URL on this site is derived from this one object: navigation
 * hrefs, `hreflang` alternates, the sitemap, breadcrumbs, the language switcher
 * and the localised-path rewrites in next.config.ts.
 *
 * Localised slugs (§8) are resolved here rather than by `next-intl`'s
 * `pathnames`, because that mechanism depends on request-time middleware and
 * §2 of the brief rules out a server-side runtime. Instead the file-system route
 * keeps the English spelling and `next.config.ts` turns this registry into
 * build-time rewrites, so `/ro/servicii` is served by the prerendered
 * `/ro/services` page with no function invocation. See DECISIONS.md.
 */

export const locales = ['en', 'ro'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Locale tags for `<html lang>` and `Intl` formatting, which need a region. */
export const localeTags: Record<Locale, string> = {
  en: 'en-GB',
  ro: 'ro-RO',
};

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ro: 'Română',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * A route's path template, relative to the locale prefix. `[slug]` marks the
 * one dynamic segment a route may carry.
 */
type PathTemplate = `/${string}` | '/';

export interface RouteDefinition {
  /** Path under `src/app/[locale]`. Always the English spelling. */
  readonly internal: PathTemplate;
  /** Public path per locale. Differs from `internal` wherever it is translated. */
  readonly paths: Readonly<Record<Locale, PathTemplate>>;
  /** True when the template contains a `[slug]` segment. */
  readonly dynamic: boolean;
}

export const routes = {
  home: {
    internal: '/',
    paths: { en: '/', ro: '/' },
    dynamic: false,
  },
  services: {
    internal: '/services',
    paths: { en: '/services', ro: '/servicii' },
    dynamic: false,
  },
  service: {
    internal: '/services/[slug]',
    paths: { en: '/services/[slug]', ro: '/servicii/[slug]' },
    dynamic: true,
  },
  work: {
    internal: '/work',
    paths: { en: '/work', ro: '/proiecte' },
    dynamic: false,
  },
  caseStudy: {
    internal: '/work/[slug]',
    paths: { en: '/work/[slug]', ro: '/proiecte/[slug]' },
    dynamic: true,
  },
  about: {
    internal: '/about',
    paths: { en: '/about', ro: '/despre-noi' },
    dynamic: false,
  },
  insights: {
    internal: '/insights',
    paths: { en: '/insights', ro: '/analize' },
    dynamic: false,
  },
  insight: {
    internal: '/insights/[slug]',
    paths: { en: '/insights/[slug]', ro: '/analize/[slug]' },
    dynamic: true,
  },
  contact: {
    internal: '/contact',
    paths: { en: '/contact', ro: '/contact' },
    dynamic: false,
  },
  careers: {
    internal: '/careers',
    paths: { en: '/careers', ro: '/cariere' },
    dynamic: false,
  },
  privacy: {
    internal: '/privacy',
    paths: { en: '/privacy', ro: '/confidentialitate' },
    dynamic: false,
  },
  cookies: {
    internal: '/cookies',
    paths: { en: '/cookies', ro: '/cookie-uri' },
    dynamic: false,
  },
  terms: {
    internal: '/terms',
    paths: { en: '/terms', ro: '/termeni' },
    dynamic: false,
  },
  legalNotice: {
    internal: '/legal-notice',
    paths: { en: '/legal-notice', ro: '/informatii-legale' },
    dynamic: false,
  },
} as const satisfies Record<string, RouteDefinition>;

export type RouteId = keyof typeof routes;

export const routeIds = Object.keys(routes) as readonly RouteId[];

/** Route ids whose template has no `[slug]`, so a path needs no parameters. */
export type StaticRouteId = {
  [K in RouteId]: (typeof routes)[K]['dynamic'] extends false ? K : never;
}[RouteId];

/** Route ids whose template requires a `slug`. */
export type DynamicRouteId = Exclude<RouteId, StaticRouteId>;

function fill(template: string, slug: string | undefined): string {
  if (slug === undefined) return template;
  return template.replace('[slug]', slug);
}

function joinLocale(locale: Locale, path: string): string {
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/**
 * A route's path template with the locale prefix applied but `[slug]` left in
 * place. Needed by the rewrite generator and the sitemap, which work over every
 * route uniformly and so cannot satisfy the parameter-aware overloads below.
 */
export function localisedTemplate(locale: Locale, id: RouteId): string {
  return joinLocale(locale, routes[id].paths[locale]);
}

/** As `localisedTemplate`, for the English-spelled file-system route. */
export function internalTemplate(locale: Locale, id: RouteId): string {
  return joinLocale(locale, routes[id].internal);
}

/**
 * The public, localised URL path for a route — what goes in an `href`, a
 * canonical tag or the sitemap.
 *
 * The overloads make the `slug` argument required exactly when the route
 * template has a `[slug]` segment, so a missing slug is a type error rather
 * than a URL containing the literal text `[slug]`.
 */
export function routePath(locale: Locale, id: StaticRouteId): string;
export function routePath(locale: Locale, id: DynamicRouteId, slug: string): string;
export function routePath(locale: Locale, id: RouteId, slug?: string): string {
  return joinLocale(locale, fill(routes[id].paths[locale], slug));
}

/**
 * The internal, English-spelled path that `src/app` actually routes. Used by
 * the rewrite generator and by tests asserting registry/file-system parity.
 */
export function internalPath(locale: Locale, id: StaticRouteId): string;
export function internalPath(locale: Locale, id: DynamicRouteId, slug: string): string;
export function internalPath(locale: Locale, id: RouteId, slug?: string): string {
  return joinLocale(locale, fill(routes[id].internal, slug));
}

/** True when a route's public path is translated away from its internal one. */
export function hasTranslatedPath(id: RouteId, locale: Locale): boolean {
  return routes[id].paths[locale] !== routes[id].internal;
}

export interface MatchedRoute {
  readonly locale: Locale;
  readonly id: RouteId;
  /** Present only for routes whose template carries a `[slug]`. */
  readonly slug?: string;
}

/** Splits a URL path into its non-empty segments. */
function segmentsOf(path: string): string[] {
  return path.split('/').filter((segment) => segment.length > 0);
}

/**
 * Identifies which registry route a URL path corresponds to.
 *
 * Both spellings resolve: the localised one a visitor sees and the internal
 * English one the file system uses, so the language switcher works whichever
 * form the browser happens to be showing. Returns `null` for anything outside
 * the registry, which the caller treats as "no equivalent page".
 */
export function matchRoutePath(path: string): MatchedRoute | null {
  const segments = segmentsOf(path);
  const [localeSegment, ...rest] = segments;

  if (localeSegment === undefined || !isLocale(localeSegment)) return null;

  const locale = localeSegment;
  const remainder = `/${rest.join('/')}`;

  /* Static routes are matched first: an exact path never means a dynamic one. */
  for (const id of routeIds) {
    const route = routes[id];
    if (route.dynamic) continue;
    if (route.paths[locale] === remainder || route.internal === remainder) {
      return { locale, id };
    }
  }

  for (const id of routeIds) {
    const route = routes[id];
    if (!route.dynamic) continue;

    for (const template of [route.paths[locale], route.internal]) {
      const templateSegments = segmentsOf(template);
      if (templateSegments.length !== rest.length) continue;

      const slugIndex = templateSegments.indexOf('[slug]');
      if (slugIndex === -1) continue;

      const prefixMatches = templateSegments.every(
        (segment, index) => index === slugIndex || segment === rest[index],
      );
      const slug = rest[slugIndex];

      if (prefixMatches && slug !== undefined && slug.length > 0) {
        return { locale, id, slug };
      }
    }
  }

  return null;
}

/**
 * Translates a dynamic route's slug between locales. Supplied by the content
 * layer, which owns the per-locale slugs; `undefined` means this entity has no
 * counterpart in the target locale.
 */
export type SlugTranslator = (
  id: RouteId,
  slug: string,
  from: Locale,
  to: Locale,
) => string | undefined;

/**
 * The equivalent path in another locale, for the language switcher (§8).
 *
 * Falls back to the target locale's home page in the two cases where no
 * equivalent exists: the current path is not a registry route, or it is a
 * dynamic route whose slug has no translation.
 */
export function alternateRoutePath(
  path: string,
  target: Locale,
  translateSlug?: SlugTranslator,
): string {
  const matched = matchRoutePath(path);
  if (matched === null) return routePath(target, 'home');
  if (matched.locale === target) return path;

  if (matched.slug === undefined) {
    return joinLocale(target, routes[matched.id].paths[target]);
  }

  const translated = translateSlug?.(matched.id, matched.slug, matched.locale, target);
  if (translated === undefined) return routePath(target, 'home');

  return joinLocale(target, fill(routes[matched.id].paths[target], translated));
}
