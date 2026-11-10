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
  it('prefixes the locale and keeps the English spelling for English', () => {
    expect(routePath('en', 'services')).toBe('/en/services');
    expect(routePath('en', 'home')).toBe('/en');
  });

  it('uses the translated segment for Romanian', () => {
    expect(routePath('ro', 'services')).toBe('/ro/servicii');
    expect(routePath('ro', 'about')).toBe('/ro/despre-noi');
    expect(routePath('ro', 'legalNotice')).toBe('/ro/informatii-legale');
  });

  it('substitutes the slug on dynamic routes', () => {
    expect(routePath('en', 'service', 'structural-engineering')).toBe(
      '/en/services/structural-engineering',
    );
    expect(routePath('ro', 'service', 'inginerie-structurala')).toBe(
      '/ro/servicii/inginerie-structurala',
    );
  });

  it('never leaves an unsubstituted parameter in a path', () => {
    for (const locale of locales) {
      for (const id of routeIds) {
        const path = routes[id].dynamic
          ? routePath(locale, id as 'service', 'a-slug')
          : routePath(locale, id as 'about');
        expect(path).not.toContain('[');
      }
    }
  });
});

describe('the registry itself', () => {
  it('defines a path for every locale on every route', () => {
    for (const id of routeIds) {
      for (const locale of locales) {
        expect(routes[id].paths[locale], `${id}/${locale}`).toMatch(/^\//);
      }
    }
  });

  it('marks a route dynamic exactly when its template carries a slug', () => {
    for (const id of routeIds) {
      const route = routes[id];
      expect(route.internal.includes('[slug]'), id).toBe(route.dynamic);

      for (const locale of locales) {
        expect(route.paths[locale].includes('[slug]'), `${id}/${locale}`).toBe(route.dynamic);
      }
    }
  });

  it('keeps every localised path unique within a locale, so no two routes collide', () => {
    for (const locale of locales) {
      const paths = routeIds.map((id) => localisedTemplate(locale, id));
      expect(new Set(paths).size).toBe(paths.length);
    }
  });

  it('leaves the default locale untranslated, so no rewrite is generated for it', () => {
    for (const id of routeIds) {
      expect(hasTranslatedPath(id, defaultLocale), id).toBe(false);
      expect(localisedTemplate(defaultLocale, id)).toBe(internalTemplate(defaultLocale, id));
    }
  });
});

describe('isLocale', () => {
  it('accepts the configured locales and rejects anything else', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('ro')).toBe(true);
    expect(isLocale('de')).toBe(false);
    expect(isLocale('')).toBe(false);
    expect(isLocale('EN')).toBe(false);
  });
});

describe('matchRoutePath', () => {
  it('identifies a locale home page', () => {
    expect(matchRoutePath('/en')).toEqual({ locale: 'en', id: 'home' });
    expect(matchRoutePath('/ro')).toEqual({ locale: 'ro', id: 'home' });
  });

  it('identifies a translated static route', () => {
    expect(matchRoutePath('/ro/despre-noi')).toEqual({ locale: 'ro', id: 'about' });
  });

  it('also identifies the internal spelling, which the rewrite target uses', () => {
    expect(matchRoutePath('/ro/about')).toEqual({ locale: 'ro', id: 'about' });
  });

  it('captures the slug on a dynamic route', () => {
    expect(matchRoutePath('/en/work/press-line-migration')).toEqual({
      locale: 'en',
      id: 'caseStudy',
      slug: 'press-line-migration',
    });
  });

  it('prefers a static route over a dynamic one for an exact match', () => {
    expect(matchRoutePath('/en/services')).toEqual({ locale: 'en', id: 'services' });
  });

  it('returns null for an unknown locale, an unknown path and the bare origin', () => {
    expect(matchRoutePath('/de/services')).toBeNull();
    expect(matchRoutePath('/en/nothing-here')).toBeNull();
    expect(matchRoutePath('/')).toBeNull();
    expect(matchRoutePath('')).toBeNull();
  });

  it('does not treat a missing slug as a dynamic route match', () => {
    expect(matchRoutePath('/en/work/')).toEqual({ locale: 'en', id: 'work' });
  });
});

describe('alternateRoutePath', () => {
  it('maps a static route to its equivalent in the target locale', () => {
    expect(alternateRoutePath('/en/services', 'ro')).toBe('/ro/servicii');
    expect(alternateRoutePath('/ro/despre-noi', 'en')).toBe('/en/about');
  });

  it('returns the path unchanged when it is already in the target locale', () => {
    expect(alternateRoutePath('/ro/servicii', 'ro')).toBe('/ro/servicii');
  });

  it('translates a dynamic route when the content layer supplies a slug', () => {
    const translate = (): string => 'inginerie-structurala';

    expect(alternateRoutePath('/en/services/structural-engineering', 'ro', translate)).toBe(
      '/ro/servicii/inginerie-structurala',
    );
  });

  it('passes the route, slug and both locales to the translator', () => {
    const calls: [RouteId, string, Locale, Locale][] = [];
    const translate: SlugTranslator = (id, slug, from, to) => {
      calls.push([id, slug, from, to]);
      return 'weld-fatigue-ro';
    };

    alternateRoutePath('/en/insights/weld-fatigue', 'ro', translate);

    expect(calls).toEqual([['insight', 'weld-fatigue', 'en', 'ro']]);
  });

  it('falls back to the locale home when a slug has no translation', () => {
    const translate = (): undefined => undefined;

    expect(alternateRoutePath('/en/work/press-line-migration', 'ro', translate)).toBe('/ro');
  });

  it('falls back to the locale home for a path outside the registry', () => {
    expect(alternateRoutePath('/en/not-a-page', 'ro')).toBe('/ro');
    expect(alternateRoutePath('/', 'ro')).toBe('/ro');
  });

  it('falls back when a dynamic route is reached with no translator at all', () => {
    expect(alternateRoutePath('/en/work/press-line-migration', 'ro')).toBe('/ro');
  });
});

describe('locale configuration', () => {
  it('includes the default locale in the locale list', () => {
    const configured: readonly Locale[] = locales;
    expect(configured).toContain(defaultLocale);
  });
});
