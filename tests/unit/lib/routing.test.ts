import { describe, expect, it } from 'vitest';

import {
  alternateRoutePath,
  defaultLocale,
  hasTranslatedPath,
  internalTemplate,
  isLocale,
  locales,
  localisedTemplate,
  matchRoutePath,
  routeIds,
  routePath,
  routes,
} from '@/lib/routing';

import type { Locale, RouteId, SlugTranslator } from '@/lib/routing';

describe('routePath', () => {
  it('builds localised paths for both locales, including dynamic slugs', () => {
    expect(routePath('en', 'home')).toBe('/en');
    expect(routePath('en', 'services')).toBe('/en/services');
    expect(routePath('ro', 'services')).toBe('/ro/servicii');
    expect(routePath('ro', 'legalNotice')).toBe('/ro/informatii-legale');
    expect(routePath('en', 'service', 'structural-engineering')).toBe(
      '/en/services/structural-engineering',
    );
    expect(routePath('ro', 'service', 'inginerie-structurala')).toBe(
      '/ro/servicii/inginerie-structurala',
    );
  });

  it('never emits an unsubstituted parameter, for any route in any locale', () => {
    const leaked = locales.flatMap((locale) =>
      routeIds
        .map((id) =>
          routes[id].dynamic
            ? routePath(locale, id as 'service', 'a-slug')
            : routePath(locale, id as 'about'),
        )
        .filter((path) => path.includes('[')),
    );

    expect(leaked).toEqual([]);
  });
});

describe('the route registry', () => {
  it('marks a route dynamic exactly when its templates carry a slug', () => {
    const inconsistent = routeIds.filter((id) => {
      const route = routes[id];
      const templates = [route.internal, ...locales.map((locale) => route.paths[locale])];
      return templates.some((template) => template.includes('[slug]') !== route.dynamic);
    });

    expect(inconsistent).toEqual([]);
  });

  it('keeps localised paths unique within a locale, so no two routes collide', () => {
    for (const locale of locales) {
      const paths = routeIds.map((id) => localisedTemplate(locale, id));
      expect(new Set(paths).size, locale).toBe(paths.length);
    }
  });

  it('leaves the default locale untranslated, so it generates no rewrites', () => {
    const translated = routeIds.filter((id) => hasTranslatedPath(id, defaultLocale));
    expect(translated).toEqual([]);

    for (const id of routeIds) {
      expect(localisedTemplate(defaultLocale, id)).toBe(internalTemplate(defaultLocale, id));
    }
  });
});

describe('isLocale', () => {
  it('accepts the configured locales and rejects everything else', () => {
    expect(locales.filter((locale) => !isLocale(locale))).toEqual([]);
    expect(['de', 'EN', 'en-GB', ''].filter(isLocale)).toEqual([]);
  });
});

describe('matchRoutePath', () => {
  it('resolves the localised spelling, the internal spelling and a slug', () => {
    expect(matchRoutePath('/en')).toEqual({ locale: 'en', id: 'home' });
    expect(matchRoutePath('/ro/despre-noi')).toEqual({ locale: 'ro', id: 'about' });
    /* The rewrite target uses the internal spelling, so it must resolve too. */
    expect(matchRoutePath('/ro/about')).toEqual({ locale: 'ro', id: 'about' });
    expect(matchRoutePath('/en/work/press-line-migration')).toEqual({
      locale: 'en',
      id: 'caseStudy',
      slug: 'press-line-migration',
    });
  });

  it('prefers a static route over a dynamic one, and rejects non-routes', () => {
    expect(matchRoutePath('/en/services')).toEqual({ locale: 'en', id: 'services' });
    /* A trailing slash is the index, not a case study with an empty slug. */
    expect(matchRoutePath('/en/work/')).toEqual({ locale: 'en', id: 'work' });

    for (const path of ['/de/services', '/en/nothing-here', '/', '']) {
      expect(matchRoutePath(path), path).toBeNull();
    }
  });
});

describe('alternateRoutePath', () => {
  it('maps to the equivalent page, translating a slug through the content layer', () => {
    expect(alternateRoutePath('/en/services', 'ro')).toBe('/ro/servicii');
    expect(alternateRoutePath('/ro/despre-noi', 'en')).toBe('/en/about');
    expect(alternateRoutePath('/ro/servicii', 'ro')).toBe('/ro/servicii');

    const calls: [RouteId, string, Locale, Locale][] = [];
    const translate: SlugTranslator = (id, slug, from, to) => {
      calls.push([id, slug, from, to]);
      return 'inginerie-structurala';
    };

    expect(alternateRoutePath('/en/services/structural-engineering', 'ro', translate)).toBe(
      '/ro/servicii/inginerie-structurala',
    );
    expect(calls).toEqual([['service', 'structural-engineering', 'en', 'ro']]);
  });

  it('falls back to the locale home wherever no equivalent page exists', () => {
    /* Slug with no counterpart in the target locale. */
    expect(alternateRoutePath('/en/work/press-line-migration', 'ro', () => undefined)).toBe('/ro');
    /* Dynamic route reached with no translator supplied at all. */
    expect(alternateRoutePath('/en/work/press-line-migration', 'ro')).toBe('/ro');
    /* Paths outside the registry. */
    expect(alternateRoutePath('/en/not-a-page', 'ro')).toBe('/ro');
    expect(alternateRoutePath('/', 'ro')).toBe('/ro');
  });
});
