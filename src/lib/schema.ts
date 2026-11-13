import { company } from '@/content/company';

import { localeTags, routePath } from './routing';
import { absoluteUrl, siteOrigin } from './seo';

import type { Locale, StaticRouteId } from './routing';
import type { CaseStudy, Insight, Service } from '@/content/schema';

/**
 * JSON-LD builders.
 *
 * Each returns a plain object that a page serialises into a
 * `<script type="application/ld+json">`. They are built on the server and
 * appear in the sent HTML, because structured data a crawler cannot see
 * without running JavaScript is structured data that does not exist.
 *
 * Types are kept to what the page can actually support. A field nobody can
 * verify is worse than an absent one: invented `aggregateRating` or `review`
 * is the usual way structured data turns into a manual action.
 */

/** The `@id` of the organisation, referenced by every other node. */
function organisationId(): string {
  return `${siteOrigin()}/#organization`;
}

export interface JsonLdNode {
  readonly '@context'?: string;
  readonly '@type': string;
  readonly [key: string]: unknown;
}

/** Several nodes published together, cross-referenced by `@id`. */
export interface JsonLdGraph {
  readonly '@context': string;
  readonly '@graph': readonly JsonLdNode[];
}

export type JsonLd = JsonLdNode | JsonLdGraph;

function postalAddress(): JsonLdNode {
  return {
    '@type': 'PostalAddress',
    streetAddress: company.address.street,
    postalCode: company.address.postalCode,
    addressLocality: company.address.city,
    addressRegion: company.address.region,
    /* The ISO code, not the name: `addressCountry` is language-independent. */
    addressCountry: company.address.countryCode,
  };
}

/**
 * `Organization` and `ProfessionalService` for the home page (§9).
 *
 * `ProfessionalService` is a subtype of `LocalBusiness`, so it carries the
 * address and the area served; the two nodes are emitted as a graph with the
 * service referencing the organisation rather than repeating it.
 */
export function organizationSchema(locale: Locale): JsonLdGraph {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organisationId(),
        name: company.name,
        legalName: company.legalName,
        url: absoluteUrl(routePath(locale, 'home')),
        foundingDate: String(company.founded),
        description: company.shortDescription[locale],
        email: company.contact.email,
        telephone: company.contact.phone,
        address: postalAddress(),
        numberOfEmployees: {
          '@type': 'QuantitativeValue',
          value: company.headcount,
        },
        /*
         * `sameAs` is absent rather than empty: the firm is fictional and has
         * no profiles anywhere, and linking to pages that do not exist is the
         * kind of claim this project does not make.
         */
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${siteOrigin()}/#professionalservice`,
        name: company.name,
        parentOrganization: { '@id': organisationId() },
        url: absoluteUrl(routePath(locale, 'home')),
        address: postalAddress(),
        areaServed: company.areaServed.map((code) => ({ '@type': 'Country', name: code })),
        geo: {
          '@type': 'GeoCoordinates',
          latitude: company.address.latitude,
          longitude: company.address.longitude,
        },
        knowsLanguage: Object.values(localeTags),
      },
    ],
  };
}

export interface BreadcrumbEntry {
  readonly name: string;
  /** Absolute URL. Omitted on the final item, which is the current page. */
  readonly url?: string;
}

/** `BreadcrumbList` for a nested page (§9), from the same data the trail uses. */
export function breadcrumbSchema(entries: readonly BreadcrumbEntry[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      ...(entry.url === undefined ? {} : { item: entry.url }),
    })),
  };
}

/** `Service` for a service page (§9). */
export function serviceSchema(service: Service, url: string): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url,
    serviceType: service.name,
    provider: { '@id': organisationId() },
    areaServed: company.areaServed.map((code) => ({ '@type': 'Country', name: code })),
    /*
     * No `availableLanguage`: schema.org puts it on ContactPoint and
     * ServiceChannel, not on Service. The page's `lang` and its `hreflang`
     * alternates already say which language this is.
     */
  };
}

/** `Article` for an insight, with `datePublished` and `author` (§9). */
export function articleSchema(
  locale: Locale,
  insight: Insight,
  url: string,
  imageUrl: string,
): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: insight.title,
    description: insight.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: insight.publishedAt,
    dateModified: insight.publishedAt,
    inLanguage: localeTags[locale],
    image: imageUrl,
    author: { '@type': 'Person', name: insight.author },
    publisher: { '@id': organisationId() },
    about: insight.topics,
  };
}

export interface FaqEntry {
  readonly question: string;
  readonly answer: string;
}

/** `FAQPage`, emitted only where an FAQ section is actually rendered (§9). */
export function faqSchema(entries: readonly FaqEntry[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

/** `CreativeWork` for a case study: it is a report, not a product or a review. */
export function caseStudySchema(locale: Locale, caseStudy: CaseStudy, url: string): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: caseStudy.title,
    description: caseStudy.description,
    url,
    inLanguage: localeTags[locale],
    datePublished: String(caseStudy.year),
    creator: { '@id': organisationId() },
    about: caseStudy.sector,
  };
}

/** Convenience for a page that only needs the home breadcrumb plus one step. */
export function breadcrumbFor(
  locale: Locale,
  trail: readonly { name: string; route?: StaticRouteId }[],
  currentName: string,
): JsonLdNode {
  return breadcrumbSchema([
    ...trail.map((step) => ({
      name: step.name,
      ...(step.route === undefined ? {} : { url: absoluteUrl(routePath(locale, step.route)) }),
    })),
    { name: currentName },
  ]);
}
