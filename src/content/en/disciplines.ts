import { z } from 'zod';

import { company } from '../company';
import { disciplineSchema } from '../schema';

import type { Discipline } from '../schema';

/**
 * The three disciplines the six services are grouped under.
 *
 * Headcounts come from `company.ts` rather than being restated here, so the
 * breakdown shown on the home page cannot contradict the total beside it.
 */

function headcountOf(id: Discipline['id']): number {
  const match = company.disciplines.find((discipline) => discipline.id === id);
  if (match === undefined) throw new Error(`No headcount recorded for discipline: ${id}`);
  return match.headcount;
}

export const disciplines: readonly Discipline[] = z
  .array(disciplineSchema)
  .length(3)
  .parse([
    {
      id: 'structures',
      name: 'Structures',
      description:
        'Design review, certification, and the code questions that decide whether a structure can be used the way someone intends to use it.',
      headcount: headcountOf('structures'),
    },
    {
      id: 'industrial-systems',
      name: 'Industrial systems',
      description:
        'Production lines and the energy they consume: migration, commissioning, measurement, and the compliance work that follows from both.',
      headcount: headcountOf('industrial-systems'),
    },
    {
      id: 'information-and-risk',
      name: 'Information and risk',
      description:
        'Establishing what is actually known about an asset, what is merely assumed, and which of the two a decision is resting on.',
      headcount: headcountOf('information-and-risk'),
    },
  ]);
