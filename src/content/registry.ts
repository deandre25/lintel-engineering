import { about as aboutEn } from './en/about';
import { careers as careersEn } from './en/careers';
import { disciplines as disciplinesEn } from './en/disciplines';
import { home as homeEn } from './en/home';
import { insights as insightsEn } from './en/insights';
import {
  cookies as cookiesEn,
  legalNotice as legalNoticeEn,
  privacy as privacyEn,
  terms as termsEn,
} from './en/legal';
import { services as servicesEn } from './en/services';
import { caseStudies as caseStudiesEn } from './en/work';
import { about as aboutRo } from './ro/about';
import { careers as careersRo } from './ro/careers';
import { disciplines as disciplinesRo } from './ro/disciplines';
import { home as homeRo } from './ro/home';
import { insights as insightsRo } from './ro/insights';
import {
  cookies as cookiesRo,
  legalNotice as legalNoticeRo,
  privacy as privacyRo,
  terms as termsRo,
} from './ro/legal';
import { services as servicesRo } from './ro/services';
import { caseStudies as caseStudiesRo } from './ro/work';

import type { CaseStudy, Insight, Service } from './schema';
import type { Locale, RouteId } from '@/lib/routing';

/**
 * The content registry: one place that resolves a locale to its content.
 *
 * Modules are imported explicitly rather than through a star re-export. §7
 * rules out barrel files that re-export everything, because they defeat
 * tree-shaking; naming each import also makes it obvious when a locale is
 * missing a module, since the object below will not type-check without it.
 */

const CONTENT = {
  en: {
    home: homeEn,
    disciplines: disciplinesEn,
    services: servicesEn,
    caseStudies: caseStudiesEn,
    insights: insightsEn,
    about: aboutEn,
    careers: careersEn,
    legal: {
      privacy: privacyEn,
      cookies: cookiesEn,
      terms: termsEn,
      legalNotice: legalNoticeEn,
    },
  },
  ro: {
    home: homeRo,
    disciplines: disciplinesRo,
    services: servicesRo,
    caseStudies: caseStudiesRo,
    insights: insightsRo,
    about: aboutRo,
    careers: careersRo,
    legal: {
      privacy: privacyRo,
      cookies: cookiesRo,
      terms: termsRo,
      legalNotice: legalNoticeRo,
    },
  },
} as const satisfies Record<Locale, unknown>;

export type Content = (typeof CONTENT)[Locale];

export function getContent(locale: Locale): Content {
  return CONTENT[locale];
}

export function getService(locale: Locale, slug: string): Service | undefined {
  return CONTENT[locale].services.find((service) => service.slug === slug);
}

export function getCaseStudy(locale: Locale, slug: string): CaseStudy | undefined {
  return CONTENT[locale].caseStudies.find((caseStudy) => caseStudy.slug === slug);
}

export function getInsight(locale: Locale, slug: string): Insight | undefined {
  return CONTENT[locale].insights.find((insight) => insight.slug === slug);
}

/** Every slug for a dynamic route, for `generateStaticParams`. */
export function slugsFor(locale: Locale, route: RouteId): string[] {
  switch (route) {
    case 'service':
      return CONTENT[locale].services.map((service) => service.slug);
    case 'caseStudy':
      return CONTENT[locale].caseStudies.map((caseStudy) => caseStudy.slug);
    case 'insight':
      return CONTENT[locale].insights.map((insight) => insight.slug);
    default:
      return [];
  }
}

/** Entities addressable by a localised slug, keyed by locale-independent id. */
interface Addressable {
  readonly id: string;
  readonly slug: string;
}

function entitiesFor(locale: Locale, route: RouteId): readonly Addressable[] {
  switch (route) {
    case 'service':
      return CONTENT[locale].services;
    case 'caseStudy':
      return CONTENT[locale].caseStudies;
    case 'insight':
      return CONTENT[locale].insights;
    default:
      return [];
  }
}

/**
 * Translates a localised slug into the equivalent slug in another locale.
 *
 * This is the function `alternateRoutePath` takes, and it is what makes the
 * language switcher land on the same article rather than on the locale home.
 * It returns `undefined` when an entity has no counterpart, which the switcher
 * treats as "no equivalent page" and falls back from.
 */
export function translateSlug(
  route: RouteId,
  slug: string,
  from: Locale,
  to: Locale,
): string | undefined {
  const source = entitiesFor(from, route).find((entity) => entity.slug === slug);
  if (source === undefined) return undefined;

  return entitiesFor(to, route).find((entity) => entity.id === source.id)?.slug;
}
