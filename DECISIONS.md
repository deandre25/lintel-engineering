# Decisions and trade-offs

One entry per non-obvious technical choice, newest last within each phase.
This file is the source for the "decisions and trade-offs" section of the README.

## Phase 1 — Foundation

### 2026-11-10 — TypeScript 6.0 rather than 7.0

TypeScript 7.0.2 is the current stable release, but `typescript-eslint` 8.72
declares `typescript >=4.8.4 <6.1.0`, so pairing them would mean no type-aware
linting. The rules that enforce the brief's "zero `any`" target
(`no-unsafe-assignment`, `no-unsafe-call`, `no-unsafe-return`) are all
type-aware, so losing them would move that guarantee from CI into code review.
TypeScript 6.0.3 is the newest release that keeps both. Revisit when
typescript-eslint supports the 7.x series.

### 2026-11-10 — ESLint 9 rather than 10

`eslint-plugin-jsx-a11y` 6.10.2, a dependency of `eslint-config-next`, supports
ESLint up to 9. Installing ESLint 10 requires overriding that peer range, which
risks silently breaking accessibility rules — the one rule set the brief treats
as a build failure. Pinned to 9.39.5 until the plugin ships ESLint 10 support.

### 2026-11-10 — Localised slugs without middleware

§8 requires localised paths (`/ro/servicii`), and §2 forbids a server-side
runtime. `next-intl`'s `pathnames` option resolves localised paths in
middleware, which is a request-time function, so the two requirements conflict.

Resolution: a single route registry in `src/lib/routing.ts` owns every path, and
`next.config.ts` turns it into build-time `rewrites` — routing-table entries
resolved before any function runs. `/ro/servicii` is served by the prerendered
`/ro/services` page with no invocation. The internal spelling redirects (308) to
the localised one, so each page has exactly one indexable URL.

Verified by request: `/en/services` 200, `/ro/servicii` 200 via rewrite,
`/ro/services` 308 to `/ro/servicii`.

Trade-offs: the file-system route keeps the English spelling, so the app tree
and the URLs differ — `matchRoutePath` accepts both spellings to compensate. In
exchange, adding a locale is a message file plus one line per route, with no
runtime cost, and `output: 'export'` stays available if the hosting target
changes. The alternative — a separate `app/en` and `app/ro` tree — would make
the URLs literal but duplicate 15 route files per locale.

### 2026-11-10 — `next-intl` for messages only, not for navigation

Following from the decision above, `defineRouting` is configured without
`pathnames` and the navigation APIs are unused. `next-intl` provides messages,
ICU formatting and `Intl` wrappers; URLs come from the registry. Keeping one
owner for URLs avoids two mechanisms disagreeing about what a path is.

### 2026-11-10 — Messages imported statically and checked against English

`messages/*.json` are imported statically, not through a templated dynamic
`import()`, for two reasons: a templated dynamic import resolves to `any`, which
§2 forbids; and `satisfies Record<Locale, typeof en>` makes Romanian
structurally checked against English, so a message added to one locale and
forgotten in the other fails `tsc` rather than appearing as a missing string on
a page. Both files are a few kilobytes and every page is prerendered, so nothing
is paid per request. `src/types/next-intl.d.ts` extends the same types to
`useTranslations`, making a mistyped message key a compile error.

### 2026-11-10 — No `NextIntlClientProvider`, and client components take strings as props

The provider would ship the message catalogue and next-intl's ICU runtime to the
browser — about 11 KB gzipped on every page, measured. Instead the two client
components receive their strings as props from the server, and the provider is
absent. Adding a client component that calls `useTranslations` means
reintroducing it and paying for it; the tree is arranged so that is a visible
decision rather than a default.

### 2026-11-10 — `exactOptionalPropertyTypes` disabled

Enabled initially, beyond the brief's requirement. `next/link`'s published prop
types declare optional handlers without `| undefined`, so passing spread props
to `Link` is an error under the flag, and the only workarounds are casts the
brief forbids. The flag was removed rather than worked around; `strict` and
`noUncheckedIndexedAccess`, which the brief does require, remain on, along with
`noUnusedLocals`, `noUnusedParameters`, `noImplicitOverride` and
`noFallthroughCasesInSwitch`.

### 2026-11-10 — First-load JS is measured from the prerendered HTML

