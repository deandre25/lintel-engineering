import { z } from 'zod';

import { insightSchema } from '../schema';

import type { Insight } from '../schema';

/**
 * Metadata for the three articles, newest first.
 *
 * The bodies are MDX files alongside this module. Metadata is kept separate and
 * typed so that the index, the Article JSON-LD and the sitemap read validated
 * fields rather than parsing frontmatter at build time.
 *
 * `author` must match a name on the about page; a test asserts that.
 */
export const insights: readonly Insight[] = z
  .array(insightSchema)
  .length(3)
  .parse([
    {
      id: 'fatigue-in-older-welded-connections',
      slug: 'fatigue-in-older-welded-connections',
      title: 'Assessing fatigue in welded connections of older industrial structures',
      description:
        'Why a fatigue check on a pre-1990 industrial structure usually turns on the duty spectrum rather than the detail category, and what to measure first.',
      publishedAt: '2026-09-22',
      author: 'Adriana Pîrvu',
      readingMinutes: 5,
      standfirst:
        'Most industrial structures in this region were designed before the current fatigue provisions existed. The question is rarely whether a detail is poor, but whether its remaining life is shorter than the plant around it.',
      topics: ['Structural assessment', 'Fatigue', 'Eurocode 3'],
    },
    {
      id: 'what-changed-for-existing-buildings',
      slug: 'what-changed-for-existing-buildings',
      title: 'What the recast EPBD changed for existing buildings',
      description:
        'The recast directive moved the obligation from new buildings to the existing stock. What that means in practice for an industrial owner in Romania.',
      publishedAt: '2026-07-14',
      author: 'Sorin Bălan',
      readingMinutes: 5,
      standfirst:
        'The directive that governs building energy performance was recast, and the centre of gravity moved from new construction to the buildings that already exist. For an industrial owner, that changes the order in which things have to be done.',
      topics: ['Energy', 'Regulation', 'Existing buildings'],
    },
    {
      id: 'sequencing-a-control-system-migration',
      slug: 'sequencing-a-control-system-migration',
      title: 'Sequencing a control system migration around a production calendar',
      description:
        'Why the engineering in a control migration is rarely the hard part, and how the production calendar should decide the cutover sequence instead.',
      publishedAt: '2026-05-06',
      author: 'Tobias Rennert',
      readingMinutes: 6,
      standfirst:
        'A migration plan built around engineering convenience produces one long shutdown. A plan built around the production calendar produces several short ones, and finds the undocumented behaviour before the line is down.',
      topics: ['Control systems', 'Commissioning', 'Production planning'],
    },
  ]);
