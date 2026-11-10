# PROJECT BRIEF — Lintel Engineering corporate website

> **How to use this file.** This is the complete specification. Read it fully before writing any code.
> Work through the phases in order. **Stop at every GATE** and report to me before continuing.
> Do not skip ahead, do not scaffold everything at once, do not mark a phase done until its gate passes.

---

## 0. Before you write a single line

Ask me these questions and wait for answers. Do not assume.

1. **Company name** — the brief uses `Lintel Engineering`. Confirm it, or I will give you another. (I will check it is not an existing trademark in my market.)
2. **Second locale** — EN + RO (Romanian) is the default. If I say so instead, use EN + DE (German).
3. **Domain** — what I have registered, for canonical URLs, sitemap and OG tags.
4. **Deploy target** — Vercel unless I say otherwise.
5. **Node version** on my machine (`node -v`), and package manager (`pnpm` preferred, `npm` acceptable).

After I answer, restate the plan in 10 lines and start Phase 1.

**Never invent** real certifications (ISO numbers, chamber memberships), named clients, staff photographs,
awards, or regulatory accreditations. Everything on this site must be plainly fictional on inspection,
while being written to a real commercial standard. There will be one small line in the footer and a clear
statement in the README saying this is a demonstration project for a fictional company.

---

## 1. What this is and what "done" means

A bilingual corporate website for a mid-sized engineering consultancy. It is a **portfolio piece that must
be indistinguishable in craft from a real client project** — someone reviewing it should assume it was paid
work, and only learn otherwise from the README.

It is judged by a hiring engineer who will, in this order:

1. Open the live site on a phone.
2. Run Lighthouse.
3. Open the repo, read the README, look at the CI badge.
4. Open two or three files to see how the code is written.
5. Look at the commit history.

Every requirement below exists to survive one of those five steps.

### Success criteria — all must hold at the end

| Criterion                                  | Target                                                  |
| ------------------------------------------ | ------------------------------------------------------- |
| Lighthouse Performance (mobile, throttled) | ≥ 95                                                    |
| Lighthouse Accessibility                   | 100                                                     |
| Lighthouse Best Practices                  | ≥ 95                                                    |
| Lighthouse SEO                             | 100                                                     |
| LCP (mobile, Moto G4 profile)              | < 1.5 s                                                 |
| CLS                                        | < 0.03                                                  |
| TBT                                        | < 150 ms                                                |
| First-load JS, landing page                | < 110 KB gzipped                                        |
| TypeScript errors                          | 0, with `strict: true`                                  |
| `any` in source                            | 0 occurrences                                           |
| ESLint errors / warnings                   | 0                                                       |
| CI pipeline                                | green on `main`                                         |
| Keyboard-only navigation                   | every interactive element reachable and visibly focused |
| axe-core violations                        | 0 on every page template                                |

---

## 2. Non-negotiable constraints

- **Static only.** No database, no CMS, no server-side runtime beyond what Next.js needs for building.
  Content lives in the repository.
- **TypeScript strict.** `strict: true`, `noUncheckedIndexedAccess: true`. No `any`, no `@ts-ignore`,
  no `as unknown as`. If typing is hard, fix the design, not the type.
- **No component library.** No MUI, no shadcn, no Chakra, no DaisyUI. Every component is written here.
  This project exists to show that I can build a design system, not install one.
- **No animation library** unless a specific interaction genuinely needs it. CSS transitions first.
- **Accessibility is a build failure**, not a nice-to-have.
- **Every phase ends in a commit** with a Conventional Commits message.

---

## 3. The company

Define this once, in `content/company.ts`, and derive everything else from it.

**Lintel Engineering** — an independent engineering consultancy, founded 2009, headquartered in Brașov,
Romania, 48 staff. It does not build things; it advises the people who do. Its clients are automotive and
industrial manufacturers, property developers and public infrastructure bodies across Romania, Hungary and
southern Germany — the manufacturing corridor its own region sits in.

**Positioning.** Not "innovative solutions for a digital future." Lintel is the firm you call when a
project is technically contested — when a structure has to be certified, a plant retrofitted without
stopping production, or an acquisition's engineering risk priced before a deal closes. The tone is
senior, specific and unexcited. It never oversells.