Turbopack builds emit no `app-build-manifest.json` and the build summary no
longer prints per-route sizes, so `scripts/report-bundle-size.mjs` reads each
prerendered document and sums the gzipped size of exactly the scripts it asks
the browser to fetch. Scripts marked `noModule` are reported separately rather
than counted: no browser that supports ES modules downloads them, so including
them would overstate what a visitor receives by 38.6 KB.

### 2026-11-10 — First-load JS budget restated from 110 KB to 140 KB

The brief's original figure was 110 KB gzipped. Measured on the Phase 1 shell:

| Build     | Modern browsers | `noModule` legacy bundle |
| --------- | --------------- | ------------------------ |
| Turbopack | 136.6 KB        | 38.6 KB                  |
| webpack   | 135.8 KB        | 38.6 KB                  |

The decisive measurement is that `/_not-found`, a route with no client
components whatsoever, measures the same. The weight is therefore the React 19 /
Next 16 hydration baseline, not application code — of which there is roughly
5 KB. Reaching 110 KB would mean changing framework, not optimising this one.

The outcomes the budget existed to protect are all met on a throttled mobile
profile: Lighthouse Performance 100, LCP 0.76 s, CLS 0.000, TBT 12-75 ms.

Decision: budget restated to 140 KB — the measured baseline plus about 3 KB of
headroom — and the framework stays. The CI gate enforces 140 KB, so a real
regression still fails the build; the gate was not switched off. Approved at
GATE 1.

### 2026-11-10 — Contrast is asserted against the stylesheet, not a copy

`src/lib/tokens.ts` parses `src/styles/tokens.css` and the unit suite asserts a
ratio for every text and interface pairing the components use. A duplicated
table of colour values in TypeScript would drift from the CSS, and a drifted
copy reports passes that are not real. The first run of this suite caught a real
failure: the footer disclosure used `--ink-400` on `--ink-900` at 3.4:1.

### 2026-11-10 — Best Practices 96 was a missing icon, not a missing CSP

Four points were lost to a single weighted audit, `errors-in-console`: with no
`<link rel="icon">` the browser falls back to `/favicon.ico`, receives a 404 and
logs a console error. Lighthouse scores `csp-xss` at weight 0, so the
Content-Security-Policy work in Phase 6 could never have moved this number.

Fixed by `src/app/icon.svg`, the brand lintel drawn for legibility at 16 px.
Two colours only, because a third is mud at that size.

### 2026-11-10 — The unit suite asserts behaviours, not examples

The suite reached 55 tests at the end of Phase 1, which is more than §13 budgets
for the whole project. The cause was parameterisation: 19 of them were one `it`
per colour pairing, generated in a loop, which inflates the count without adding
coverage. None of them asserted that a component rendered without asserting
something about what it rendered — there are no component tests yet at all.

Consolidated to 18 tests with identical coverage, grouped by behaviour rather
than by example. The contrast checks now iterate internally and collect every
failing pairing before asserting, so one run reports the whole problem instead
of stopping at the first pair.

Verified by mutation rather than by inspection: changing `--ink-400` from
`#606a79` to `#8a94a3` fails the suite with
`ink-400 on paper (muted text and metadata) is 2.8:1` and the sunken-panel pair
alongside it. A consolidated test that could not fail would be worse than the 19
it replaced.

### 2026-11-10 — The locale layout is the root layout

`app/layout.tsx` was initially a passthrough that returned `children`, with
`<html>` in `app/[locale]/layout.tsx`. That made `locale` a child param rather
than a root param, and `next/root-params` reported none, which would have forced
the deprecated `requestLocale` API. Removing the passthrough makes the locale
layout the root layout and `locale` a typed root param, which is also what keeps
every page statically rendered without per-page `setRequestLocale` calls.

## Phase 2 — Design system

### 2026-11-10 — Actions are buttons, navigation is links, and they share only styling

`Button` renders a `<button>` and never an anchor; `ButtonLink` renders a link
and never a button. They share `buttonClassName` so they look identical, but
neither pretends to be the other. The alternative — one polymorphic component
with an `as` prop — reliably produces anchors without `href` and buttons that
navigate, which breaks Space versus Enter, middle-click and the context menu.

