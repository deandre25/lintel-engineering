import { company } from '../company';
import { legalPageSchema } from '../schema';

import type { LegalPage } from '../schema';

/**
 * Romanian legal pages.
 *
 * The legal notice carries the statement that Lintel Engineering is fictional
 * and this site is a demonstration project, in the same terms as the English.
 * It is not softened in either language.
 */

const addressLine = `${company.address.street}, ${company.address.postalCode} ${company.address.city}, ${company.address.country.ro}`;

export const privacy: LegalPage = legalPageSchema.parse({
  title: 'Cum sunt tratate datele personale pe acest site',
  description:
    'Ce date personale colectează acest site, temeiul juridic din articolul 6 GDPR, cât timp sunt păstrate și ce drepturi aveți conform articolelor 15-21.',
  updated: '2026-11-10',
  intro: `Această politică descrie ce se întâmplă cu datele personale pe care ni le transmiteți prin acest site. ${company.legalName} este operatorul acestor date, cu sediul în ${addressLine}.`,
  sections: [
    {
      heading: 'Ce colectăm și când',
      body: [
        'Acest site colectează date personale într-un singur loc: formularul de contact. Nimic altceva de pe site nu vă cere informații despre dumneavoastră și nu există niciun cont de creat.',
        'Când trimiteți formularul de contact, primim numele, compania, adresa de e-mail, tipul solicitării și mesajul introduse, împreună cu momentul trimiterii.',
      ],
      items: [
        {
          term: 'Nume și companie',
          description: 'Ca răspunsul să fie adresat unei persoane, nu unei adrese generice.',
        },
        {
          term: 'Adresa de e-mail',
          description: 'Ca să vă putem răspunde. Nu o folosim pentru nimic altceva.',
        },
        {
          term: 'Tipul solicitării și mesajul',
          description:
            'Ca solicitarea să ajungă la disciplina potrivită fără să fie redirecționată de două ori.',
        },
        {
          term: 'Momentul trimiterii',
          description:
            'Se înregistrează odată cu mesajul și este folosit pentru a detecta trimiterile automate, care sosesc neverosimil de repede după încărcarea paginii.',
        },
      ],
    },
    {
      heading: 'Temeiul juridic pe care ne bazăm',
      body: [
        'Prelucrăm mesajele din formularul de contact în temeiul interesului nostru legitim, conform articolului 6 alineatul (1) litera (f) din Regulamentul general privind protecția datelor. Interesul este acela de a răspunde unei solicitări pe care ați ales să ne-o trimiteți, iar îl considerăm echilibrat față de drepturile dumneavoastră pentru că dumneavoastră ați inițiat contactul, iar datele se limitează la ce este necesar pentru un răspuns.',
        'Bifați de asemenea o casetă de consimțământ înainte de trimitere, prin care confirmați că ați citit această politică. Acel consimțământ consemnează acordul de a fi contactat ca răspuns; el nu este temeiul juridic al prelucrării în sine, iar retragerea lui nu face nelegal un răspuns deja trimis.',
        'Dacă o solicitare devine o colaborare, datele trec în evidențele noastre obișnuite de client și sunt prelucrate în temeiul contractului dintre noi, conform articolului 6 alineatul (1) litera (b).',
      ],
    },
    {
      heading: 'Cât timp le păstrăm',
      body: [
        'Mesajele din formularul de contact se șterg la 24 de luni de la ultimul mesaj din corespondență, dacă solicitarea nu a devenit o colaborare.',
        'Acolo unde solicitarea a devenit o colaborare, evidențele se păstrează pe perioada cerută de legislația contabilă română și de răspunderea profesională, adică zece ani de la încheierea colaborării.',
      ],
    },
    {
      heading: 'Cine le mai vede',
      body: [
        'Mesajul este transmis printr-un procesator de formulare terț, care îl stochează doar cât durează livrarea către noi. E-mailul nostru este găzduit de un furnizor din Uniunea Europeană.',
        'Nu vindem date personale, nu le punem la dispoziție pentru publicitate și nu le transferăm în afara Spațiului Economic European.',
      ],
    },
    {
      heading: 'Drepturile dumneavoastră',
      body: [
        'Conform articolelor 15-21 din GDPR aveți dreptul să aflați ce date deținem despre dumneavoastră, să cereți rectificarea, ștergerea, restricționarea prelucrării, portarea datelor și să vă opuneți prelucrării întemeiate pe interesul legitim.',
        'Pentru oricare dintre ele, scrieți la adresa din capul paginii sau trimiteți-ne un e-mail. Răspundem în 30 de zile. Dacă nu sunteți mulțumit de răspuns, puteți depune o plângere la autoritatea română de supraveghere a protecției datelor.',
      ],
    },
    {
      heading: 'Informațiile cerute de articolul 13',
      body: [
        'Articolul 13 ne obligă să vă comunicăm anumite lucruri în momentul colectării datelor, iar această politică este locul unde o facem: cine este operatorul, ce colectăm, de ce, în ce temei, cât păstrăm, cine primește datele și ce drepturi aveți.',
        'Nu am desemnat un responsabil cu protecția datelor. Prelucrările noastre nu ating pragurile din articolul 37 care ar impune acest lucru, iar solicitările trebuie trimise la adresa de mai sus.',
      ],
    },
  ],
});

