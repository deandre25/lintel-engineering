import { describe, expect, it } from 'vitest';

import { company } from '@/content/company';
import { getContent, translateSlug } from '@/content/registry';
import { locales } from '@/lib/routing';

import type { RouteId } from '@/lib/routing';

/**
 * Cross-module and cross-locale invariants.
 *
 * Zod validates each content module in isolation at build time, which catches a
 * malformed field but cannot see that a Romanian case study references a
 * service that does not exist, or that the two locales have drifted apart.
 * Those are the failures this file is for.
 */

const ENTITY_ROUTES = [
  { route: 'service' as const satisfies RouteId, key: 'services' as const },
  { route: 'caseStudy' as const satisfies RouteId, key: 'caseStudies' as const },
  { route: 'insight' as const satisfies RouteId, key: 'insights' as const },
];

describe('the two locales describe the same site', () => {
  it('defines the same entity ids in both locales', () => {
    for (const { key } of ENTITY_ROUTES) {
      const [first, ...rest] = locales.map((locale) =>
        getContent(locale)[key].map((entity) => entity.id),
      );

      for (const ids of rest) {
        expect(ids, key).toEqual(first);
      }
    }
  });

  it('gives every entity a slug that is unique within its locale', () => {
    for (const locale of locales) {
      for (const { key } of ENTITY_ROUTES) {
        const slugs = getContent(locale)[key].map((entity) => entity.slug);
        expect(new Set(slugs).size, `${locale}/${key}`).toBe(slugs.length);
      }
    }
  });

  it('translates every slug to its counterpart and back again', () => {
    for (const { route, key } of ENTITY_ROUTES) {
      for (const from of locales) {
        for (const to of locales) {
          for (const entity of getContent(from)[key]) {
            const translated = translateSlug(route, entity.slug, from, to);
            expect(translated, `${entity.slug} ${from}->${to}`).toBeDefined();

            /* Round-tripping must land on the slug we started from. */
            expect(
              translateSlug(route, translated ?? '', to, from),
              `${entity.slug} ${from}->${to}->${from}`,
            ).toBe(entity.slug);
          }
        }
      }
    }
  });
});

describe('cross-references resolve', () => {
  it('points every service and case study at entities that exist', () => {
    for (const locale of locales) {
      const content = getContent(locale);
      const serviceIds = new Set(content.services.map((service) => service.id));
      const caseStudyIds = new Set(content.caseStudies.map((caseStudy) => caseStudy.id));

      const danglingCaseStudies = content.services
        .map((service) => service.relatedCaseStudy)
        .filter((id): id is string => id !== undefined)
        .filter((id) => !caseStudyIds.has(id));
      expect(danglingCaseStudies, `${locale}: service.relatedCaseStudy`).toEqual([]);

      const danglingServices = content.caseStudies
        .flatMap((caseStudy) => caseStudy.services)
        .filter((id) => !serviceIds.has(id));
      expect(danglingServices, `${locale}: caseStudy.services`).toEqual([]);
    }
  });

  it('attributes every article to somebody on the team page', () => {
    for (const locale of locales) {
      const content = getContent(locale);
      const names = new Set(content.about.team.members.map((member) => member.name));

      const unattributed = content.insights
        .map((insight) => insight.author)
        .filter((author) => !names.has(author));

      expect(unattributed, locale).toEqual([]);
    }
  });
});

describe('the disciplines the site claims', () => {
  it('declares every discipline a service or a person is assigned to', () => {
    for (const locale of locales) {
      const content = getContent(locale);
      const declared = new Set(content.disciplines.map((discipline) => discipline.id));

      const assigned = [
        ...content.services.map((service) => service.discipline),
        ...content.about.team.members.map((member) => member.discipline),
        ...content.careers.vacancies.map((vacancy) => vacancy.discipline),
      ];

      expect(
        assigned.filter((id) => !declared.has(id)),
        locale,
      ).toEqual([]);
    }
  });

  it('adds the discipline headcounts up to the number the site prints', () => {
    for (const locale of locales) {
      const total = getContent(locale).disciplines.reduce(
        (sum, discipline) => sum + discipline.headcount,
        0,
      );
      expect(total, locale).toBe(company.headcount);
    }
  });
});