`Button` also defaults `type` to `button` rather than `submit`, because a button
inside a form with no explicit type submits it, which is the most common way a
secondary control becomes an accidental submission.

### 2026-11-10 — Disabled states use inert tokens, not opacity

`opacity-50` composites an element's label and fill together against the page.
On the primary button that lands at roughly 3.1:1, and it renders as a
translucent grey blob beside hairline-bordered buttons. Disabled states are now
explicit tokens — `--ink-200` fill with an `--ink-600` label at 7.1:1 — which
stays on the palette and keeps the label readable.

WCAG exempts inactive controls from contrast requirements, so axe never flagged
this. §6 asks for every text pairing to be verified, so the disabled label is in
the asserted pairing list like any other.

### 2026-11-10 — `Field` passes attributes to the control instead of rendering it

`Field` takes a function and calls it with `id`, `name`, `aria-describedby`,
`aria-invalid` and `aria-required`. It therefore wires an input, a textarea and
a select identically without knowing which it holds, and in Phase 6 the same
object can be spread alongside `react-hook-form`'s `register()`.

Two details are deliberate. `aria-describedby` points at the hint and the error
together, so the error supplements the guidance rather than replacing it. The
`aria-live` region is always mounted, including while the field is valid:
rendering it only on error means assistive technology is not yet observing the
node when the message arrives, and the announcement is missed.

### 2026-11-10 — `Disclosure` is a button, and the panel unmounts

§11 asks for a real `button` with `aria-expanded` rather than a styled
`<details>`, which cannot be animated reliably and whose open state is not
exposed consistently across screen-reader pairings.

The panel is unmounted when closed rather than hidden with CSS, so links inside
it cannot be reached by Tab while invisible — the usual keyboard trap in an
accordion. The accessibility suite scans the styleguide twice, once with a
disclosure expanded, because a collapsed panel's contents are not in the DOM to
be scanned.

### 2026-11-10 — The contrast table and the contrast test read one list

`src/lib/contrastPairs.ts` holds every pairing. The unit suite asserts the
ratios and the styleguide prints them, both computed from
`src/styles/tokens.css` at build time. Keeping two lists would let the published
figures drift from the asserted ones, which is precisely how a contrast table
stops being evidence and becomes decoration.

### 2026-11-10 — The styleguide lives under `[locale]`

§16 calls it `/styleguide`. The locale layout is the root layout and owns
`<html>`, so a page outside `[locale]` would have no document shell. It is
therefore `/en/styleguide`, registered in the route registry with
`noindex: true`, which both emits `robots: noindex, nofollow` and excludes it
from `indexableRouteIds()` and so from the sitemap in Phase 5.

Its copy is English-only and written inline, outside the content modules and the
message catalogue, because it is scaffolding read by developers rather than
content read by visitors.

### 2026-11-10 — Prose styles are hand-written CSS, not utilities

Long-form typography has to reach markup that MDX generates, which cannot carry
utility classes, so the rules live under `.prose` in `globals.css`. Written by
hand rather than with a typography plugin: §2 rules out installing a component
library, and the vertical rhythm is one of the things being demonstrated.
Spacing is `margin-top` on following siblings, so the first element in a prose
block never introduces space above itself.

### 2026-11-10 — Disabled appearance has no unit test, by decision

The disabled-state bug above reached a green test run: no unit test covered how
a disabled button looks, and it was caught by screenshotting the styleguide and
reading the rendered class list.

A unit test would have to assert class names, which tests the implementation
rather than the result and breaks on every refactor. The correct home for this
is the Phase 7 visual-regression baseline on `/styleguide`, which already
renders every component in every state, including disabled.

Recorded here so the gap is known and dated rather than discovered later. Until
Phase 7 commits those baselines, component appearance is covered by review, not
by CI.

### 2026-11-10 — The README will describe how the project was built

§15 lists the README's contents. One section is being added beyond that list: a
short "How this project was built", covering spec-driven development from
`PROJECT_BRIEF.md`, the phased structure with a review gate per phase, and
AI-assisted implementation with human verification at each gate. It will name
the disabled-state failure and how it was caught as the concrete example.

The workflow is visible rather than hidden because the alternative invites the
reviewer to guess, and because the verification record is the part worth
showing. Written in Phase 8 with the rest of the README.

### 2026-11-10 — Commit authorship stays as it is