export const cookies: LegalPage = legalPageSchema.parse({
  title: 'Ce se stochează pe dispozitivul dumneavoastră',
  description:
    'Categoriile de cookie-uri folosite pe acest site, ce face fiecare, cât durează și cum vă puteți schimba oricând alegerea din subsolul paginii.',
  updated: '2026-11-10',
  intro:
    'Acest site stochează foarte puțin pe dispozitivul dumneavoastră și absolut nimic din categoriile de analiză sau preferințe până când nu sunteți de acord. Nimic de aici nu este folosit pentru publicitate.',
  sections: [
    {
      heading: 'Categoriile pe care le folosim',
      body: [
        'Cookie-urile de pe acest site se împart în trei categorii. Doar prima este setată înainte de alegerea dumneavoastră.',
      ],
      items: [
        {
          term: 'Necesare',
          description:
            'Un singur cookie, care reține alegerea făcută în bannerul de consimțământ, ca să nu fiți întrebat pe fiecare pagină. Durează douăsprezece luni și nu conține nimic altceva decât alegerea. Nu poate fi dezactivat, pentru că dezactivarea este ea însăși o alegere care trebuie reținută.',
        },
        {
          term: 'Analiză',
          description:
            'Măsurare agregată a paginilor citite și a modului în care ajung vizitatorii. Inactivă până când o acceptați. Fără urmărire între site-uri și fără identificatori publicitari. Dacă refuzați, scriptul de analiză nu este încărcat deloc, nu încărcat și instruit să se poarte frumos.',
        },
        {
          term: 'Preferințe',
          description:
            'Rețin opțiuni de interfață pe care le faceți, de exemplu limba în care ați citit ultima dată site-ul. Inactive până la acceptare, iar site-ul funcționează identic fără ele.',
        },
      ],
    },
    {
      heading: 'Ce se întâmplă dacă refuzați',
      body: [
        'Dacă respingeți categoriile de analiză și preferințe, scripturile din spatele lor nu sunt cerute niciodată. Puteți verifica asta în fila de rețea a browserului: refuzul înseamnă că nu se face nicio cerere către furnizorul de analiză.',
        'Respingerea a tot ce este opțional se face cu un singur clic, în aceeași poziție și cu aceeași vizibilitate ca acceptarea.',
      ],
    },
    {
      heading: 'Dacă vă răzgândiți',
      body: [
        'Alegerea se reține douăsprezece luni, după care întrebăm din nou.',
        'O puteți schimba oricând din legătura către setările de cookie-uri aflată în subsolul fiecărei pagini. Schimbarea are efect imediat, iar retragerea consimțământului pentru analiză oprește încărcarea scriptului începând cu pagina următoare.',
      ],
    },
    {
      heading: 'Cookie-uri pe care nu le folosim',
      body: [
        'Pe acest site nu există cookie-uri publicitare, cookie-uri de rețele sociale, urmăritoare între site-uri sau amprentare a dispozitivului. Nu există conținut încorporat de la terți care să seteze propriile cookie-uri.',
      ],
    },
  ],
});

