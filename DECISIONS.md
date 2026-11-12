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

### 2026-11-12 — The 404: where §2 and §10 cannot both be satisfied

Two boundaries, and only one is affected.

**Any path under a valid locale** — a mistyped URL, or an unknown slug that
makes a page call `notFound()` — is answered from the prerendered 404.
`dynamicParams = false` on the three slug routes is what does that: without it
Next renders an unknown slug on demand, and a request-time payload cannot be
hashed. The page is CSP-clean, carries its full content, and has its own
chrome.

**A path whose first segment is not a valid locale** — `/garbage`, `/de` — is
the one page Next still renders per request. Its hydration payload embeds the
requested path, so `/aaa` and `/zzz` produce different payloads and no
build-time hash can cover them. Measured:

```
/aaa                   len=9322   sha256-7io+gc8oL/ikzba5…
/bbb-different-length  len=9410   sha256-r+CcpmrYJkXca4i9…
/zzz                   len=9322   sha256-UtSwhi7sz+mNwB5w…
```

CSP blocks the script, React discards the server HTML, and the page renders
blank. The status is 404 and 12 KB of correct bilingual HTML is sent, so a
crawler — which runs no JavaScript — sees the page intact. Only a person who
hand-types an invalid root path sees the blank render.

**Why the alternatives were rejected.**

`output: 'export'` would remove the per-request render entirely, and was
built rather than reasoned about. It emits `out/ro/services` while
`out/ro/servicii` is missing, because rewrites are not applied under export —
so it costs the whole localised URL structure of §8, not just `headers()` and
`redirects()`.

Capturing the hash of one fixed 404 URL fails its own precondition: the
payload embeds the real path and a rewrite preserves the address bar, so the
URLs stay distinct. It also needs a server inside the build.

`unsafe-inline` is the wrong escape **specifically here**. This is the only
page on the site that reflects the requested URL back, which makes it the only
attacker-controlled input in the project. Relaxing the policy there would
activate a reflected-XSS vector in precisely the one place there is something
to reflect.

The test covering it is deliberately left failing, with the reason in the test
file. **This means CI is red**, which conflicts with §1's requirement that the
pipeline be green on `main`. That conflict is real and is for the client to
resolve: either accept a red check that documents a known limitation, or mark
the test as expected-to-fail so the suite stays green while still alerting if
the behaviour ever changes.

The page itself carries its own wordmark, its own links to both locale homes
and its own disclosure line, rather than inheriting the locale layout it
renders outside of. A page that looks deliberately spare reads differently
from one that looks truncated by a constraint.

### 2026-11-12 — Font role tokens have to be re-declared wherever the font variables are

Giving the global 404 its own chrome produced a page set entirely in the system
font, with no error anywhere.

`--font-sans` is declared in `tokens.css` at `:root` as
`var(--font-hanken-grotesk), …`. Custom property substitution happens where a
property is **declared**, not where it is used. The global 404 renders outside
every layout, so the `next/font` variables are attached to its own wrapper
rather than to `<html>`; at `:root` the referenced variable does not exist, the
declaration resolves to nothing, and every descendant inherits that empty value.

A `.font-scope` class in `globals.css` re-declares the two role tokens, and the
wrapper carries it. Diagnosed by reading computed styles rather than by looking
at the page — the rendered text was plausible enough that a screenshot did not
call attention to itself.

## Phase 6 — Forms, consent, security

### 2026-11-11 — CSP uses hashes, not nonces, and the build id had to be made deterministic

§10 asks for a nonce-based policy. A nonce has to be generated per request and
therefore needs a server runtime, which §2 forbids. On a site where every page
is prerendered the inline scripts are known at build time, so hashes express
the same guarantee without the runtime. There is no `unsafe-inline` and no
`unsafe-eval` in `script-src`.

Measured first, before anything was written:

|                           |                                                    |
| ------------------------- | -------------------------------------------------- |
| HTML files                | 52                                                 |
| Executable inline scripts | 156                                                |
| Distinct SHA-256 hashes   | 54 — two shared by all pages, 52 per-page payloads |
| `script-src` hash list    | 2,915 bytes                                        |
| Full CSP header           | ~3.4 KB                                            |

