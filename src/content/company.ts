import { z } from 'zod';

import { locales } from '@/lib/routing';

import type { Locale } from '@/lib/routing';

/**
 * The company, defined once. Everything that names, addresses or describes
 * Lintel Engineering derives from this module: page metadata, JSON-LD, the
 * footer, the legal notice and the contact page.
 *
 * The schema is parsed at module scope, so a malformed field fails `next build`
 * instead of rendering an empty element on a live page (§7).
 */

function localisedString(schema: z.ZodString = z.string().min(1)) {
  return z.object(
    Object.fromEntries(locales.map((locale) => [locale, schema])) as Record<Locale, z.ZodString>,
  );
}

/**
 * §9 requires meta descriptions between 140 and 160 characters. Encoding that
 * as a schema means a description written too short fails the build, rather
 * than quietly costing a Lighthouse SEO point nobody re-checks.
 */
const metaDescription = z.string().min(140).max(160);

const companySchema = z.object({
  /** Trading name, as it appears in the wordmark and page titles. */
  name: z.string().min(1),
  /** Registered name, for the legal notice and `Organization` JSON-LD. */
  legalName: z.string().min(1),
  founded: z.number().int().min(1900).max(2100),
  headcount: z.number().int().positive(),

  /** One sentence of positioning. Used in the home page title and OG tags. */
  positioning: localisedString(),

  /**
   * The company in one sentence, for the home page's meta description and the
   * `description` of the `Organization` JSON-LD. Per-page descriptions are
   * written per page in Phase 5; this one belongs to the company.
   */
  shortDescription: localisedString(metaDescription),

  address: z.object({
    street: z.string().min(1),
    postalCode: z.string().min(1),
    city: z.string().min(1),
    region: z.string().min(1),
    country: z.string().min(1),
    countryCode: z.string().length(2),
    /** Decimal degrees, for the `PostalAddress` geo in JSON-LD. */
    latitude: z.number(),
    longitude: z.number(),
  }),

  contact: z.object({
    email: z.email(),
    /** E.164, so it is valid in both `tel:` hrefs and structured data. */
    phone: z.string().regex(/^\+[1-9]\d{6,14}$/),
    phoneDisplay: z.string().min(1),
  }),

  registration: z.object({
    /** Romanian trade register number. */
    tradeRegister: z.string().min(1),
    /** VAT identification number. */
    vatId: z.string().min(1),
  }),

  /** ISO 3166-1 alpha-2 codes for the markets served, used by `areaServed`. */
  areaServed: z.array(z.string().length(2)).nonempty(),

  disciplines: z.number().int().positive(),
});

export type Company = z.infer<typeof companySchema>;

/*
 * Lintel Engineering is fictional. The registration numbers, address and phone
 * number below are invented and intentionally unallocated; see README.md.
 */
export const company: Company = companySchema.parse({
  name: 'Lintel Engineering',
  legalName: 'Lintel Engineering SRL',
  founded: 2009,
  headcount: 48,
  disciplines: 3,

  positioning: {
    en: 'Engineering judgement for projects that are technically contested',
    ro: 'Expertiză inginerească pentru proiecte disputate tehnic',
  },

  shortDescription: {
    en: 'Independent engineering consultancy in Brașov, advising manufacturers, developers and public bodies on structural certification and engineering risk.',
    ro: 'Consultanță inginerească independentă din Brașov: certificare structurală, retehnologizări industriale și evaluarea riscului tehnic, din anul 2009.',
  },

  address: {
    street: 'Strada Turnului 42',
    postalCode: '500152',
    city: 'Brașov',
    region: 'Brașov',
    country: 'Romania',
    countryCode: 'RO',
    latitude: 45.6525,
    longitude: 25.6104,
  },

  contact: {
    email: 'office@lintel-engineering.com',
    phone: '+40268000120',
    phoneDisplay: '+40 268 000 120',
  },

  registration: {
    tradeRegister: 'J08/742/2009',
    vatId: 'RO24518903',
  },

  areaServed: ['RO', 'HU', 'DE'],
});

/** The founding year through to the current year, for the footer copyright. */
export function yearsActive(now: Date = new Date()): number {
  return now.getFullYear() - company.founded;
}
