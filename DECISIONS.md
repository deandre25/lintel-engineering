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

### 2026-11-10 — The 110 KB first-load budget is not reachable on this stack

Measured on the Phase 1 shell: 136.6 KB gzipped with Turbopack, 135.8 KB with
webpack. A route with no client components at all measures the same, so this is
the React 19 / Next 16 hydration baseline, not application code — of which there
is about 5 KB. The §1 target of 110 KB would require a different framework.

The outcomes the budget exists to protect are met: Lighthouse Performance 100,
LCP 0.76 s, CLS 0.000, TBT 12-75 ms on a throttled mobile profile.

Interim: the CI gate is set to 140 KB — the measured baseline plus about 3 KB of
headroom — so a real regression still fails the build rather than the gate being
switched off. This is a deviation from §1 and needs a decision: restate the
budget at 140 KB, or change the framework. It is not a target that was quietly
relaxed to make the build pass.

### 2026-11-10 — Contrast is asserted against the stylesheet, not a copy

`src/lib/tokens.ts` parses `src/styles/tokens.css` and the unit suite asserts a
ratio for every text and interface pairing the components use. A duplicated
table of colour values in TypeScript would drift from the CSS, and a drifted
copy reports passes that are not real. The first run of this suite caught a real
failure: the footer disclosure used `--ink-400` on `--ink-900` at 3.4:1.

### 2026-11-10 — The locale layout is the root layout

`app/layout.tsx` was initially a passthrough that returned `children`, with
`<html>` in `app/[locale]/layout.tsx`. That made `locale` a child param rather
than a root param, and `next/root-params` reported none, which would have forced
the deprecated `requestLocale` API. Removing the passthrough makes the locale
layout the root layout and `locale` a typed root param, which is also what keeps
every page statically rendered without per-page `setRequestLocale` calls.