export const terms: LegalPage = legalPageSchema.parse({
  title: 'Termeni de utilizare a acestui site',
  description:
    'Termenii care acoperă utilizarea acestui site: la ce folosește conținutul, limitele informațiilor de pe el și cum diferă contractele profesionale.',
  updated: '2026-11-10',
  intro: `Acești termeni acoperă utilizarea acestui site. Ei nu acoperă colaborările profesionale cu ${company.legalName}, care sunt guvernate de fiecare dată de un contract scris separat.`,
  sections: [
    {
      heading: 'La ce folosește conținutul acestui site',
      body: [
        'Materialul de pe acest site descrie serviciile pe care le oferim și felul în care le abordăm. Este informație generală, nu consultanță inginerească, și nu înlocuiește evaluarea propriului dumneavoastră proiect.',
        'Nimic de pe acest site nu creează o relație profesională între noi. Acea relație începe după ce am convenit în scris obiectul lucrării și ambele părți l-au semnat.',
      ],
    },
    {
      heading: 'Acuratețea și limitele ei',
      body: [
        'Standardele, normativele și anexele naționale se schimbă. Paginile acestui site descriu situația de la data la care au fost scrise, iar noi nu ne angajăm să revizuim fiecare pagină ori de câte ori un standard este modificat.',
        'Studiile de caz descriu lucrări încheiate. Rezultatele sunt specifice circumstanțelor acelor proiecte și nu implică un rezultat similar pentru alt proiect.',
      ],
    },
    {
      heading: 'Răspundere',
      body: [
        'Nu ne asumăm răspunderea pentru decizii luate pe baza informațiilor generale de pe acest site. Răspunderea care decurge dintr-o colaborare profesională este guvernată de termenii acelei colaborări, inclusiv de limitele de răspundere convenite în ea.',
        'Nimic din acești termeni nu limitează răspunderea pentru deces sau vătămare corporală cauzate din neglijență ori pentru fraudă, acolo unde o astfel de limitare ar fi nelegală.',
      ],
    },
    {
      heading: 'Proprietate intelectuală și legături',
      body: [
        'Textele, desenele și grafica de pe acest site ne aparțin. Puteți cita din ele cu atribuire și cu o legătură către sursă. Nu le puteți reproduce integral și nu le puteți prezenta ca fiind ale dumneavoastră.',
        'Când facem legătura către alt site, o facem pentru că materialul ni se pare util. Nu controlăm acele site-uri și nu răspundem pentru conținutul lor.',
      ],
    },
    {
      heading: 'Legea aplicabilă',
      body: [
        'Acești termeni sunt guvernați de legea română, iar instanțele din România sunt competente pentru orice litigiu decurgând din utilizarea acestui site.',
      ],
    },
  ],
});

export const legalNotice: LegalPage = legalPageSchema.parse({
  title: 'Date de identificare și informații despre site',
  description:
    'Datele de identificare ale societății Lintel Engineering SRL, adresa, modul de contact și precizarea că acesta este un proiect demonstrativ.',
  updated: '2026-11-10',
  intro: `Date de identificare pentru ${company.legalName}, publicate așa cum se cere unei societăți care operează în România.`,
  sections: [
    {
      heading: 'Acesta este un proiect demonstrativ',
      body: [
        'Lintel Engineering este o companie fictivă. Acest site este un proiect demonstrativ, construit pentru a arăta cum se proiectează, se scrie și se dezvoltă un site corporativ de acest fel.',
        'Compania nu există. Persoanele numite în pagina Despre noi sunt inventate, studiile de caz descriu lucrări care nu au fost niciodată executate, iar numerele de înregistrare, adresa, numărul de telefon și adresa de e-mail de mai jos sunt fabricate și nu identifică nicio entitate reală.',
        'Niciun serviciu descris pe acest site nu este disponibil spre achiziție și nicio afirmație de pe el nu trebuie luată ca atare. Nimic de aici nu constituie o declarație despre vreo firmă de inginerie reală.',
      ],
    },
    {
      heading: 'Date de identificare',
      body: [
        'Datele de mai jos sunt inventate și sunt prezentate în forma în care le-ar publica o societate română.',
      ],
      items: [
        { term: 'Denumire', description: company.legalName },
        { term: 'Sediu social', description: addressLine },
        {
          term: 'Număr de ordine în registrul comerțului',
          description: company.registration.tradeRegister,
        },
        { term: 'Cod de identificare fiscală', description: company.registration.vatId },
        { term: 'E-mail', description: company.contact.email },
        { term: 'Telefon', description: company.contact.phoneDisplay },
      ],
    },
    {
      heading: 'Răspunderea pentru conținut',
      body: [
        'Pentru o societate reală, răspunderea pentru conținutul acestui site ar reveni conducerii, la sediul social de mai sus.',
        'Pentru că societatea este fictivă, răspunderea editorială revine autorului proiectului demonstrativ, iar codul sursă este publicat spre consultare.',
      ],
    },
    {
      heading: 'Reglementare profesională',
      body: [
        'O firmă reală de consultanță inginerească din România ar enumera aici organizațiile profesionale la care sunt înscriși inginerii săi, împreună cu registrul și regulile de conduită profesională aplicabile.',
        'Lintel Engineering nu deține astfel de înscrieri, pentru că nu există. Pe acest site nu este revendicată nicio certificare, acreditare sau calitate de membru al vreunei organizații profesionale.',
      ],
    },
  ],
});
