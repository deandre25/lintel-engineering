import { z } from 'zod';

import { heading, metaDescription, paragraphs, prose, vacancySchema } from '../schema';

const careersSchema = z.object({
  title: heading,
  description: metaDescription,
  intro: prose,
  working: z.object({ heading, body: paragraphs }),
  process: z.object({ heading, body: paragraphs }),
  vacancies: z.array(vacancySchema).length(3),
  speculative: z.object({ heading, body: paragraphs }),
});

/** Romanian careers page. Slugs are localised; terms are identical to the English. */
export const careers = careersSchema.parse({
  title: 'Trei posturi deschise și cum arată lucrarea în realitate',
  description:
    'Posturi deschise la Lintel Engineering în Brașov: evaluare structurală, sisteme de automatizare și due diligence tehnic, cu condițiile precizate.',
  intro:
    'Angajăm ingineri care spun fără disconfort ce nu știu încă. Cea mai mare parte a lucrărilor noastre înseamnă să dai unui client un răspuns pe baza căruia va acționa, iar abilitatea utilă este să știi exact cât de sigur să fii.',

  working: {
    heading: 'Cum arată lucrarea',
    body: [
      'Veți fi pe teren mai mult decât în majoritatea posturilor de consultanță: de obicei două-cinci zile pe lună, uneori într-o fabrică în timpul unei opriri sau într-o clădire fără utilități. Lucrul pe teren este planificat, nu improvizat, iar nimeni nu este trimis singur la o structură necunoscută.',
      'Veți scrie. Fiecare colaborare se încheie cu un raport pe baza căruia cineva cheltuie bani, iar standardul acelor rapoarte este standardul restului acestui site: precis, delimitat și clar despre ce este măsurat și ce este dedus.',
      'Rapoartele sunt verificate de un al doilea inginer înainte de emitere, inclusiv rapoartele coordonatorilor de disciplină. Verificarea este o condiție permanentă aici, nu o etapă pe care o depășiți.',
      'Nu avem țintă de ore facturabile. Ofertăm prețuri fixe pe obiect scris, iar presiunea pe care o creează asta este pe definirea corectă a obiectului, nu pe înregistrarea timpului.',
    ],
  },

  process: {
    heading: 'Cum angajăm',
    body: [
      'O primă discuție cu coordonatorul de disciplină, aproximativ o oră, despre ce ați lucrat.',
      'O discuție tehnică pornind de la o lucrare reală, cu datele clientului eliminate. V-o trimitem cu două zile înainte. Este o discuție despre cum ați aborda-o, nu un test cu un răspuns corect, iar pe noi ne interesează întrebările pe care le puneți despre temă.',
      'O jumătate de zi la birou, cu echipa din care ați face parte, inclusiv cel puțin o persoană venită în ultimii doi ani.',
      'Dăm un răspuns în cinci zile lucrătoare de la ultima etapă și motivăm decizia în ambele sensuri.',
    ],
  },

  vacancies: [
    {
      slug: 'inginer-structurist-evaluare',
      title: 'Inginer structurist, evaluare și certificare',
      discipline: 'structures',
      location: 'Brașov, cu deplasări în România și Ungaria',
      commitment: 'Normă întreagă, perioadă nedeterminată',
      experience: 'Minimum patru ani în proiectare sau evaluare structurală',
      summary:
        'Evaluarea și certificarea construcțiilor existente: hale industriale, căi de rulare și infrastructură care trebuie să preia mai mult decât a fost proiectată.',
      responsibilities: [
        'Realizarea evaluărilor de structuri existente, de la releveu până la raportul emis.',
        'Reconstituirea traseului încărcărilor din geometria măsurată acolo unde calculele originale lipsesc.',
        'Verificarea proiectelor altor ingineri față de normativul și anexa națională aplicabile.',
        'Prezentarea constatărilor clienților și, unde procedura o cere, autorității care analizează dosarul.',
      ],
      requirements: [
        'Diplomă în construcții civile sau inginerie structurală și minimum patru ani de practică.',
        'Cunoașterea Eurocodurilor 0, 1, 2, 3 și 8 și disponibilitatea de a lucra cu o anexă națională nouă.',
        'Experiență în evaluarea construcțiilor existente, nu doar în proiectarea celor noi.',
        'Română și engleză. Germana sau maghiara sunt utile și nu sunt obligatorii.',
      ],
      offer: [
        'Salariu revizuit anual față de o grilă publicată pentru post, grilă pe care o vedeți înainte să acceptați.',
        'Atestările și parcursul profesional al disciplinei, plătite de firmă, inclusiv timpul de pregătire.',
        'Zece zile pe an pentru formare sau studiu, rezervate ca orice altă obligație, nu încadrate pe lângă lucru.',
        'O diurnă de teren definită și nicio așteptare ca deplasarea să fie absorbită din timpul dumneavoastră.',
      ],
    },
    {
      slug: 'inginer-automatizari',
      title: 'Inginer automatizări, migrare și punere în funcțiune',
      discipline: 'industrial-systems',
      location: 'Brașov, cu deplasări în România, Ungaria și sudul Germaniei',
      commitment: 'Normă întreagă, perioadă nedeterminată',
      experience: 'Minimum trei ani în sisteme industriale de automatizare',
      summary:
        'Planificarea și supravegherea migrărilor de platformă pe linii de producție care nu se pot opri mult, și punerea în funcțiune care urmează.',
      responsibilities: [
        'Relevarea sistemelor instalate și compararea lor cu ce susține documentația.',
        'Planificarea secvențelor de comutare în jurul calendarului de producție, inclusiv perioadele de funcționare în paralel.',
        'Scrierea criteriilor de acceptanță înainte de începerea lucrării și asistarea probelor față de ele.',
        'Evaluarea efectului unei modificări asupra funcțiilor de securitate și semnalarea lui în scris atunci când există.',
      ],
      requirements: [
        'Diplomă în electrotehnică, automatizări sau echivalent și minimum trei ani de practică.',
        'Experiență practică pe cel puțin două platforme PLC și disponibilitatea de a lucra pe a treia, pe care nu o cunoașteți.',
        'Familiaritate cu EN ISO 13849 sau EN 62061 în practică, nu doar din curs.',
        'Română și engleză, sau germană și engleză.',
      ],
      offer: [
        'Salariu revizuit anual față de o grilă publicată pentru post, grilă pe care o vedeți înainte să acceptați.',
        'Instruire pe platformele cu care lucrăm, plătită, inclusiv certificările care trebuie reînnoite.',
        'Zece zile pe an pentru formare sau studiu, rezervate ca orice altă obligație.',
        'Lucrul în opriri este planificat cu luni înainte și plătit ca ore suplimentare, nu așteptat ca bunăvoință.',
      ],
    },
    {
      slug: 'inginer-due-diligence',
      title: 'Inginer, due diligence tehnic',
      discipline: 'information-and-risk',
      location: 'Brașov, cu deplasări în România și Ungaria',
      commitment: 'Normă întreagă, perioadă nedeterminată',
      experience: 'Minimum trei ani în exploatare, mentenanță sau administrarea activelor',
      summary:
        'Stabilirea stării tehnice a activelor industriale înainte ca cineva să le cumpere, într-un calendar de tranzacție care nu se mută.',
      responsibilities: [
        'Evaluări pe teren ale fabricilor în funcțiune, în ferestre de acces restrânse.',
        'Citirea camerei de date a vânzătorului față de activul însuși și raportarea neconcordanțelor.',
        'Construirea prognozelor de investiții ca profil pe ani, cu ipotezele la vedere.',
        'Întocmirea sintezelor de puncte critice în prima săptămână, când informația este incompletă și totuși utilă.',
      ],
      requirements: [
        'Diplomă în inginerie mecanică, electrică, de proces sau civilă și minimum trei ani de practică.',
        'Experiență cu instalații în funcțiune, din partea de mentenanță sau din exploatare.',
        'Judecata necesară pentru a scrie o concluzie delimitată pornind de la informație incompletă și pentru a spune unde sunt limitele.',
        'Română și engleză.',
      ],
      offer: [
        'Salariu revizuit anual față de o grilă publicată pentru post, grilă pe care o vedeți înainte să acceptați.',
        'Lucrările de tranzacție sunt intense și finite; urmărim orele în timpul unei tranzacții și dăm timpul înapoi după.',
        'Zece zile pe an pentru formare sau studiu, rezervate ca orice altă obligație.',
        'Contact direct cu clientul de la prima colaborare, cu un coordonator de disciplină alături, nu în față.',
      ],
    },
  ],

  speculative: {
    heading: 'Dacă niciunul dintre posturi nu vi se potrivește',
    body: [
      'Citim candidaturile spontane și răspundem la toate, de obicei în două săptămâni. Spuneți-ne ce ați lucrat și ce ați vrea să lucrați aici.',
      'Suntem o firmă mică și spunem deschis ce înseamnă asta: angajăm două-cinci persoane pe an, iar o candidatură spontană poate aștepta luni până apare un post potrivit. Vă spunem dacă aceasta este situația, în loc să vă lăsăm să ghiciți.',
    ],
  },
});
