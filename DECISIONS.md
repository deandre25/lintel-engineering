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
