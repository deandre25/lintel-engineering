import enFatigue from './en/insights/fatigue-in-older-welded-connections.mdx';
import enSequencing from './en/insights/sequencing-a-control-system-migration.mdx';
import enEpbd from './en/insights/what-changed-for-existing-buildings.mdx';
import roEpbd from './ro/insights/ce-s-a-schimbat-pentru-cladirile-existente.mdx';
import roFatigue from './ro/insights/oboseala-imbinarilor-sudate.mdx';
import roSequencing from './ro/insights/secventierea-unei-migrari-de-automatizare.mdx';

import type { Locale } from '@/lib/routing';
import type { MDXContent } from 'mdx/types';

/**
 * Article bodies, keyed by locale and by the article's locale-independent id.
 *
 * Imported statically rather than through `await import(...)` with a template
 * literal. A templated dynamic import resolves to `any`, which §2 forbids, and
 * it forces the bundler to glob the directory; a missing or renamed file is a
 * compile error here instead of a runtime failure on one page.
 */
const ARTICLES = {
  en: {
    'fatigue-in-older-welded-connections': enFatigue,
    'what-changed-for-existing-buildings': enEpbd,
    'sequencing-a-control-system-migration': enSequencing,
  },
  ro: {
    'fatigue-in-older-welded-connections': roFatigue,
    'what-changed-for-existing-buildings': roEpbd,
    'sequencing-a-control-system-migration': roSequencing,
  },
} as const satisfies Record<Locale, Record<string, MDXContent>>;

export type ArticleId = keyof (typeof ARTICLES)['en'];

export function getArticleBody(locale: Locale, id: string): MDXContent | undefined {
  const byId: Record<string, MDXContent> = ARTICLES[locale];
  return byId[id];
}