Commits are authored `deandre25 <deyneka2003@gmail.com>`. The public address on
the GitHub account is `andrii.deineka.fe@gmail.com`, which is being verified
there so the existing history links to the profile. History is therefore not
rewritten again — rewriting it would change every commit hash to fix something
GitHub resolves on its own once the address is verified.

## Phase 3 — Content

### 2026-11-10 — Editorial rules are enforced by the content schema

§5 bans a list of vocabulary and requires sentence-case headings without
terminal punctuation; §9 requires meta descriptions between 140 and 160
characters. These are checked in `src/content/schema.ts` rather than left to
review, so a phrase cannot reach a page through a late edit.

The length rule earned its place immediately: it rejected six descriptions
across the two locales that read fine and were between 131 and 139 characters.
None would have been noticed by eye.

The banned-phrase check is a substring match with deliberately narrow
boundaries — "robust solutions" is banned, "robust" describing a weld is not —
because a check that produces false positives gets disabled.

### 2026-11-10 — Entities carry a locale-independent id alongside a localised slug

Slugs are localised, so they cannot link a page to its translation. Each
service, case study and article therefore carries an `id` as well as a `slug`,
and the English slug is used as the id: it is already unique and stable, and it
keeps the registry readable.

`translateSlug` in `src/content/registry.ts` resolves a localised slug to its
counterpart through that id, and is the function `alternateRoutePath` takes. It
is what makes the language switcher land on the same article rather than on the
locale home, which §8 calls out as the part most implementations skip.

Cross-references — `service.relatedCaseStudy` and `caseStudy.services` — are
stored as ids rather than localised slugs for the same reason.

### 2026-11-10 — Cross-module integrity is tested, not validated at build time

Zod validates each content module in isolation, which cannot see that a
Romanian case study references a service that does not exist or that the two
locales have drifted apart. Those invariants are asserted in
`tests/unit/content/integrity.test.ts`: identical entity ids across locales,
unique slugs within a locale, slug translation round-tripping in both
directions, cross-references resolving, every article attributed to somebody on
the team page, and discipline headcounts summing to the company total.

Seven tests, bringing the suite to 36. They were put in the suite rather than in
the registry's module scope because a failing assertion in a test names the
offending entity, while a thrown error at import time fails the build with a
stack trace into a content file.

### 2026-11-10 — Romanian is an adaptation, not a translation

Where an English turn of phrase would not carry, it is replaced with a plain
statement rather than calqued. Three places where the English leans on an
idiom read differently in Romanian, and are listed in the Phase 3 report for a
native speaker to confirm.

Standards keep their published designations — Eurocod, EN ISO 13849, ISO 19650 —
because translating a standard's name makes it unfindable.

The README will state that a native speaker should review the Romanian before
any real use, as §5 requires.

### 2026-11-10 — The fictional-company statement is separate from declining to claim accreditation

These were conflated in the Phase 3 copy review. Declining to claim
certification makes the firm sound careful; it does not disclose anything. The
explicit statement that Lintel Engineering is fictional and that this site is a
demonstration project appears as the first section of the legal notice in both
locales, in the footer of every page, and in the README. It is not softened and
it is not implied.

## Phase 4 — Sections and pages

### 2026-11-10 — Two-column layouts engage at 1024px, not 768px

The sections were first written with `md:` (768px) splits. At exactly 768 the
hero gave its display type a 435px column and the lead a 5/12 tower, and the
explanatory sections cut the measure to roughly 48 characters. Every two-column
split now starts at `lg:` (1024px), so tablet width is a single column at full
measure. Caught by screenshotting 768 rather than by any test.

### 2026-11-10 — Sections take render props for their links

§7 requires section components to receive typed content and know nothing about
routing or locale. Links inside a section are therefore passed in from the page,
which is the only layer allowed to know both. `DisciplineList` and
`CaseStudyGrid` take `renderServiceLink` and `renderLink`; the sections
themselves import nothing from the routing layer.

### 2026-11-10 — Page params are typed as strings and narrowed

Typing a page's `params` as `{ locale: Locale }` is a lie: Next passes whatever
is in the URL. It held until `/de` was requested, when the content lookup
returned `undefined` and the page threw a 500 where it should have answered 404.
Pages now take `{ locale: string }` and narrow through `requireLocale`, which
calls `notFound()`. Caught by the existing e2e test, which asserted 404 and got 500.

