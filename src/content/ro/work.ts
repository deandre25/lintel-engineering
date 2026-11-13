import { z } from 'zod';

import { caseStudySchema } from '../schema';

import type { CaseStudy } from '../schema';

/** Romanian case studies, adapted. Facts and figures are identical to the English. */
export const caseStudies: readonly CaseStudy[] = z
  .array(caseStudySchema)
  .length(4)
  .parse([
    {
      id: 'steel-hall-crane-recertification',
      slug: 'recertificare-hala-pod-rulant',
      title: 'Recertificarea unei hale metalice din 1972 pentru un pod rulant mai greu',
      description:
        'Un antreprenor ofertase 44 de îmbinări consolidate și demontarea acoperișului. Măsurarea halei a redus lucrarea la unsprezece, cu acoperișul închis.',
      sector: 'Componente auto',
      location: 'Lângă Sibiu, România',
      year: 2023,
      duration: '11 săptămâni',
      client: 'Un furnizor auto de rang 1',
      headline: { value: '11 din 44', label: 'îmbinări care chiar aveau nevoie de consolidare' },
      summary:
        'O hală proiectată în 1972 pentru un pod rulant de 12,5 tone trebuia să preia unul de 32 de tone. Măsurarea a înlocuit cu cifre trei ipoteze acoperitoare suprapuse.',
      services: ['structural-engineering'],
      constraint: {
        heading: 'Constrângerea',
        body: [
          'Fabrica avea nevoie de un pod rulant de 32 de tone într-o hală a cărei cale de rulare fusese proiectată în 1972 pentru 12,5 tone. Evaluarea inițială a unui antreprenor concluziona că 44 de îmbinări trebuie consolidate și că acoperișul trebuie demontat pentru acces: o oprire de 14 săptămâni într-o hală care lucra în trei schimburi, adică mai mult decât programul pentru care fusese cumpărat podul.',
          'Planurile originale acopereau cadrele transversale. Nu acopereau grinzile căii de rulare, consolele de prindere în stâlpi și nici fundațiile. Nimeni nu putea spune dacă cele 44 de îmbinări erau cu adevărat insuficiente sau dacă cifra era rezultatul unor ipoteze acoperitoare suprapuse una peste alta.',
        ],
      },
      approach: {
        heading: 'Ce am făcut',
        body: [
          'Am relevat hala în nouă zile, inclusiv îmbinările pe care antreprenorul le evaluase de pe planuri. Patru dintre consolele căii de rulare nu erau detaliul din planurile din 1972. Fuseseră modificate, probabil la o schimbare anterioară de pod rulant, iar modificarea era mai bună decât originalul.',
          'Am prelevat probe de material din șase locuri. Oțelul a rezultat constant peste marca presupusă în evaluarea antreprenorului, care folosise valoarea minimă specificată pentru perioada respectivă.',
          'Am instrumentat podul existent și am înregistrat 11 zile de funcționare. Astfel s-a stabilit că spectrul de încărcare era mult mai ușor decât clasa aplicată de antreprenor și că situația determinantă nu era capacitatea de ansamblu, ci oboseala la sudurile consolelor căii de rulare: altă problemă, în alt loc, decât cea ofertată.',
          'Am reanalizat conform Eurocodului în vigoare, cu anexa națională română, folosind geometria măsurată, caracteristicile reale ale materialului și spectrul de funcționare înregistrat.',
        ],
      },
      outcome: {
        heading: 'Rezultatul',
        body: [
          'Unsprezece îmbinări au necesitat consolidare, nu 44. Toate unsprezece erau accesibile din interiorul halei, cu o nacelă, între schimburi, iar acoperișul nu a fost deschis niciodată.',
          'Producția s-a oprit două schimburi de weekend în loc de 14 săptămâni. Consolidarea s-a executat în patru săptămâni de lucru seara, iar podul a fost pus în funcțiune la 11 săptămâni de la contractare.',
          'Am raportat și două lucruri pe care clientul nu le ceruse: o bază de stâlp cu pierdere de secțiune care nu era determinantă, dar ar fi devenit în aproximativ opt ani, și o consolă pe calea de rulare opusă cu aceeași modificare neconsemnată, pe care am recomandat să o înregistreze înainte de următoarea schimbare de pod.',
        ],
      },
      reflection: {
        heading: 'Ce a făcut diferența',
        body: [
          'Evaluarea antreprenorului nu era greșită. Era o evaluare a planurilor, făcută cu ipotezele corecte atunci când nu ai informații mai bune: marca minimă de material, geometrie nominală, o clasă de funcționare acoperitoare. Trei ipoteze acoperitoare nu se adună, ci se înmulțesc.',
          'Măsurarea structurii a înlocuit fiecare ipoteză cu o cifră. Releveul, probele și instrumentarea au costat o mică parte din consolidarea pe care au scos-o din lucrare, iar acesta este raportul obișnuit la clădiri de vârsta aceasta.',
        ],
      },
    },

    {
      id: 'press-line-control-migration',
      slug: 'migrare-control-linie-de-prese',
      title: 'Mutarea unei linii de prese pe o platformă nouă în fereastra de vară',
      description:
        'O linie de prese trebuia să schimbe platforma de automatizare fără o oprire mai lungă de nouă zile. Funcționarea în paralel a găsit un interblocaj nedesenat.',
      sector: 'Componente auto',
      location: 'Lângă Brașov, România',
      year: 2024,
      duration: '7 luni',
      client: 'Un furnizor auto de rang 1',
      headline: { value: '6 zile', label: 'rămase nefolosite din fereastra de nouă zile' },
      summary:
        'O migrare de platformă secvențiată în trei opriri, cu vechiul și noul sistem rulând în paralel 40 de zile, acolo unde a apărut comportamentul nedocumentat.',
      services: ['industrial-process-and-automation'],
      constraint: {
        heading: 'Constrângerea',
        body: [
          'O linie de prese de la un furnizor auto de lângă Brașov trebuia mutată pe o platformă nouă de automatizare. Platforma ieșea din suport, iar linia alimenta un flux pe care fabrica nu îl putea tampona mult timp. Singura oprire disponibilă era fereastra existentă de mentenanță de vară, de nouă zile, și nu urma să fie prelungită.',
          'Furnizorul ofertase o singură comutare care ocupa toată fereastra, fără nicio rezervă în interiorul ei. Dacă s-ar fi descoperit ceva în timpul acelei comutări, linia ar fi repornit cu întârziere.',
        ],
      },
      approach: {
        heading: 'Ce am făcut',
        body: [
          'Am relevat sistemul instalat înainte să citim documentația și am tratat cele două ca descrieri independente ale aceleiași fabrici.',
          'Lista de semnale a fabricii avea 1.412 puncte. Noi am găsit 1.431. Printre cele nouăsprezece puncte nedocumentate era un interblocaj cablat între destivuitor și apărătoarea presei, adăugat la o reparație din 2016 și nedesenat niciodată. Funcționa, avea un rol de securitate și nimic din pachetul de migrare nu știa că există.',
          'Am împărțit linia în trei tronsoane care puteau fi comutate independent și le-am secvențiat în trei opriri mai scurte în locul uneia lungi, lăsând la final tronsonul cu interblocajul nedocumentat, după ce comportamentul lui a fost caracterizat.',
          'Vechiul și noul controler au mers în paralel 40 de zile, citind aceleași intrări, cu sistemul nou în imposibilitatea de a comanda elemente de execuție. Compararea celor două fluxuri de comenzi a arătat că interblocajul se comporta altfel la deblocarea unui blocaj decât descrisese oricine.',
        ],
      },
      outcome: {
        heading: 'Rezultatul',
        body: [
          'Migrarea s-a încheiat în trei opriri însumând trei zile, iar la predare au rămas nefolosite șase din cele nouă zile ale ferestrei.',
          'Cele nouăsprezece puncte nedocumentate au fost desenate, testate și adăugate în evidența de mentenanță. Interblocajul din 2016 a fost reimplementat pe platforma nouă ca funcție de securitate documentată, nu preluat ca un fir de care nimeni nu putea da socoteală.',
          'Linia a revenit la regim complet din primul schimb de producție de după ultima comutare, iar setul de date din funcționarea în paralel a fost predat fabricii ca referință pentru următoarea modificare.',
        ],
      },
      reflection: {
        heading: 'Ce a făcut diferența',
        body: [
          'Funcționarea în paralel este cea care a scos la iveală interblocajul. O comutare într-un singur weekend ar fi găsit același comportament cu linia oprită, cu antreprenorul pe teren și cu fereastra deja consumată.',
          'Funcționarea în paralel nu este gratuită: costă o licență, o perioadă de mentenanță dublă și disciplina de a lăsa sistemul nou să privească fără să poată acționa. Pe o linie care nu poate fi tamponată, este cu mult mai ieftină decât alternativa.',
        ],
      },
    },

    {
      id: 'water-intake-drawdown-assessment',
      slug: 'evaluare-priza-de-apa',
      title: 'Evaluarea unei prize de apă într-o fereastră de 72 de ore',
      description:
        'Singurul acces la o priză de apă municipală era o golire programată care nu se repeta trei ani. Releveu, probe și instrumentare în 72 de ore.',
      sector: 'Apă municipală',
      location: 'Sudul Transilvaniei, România',
      year: 2024,
      duration: '14 săptămâni, cu o fereastră de acces de 72 de ore',
      client: 'O autoritate municipală de apă',
      headline: { value: '72 de ore', label: 'de acces, fără a doua încercare' },
      summary:
        'O priză de apă din beton armat, de stare incertă, accesibilă doar în timpul unei goliri programate, evaluată pentru durata de viață rămasă.',
      services: ['structural-engineering', 'permitting-and-compliance'],
      constraint: {
        heading: 'Constrângerea',
        body: [
          'O autoritate municipală de apă avea nevoie de o poziție privind durata de viață rămasă a unei prize de apă din beton armat construite în 1968. Structura era permanent submersată până la un metru de platformă, iar singurul acces era o golire programată de 72 de ore, care nu urma să se repete timp de trei ani.',
          'Autoritatea trebuia să decidă între reabilitare și înlocuire în interiorul aceluiași ciclu de finanțare. Un răspuns amânat echivala cu decizia de a înlocui, pentru că finanțarea ar fi fost angajată în altă parte.',
        ],
      },
      approach: {
        heading: 'Ce am făcut',
        body: [
          'Am planificat cele 72 de ore în blocuri de 30 de minute, cu o variantă de rezervă scrisă pentru fiecare operație, și am convenit dinainte ce măsurători se sacrifică dacă programul alunecă. Două echipe au lucrat în schimburi opuse, ca nicio operație să nu depindă de o singură persoană trează.',
          'În fereastră am realizat releveul dimensional, probe de cloruri și carbonatare în 14 puncte, cartarea potențialului de semicelulă pe fețele accesibile și pahometrie pe platformă și pe peretele amonte.',
          'Am montat patru sonde de viteză de coroziune și două mărci de fisură înainte să revină apa, ceea ce a transformat un instantaneu unic într-o serie pe care am putut-o citi încă trei luni.',
          'Adâncimea de carbonatare în zona de stropire era aproximativ jumătate din ce ar fi prezis vârsta și clasa de expunere a structurii. Betonul din 1968 era semnificativ mai compact decât specificația perioadei, iar aceasta este constatarea care a schimbat recomandarea.',
        ],
      },
      outcome: {
        heading: 'Rezultatul',
        body: [
          'Am raportat o durată de viață rămasă de 18-25 de ani pentru structura principală, condiționată de o reparație definită la intradosul platformei, față de cei 8-12 ani cu care lucra autoritatea.',
          'Raportul a separat, punct cu punct, ce a fost măsurat de ce a fost dedus și a precizat care trei constatări ar schimba concluzia dacă datele de la sonde ar contrazice instantaneul. Nu l-au contrazis.',
          'Autoritatea a reabilitat în loc să înlocuiască. Lucrarea de reparație a costat aproximativ o cincime din estimarea de înlocuire, iar finanțarea eliberată a acoperit o a doua priză din rețea.',
        ],
      },
      reflection: {
        heading: 'Ce a făcut diferența',
        body: [
          'Instrumentarea. Trei zile de acces produc un instantaneu, iar instantaneul unei structuri din 1968 susține un răspuns prudent. Sondele lăsate pe loc au transformat instantaneul într-o tendință verificabilă după revenirea apei, iar asta a permis o cifră în locul unui interval de presupuneri.',
          'Planificarea ferestrei în blocuri de 30 de minute pare exagerată până când fereastra este singura din trei ani. Am pierdut patru ore în prima noapte din cauza unei pompe defecte și am făcut totuși toate măsurătorile de pe listă.',
        ],
      },
    },

    {
      id: 'acquisition-due-diligence-three-sites',
      slug: 'due-diligence-achizitie-trei-situri',
      title: 'Cuantificarea riscului tehnic într-o achiziție cu trei situri',
      description:
        'Un cumpărător avea cinci săptămâni ca să stabilească starea tehnică a trei fabrici. Sinteza din prima săptămână a mutat prețul înainte de semnare.',
      sector: 'Producție industrială',
      location: 'România și sudul Ungariei',
      year: 2025,
      duration: '5 săptămâni',
      client: 'Un fond de investiții de talie medie',
      headline: {
        value: '2,4 mil. €',
        label: 'investiții necesare absente din prognoza vânzătorului',
      },
      summary:
        'Trei fabrici în funcțiune, evaluate până la o dată fixă de semnare, cu constatările clasificate după efectul asupra prețului și a calendarului.',
      services: ['technical-due-diligence', 'energy-and-efficiency-audits'],
      constraint: {
        heading: 'Constrângerea',
        body: [
          'Un cumpărător semnase termenii principali pentru un grup industrial cu trei fabrici și avea cinci săptămâni până la finalizare. Camera de date conținea un istoric de mentenanță, o prognoză de investiții și un registru de conformitate, toate întocmite de antreprenorul de mentenanță existent.',
          'Toate cele trei fabrici erau în funcțiune. Nimic nu putea fi deschis, oprit sau demontat, iar vizitele erau limitate la o zi pe fabrică, în prezența vânzătorului.',
        ],
      },
      approach: {
        heading: 'Ce am făcut',
        body: [
          'Am emis sinteza punctelor critice la finalul primei săptămâni, după cele trei vizite și înainte ca analiza să fie completă, pentru că o constatare ajunsă la echipa de tranzacție în săptămâna a cincea pierde patru săptămâni de poziție de negociere.',
          'Constatările au fost clasificate după efectul asupra tranzacției: cele care schimbau prețul, cele care schimbau calendarul și cele care nu schimbau niciuna, dar urmau să coste bani mai târziu.',
          'Am citit registrul de conformitate direct pe autorizații, nu pe propriul lui rezumat. Două dintre cele trei situri aveau autorizații cu condiții care nu supraviețuiau unei schimbări de control, situație recuperabilă, dar care trebuia începută înainte de finalizare, nu după.',
          'Prognoza de investiții a vânzătorului presupunea că instalația de aer comprimat de la una dintre fabrici fusese reabilitată în 2021. Consumul contorizat spunea altceva: puterea specifică era cu aproximativ 40 la sută peste ce ar consuma o instalație reabilitată de acea mărime. Reabilitarea fusese definită și ofertată, dar niciodată executată.',
        ],
      },
      outcome: {
        heading: 'Rezultatul',
        body: [
          'Am identificat 2,4 milioane de euro de investiții necesare pe cinci ani, absente din prognoza vânzătorului, din care 900.000 de euro în primele 18 luni.',
          'Condițiile din autorizații au fost ridicate înainte de finalizare, iar cererile de transfer au fost depuse la timp pentru a evita o întrerupere a autorizării la două situri.',
          'Cumpărătorul a finalizat la un preț redus. Nu am fost parte în negociere și nu știm ce proporție din diferență ne aparține, iar acesta este răspunsul onest la o întrebare care ni se pune des.',
        ],
      },
      reflection: {
        heading: 'Ce a făcut diferența',
        body: [
          'Consumul contorizat. Orice altă cale către întrebarea despre aerul comprimat trecea prin documente întocmite de antreprenorul existent, iar o fabrică în funcțiune îți spune despre ea însăși dacă o măsori.',
          'Raportarea în prima săptămână, nu în a cincea, este o alegere despre utilitate, nu despre rigoare. Raportul final a spus mai mult, dar până atunci cumpărătorul avusese deja patru săptămâni ca să acționeze pe partea care conta.',
        ],
      },
    },
  ]);