**Services (six, each a real page):**

1. **Structural engineering** — design review, certification, load assessment of existing structures, seismic and wind analysis.
2. **Industrial process & automation** — retrofit of production lines, control system migration, commissioning support.
3. **Energy & efficiency audits** — EU Energy Efficiency Directive compliance, thermal modelling, decarbonisation roadmaps.
4. **Technical due diligence** — engineering risk assessment for acquisitions and project finance.
5. **Permitting & compliance** — Eurocode and national building code, environmental permitting, authority liaison.
6. **BIM coordination** — model federation, clash detection, information management to ISO 19650 (describe the standard generically; do not claim certification).

**Case studies (four, each a real page).** Each has: sector, location, year, duration, the client's
constraint, what Lintel did, and a result with a number. Clients are described by type, never named
("a Tier-1 automotive supplier", "a municipal water authority"). Example of the register required:

> A press line at an automotive supplier outside Brașov had to move to a new control platform without a
> shutdown longer than the plant's existing 9-day summer maintenance window. We sequenced the migration
> across three stops, ran the old and new controllers in parallel for 40 days, and handed over with 6 days
> of the window unused.

That is the standard for every piece of copy on this site. Specific, bounded, verifiable-sounding, no adjectives doing the work.

**Four people on the team page.** Invented names, real-sounding credentials of a generic kind
(discipline, years, degree field), no photographs — see §6 on imagery.

---

## 4. Information architecture

15 routes per locale. `[locale]` is `en` | `ro`.

```
/[locale]                                 Home
/[locale]/services                        Services index
/[locale]/services/[slug]                 6 service pages
/[locale]/work                            Case studies index
/[locale]/work/[slug]                     4 case study pages
/[locale]/about                           About + team
/[locale]/insights                        Insights index (technical articles)
/[locale]/insights/[slug]                 3 articles, MDX
/[locale]/contact                         Contact + form
/[locale]/careers                         Open positions (3, static)
/[locale]/privacy                         Privacy policy
/[locale]/cookies                         Cookie policy
/[locale]/terms                           Terms of use
/[locale]/legal-notice                    Imprint / company details
not-found                                 404, localised
```

The four legal pages are not filler. A site without them reads as a mockup; a site with properly written
ones reads as a business. Write them as real policies referencing GDPR Art. 6(1)(f) and Art. 13, the
retention period for contact submissions, and the cookie categories actually used. Add a visible
"This is a demonstration project" line in the legal notice.

**Insights articles** — three genuinely technical pieces, 700–1100 words each, written as an engineer
would write them. Suggested topics: assessing fatigue in welded connections of older industrial
structures; what changed for existing buildings under the recast EPBD; sequencing a control-system
migration around a production calendar. These must read as competent domain writing, not as blog filler.

---

## 5. Content rules

Content is the single biggest difference between a portfolio piece and a real site. Treat copy as a
deliverable, not as placeholder.

- **No Lorem ipsum anywhere**, at any stage, including during scaffolding.
- **No superlatives.** Banned: "cutting-edge", "innovative", "world-class", "seamless", "robust solutions",
  "passionate", "we leverage", "empower", "transform your business", "end-to-end excellence".
- **Numbers over adjectives.** "48 engineers across three disciplines" beats "a large expert team".
- **Sentence case** for headings, not Title Case. No sentence-ending punctuation in headings.
- Every page has a distinct, specific `<h1>`. No page reuses another's heading.
- Microcopy counts: form labels, error messages, empty states, button text, the 404 page, the cookie
  banner. Write each one deliberately. "Something went wrong" is a failure; say what went wrong and what to do.
- **Write EN first, then translate.** For the second locale, produce a genuine translation, not a
  machine-literal one — adapt idiom and sentence length. Note in the README that a native speaker should
  review it before any real use.

Store copy as typed content modules under `src/content/<locale>/`, not inline in components. UI strings
(buttons, labels, errors) go in `messages/<locale>.json` for `next-intl`.

---

## 6. Design direction

The brief for the look is: **restrained, editorial, technical**. Think of a Swiss engineering firm's
annual report, not a SaaS landing page.