### 2026-11-10 — `readColorTokens` takes no path argument

The function had an optional path parameter that was only ever used by its
default. Next's static analysis could not prove what was being read and traced
the entire project into the server output, warning that this bloats a
deployment. Reading the module constant directly removes the warning and the
parameter nobody used.

### 2026-11-10 — The inverse button variant

The closing section sits on `--ink-900`, where the primary button's dark fill is
invisible. A fourth variant inverts it — a paper fill with an `--ink-900` label
at 17.2:1 — and its disabled state uses `--ink-600` with `--ink-200` at 7.1:1.
Both pairings are in the asserted contrast list.

### 2026-11-10 — The Romanian names reserved roles the English does not

The English service pages decline to claim accreditation in general terms. The
Romanian pages name three specific roles — `verificator de proiecte atestat`,
`expert tehnic atestat` and `auditor energetic autorizat` — and state that
Lintel holds none of them.

**This asymmetry is correct and must not be "fixed" into a literal match.**
Those roles are reserved in Romanian law, and a reader in the sector reads a
service name as a claim to the attestation. The English has no such reading,
because the roles do not exist in English. Localisation means saying what a
reader of that language will understand, which here means saying more.

Three Romanian service labels were renamed for the same reason, because a name
in navigation, a card or a page title carries no disclaimer beside it:

| Was                                   | Now                                  |
| ------------------------------------- | ------------------------------------ |
| Audit energetic                       | Eficiență energetică și conformitate |
| Verificarea proiectelor               | Analiza independentă a proiectelor   |
| Certificarea construcțiilor existente | Evaluarea construcțiilor existente   |

In each pair the regulated word was the second one. The Romanian home page's
meta description lost "certificare structurală" for the same reason: a meta
description appears in search results with nothing beside it.

### 2026-11-10 — Working practice: an edit that does not match must fail loudly

Three edits in Phase 4 and one in Phase 2 silently did nothing. The cause is
the same each time: `prettier-plugin-tailwindcss` reorders class lists after a
file is written, so an edit matching remembered text no longer matches the file.
A string replacement that finds nothing is not an error by default — it writes
the file back unchanged and reports success.

The practice, from here on: read the file as it currently stands before editing
it; make every replacement assert that its target was found and abort if it was
not; and verify the result by grepping for the new text rather than trusting the
exit code. The Phase 2 instance shipped a visual regression through a green test
run, which is what makes this worth writing down rather than remembering.

### 2026-11-11 — The 404: a formal defect with demonstrated zero user impact

There are two 404 boundaries, and only one is affected.

**Paths under a valid locale** — a mistyped URL such as `/en/servces`, or an
unknown slug that makes a page call `notFound()` — render through
`[locale]/not-found.tsx` inside the locale layout. The document carries the
correct `lang`, the header and the footer. There is no defect here. A catch-all
at `[locale]/[...rest]` is what routes mistyped paths to this boundary rather
than to the global one; it is the single route that is not prerendered, because
the set of paths that do not exist cannot be enumerated, and it resolves no data
and renders no content.

**Paths with no usable locale prefix** — `/garbage`, or an unknown locale such
as `/de`. The root layout lives at `[locale]/layout.tsx`, which is what makes
`locale` a typed root param and keeps every page static, so there is no root
layout for Next to wrap the global boundary in. Next emits the `<html>` itself,
without `lang`. Rendering an `<html>` in the component produces one nested
inside another, and `experimental.globalNotFound` did not change the behaviour.

This is a formal defect, not a compromise, and the evidence is in the markup:
the page is bilingual and **every block carries its own `lang`**, so no text on
it inherits language from the document. A screen reader is given the correct
language for everything it reads. What is missing is the attribute the
`html-has-lang` rule looks for, and nothing a user experiences.

The scope is narrower still: a visitor only reaches this boundary through a
broken inbound link or a typed URL with no valid locale, never through
navigation within the site, because every in-site link is generated from the
route registry.

The suite reflects this exactly. The locale 404 is asserted with no exclusion
at all. The global one excludes one rule, `html-has-lang`, and asserts the
per-block `lang` attributes in its place.

