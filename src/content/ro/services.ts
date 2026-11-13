import { z } from 'zod';

import { serviceSchema } from '../schema';

import type { Service } from '../schema';

/**
 * Romanian services, adapted rather than translated.
 *
 * Slugs are localised independently of the English ones (§8). Standards keep
 * their published names — Eurocod, EN ISO — because translating a standard's
 * designation would make it unfindable.
 */
export const services: readonly Service[] = z
  .array(serviceSchema)
  .length(6)
  .parse([
    {
      id: 'structural-engineering',
      slug: 'inginerie-structurala',
      discipline: 'structures',
      name: 'Inginerie structurală',
      title: 'Inginerie structurală',
      summary:
        'Verificarea proiectelor, certificare, evaluarea capacității construcțiilor existente și analiză seismică și la vânt.',
      description:
        'Verificare independentă de proiect, certificarea construcțiilor existente, evaluarea capacității portante și analiză seismică, conform Eurocod.',
      intro:
        'Evaluăm, verificăm și certificăm structuri proiectate sau construite de altcineva, de obicei pentru că o decizie depinde acum de faptul că sunt sau nu corespunzătoare. Decizia nu este adesea una structurală: este achiziția unui pod rulant, un contract de închiriere, o autorizație sau o vânzare.',
      whenToCall: {
        heading: 'Când ne sună firmele',
        items: [
          'O autoritate a respins un proiect, iar lucrarea s-a oprit.',
          'O clădire trebuie să preia mai mult decât a fost proiectată să preia.',
          'O structură are degradări vizibile și nimeni nu vrea să spună dacă sunt grave.',
          'Planurile lipsesc, iar un cumpărător vrea o poziție înainte de semnare.',
          'Constructorul și proiectantul nu sunt de acord, iar dezacordul a devenit costisitor.',
        ],
      },
      coverage: {
        heading: 'Ce cuprinde activitatea',
        items: [
          {
            term: 'Verificarea proiectelor',
            description:
              'Verificare independentă a proiectului altui inginer față de normativul aplicabil, inclusiv anexa națională valabilă acolo unde se află construcția. Raportăm ce am verificat, ce nu am verificat și pe ce bază.',
          },
          {
            term: 'Certificarea construcțiilor existente',
            description:
              'Evaluare conform Eurocod în vigoare a unor structuri proiectate după normative care nu mai sunt aplicabile, adică majoritatea fondului industrial construit în regiune înainte de 1990.',
          },
          {
            term: 'Evaluarea capacității portante',
            description:
              'Stabilirea a ceea ce poate prelua structura acum, așa cum este executată și degradată, nu așa cum este desenată. Unde calculele originale lipsesc, reconstituim traseul încărcărilor din geometria măsurată.',
          },
          {
            term: 'Analiză seismică și la vânt',
            description:
              'România este o zonă seismic activă, iar spectrul de proiectare pentru o bună parte din țară s-a schimbat odată cu normativul în vigoare. Structuri conforme la data execuției pot să nu mai fie conforme azi, iar această diferență decide frecvent dacă o consolidare se face sau nu.',
          },
        ],
      },
      howWeWork: {
        heading: 'Cum lucrăm',
        body: [
          'Măsurăm înainte să calculăm. O evaluare făcută numai pe planuri este o evaluare a planurilor.',
          'Lucrul pe teren este primul: relevee dimensionale, detalierea îmbinărilor, verificarea secțiunilor și prelevarea de probe de material acolo unde accesul permite. Unde prelevarea nu este posibilă, spunem ce valori am presupus și ducem presupunerea până în concluzie, nu o lăsăm într-o anexă.',
          'Analiza este proporțională cu întrebarea. Un calcul de încadrare este adesea suficient ca să stabilească dacă există o problemă, iar un model cu element finit îl facem atunci când structura chiar îl cere: geometrie neregulată, răspuns seismic sau oboseală.',
          'Rapoartele separă ce a fost măsurat de ce a fost dedus. Fiecare evaluare precizează cazul determinant, rezerva față de el și ce anume ar schimba răspunsul.',
        ],
      },
      standards: {
        heading: 'Normativele după care lucrăm',
        body: [
          'Eurocod 0, 1, 2, 3 și 8, aplicate cu anexa națională a țării în care se află construcția: România, Ungaria sau Germania.',
          'Când evaluarea este pentru un cumpărător sau un finanțator, nu pentru o autoritate, precizăm față de ce normativ am evaluat, pentru că răspunsul diferă în funcție de întrebare.',
          'Lucrăm după normative publicate. Nu certificăm conformitatea în numele vreunui organism de acreditare și spunem de la început când o documentație are nevoie de un verificator care nu suntem noi.',
        ],
      },
      engagements: {
        heading: 'Colaborări tipice',
        body: [
          'Verificarea unui proiect pentru o singură structură durează două-trei săptămâni.',
          'Certificarea unei clădiri industriale existente durează între patru și zece săptămâni, în funcție de cât din ea este accesibilă și cât releveu presupune asta.',
          'O evaluare a capacității portante legată de un anumit utilaj durează de obicei trei-șase săptămâni. Durata este dată de momentul în care primim acces, nu de timpul de calcul.',
        ],
      },
      faq: [
        {
          question: 'Puteți evalua o structură fără planurile originale?',
          answer:
            'De obicei, da. Relevăm structura, prelevăm probe de material unde accesul permite și reconstituim traseul încărcărilor din geometria măsurată. Evaluarea precizează explicit ce date au fost măsurate și care au fost deduse.',
        },
        {
          question: 'Va fi acceptată evaluarea de către autoritate?',
          answer:
            'Depinde de autoritate și de procedura de depunere. Vă spunem de la început ce procedură se aplică și dacă este nevoie de un verificator atestat care nu suntem noi. Am avut evaluări acceptate și am avut evaluări contestate, iar noi preferăm să stabilim corect așteptarea decât să câștigăm lucrarea.',
        },
        {
          question: 'Puteți da o cifră înainte de releveu?',
          answer:
            'Putem da un interval și cele două-trei constatări care l-ar modifica. O cifră dată înainte ca cineva să fi fost pe teren este o ghiceală, nu o estimare.',
        },
      ],
      relatedCaseStudy: 'steel-hall-crane-recertification',
    },

    {
      id: 'industrial-process-and-automation',
      slug: 'procese-industriale-si-automatizare',
      discipline: 'industrial-systems',
      name: 'Procese industriale și automatizare',
      title: 'Procese industriale și automatizare',
      summary:
        'Retehnologizarea liniilor de producție, migrarea sistemelor de automatizare și asistență la punerea în funcțiune.',
      description:
        'Migrarea sistemelor de automatizare, retehnologizarea liniilor și asistență la punerea în funcțiune pentru fabrici care trebuie să meargă în continuare.',
      intro:
        'Planificăm și supraveghem modificări pe linii de producție care sunt încă în producție. Partea grea este rareori ingineria. Partea grea este secvența: ce se poate schimba într-un schimb, ce are nevoie de un weekend și ce cere cu adevărat oprirea liniei.',
      whenToCall: {
        heading: 'Când ne sună firmele',
        items: [
          'O platformă de automatizare iese din suport, iar migrarea trebuie să încapă în calendarul de producție.',
          'O linie a fost modificată de atâtea ori încât niciun document nu mai descrie ce este instalat.',
          'Un furnizor a ofertat o oprire pe care fabrica nu și-o permite.',
          'O punere în funcțiune a depășit termenul și nimeni nu poate spune care subsistem este de vină.',
        ],
      },
      coverage: {
        heading: 'Ce cuprinde activitatea',
        items: [
          {
            term: 'Migrarea sistemelor de automatizare',
            description:
              'Mutarea unei linii de pe o platformă pe alta, inclusiv verificarea semnalelor față de ce este instalat, nu față de setul de planuri, și o secvență de comutare construită în jurul calendarului fabricii.',
          },
          {
            term: 'Retehnologizarea liniilor',
            description:
              'Specificarea și supravegherea modificărilor mecanice și electrice pe linii existente, cu interfețele către părțile neatinse ale fabricii definite înainte să se comande ceva.',
          },
          {
            term: 'Asistență la punerea în funcțiune',
            description:
              'Criterii de acceptanță convenite dinainte, probe asistate și o listă de deficiențe care separă ce blochează producția de ce doar deranjează operatorul.',
          },
          {
            term: 'Evaluarea uzurii morale',
            description:
              'Stabilirea a ceea ce pe o linie chiar nu mai poate fi susținut și a ceea ce un furnizor ar prefera pur și simplu să înlocuiască, cu disponibilitatea pieselor verificată, nu presupusă.',
          },
        ],
      },
      howWeWork: {
        heading: 'Cum lucrăm',
        body: [
          'Relevăm sistemul instalat înainte să citim documentația și tratăm cele două ca surse independente care se întâmplă să descrie aceeași fabrică. La fiecare migrare pe care am condus-o, ele s-au contrazis.',
          'Comutarea se secvențiază după calendarul de producție, nu după comoditatea inginerească. De obicei asta înseamnă opriri mai multe și mai scurte, în loc de una lungă, și aproape întotdeauna înseamnă o perioadă în care vechiul și noul merg în paralel.',
          'Funcționarea în paralel este momentul în care apare comportamentul nedocumentat. Planificăm faptul că va apărea și rezervăm timpul pentru el, în loc să îl tratăm ca pe o depășire de termen.',
          'Scriem criteriile de acceptanță înainte de începerea lucrării și le convenim atât cu fabrica, cât și cu furnizorul, ca punerea în funcțiune să se încheie pe dovezi, nu pe epuizarea răbdării.',
        ],
      },
      standards: {
        heading: 'Normativele după care lucrăm',
        body: [
          'Securitatea mașinilor conform EN ISO 13849 și EN 62061, cu siguranța funcțională evaluată la nivelul de performanță pe care îl cere aplicația, nu la cel comod de declarat.',
          'Instalațiile electrice conform transpunerii naționale a standardelor armonizate relevante din țara în care se află fabrica.',
          'Când o modificare afectează o funcție de securitate, o spunem în scris și nu mergem mai departe pe baza unei asigurări verbale că nu o afectează.',
        ],
      },
      engagements: {
        heading: 'Colaborări tipice',
        body: [
          'Evaluarea uzurii morale pe o singură linie durează două-patru săptămâni.',
          'O migrare de automatizare durează între trei luni și aproximativ un an, iar durata este dată aproape în întregime de câte opriri de producție ne poate da fabrica și cât de departe sunt una de alta.',
          'Asistența la punerea în funcțiune se ofertează pe programul de probe asistate, nu pe tarif zilnic cu final deschis.',
        ],
      },
      faq: [
        {
          question: 'Se poate face o migrare fără o oprire lungă?',
          answer:
            'Deseori, da, dacă linia poate fi împărțită în tronsoane care se pot comuta independent și dacă fabrica ne poate da mai multe opriri scurte în locul uneia lungi. Unde nu se poate, o spunem devreme, pentru că alternativa este să aflăm în timpul opririi.',
        },
        {
          question: 'Furnizați sau montați echipamentele?',
          answer:
            'Nu. Specificăm, secvențiem și supraveghem, iar contracte de distribuție nu avem. Montajul îl face un antreprenor, iar noi suntem frecvent partea care îi verifică lucrarea în numele fabricii.',
        },
        {
          question: 'Ce se întâmplă când documentația este greșită?',
          answer:
            'Presupunem că pe alocuri va fi, iar releveul există tocmai ca să afle unde. Neconcordanțele sunt consemnate, cuantificate și introduse în secvență înainte de comutare, nu descoperite în timpul ei.',
        },
      ],
      relatedCaseStudy: 'press-line-control-migration',
    },

    {
      id: 'energy-and-efficiency-audits',
      slug: 'audit-energetic',
      discipline: 'industrial-systems',
      name: 'Audit energetic și eficiență',
      title: 'Audit energetic și eficiență',
      summary:
        'Conformare la Directiva de eficiență energetică, modelare termică și planuri de decarbonare cu măsuri cuantificate.',
      description:
        'Audituri energetice, modelare termică și planuri de decarbonare pentru clădiri industriale, cu fiecare măsură cuantificată și verificată prin măsurare.',
      intro:
        'Măsurăm cât consumă efectiv o clădire sau un proces, stabilim unde se duce energia și cuantificăm măsurile care ar schimba asta. Auditul este jumătatea ușoară. Jumătatea utilă este ordinea în care se fac măsurile.',
      whenToCall: {
        heading: 'Când ne sună firmele',
        items: [
          'Un audit este obligatoriu, iar termenul a devenit incomod.',
          'S-a asumat un angajament de decarbonare și nimeni nu a cuantificat drumul până la el.',
          'Un audit anterior a produs o listă de măsuri și nicio ordine între ele.',
          'Consumul contorizat nu se potrivește cu ce crede fabrica despre propriul consum.',
        ],
      },
      coverage: {
        heading: 'Ce cuprinde activitatea',
        items: [
          {
            term: 'Audituri energetice',
            description:
              'Audituri bazate pe măsurare, pentru situri industriale și comerciale, conform transpunerii naționale a Directivei de eficiență energetică, cu contorizare suplimentară acolo unde structura existentă de contoare nu poate răspunde la întrebare.',
          },
          {
            term: 'Modelare termică',
            description:
              'Modele termice dinamice ale clădirilor și proceselor, calibrate pe consumul măsurat, nu lăsate la ipotezele de proiectare.',
          },
          {
            term: 'Planuri de decarbonare',
            description:
              'O succesiune de măsuri cuantificate și ordonate, fiecare cu durata de recuperare, cu interacțiunea cu celelalte și cu momentul în care trebuie făcută pentru că altceva depinde de ea.',
          },
          {
            term: 'Măsurare și verificare',
            description:
              'Stabilirea unei referințe înainte de implementarea unei măsuri și verificarea economiei după, ca o reducere declarată să poată fi verificată.',
          },
        ],
      },
      howWeWork: {
        heading: 'Cum lucrăm',
        body: [
          'Contorizăm înainte să modelăm. Un model calibrat pe un consum presupus prezice presupunerea.',
          'Măsurile se raportează împreună cu interacțiunile dintre ele, pentru că economia din izolare și economia dintr-o centrală mai mică nu se adună, iar un plan care le adună supraestimează rezultatul.',
          'Fiecare măsură are un interval de cost, nu o valoare punctuală, și spunem care dintre cele două-trei necunoscute l-ar modifica.',
          'Când o măsură nu se amortizează, spunem asta și o lăsăm în raport. Un plan care conține doar măsurile care arată bine este un document de vânzare.',
        ],
      },
      standards: {
        heading: 'Normativele după care lucrăm',
        body: [
          'Auditurile se fac conform EN 16247 și transpunerii naționale a Directivei de eficiență energetică din țara în care se află situl.',
          'Măsurarea și verificarea urmează structura protocolului internațional de măsurare și verificare a performanței, cu opțiunea și perioada de referință precizate în raport.',
          'Descriem aceste standarde ca bază a lucrării noastre. Nu suntem organism de verificare și nu emitem certificate în numele unuia.',
        ],
      },
      engagements: {
        heading: 'Colaborări tipice',
        body: [
          'Un audit pe un singur sit durează trei-șase săptămâni, din care perioada de contorizare este de obicei cea mai lungă parte.',
          'Un model termic calibrat pentru o clădire durează patru-opt săptămâni.',
          'Un plan de decarbonare pe mai multe situri durează două-patru luni, iar durata depinde de cât istoric de contorizare există.',
        ],
      },
      faq: [
        {
          question: 'Cât trebuie contorizat înainte ca auditul să fie util?',
          answer:
            'Două-patru săptămâni pentru majoritatea proceselor, plus un an de date de facturare. O perioadă mai scurtă se poate folosi acolo unde producția este cu adevărat constantă, iar noi vă spunem când credem că nu este.',
        },
        {
          question: 'Auditul ne va spune să înlocuim tot?',
          answer:
            'Vă va spune cât costă fiecare măsură și cât aduce, inclusiv cele care nu se amortizează. Ordinea în care se fac măsurile contează frecvent mai mult decât lista în sine.',
        },
      ],
    },

    {
      id: 'technical-due-diligence',
      slug: 'due-diligence-tehnic',
      discipline: 'information-and-risk',
      name: 'Due diligence tehnic',
      title: 'Due diligence tehnic',
      summary:
        'Evaluarea riscului tehnic pentru achiziții și finanțări de proiect, livrată într-un calendar de tranzacție.',
      description:
        'Evaluarea riscului tehnic pentru achiziții și finanțări de proiect: starea activului, necesarul de investiții și întrebările fără răspuns din camera de date.',
      intro:
        'Stabilim starea tehnică a unui activ înainte ca cineva să îl cumpere sau să împrumute pe baza lui și cuantificăm cât va costa menținerea lui în funcțiune. Lucrarea este încadrată de un calendar de tranzacție care nu se mută, iar asta determină tot restul.',
      whenToCall: {
        heading: 'Când ne sună firmele',
        items: [
          'O tranzacție are o anexă tehnică pe care nimeni nu a verificat-o.',
          'Un finanțator cere o poziție inginerească independentă înainte de tragere.',
          'Camera de date a vânzătorului este completă pe hârtie și săracă în măsurători.',
          'Un activ a fost întreținut mult timp de un singur antreprenor, iar evidențele sunt evidențele lui.',
        ],
      },
      coverage: {
        heading: 'Ce cuprinde activitatea',
        items: [
          {
            term: 'Evaluarea stării',
            description:
              'Ce este activul, în ce stare se află și care parte din asta este stabilită prin inspecție, nu prin afirmația vânzătorului.',
          },
          {
            term: 'Necesarul de investiții',
            description:
              'Cât trebuie cheltuit, și când, pentru ca activul să funcționeze la nivelul presupus. Raportat ca profil pe ani, nu ca o cifră unică.',
          },
          {
            term: 'Conformitate și autorizații',
            description:
              'Dacă activul deține autorizațiile necesare, dacă acestea supraviețuiesc unei schimbări de acționariat și ce ar presupune o reînnoire.',
          },
          {
            term: 'Raportarea punctelor critice',
            description:
              'O sinteză timpurie a tot ce ar putea schimba prețul sau opri tranzacția, emisă în prima săptămână, nu ținută până la raportul final.',
          },
        ],
      },
      howWeWork: {
        heading: 'Cum lucrăm',
        body: [
          'Emitem o sinteză a punctelor critice în prima săptămână, pentru că o echipă de tranzacție care află despre o problemă în săptămâna a cincea a pierdut patru săptămâni de poziție de negociere.',
          'Constatările sunt clasificate după efectul asupra tranzacției: cele care schimbă prețul, cele care schimbă calendarul și cele care nu schimbă niciuna, dar vor costa bani mai târziu.',
          'Separăm peste tot ce am inspectat, ce ni s-a spus și unde nu am primit acces. A treia categorie este de obicei cea mai informativă.',
          'Când camera de date contrazice situl, raportăm ambele și spunem pe care o credem.',
        ],
      },
      standards: {
        heading: 'Cum este delimitată lucrarea',
        body: [
          'Obiectul lucrării, accesul și data de raportare se convin în scris înainte de începere, iar raportul precizează ce a fost exclus din el.',
          'Lucrăm pentru partea care ne instruiește și declarăm orice lucrare anterioară făcută pe același activ înainte de a accepta o instruire.',
          'Oferim o opinie inginerească. Nu oferim consultanță de evaluare, juridică sau de răspundere de mediu și spunem unde se oprește raportul nostru.',
        ],
      },
      engagements: {
        heading: 'Colaborări tipice',
        body: [
          'Un due diligence pe un singur sit durează două-trei săptămâni de la instruire până la raportul final.',
          'Un portofoliu cu mai multe situri durează patru-șase săptămâni, cu sinteza punctelor critice în prima săptămână indiferent de mărimea portofoliului.',
          'Când accesul la un activ în funcțiune este restrâns, spunem de la început care concluzii vor avea, din acest motiv, un interval mai larg.',
        ],
      },
      faq: [
        {
          question: 'Puteți lucra într-un calendar de tranzacție?',
          answer:
            'Da, iar calendarul este primul lucru despre care întrebăm. Dacă data nu poate fi respectată cu accesul disponibil, spunem asta înainte să fim angajați, nu în timpul lucrării.',
        },
        {
          question: 'Dacă activul este în funcțiune și nu putem demonta nimic?',
          answer:
            'Cea mai mare parte a lucrării rămâne posibilă, iar noi precizăm clar care concluzii se sprijină pe inspecție și care pe evidențe. Unde o concluzie ar cere acces intruziv, îl ofertăm separat, ca să poată cumpărătorul decide dacă răspunsul merită.',
        },
      ],
      relatedCaseStudy: 'acquisition-due-diligence-three-sites',
    },

    {
      id: 'permitting-and-compliance',
      slug: 'avize-si-conformitate',
      discipline: 'structures',
      name: 'Avize și conformitate',
      title: 'Avize și conformitate',
      summary:
        'Eurocod și normative naționale, autorizare de mediu și relația cu autoritatea care decide.',
      description:
        'Autorizare în construcții și de mediu în România, Ungaria și Germania, inclusiv relația cu autoritatea și redepunerea dosarului după un refuz.',
      intro:
        'Ducem proiectele prin procedura de avizare și suntem adesea chemați după ce o primă depunere a fost deja respinsă. Întrebarea tehnică și cea administrativă sunt rareori aceeași întrebare, iar confundarea lor blochează majoritatea dosarelor.',
      whenToCall: {
        heading: 'Când ne sună firmele',
        items: [
          'O documentație a fost respinsă, iar motivele nu sunt pe deplin clare.',
          'Un proiect trece o graniță, iar normativul aplicabil s-a schimbat odată cu ea.',
          'O schimbare de destinație a declanșat cerințe pentru care clădirea nu a fost proiectată.',
          'Reînnoirea unei autorizații de mediu este scadentă, iar condițiile s-au schimbat de la emitere.',
        ],
      },
      coverage: {
        heading: 'Ce cuprinde activitatea',
        items: [
          {
            term: 'Verificarea conformității',
            description:
              'Evaluare față de normativul național de construcții și de anexa națională a Eurocodului aplicabil, făcută înainte de depunere, nu după un refuz.',
          },
          {
            term: 'Autorizare de mediu',
            description:
              'Pregătirea și susținerea dosarelor, inclusiv studiile suport, și urmărirea condițiilor atașate unei autorizații emise, ca reînnoirea să nu înceapă de la zero.',
          },
          {
            term: 'Relația cu autoritatea',
            description:
              'Contact direct cu autoritatea care analizează dosarul, inclusiv redepunerea după un refuz, și consemnarea în scris a ceea ce s-a convenit verbal.',
          },
          {
            term: 'Proiecte transfrontaliere',
            description:
              'Când același proiect se execută în mai multe dintre România, Ungaria și Germania, stabilim ce anexă națională guvernează fiecare element și unde proiectele trebuie cu adevărat să difere.',
          },
        ],
      },
      howWeWork: {
        heading: 'Cum lucrăm',
        body: [
          'Stabilim ce a cerut de fapt autoritatea înainte să pregătim un răspuns. Un refuz are frecvent în spate ceva alăturat motivului invocat, iar cea mai rapidă cale de a afla este să întrebi.',
          'Tot ce se convine într-o ședință se confirmă în scris în aceeași zi. O înțelegere verbală cu un referent nu supraviețuiește schimbării referentului.',
          'Depunem când dosarul este complet, nu când clientul și-a pierdut răbdarea, pentru că o depunere incompletă repornește termenul și consumă o credibilitate de care va fi nevoie mai târziu.',
          'Când considerăm că o cerință a fost aplicată greșit, o spunem autorității, cu argumentația, în loc să reproiectăm discret în jurul ei.',
        ],
      },
      standards: {
        heading: 'Normativele după care lucrăm',
        body: [
          'Eurocod cu anexa națională a țării în care se află proiectul, alături de normativul național de construcții și de legislația de mediu aplicabilă.',
          'Unde cerințele naționale depășesc Eurocodul, proiectăm la cerința națională și precizăm în documentație de unde provine diferența.',
          'Pregătim și susținem dosarele. Decizia aparține autorității, iar noi nu ne prezentăm ca fiind în măsură să garantăm un rezultat.',
        ],
      },
      engagements: {
        heading: 'Colaborări tipice',
        body: [
          'O verificare de conformitate înainte de depunere durează două-patru săptămâni.',
          'Susținerea unui dosar până la decizie depinde aproape în întregime de autoritate, iar noi dăm un interval bazat pe experiența recentă în acea jurisdicție, nu o dată fixă.',
          'O redepunere după refuz înseamnă de obicei trei-opt săptămâni din timpul nostru, cu durata calendaristică dată de ciclul de analiză.',
        ],
      },
      faq: [
        {
          question: 'Puteți garanta obținerea avizului?',
          answer:
            'Nu, iar cine garantează descrie altceva decât o procedură de avizare. Vă putem spune care credem că sunt riscurile, ce am schimba înainte de depunere și cum au fost tratate recent dosare similare în acea jurisdicție.',
        },
        {
          question: 'Am fost respinși. O luăm de la capăt?',
          answer:
            'Rareori. Majoritatea refuzurilor se reduc la un set definit de puncte, iar prima sarcină este să stabilim care sunt de fond și care administrative. Am dus redepuneri în șase săptămâni și am văzut altele durând un an, iar diferența este de obicei cât de exact a fost înțeles primul refuz.',
        },
      ],
      relatedCaseStudy: 'water-intake-drawdown-assessment',
    },

    {
      id: 'bim-coordination',
      slug: 'coordonare-bim',
      discipline: 'information-and-risk',
      name: 'Coordonare BIM',
      title: 'Coordonare BIM',
      summary:
        'Federarea modelelor, detectarea coliziunilor și managementul informației pentru proiecte cu mai multe echipe.',
      description:
        'Federarea modelelor, detectarea coliziunilor și managementul informației pentru proiecte multidisciplinare, cu cerințele definite înainte de modelare.',
      intro:
        'Conducem partea de modelare a proiectelor în care mai multe echipe de proiectare trebuie să producă un rezultat coordonat. Cea mai mare parte a valorii nu este în raportul de coliziuni, ci în a stabili, înainte să modeleze cineva ceva, la ce folosește modelul.',
      whenToCall: {
        heading: 'Când ne sună firmele',
        items: [
          'Mai multe echipe de proiectare produc modele care nu se potrivesc între ele.',
          'Un client a cerut un model și nimeni nu a definit ce trebuie să conțină.',
          'Se găsesc pe șantier coliziuni care ar fi trebuit găsite în model.',
          'Un proiect se predă, iar modelul nu corespunde cu ce s-a executat.',
        ],
      },
      coverage: {
        heading: 'Ce cuprinde activitatea',
        items: [
          {
            term: 'Cerințe de informație',
            description:
              'Definirea a ceea ce trebuie să conțină modelul și la ce nivel de detaliu, legat de deciziile pentru care va fi folosit, înainte de începerea modelării.',
          },
          {
            term: 'Federarea modelelor',
            description:
              'Combinarea modelelor pe discipline într-un model federat, pe un ciclu convenit, cu evidența a ceea ce s-a schimbat între cicluri.',
          },
          {
            term: 'Detectarea și rezolvarea coliziunilor',
            description:
              'Rularea procesului de detectare și, mai important, trierea rezultatului, astfel încât ședința să trateze cele patruzeci de coliziuni care contează, nu cele patru mii care nu contează.',
          },
          {
            term: 'Informația la predare',
            description:
              'Verificarea faptului că ce se predă corespunde cu ce s-a executat și că este structurat astfel încât operatorul să îl poată folosi efectiv.',
          },
        ],
      },
      howWeWork: {
        heading: 'Cum lucrăm',
        body: [
          'Definim întâi cerințele de informație. Un model construit fără să se știe ce decizii sprijină va fi în același timp prea detaliat și lipsit tocmai de ce aveți nevoie.',
          'Rezultatul detectării se triază înainte să fie distribuit. Un raport de coliziuni netriat mută munca de la coordonator la douăsprezece echipe de proiectare, adică exact opusul coordonării.',
          'Federarea rulează pe un ciclu fix pe care proiectul chiar îl poate susține, cu un jurnal al modificărilor, astfel încât o echipă care revine după două săptămâni să vadă ce s-a schimbat.',
          'Descriem metoda noastră ca fiind aliniată la seria ISO 19650. Este o descriere de metodă, nu o pretenție de certificare, nici a noastră și nici în numele altcuiva.',
        ],
      },
      standards: {
        heading: 'Normativele după care lucrăm',
        body: [
          'Seria ISO 19650 oferă structura pentru managementul informației, denumire și mediul comun de date.',
          'Schimbul se face prin IFC acolo unde proiectul permite, cu păstrarea în paralel a formatelor native, ca modelul să supraviețuiască licenței care l-a produs.',
          'Descriem standardul generic și îi aplicăm structura. Nu deținem nicio certificare față de el și nu pretindem una.',
        ],
      },
      engagements: {
        heading: 'Colaborări tipice',
        body: [
          'Definirea cerințelor de informație pentru un proiect durează două-trei săptămâni și este, cu o marjă mare, cea mai ieftină parte a lucrării.',
          'Coordonarea curentă se ofertează pe ciclu de federare, de obicei la două săptămâni, pe toată durata proiectării.',
          'Verificarea informației la predare durează trei-cinci săptămâni, în funcție de mărimea activului și de starea modelului la primire.',
        ],
      },
      faq: [
        {
          question: 'Avem nevoie de un model?',
          answer:
            'Nu întotdeauna. Dacă proiectul are o singură echipă de proiectare, puține instalații și interfețe simple, costul coordonării poate depăși ce economisește. Vă spunem când credem că aceasta este situația.',
        },
        {
          question: 'Proiectanții noștri folosesc programe diferite. Este o problemă?',
          answer:
            'De obicei nu, dacă formatul de schimb și cerințele de informație se convin de la început. Devine o problemă când se descoperă în luna a patra.',
        },
      ],
    },
  ]);