### Type

- Display / headings: **Instrument Serif** (or **Newsreader**) — an editorial serif, used large and sparingly.
- Body / UI: **Inter Tight** or **Hanken Grotesk** — never plain Inter at default settings, which reads as
  "I did not choose a typeface".
- Load via `next/font` with subsetting and `display: swap`. No render-blocking font CSS, no layout shift.
- Tabular figures (`font-variant-numeric: tabular-nums`) everywhere numbers appear in sequence.
- A real modular scale, defined once as CSS custom properties — roughly 1.25 at small sizes widening to
  1.333 at display sizes. Do not use Tailwind's default `text-*` ramp unmodified.
- Measure capped at 68–72 characters for body text.

### Colour

- One near-black with a hue in it (e.g. a very dark slate-blue), one warm off-white, a neutral ramp
  derived from the same hue, and **one** accent.
- The accent covers less than 5% of any viewport. It is for state and emphasis, never for decoration.
- No pure `#000` or `#fff`. No gradient meshes, no blurred colour blobs, no glassmorphism.
- Contrast: every text/background pair ≥ 4.5:1, large display text ≥ 3:1. Verify, do not assume.
- Define as CSS custom properties in `:root`, consumed through the Tailwind theme. Dark mode is **out of
  scope** — a single, well-executed light theme beats two mediocre ones.

### Layout

- A 12-column grid with a defined max width (1280px content, 1440px for full-bleed elements).
- An 8px spacing scale, used strictly. No arbitrary `mt-[13px]`.
- **Generous vertical rhythm.** Section padding should feel larger than instinct suggests — this is the
  single clearest visual signal separating professional work from amateur.
- Asymmetry is welcome: offset headings, uneven column splits (7/5, 8/4), full-bleed rules.
- Hairline rules (1px, low-contrast) as structure instead of boxed cards with drop shadows.

### Imagery — read this carefully

**No photographs of people.** No stock photos at all. Reasons: licensing, and the fact that stock imagery
is the fastest way to make a site look fake.

Instead, build the visual language from **code-drawn technical graphics**: isometric structural schematics,
sectional drawings, grid and contour patterns, axis diagrams, exploded assemblies — all authored as inline
SVG components in `src/components/graphics/`. Monochrome plus the accent, hairline strokes. These double as
proof of craft: a reviewer who opens one sees hand-written SVG, not an imported asset.

Where a photographic texture is genuinely needed (one hero, perhaps), use an abstract architectural or
industrial image from Unsplash, record the photographer and licence in `CREDITS.md`, serve it as AVIF/WebP
through `next/image` with explicit dimensions, and preload only the LCP image.

### Motion

- Transitions under 200 ms, `ease-out`, on opacity and transform only.
- One restrained scroll-reveal at most, via `IntersectionObserver` — never a library.
- `@media (prefers-reduced-motion: reduce)` disables all of it. This is tested.

---

## 7. Technical architecture

### Stack

| Concern      | Choice                                                          |
| ------------ | --------------------------------------------------------------- |
| Framework    | Next.js (latest stable), App Router, fully static               |
| Language     | TypeScript, `strict`                                            |
| Styling      | Tailwind CSS with a custom theme built on CSS custom properties |
| i18n         | `next-intl`                                                     |
| Articles     | MDX via `@next/mdx`                                             |
| Forms        | `react-hook-form` + `zod`                                       |
| Unit tests   | Vitest + React Testing Library                                  |
| E2E / visual | Playwright                                                      |
| A11y testing | `@axe-core/playwright`                                          |
| CI           | GitHub Actions                                                  |
| Perf gate    | Lighthouse CI (`@lhci/cli`)                                     |
| Deploy       | Vercel                                                          |

### Structure

```
src/
  app/
    [locale]/
      layout.tsx
      page.tsx
      services/…  work/…  insights/…  about/  contact/  careers/
      privacy/  cookies/  terms/  legal-notice/
    sitemap.ts
    robots.ts
    opengraph-image.tsx
  components/
    sections/        Hero, Features, CaseStudyGrid, Stats, FAQ, CTA, TeamGrid, ContactForm…
    ui/              Button, Link, Field, Disclosure, Breadcrumb, Container, Prose…
    graphics/        hand-authored SVG components
  content/
    company.ts
    en/  ro/         typed content modules
  lib/
    seo.ts  schema.ts  routing.ts  utils.ts
  styles/
messages/            en.json  ro.json
tests/
  unit/  e2e/  visual/
.github/workflows/ci.yml
```

