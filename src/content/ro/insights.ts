import { z } from 'zod';

import { insightSchema } from '../schema';

import type { Insight } from '../schema';

/** Romanian article metadata. Slugs are localised; dates and authors match the English. */
export const insights: readonly Insight[] = z
  .array(insightSchema)
  .length(3)
  .parse([
    {
      id: 'fatigue-in-older-welded-connections',
      slug: 'oboseala-imbinarilor-sudate',
      title: 'Evaluarea oboselii la îmbinările sudate ale structurilor industriale vechi',
      description:
        'De ce o verificare la oboseală pe o structură dinainte de 1990 se decide prin spectrul de funcționare, nu prin categoria de detaliu, și ce se măsoară întâi.',
      publishedAt: '2026-09-22',
      author: 'Adriana Pîrvu',
      readingMinutes: 5,
      standfirst:
        'Majoritatea structurilor industriale din regiune au fost proiectate înainte să existe prevederile actuale de oboseală. Întrebarea nu este dacă un detaliu este slab, ci dacă durata lui de viață rămasă este mai scurtă decât a instalației din jur.',
      topics: ['Evaluare structurală', 'Oboseală', 'Eurocod 3'],
    },
    {
      id: 'what-changed-for-existing-buildings',
      slug: 'ce-s-a-schimbat-pentru-cladirile-existente',
      title: 'Ce a schimbat directiva reformată pentru clădirile existente',
      description:
        'Directiva reformată a mutat obligația de la clădirile noi către fondul existent. Ce înseamnă asta, practic, pentru un proprietar industrial din România.',
      publishedAt: '2026-07-14',
      author: 'Sorin Bălan',
      readingMinutes: 5,
      standfirst:
        'Directiva care guvernează performanța energetică a clădirilor a fost reformată, iar centrul de greutate s-a mutat de la construcția nouă la clădirile care există deja. Pentru un proprietar industrial, asta schimbă ordinea în care trebuie făcute lucrurile.',
      topics: ['Energie', 'Reglementare', 'Clădiri existente'],
    },
    {
      id: 'sequencing-a-control-system-migration',
      slug: 'secventierea-unei-migrari-de-automatizare',
      title: 'Secvențierea unei migrări de automatizare în jurul calendarului de producție',
      description:
        'De ce ingineria este rareori partea grea la o migrare de automatizare și de ce calendarul de producție ar trebui să decidă secvența de comutare.',
      publishedAt: '2026-05-06',
      author: 'Tobias Rennert',
      readingMinutes: 6,
      standfirst:
        'Un plan de migrare construit în jurul comodității inginerești produce o singură oprire lungă. Un plan construit în jurul calendarului de producție produce mai multe scurte și găsește comportamentul nedocumentat înainte ca linia să fie oprită.',
      topics: ['Automatizări', 'Punere în funcțiune', 'Planificarea producției'],
    },
  ]);