Two ways to close it, neither taken: reintroduce `app/layout.tsx` as the root
layout, which demotes `locale` from a root param and returns `getRequestConfig`
to the deprecated `requestLocale`; or wait for `globalNotFound` to support a
root layout that is a dynamic segment. Trading a working i18n setup for one
attribute on one unreachable-by-navigation page is the wrong way round.

Diagnosed with a browser rather than with `curl`: the 404 body arrives as an RSC
payload and is rendered client-side, so `curl` sees only the shell and reports a
missing `lang` on both boundaries. The first two readings of this were wrong for
that reason.

### 2026-11-11 — The header navigation moves to 1024px too

Screenshotting all thirteen templates at three widths in both locales found a
5px horizontal scroll on **every Romanian page at 768px** and on no English
page at any width. The cause was the header: Romanian navigation labels are
longer, and the nav, locale switcher and contact button together overflowed the
gutter by 5px.

The fix is the same one the sections already had — the desktop navigation now
appears at `lg` rather than `md`, so 768px uses the compact navigation like
every other two-column layout on the site. The site now has one breakpoint
story rather than two.

This is the second defect found only by looking at the middle width, after the
hero at 768 in Phase 4. Both were invisible at 390 and 1440, and neither would
have failed a test. The screenshot sweep is now scripted and asserts no
horizontal overflow on any template at any width in either locale, which turns
the check into something repeatable rather than something remembered.

### 2026-11-11 — The country's name is localised; the country code is not

`company.ts` holds facts that do not change with language, but the name of a
country is a word, and the Romanian pages were printing "Romania" where a
Romanian reader expects "România". It is now a localised string like the
positioning line, while `countryCode` stays a single `RO` because an ISO code
is not language-dependent.

Found by reading the rendered Romanian contact page, not by a test. The address
is assembled from `company.ts` in four places, all of which already knew their
locale, so nothing else had to change.

## Phase 5 — SEO

### 2026-11-11 — Verifying a client-rendered application: `curl` gives you the shell, not the page

The 404 diagnosis in Phase 4 was wrong twice for one reason. The page body
arrived as an RSC payload and was rendered by the browser, so `curl` saw the
document shell and nothing inside it, and reported a missing `lang` on both
boundaries when only one was affected.

**The rule: `curl` shows what the server sent, a browser shows what the user
gets, and in a client-rendered application those are different documents.**
Choosing between them is choosing which question is being asked:

| Question                                         | Instrument                                          |
| ------------------------------------------------ | --------------------------------------------------- |
| What does a user experience?                     | A browser, against the production build             |
| What does a crawler that runs no JavaScript see? | `curl` or view-source, against the production build |
| What does the application do once hydrated?      | A browser's inspector                               |

The inversion matters in this phase. Everything SEO depends on — `hreflang`,
canonical, JSON-LD, Open Graph tags — counts only if it is in the HTML the
server sent. A tag that appears after hydration does not exist for a crawler.
So Phase 5 is verified with `curl` against `.next/server/app/**/*.html`, for
exactly the reason `curl` was the wrong tool for the 404.

A finding that rests on a measurement is reported with the instrument that
produced it. That is the part that would have caught this in the first report
rather than the third.

### 2026-11-11 — Two defects, both at the middle width, both locale-dependent

The hero at 768 and the header overflow at 768 were each invisible at 390 and
1440, and the second was invisible in English at every width. Width and locale
are easy to test one at a time and easy to miss together.

The screenshot sweep now covers every template at three widths in both locales
and asserts no horizontal overflow, which turns a manual find into a standing
check rather than something to remember.

### 2026-11-11 — `next/og` emits static PNGs; it was confirmed before the routes were written

§2 forbids a server runtime and `ImageResponse` renders per request by default,
so the first thing built in this phase was one OG route with
`generateStaticParams`, to check the build output before writing fourteen more.

It emits real files: `.next/server/app/en/opengraph-image.body` is
`PNG image data, 1200 x 630, 8-bit/color RGBA`. Twenty-eight PNGs are produced
at build time, one per page per locale, and no function runs to serve them.

The cards use the system sans rather than the site's display face.
`ImageResponse` needs raw font bytes, and `next/font` keeps its copies under
hashed names in the build output that source cannot address; committing a
second copy of a font the site already ships would be a duplicate asset to keep
in step. The layout, the rule and the lintel mark carry the brand instead.

