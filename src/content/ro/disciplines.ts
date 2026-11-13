import { z } from 'zod';

import { company } from '../company';
import { disciplineSchema } from '../schema';

import type { Discipline } from '../schema';

/** Romanian adaptation of the three disciplines. Headcounts come from company.ts. */

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
      name: 'Structuri',
      description:
        'Verificarea proiectelor, certificarea construcțiilor existente și întrebările de normativ care decid dacă o structură poate fi folosită așa cum își propune cineva.',
      headcount: headcountOf('structures'),
    },
    {
      id: 'industrial-systems',
      name: 'Sisteme industriale',
      description:
        'Liniile de producție și energia pe care o consumă: migrare, punere în funcțiune, măsurare și conformitatea care decurge din amândouă.',
      headcount: headcountOf('industrial-systems'),
    },
    {
      id: 'information-and-risk',
      name: 'Informație și risc',
      description:
        'Stabilirea a ceea ce se știe efectiv despre un activ, a ceea ce este doar presupus și pe care dintre cele două se sprijină o decizie.',
      headcount: headcountOf('information-and-risk'),
    },
  ]);