`application/ld+json` blocks are excluded: the browser never executes them, so
`script-src` does not govern them. Counting them would have inflated the list
from 54 to 140 and the header to 8 KB, close to where proxies start refusing.

**The problem this surfaced.** Hashes are only knowable after a build, but
`next.config.ts` builds its headers before any page is rendered. The build
therefore runs twice — `build → generate → build → verify` — and `--verify`
fails if the hashes moved between passes rather than assuming they did not.

On the first run it failed, correctly, and what it found is recorded separately
below because it is not a CSP matter.

Verified in a browser, which is the right instrument for this question because
a violation only exists at execution time: zero `securitypolicyviolation`
events and zero page errors across eight pages in both locales, with the pages
still interactive.

**The one relaxation is `style-src 'unsafe-inline'`**, and it is deliberate.
`next/font` injects an inline `@font-face` block, and style hashes are brittle
because browsers normalise CSS text before hashing. Styles cannot execute, so
the attack this would otherwise open is not script execution. It is recorded
here rather than left to be noticed.

### 2026-11-12 — The build was not reproducible, and that is a defect in its own right

Two builds of identical source produced different HTML. Diffing the hydration
payloads showed one difference: `"b":"kXOwUG9bq2AuLS0kVCX3j"` against
`"b":"ueyFKKcOgb_37sgKl7Phe"`. That is Next's build id, generated randomly for
every build and embedded in every page.

CSP is how this was noticed, but it is not what it affects. A build that does
not reproduce cannot be verified by comparing artefacts, cannot be cached
reliably by content, and makes "the deployed bundle is the one from this
commit" a claim nobody can check. `generateBuildId` now derives the id from the
commit — from `VERCEL_GIT_COMMIT_SHA` or `GITHUB_SHA` in CI, from
`git rev-parse HEAD` locally, and from a constant where there is no git at all.

Chunk filenames are content-hashed independently, so cache busting never
depended on this value.

`frame-ancestors` and `report-uri` are ignored in a `<meta>` CSP, so the policy
is delivered as a response header. `X-Frame-Options: DENY` is set alongside
`frame-ancestors 'none'` for agents that honour only the older header.

### 2026-11-12 — Zod runs jitless, because the policy has no `unsafe-eval`

The form produced one CSP violation with `blockedURI: "eval"`. Zod v4 compiles
validators with `new Function` by default, which needs
`script-src 'unsafe-eval'` — the opposite of what hashing the inline scripts is
for. `z.config({ jitless: true })` makes it interpret instead, and the
violation goes. Set in `lib/contact.ts` rather than in the component, because
the schema is shared with the submit handler and the setting has to hold
wherever it runs.

### 2026-11-12 — The analytics origin is named in the CSP so the consent gate can be tested

`script-src` names `https://plausible.io`. Without it, CSP would block the
analytics script regardless of consent, the gate would appear to work for the
wrong reason, and a regression in the gate would be invisible. One named host,
no wildcard, and the request still only happens after the category is accepted.

Verified on the network, not on a flag:

|                | Requests to plausible.io                      |
| -------------- | --------------------------------------------- |
| No choice made | 0                                             |
| Reject all     | 0, including after navigating to another page |
| Accept all     | 2                                             |

### 2026-11-12 — Consent is read with `useSyncExternalStore`

`document.cookie` is an external store. Reading it in an effect body and
calling `setState` causes a cascading render, which React's own lint rule
rejects. The hook subscribes to the consent event instead, and caches its
snapshot against the raw cookie string because `getSnapshot` must return a
stable reference or React re-renders without end.

The server snapshot is `null`, which is what keeps the banner out of the
prerendered HTML and means the absence of a cookie is never read as consent.

### 2026-11-12 — The time-to-submit rule is tested in the schema, not through the UI

The e2e test for it was flaky and removed: filling a form with a driver already
takes longer than the three-second threshold, so the condition could not be
reproduced. The rule lives in the schema, which both the browser and the submit
handler run, so that is where it is asserted — along with the honeypot, and the
check that the anti-spam fields never reach the transport.