### Code standards

- Server Components by default. `'use client'` only where interactivity requires it, and as low in the
  tree as possible. The contact form and the cookie banner should be the only meaningful client boundaries.
- Named exports throughout. One component per file, filename matches the component.
- Props interfaces are explicit and exported. No inline prop types over two fields.
- No barrel files that re-export everything — they defeat tree-shaking.
- Section components receive typed content as props and know nothing about routing or locale.
- Content is validated at build time with Zod schemas, so a malformed content file fails the build rather
  than rendering blank.
- Comments explain _why_, never _what_. Delete any comment that restates the code.

---

## 8. Internationalisation

- Locale-prefixed routes for both locales (`/en/...`, `/ro/...`), no un-prefixed default.
- `generateStaticParams` across locale × slug so every page is prerendered.
- A language switcher that preserves the current route, including dynamic segments, and falls back to the
  locale home if an equivalent page does not exist.
- `<html lang>` set correctly per locale.
- Slugs are **localised**: `/en/services/structural-engineering` and `/ro/servicii/inginerie-structurala`.
  This is the part most implementations skip; it is also the part a reviewer checks.
- Dates and numbers formatted through `Intl`, per locale.
- No string concatenation for sentences with variables — use ICU message syntax.

---

## 9. SEO specification

Implement all of it. Each item is independently verifiable, which is the point.

- `generateMetadata` on every route: title, description, canonical, OG, Twitter card.
  Title pattern: `{Page} — Lintel Engineering`, home is `Lintel Engineering — {positioning line}`.
  Descriptions written per page, 140–160 characters, never templated.
- `alternates.languages` with **`hreflang` for both locales plus `x-default`** on every page.
- `app/sitemap.ts` — all routes, both locales, with `alternates`, `lastModified` from content.
- `app/robots.ts` — allow all, point at the sitemap.
- **JSON-LD**, rendered as `<script type="application/ld+json">`:
  - `Organization` + `ProfessionalService` on the home page, with `address`, `areaServed`, `sameAs`.
  - `BreadcrumbList` on every nested page.
  - `Service` on each service page.
  - `Article` on each insight, with `datePublished` and `author`.
  - `FAQPage` where an FAQ section appears.
  - Validate every type against schema.org before considering it done.
- **Dynamic OG images** via `next/og` — per page, showing the page title over the brand mark on the
  brand background. Not one static image reused.
- **301 redirects** in `next.config` from a plausible legacy structure, to demonstrate migration handling:
  `/services.html → /en/services`, `/despre-noi → /ro/despre-noi`, `/case-studies/* → /en/work/*`, and a trailing-slash rule.
- Semantic document outline: one `<h1>`, no skipped levels, `<nav>`/`<main>/<footer>` landmarks, a
  `<Breadcrumb>` with proper markup on nested pages.
- Every image has meaningful `alt`; decorative graphics are `aria-hidden` with empty `alt`.

---

## 10. Forms, privacy, security

### Contact form

Fields: name, company, email, enquiry type (select), message, consent checkbox.

- Zod schema shared between client and the submit handler.
- Inline validation on blur, not on every keystroke. Errors announced via `aria-live="polite"` and linked
  with `aria-describedby`.
- Three states handled visibly: submitting, success, failure — each with written microcopy.
- **Spam protection:** a honeypot field, a minimum time-to-submit check, and Cloudflare Turnstile if I
  provide keys. Never a visible CAPTCHA.
- Since the site is static, submit to a form endpoint (Formspree or a Vercel serverless route if we keep
  one). Keep the transport behind a small interface so it can be swapped.
- Consent checkbox is unchecked by default and links to the privacy policy. Record what consent was given
  for, in the policy text.

### Cookie consent

