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
