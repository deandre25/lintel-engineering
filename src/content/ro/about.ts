import { z } from 'zod';

import { heading, metaDescription, paragraphs, prose, teamMemberSchema } from '../schema';

const aboutSchema = z.object({
  title: heading,
  description: metaDescription,
  intro: prose,
  story: z.object({ heading, body: paragraphs }),
  howWeAreOrganised: z.object({ heading, body: paragraphs }),
  team: z.object({ heading, standfirst: prose, members: z.array(teamMemberSchema).length(4) }),
});

/** Romanian about page. Same four people, same credentials, adapted biographies. */
export const about = aboutSchema.parse({
  title: 'O firmă de 48 de oameni, chemată la jumătatea dificilă a întrebării',
  description:
    'Lintel Engineering, Brașov: înființată în 2009, 48 de oameni în trei discipline, independentă de constructori, furnizori și producători de echipamente.',
  intro:
    'Suntem o firmă de consultanță inginerească independentă din Brașov, înființată în 2009. Proiectăm de la zero rareori și nu construim deloc. Suntem chemați de obicei atunci când ceva trebuie stabilit, nu creat.',

  story: {
    heading: 'De ce există firma',
    body: [
      'Cei trei fondatori lucraseră zece ani cu antreprenori și cu operatori de fabrică și fiecare așteptase prea mult ca o întrebare tehnică să primească răspuns de la cineva al cărui interes comercial depindea de acel răspuns.',
      'Lintel a fost înființată ca să fie firma care dă răspunsul fără problema aceasta. Nu avem contracte de distribuție, nu luăm comision pe echipamente și nu licităm pentru lucrările de execuție care decurg din recomandările noastre.',
      'Firma a crescut de la trei oameni la 48 fără să deschidă un al doilea birou. Pentru felul nostru de lucrări, apropierea contează mai mult decât acoperirea: majoritatea colaborărilor cer ca cineva să fie pe teren într-o săptămână, iar din Brașov se ajunge în coridorul industrial din Transilvania, în Ungaria și în sudul Germaniei.',
    ],
  },

  howWeAreOrganised: {
    heading: 'Cum suntem organizați',
    body: [
      'Trei discipline, fiecare cu o echipă permanentă și cu un coordonator care este inginer practicant, nu administrator: structuri cu 21 de oameni, sisteme industriale cu 17, informație și risc cu 10.',
      'Fiecare colaborare este condusă de inginerul care va face lucrarea. Persoana de la prima întâlnire este persoana care semnează raportul, iar între ele nu există un nivel de administrare a contului.',
      'Rapoartele sunt verificate de un al doilea inginer, dintr-o altă disciplină, înainte de emitere. Este mai lent și a prins destule greșeli cât să merite întârzierea.',
    ],
  },

  team: {
    heading: 'Cine conduce lucrările',
    standfirst:
      'Cei trei coordonatori de disciplină și inginerul care conduce investigațiile pe teren. Toți patru sunt ingineri practicanți care semnează rapoarte.',
    members: [
      {
        name: 'Adriana Pîrvu',
        role: 'Coordonator disciplină, structuri',
        discipline: 'structures',
        qualification: 'Inginerie structurală, master în construcții civile, 22 de ani de practică',
        joined: 2009,
        biography:
          'Fondatoare. A lucrat unsprezece ani la un antreprenor, pe proiecte industriale și de infrastructură, adică de partea care trebuie să execute ce a desenat altcineva. Conduce evaluarea și certificarea structurilor și preia majoritatea cazurilor în care o autoritate a spus deja nu o dată.',
      },
      {
        name: 'Tobias Rennert',
        role: 'Coordonator disciplină, sisteme industriale',
        discipline: 'industrial-systems',
        qualification: 'Automatizări, inginer diplomat în electrotehnică, 19 ani de practică',
        joined: 2012,
        biography:
          'A venit de la un constructor de mașini din Baden-Württemberg, unde a pus în funcțiune linii în toată Europa Centrală. Conduce migrările de automatizare și punerile în funcțiune și răspunde de practica rulării în paralel a sistemelor vechi și noi suficient de mult cât să apară ce au omis planurile.',
      },
      {
        name: 'Sorin Bălan',
        role: 'Coordonator disciplină, informație și risc',
        discipline: 'information-and-risk',
        qualification: 'Inginerie mecanică, master, 17 ani de practică',
        joined: 2015,
        biography:
          'A ajuns la due diligence dinspre mentenanță, ceea ce este o direcție utilă: ani la rând a întocmit chiar evidențele pe care un cumpărător trebuie apoi să decidă dacă le crede. Conduce lucrările de tranzacție și partea de management al informației din coordonare.',
      },
      {
        name: 'Elena Marcu',
        role: 'Inginer principal, investigații pe teren',
        discipline: 'structures',
        qualification:
          'Ingineria materialelor, doctorat în știința materialelor, 14 ani de practică',
        joined: 2017,
        biography:
          'Conduce investigațiile și instrumentarea pentru toate cele trei discipline: prelevări, monitorizare și planificarea ferestrelor de acces care nu se pot repeta. A conceput programul de 72 de ore folosit la evaluarea prizei de apă și abordarea cu sonde lăsate pe loc de care a depins.',
      },
    ],
  },
});