- The banner **actually gates** script loading. Analytics must not load before consent. A decorative
  banner that sets a flag and loads everything regardless is worse than none, and a reviewer will check
  the network tab.
- Categories: necessary (always on), analytics, preferences. Reject-all is as prominent as accept-all.
- Choice persisted, re-openable from the footer, documented in the cookie policy.

### Security headers

Set in `next.config` headers:

- `Content-Security-Policy` — real, nonce-based where inline scripts are needed, not `unsafe-inline`.
- `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying unused features.
- Target grade A on securityheaders.com; screenshot it into the README.

---

## 11. Accessibility

- Keyboard path through every page, with a visible focus ring that is designed, not the browser default.
- A skip-to-content link, visible on focus.
- The mobile navigation traps focus while open, closes on `Escape`, and restores focus to its trigger.
- Disclosure components (FAQ) use real `button` + `aria-expanded`, not `details` styled into submission.
- Colour never carries meaning alone.
- `prefers-reduced-motion` honoured and tested.
- Run `@axe-core/playwright` against every page template in CI. Zero violations is a merge requirement.

---

## 12. Performance

- Treat the budget in §1 as a hard gate enforced by Lighthouse CI.
- Self-host fonts through `next/font`. Preload only the fonts used above the fold.
- `next/image` with explicit `width`/`height` and `sizes` on everything. `priority` on the LCP image only.
- Zero client JS on pages that have no interactivity — verify this by inspecting the build output, and
  record first-load JS per route in the README.
- No client-side data fetching anywhere.
- Analyse the bundle (`@next/bundle-analyzer`) once before the final commit and remove anything surprising.

---

## 13. Testing

**Unit (Vitest + RTL)** — 20–30 meaningful tests, colocated as `*.test.tsx`:

- Each section component renders its typed content correctly and handles empty/optional fields.
- Contact form: validation rules, error announcement, success and failure states.
- `lib/seo.ts` and `lib/schema.ts`: metadata and JSON-LD generated correctly for each page type.
- Routing helpers: localised slug resolution, language-switch fallback.

**E2E (Playwright)** — against the production build:

- Navigation through the primary routes, both locales.
- Language switch preserves the equivalent page, including a nested dynamic route.
- Contact form: invalid submission shows errors; valid submission reaches the success state (endpoint mocked).
- Cookie banner: declining analytics means the analytics request never fires — assert on the network.
- 404 renders localised and links home.

**Visual regression (Playwright)** — screenshots of home, a service page, a case study, the contact page,
at 390px, 768px and 1440px. Masked for anything non-deterministic. Baselines committed.

**Accessibility** — axe on every page template, both locales.

Tests must be deterministic. No arbitrary `waitForTimeout`; wait on state.

---

## 14. CI

One workflow, `.github/workflows/ci.yml`, on push and PR to `main`. Jobs, fail-fast:

1. Install (cached) → `tsc --noEmit`
2. ESLint + Prettier check
3. Vitest with coverage
4. `next build`
5. Playwright: e2e + visual + axe (upload the report as an artifact)
6. Link check across the built output (`lychee`)
7. **Lighthouse CI** against the production build, asserting the §1 budget — the job fails below threshold

Add the CI status badge and the Lighthouse scores to the README.

---

## 15. Repository

- `README.md` is a deliverable in its own right. It contains, in this order: one-line description;
  live link; screenshot; the stack and **why each piece was chosen**; architecture overview; the measured
  Lighthouse and Core Web Vitals numbers; first-load JS per route; how to run, test and build;
  **how to add a new locale** and **how to add a new service page**; a short "decisions and trade-offs"
  section; and a clear statement that Lintel Engineering is a fictional company and the site is a
  demonstration project.
- `CREDITS.md` for fonts and any third-party asset with its licence.
- Conventional Commits, one commit per logical step, written in the imperative. No `wip`, no `fix stuff`.
- Branch per phase, merged into `main` via PR with a written description. The PR history is part of what
  is being demonstrated.
- `.env.example` committed; no secrets in the repo, ever. Verify the history before the first push.

---

## 16. Execution plan

Work in this order. **Stop at every GATE, report, and wait for me.**

### Phase 1 — Foundation

Next.js + TypeScript strict + Tailwind theme from CSS custom properties + `next-intl` routing with
localised slugs + fonts + base layout (header, footer, skip link) + ESLint/Prettier + Vitest and Playwright
configured and running empty suites + CI workflow green on an empty project.

**GATE 1:** CI green. `tsc --noEmit` clean. The two locale home routes render a styled shell. Report
first-load JS.

### Phase 2 — Design system

`components/ui/*` — Button, Link, Container, Prose, Field, Disclosure, Breadcrumb. The type scale,
colour tokens, spacing scale and focus treatment, all driven by tokens. A `/styleguide` route (excluded
from sitemap and `noindex`) rendering every component and every type size.

**GATE 2:** Styleguide renders. Contrast ratios verified and listed. Unit tests on UI primitives pass.

### Phase 3 — Content

All copy for both locales, as typed modules validated by Zod: company data, six services, four case
studies, three insight articles, team, careers, four legal pages, every UI string.

**GATE 3:** Show me the English copy for the home page, one service and one case study **before**
building the sections. This is the most likely thing to go wrong and the most expensive to fix later.

### Phase 4 — Sections and pages

`components/sections/*`, then assemble all 15 routes per locale. The SVG graphics in `components/graphics/`.
Fully responsive at 390 / 768 / 1440.

**GATE 4:** All routes render in both locales. Screenshot the home page at all three widths and show me.

### Phase 5 — SEO

Everything in §9: metadata, hreflang, sitemap, robots, all JSON-LD types, dynamic OG images, redirects.

**GATE 5:** Show the rendered `<head>` of three different page types and the JSON-LD, validated.

### Phase 6 — Forms, consent, security

Contact form end to end, cookie consent with real script gating, security headers.

**GATE 6:** Demonstrate that declining analytics prevents the request. Report the securityheaders.com grade.

### Phase 7 — Tests

The full suite from §13, wired into CI, visual baselines committed.

**GATE 7:** All suites green in CI. Report counts and coverage.

### Phase 8 — Performance and launch

Bundle analysis, image pipeline, font loading, Lighthouse CI thresholds enforced. Deploy. README and
CREDITS written. Final pass on commit history.

**GATE 8:** Live URL, Lighthouse report screenshot, CI badge green, README complete.

---

## 17. Anti-patterns — do not do any of these

These are the specific things that make a site read as generated or amateur. Each is a hard no.

- Emoji in UI, headings, README or commit messages.
- Lorem ipsum, "Your Company", "Feature One", `#` placeholder links, dead buttons.
- A hero with a centred headline, a subtitle and two buttons, over a gradient. Design something.
- Purple-to-blue gradients, blurred colour blobs, glassmorphism, `shadow-2xl` cards floating on grey.
- Three or four feature cards with icon, title and two lines of text, evenly spaced.
- Generic icon fonts or an icon library dropped in wholesale.
- Stock photographs, especially of people in hard hats or shaking hands.
- Counters that animate up, marquees of fake client logos, fake testimonial carousels.
- "Trusted by 500+ companies" or any unearned claim.
- `any`, `@ts-ignore`, `!` non-null assertions used to silence the compiler.
- `useEffect` fetching data that could be static.
- `console.log` left in source.
- Inline styles mixed with Tailwind arbitrary values to patch spacing.
- Tests that assert a component renders without asserting anything about what it rendered.
- A README that is `npm install && npm run dev` and nothing else.
- Commits named `update`, `fix`, `changes`, `final`, `final2`.

---

## 18. How to work with me

- **Stop at every gate.** Do not run three phases and present a finished site.
- At each gate: what you built, what you decided and why, anything you could not do, and what is next.
- When a requirement here is ambiguous or you think it is wrong, say so and propose an alternative
  before implementing. Do not silently reinterpret.
- Keep a `DECISIONS.md` with one short entry per non-obvious technical choice, dated. It becomes the
  "decisions and trade-offs" section of the README, and it is what I will be asked about in interviews.
- Explain any non-obvious implementation as you go. I have to be able to defend every line of this in a
  technical interview, so I would rather understand it now than read it later.
- Run `tsc --noEmit`, the linter and the relevant tests before every commit. Never commit red.
