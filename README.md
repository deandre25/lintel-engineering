# Lintel Engineering

A bilingual (English and Romanian) corporate website for an engineering
consultancy, built as a static Next.js site.

> **Lintel Engineering is a fictional company.** This site is a demonstration
> project. The company, its staff, its case studies, its registration numbers
> and its address are invented. No certification, accreditation, chamber
> membership or client relationship described anywhere on the site is real.

## Status

Phase 1 of 8 complete: foundation. See [DECISIONS.md](./DECISIONS.md) for the
technical choices made so far, and `PROJECT_BRIEF.md` for the specification.

The full README — stack rationale, architecture, measured Lighthouse and Core
Web Vitals figures, first-load JS per route, how to add a locale and how to add
a service page — is written in Phase 8.

## Running it

```bash
npm ci
npm run dev          # http://localhost:3000, redirects to /en
```

## Checks

```bash
npm run typecheck    # next typegen && tsc --noEmit
npm run lint         # ESLint, type-aware
npm run format:check # Prettier
npm test             # Vitest
npm run test:e2e     # Playwright, against a production build
npm run test:a11y    # axe-core, against a production build
npm run verify       # types, lint, format and unit tests
npm run build
npm run report:bundle # first-load JS per route, against the budget
```

## Credits

Typefaces and third-party assets are listed in [CREDITS.md](./CREDITS.md).
