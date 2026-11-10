import { homeSchema } from '../schema';

import type { Home } from '../schema';

/**
 * Romanian home page.
 *
 * Adapted rather than translated. Where an English turn of phrase would not
 * carry, it is replaced by a plain statement: §5 asks for a genuine adaptation,
 * and a calqued idiom reads worse than no idiom at all.
 */
export const home: Home = homeSchema.parse({
  title: 'Răspunsuri tehnice pentru proiecte blocate',
  description:
    'Consultanță inginerească independentă în Brașov: certificare structurală, retehnologizări industriale și evaluarea riscului tehnic pentru industrie.',

  hero: {
    eyebrow: 'Brașov, România',
    heading: 'Răspunsuri tehnice pentru proiecte blocate',
    lead: 'Patruzeci și opt de oameni, într-un singur birou din Brașov. Producători, dezvoltatori și autorități de infrastructură ne aduc lucrările care s-au blocat: o structură care trebuie certificată, o linie de producție care trebuie mutată pe altă platformă de automatizare fără oprire, o achiziție al cărei risc tehnic trebuie cuantificat înainte de semnare.',
  },

  positioning: {
    heading: 'Consiliem, nu construim',
    body: [
      'Lintel a fost înființată în 2009 de trei ingineri care lucraseră zece ani de partea constructorului și care întâlneau mereu aceeași problemă, văzută din capătul nepotrivit: o întrebare tehnică devenită comercială, cu termen fix și fără nimeni dispus să pună o cifră pe risc.',
      'Suntem independenți față de constructori, furnizori și producătorii de echipamente. Nu avem contracte de distribuție și nu luăm comision pe echipamente. Când recomandăm o soluție, singurul nostru interes este ca ea să fie corectă.',
      'Lucrările ajung la noi pe trei căi. Un client nu reușește să obțină avizul pentru un proiect. O fabrică trebuie modificată fără să se oprească. Un cumpărător are nevoie să știe starea tehnică a unui activ înainte de o dată care nu se mai mută.',
    ],
  },

  disciplines: {
    heading: 'Șase servicii, grupate în trei discipline',
    standfirst:
      'Fiecare disciplină este o echipă permanentă, cu propriul coordonator, iar numărul de oameni de mai jos însumează cei 48 din birou.',
  },

  work: {
    heading: 'Proiecte selectate',
    standfirst:
      'Patru lucrări, fiecare descrisă prin constrângerea care a determinat-o și prin cifra după care ne-a măsurat clientul.',
    cta: 'Citiți toate cele patru',
  },

  figures: {
    heading: 'Firma în cifre',
    items: [
      { term: 'Înființată', description: '2009, de trei ingineri' },
      { term: 'Oameni', description: '48, într-un singur birou' },
      {
        term: 'Discipline',
        description: 'Trei: structuri, sisteme industriale, informație și risc',
      },
      { term: 'Unde lucrăm', description: 'România, Ungaria și sudul Germaniei' },
    ],
  },

  engagement: {
    heading: 'Cum începe o colaborare',
    body: [
      'Spuneți-ne ce s-a blocat și până când trebuie rezolvat. În două zile lucrătoare vă spunem dacă suntem firma potrivită, iar dacă nu suntem, de obicei știm cine este.',
      'Prima discuție este cu inginerul care ar conduce lucrarea, nu cu un om de vânzări.',
      'Ofertăm un preț fix pe un obiect al lucrării scris. Acolo unde obiectul nu poate fi fixat pentru că starea activului este necunoscută, spunem acest lucru și ofertăm separat investigația.',
    ],
    cta: 'Spuneți-ne ce s-a blocat',
  },

  insights: {
    heading: 'Publicăm',
    standfirst:
      'Note despre probleme pe care le întâlnim destul de des încât să ne fi format o opinie.',
    cta: 'Citiți analizele',
  },
});
