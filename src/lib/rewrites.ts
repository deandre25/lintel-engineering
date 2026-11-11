import {
  hasTranslatedPath,
  internalTemplate,
  locales,
  localisedTemplate,
  routeIds,
} from './routing';

export interface RewriteRule {
  readonly source: string;
  readonly destination: string;
}

export interface RedirectRule extends RewriteRule {
  /**
   * 301, not 308.
   *
   * Next's `permanent: true` emits 308, which preserves the request method.
   * §9 asks for 301, and for navigational URLs that is the right answer: these
   * addresses are only ever fetched with GET, and 301 is what every tool,
   * every log analyser and every SEO audit expects to see on a migration.
   */
  readonly statusCode: 301;
}

/** Next's path matcher uses `:name` where the route registry uses `[slug]`. */
function toMatcher(path: string): string {
  return path.replace('[slug]', ':slug');
}

/**
 * Rewrites that let a localised URL be served by the prerendered page sitting
 * at the English-spelled file-system route.
 *
 * Generated rather than written by hand, so a new route or a new locale cannot
 * fall out of step with the registry. Only translated paths produce a rule:
 * `/en/services` and `/ro/contact` already match their own files.
 */
export function localisedRewrites(): RewriteRule[] {
  return routeIds.flatMap((id) =>
    locales
      .filter((locale) => hasTranslatedPath(id, locale))
      .map((locale) => ({
        source: toMatcher(localisedTemplate(locale, id)),
        destination: toMatcher(internalTemplate(locale, id)),
      })),
  );
}

/**
 * The flip side of the rewrites: an English-spelled path under a locale that
 * translates it is a second URL for the same content, so it redirects to the
 * canonical localised one rather than being served and indexed twice.
 */
export function canonicalLocaleRedirects(): RedirectRule[] {
  return routeIds.flatMap((id) =>
    locales
      .filter((locale) => hasTranslatedPath(id, locale))
      .map((locale) => ({
        source: toMatcher(internalTemplate(locale, id)),
        destination: toMatcher(localisedTemplate(locale, id)),
        statusCode: 301,
      })),
  );
}