Satori lays out with flexbox only and rejects any element with more than one
child that has no explicit `display`. Two such elements failed the build before
the first PNG appeared, which is the kind of thing that is cheaper to meet on
one route than on fifteen.

### 2026-11-11 — Permanent redirects are 301, not Next's 308

`permanent: true` emits 308, which preserves the request method. §9 asks for
301 and, for navigational URLs that are only ever fetched with GET, 301 is also
what every log analyser and SEO audit expects on a migration. The redirect
rules therefore carry `statusCode: 301` rather than `permanent`.

One exception is not ours: a trailing slash is stripped by Next's own
`trailingSlash: false` handling, which answers 308 before any configured rule
is reached. The destination is correct either way, so the explicit rule stays
as a statement of intent and the test accepts either status.

The redirect from `/` to the default locale stays temporary (307): which locale
is the default is a decision that can change, and a permanent redirect would
outlive it in caches.

### 2026-11-11 — JSON-LD is validated against the real vocabulary, in CI

§9 asks for every type to be validated against schema.org.
`scripts/validate-jsonld.mjs` downloads the published vocabulary, reads every
JSON-LD block out of the prerendered HTML, and checks three things per node:
the type exists, every property exists, and every property is within its
declared domain, following the type's supertype chain.

It reads the build output rather than a running server, for the reason recorded
at the top of this phase: structured data that only appears after hydration does
not exist for a crawler.

It earned its place on the first run by rejecting `availableLanguage` on
`Service` — schema.org puts that property on `ContactPoint` and
`ServiceChannel`. Twelve pages carried it. A reviewer checking one page by eye
would have had to know the domain of that property to catch it.

Shape is asserted in the unit suite; validity is asserted against the
vocabulary in CI. Copying the vocabulary into a test would be copying something
that drifts.

### 2026-11-11 — robots.txt allows the styleguide, because `noindex` needs to be read

The first version disallowed `/en/styleguide` and `/ro/styleguide` while the
pages also carried `noindex`. Those two instructions work against each other: a
crawler has to fetch a page to see its `noindex`, and `Disallow` guarantees it
never does. A disallowed URL can still surface as a bare link with no
description if anything points at it, and the `noindex` never takes effect.

Allowing the crawl is what lets the `noindex` be obeyed, so the `Disallow`
lines are gone and the meta stays. The `Host` directive is also gone: it is a
Yandex extension that Google ignores, and the canonical tags already state the
preferred origin.

### 2026-11-11 — Case studies are `Article`, not `CreativeWork`

`CreativeWork` is the generic supertype and asserts almost nothing. A case
study here is a written narrative with a headline, a date and an author, which
is what `Article` describes, and `Article` is the type that carries article
rich results. The more specific type is both the more accurate one and the more
useful one.

The author is the organisation rather than a person: these are written by the
practice, and naming an individual would be inventing an attribution.

### 2026-11-11 — Romanian LCP is consistently ~150 ms higher, and it is the locale

Both locales score 100 for performance in 19 of 20 runs; the earlier readings
of 99 were variance. The LCP difference is not.

| Run order         | `/en` median LCP | `/ro` median LCP |
| ----------------- | ---------------- | ---------------- |
| en first, then ro | 758 ms           | 908 ms           |
| ro first, then en | 758 ms           | 909 ms           |

Five runs per locale per order. Reversing the order was to separate the locale
from thermal or cache drift across a single session, and it did: Romanian is
slower in both orders, by the same amount, with a spread of under 10 ms.

What it is not: the documents differ by 749 bytes and 120 characters of visible
text, and both locales preload exactly the same four font files.

The probable cause, stated as a hypothesis rather than a finding: Romanian text
needs glyphs from the `latin-ext` subset — ă, â, î, ș, ț — while the English
page is served entirely by `latin`. First paint on the Romanian page therefore
waits on a second, larger font file. It is consistent with the measurement and
with the fact that FCP, Speed Index and LCP are identical within each run,
which means a single paint rather than a reflow.

Recorded rather than resolved. It is 150 ms inside a budget of 1500 ms, and the
fix — subsetting the two faces into one file per locale — is a change to the
font pipeline that Phase 8 is the place for.
