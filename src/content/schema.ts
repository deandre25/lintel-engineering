import { z } from 'zod';

/**
 * Schemas for every content module.
 *
 * Content is parsed at module scope, so a malformed or missing field fails
 * `next build` rather than rendering an empty element on a live page (§7). The
 * constraints here encode editorial rules that would otherwise rely on someone
 * remembering them — meta description length, heading punctuation, and the
 * vocabulary §5 bans.
 */

/** §9: meta descriptions are written per page, 140-160 characters. */
export const metaDescription = z.string().min(140).max(160);

/*
 * §5 bans this vocabulary outright. Checking it here means a phrase cannot
 * reach a page through a late edit without failing the build. The boundaries
 * matter: "robust solutions" is banned but "robust" describing a weld is not.
 */
const BANNED_PHRASES = [
  'cutting-edge',
  'innovative',
  'world-class',
  'seamless',
  'robust solutions',
  'passionate',
  'we leverage',
  'empower',
  'transform your business',
  'end-to-end excellence',
  'lorem ipsum',
  'best-in-class',
  'state of the art',
  'game-changing',
  'synergy',
] as const;

export function findBannedPhrases(value: string): string[] {
  const haystack = value.toLowerCase();
  return BANNED_PHRASES.filter((phrase) => haystack.includes(phrase));
}

/** Any string that reaches a visitor, checked against the banned vocabulary. */
export const prose = z
  .string()
  .min(1)
  .superRefine((value, ctx) => {
    const banned = findBannedPhrases(value);
    if (banned.length === 0) return;

    ctx.addIssue({
      code: 'custom',
      message: `Banned phrase in copy: ${banned.join(', ')} — see §5 of PROJECT_BRIEF.md`,
    });
  });

/**
 * §5: headings are sentence case and carry no sentence-ending punctuation.
 *
 * A question mark is allowed, because an FAQ question is a heading and ends in
 * one. A full stop, exclamation mark or colon at the end is not.
 */
export const heading = prose.refine((value) => !/[.!:;]$/.test(value.trim()), {
  error: 'A heading must not end with sentence punctuation — see §5',
});

export const paragraphs = z.array(prose).nonempty();

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slugs are lowercase words separated by single hyphens');

/** A discipline groups services, so the site can show the grouping it claims. */
export const disciplineSchema = z.object({
  id: z.enum(['structures', 'industrial-systems', 'information-and-risk']),
  name: heading,
  description: prose,
  /** Headcount in this discipline. The three must sum to the company total. */
  headcount: z.number().int().positive(),
});

export type Discipline = z.infer<typeof disciplineSchema>;

export const serviceSummarySchema = z.object({
  /**
   * Locale-independent identity, shared by an entity's translations.
   *
   * Slugs are localised (§8), so they cannot link a page to its counterpart in
   * the other locale. The English slug is used as the canonical id: it is
   * already unique and stable, and it keeps the registry readable.
   */
  id: slug,
  slug,
  name: heading,
  /** One line, used on the home page and the services index. */
  summary: prose,
  discipline: disciplineSchema.shape.id,
});

export const definitionSchema = z.object({
  term: heading,
  description: prose,
});

export const faqSchema = z.object({
  question: heading,
  answer: prose,
});

export const serviceSchema = serviceSummarySchema.extend({
  /** The `<h1>`. Distinct from every other page's (§5). */
  title: heading,
  description: metaDescription,
  intro: prose,
  whenToCall: z.object({ heading, items: z.array(prose).nonempty() }),
  coverage: z.object({ heading, items: z.array(definitionSchema).min(3) }),
  howWeWork: z.object({ heading, body: paragraphs }),
  standards: z.object({ heading, body: paragraphs }),
  engagements: z.object({ heading, body: paragraphs }),
  faq: z.array(faqSchema).min(2),
  /** Id of the case study shown alongside, if one fits. Locale-independent. */
  relatedCaseStudy: slug.optional(),
});

export type Service = z.infer<typeof serviceSchema>;

export const caseStudySchema = z.object({
  /** Locale-independent identity. See `serviceSummarySchema.id`. */
  id: slug,
  slug,
  title: heading,
  description: metaDescription,
  /** The facts panel. Clients are described by type and never named (§3). */
  sector: prose,
  location: prose,
  year: z.number().int().min(2009).max(2026),
  duration: prose,
  client: prose,
  /** One number that carries the outcome, for the index and the home page. */
  headline: z.object({ value: prose, label: prose }),
  summary: prose,
  constraint: z.object({ heading, body: paragraphs }),
  approach: z.object({ heading, body: paragraphs }),
  outcome: z.object({ heading, body: paragraphs }),
  reflection: z.object({ heading, body: paragraphs }),
  /** Services this engagement drew on, by id rather than by localised slug. */
  services: z.array(slug).nonempty(),
});

export type CaseStudy = z.infer<typeof caseStudySchema>;

export const teamMemberSchema = z.object({
  name: z.string().min(1),
  role: prose,
  discipline: disciplineSchema.shape.id,
  /** Generic credentials only: discipline, degree field, years (§3). */
  qualification: prose,
  joined: z.number().int().min(2009).max(2026),
  biography: prose,
});

export const vacancySchema = z.object({
  slug,
  title: heading,
  discipline: disciplineSchema.shape.id,
  location: prose,
  commitment: prose,
  experience: prose,
  summary: prose,
  responsibilities: z.array(prose).min(3),
  requirements: z.array(prose).min(3),
  /** What the firm offers, stated concretely rather than as benefits copy. */
  offer: z.array(prose).min(3),
});

export const legalSectionSchema = z.object({
  heading,
  body: paragraphs,
  /** Optional bullets, for retention periods and cookie categories. */
  items: z.array(definitionSchema).optional(),
});

export const legalPageSchema = z.object({
  title: heading,
  description: metaDescription,
  /** ISO date. Rendered through `Intl`, so it is formatted per locale. */
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  intro: prose,
  sections: z.array(legalSectionSchema).min(3),
});

export type LegalPage = z.infer<typeof legalPageSchema>;

export const insightSchema = z.object({
  /** Locale-independent identity. See `serviceSummarySchema.id`. */
  id: slug,
  slug,
  title: heading,
  description: metaDescription,
  /** ISO date, used for `datePublished` in Article JSON-LD. */
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** The author's name, which must match someone on the team page. */
  author: z.string().min(1),
  /** Rounded from the word count at authoring time, not computed per render. */
  readingMinutes: z.number().int().min(1).max(20),
  standfirst: prose,
  topics: z.array(prose).nonempty(),
});

export type Insight = z.infer<typeof insightSchema>;

export const homeSchema = z.object({
  title: heading,
  description: metaDescription,
  hero: z.object({ eyebrow: prose, heading, lead: prose }),
  positioning: z.object({ heading, body: paragraphs }),
  disciplines: z.object({ heading, standfirst: prose }),
  work: z.object({ heading, standfirst: prose, cta: prose }),
  figures: z.object({ heading, items: z.array(definitionSchema).min(3) }),
  engagement: z.object({ heading, body: paragraphs, cta: prose }),
  insights: z.object({ heading, standfirst: prose, cta: prose }),
});

export type Home = z.infer<typeof homeSchema>;
