# Credits

## Fonts

Both typefaces are served from this repository through `next/font`, self-hosted, with the `latin`, `latin-ext` and `vietnamese` subsets. The third is required for Romanian: Google places U+0102–0103 (Ă/ă) in the `vietnamese` subset rather than `latin-ext`.

| Typeface         | Designer                                       | Licence                   |
| ---------------- | ---------------------------------------------- | ------------------------- |
| Instrument Serif | Instrument / Rodrigo Fuenzalida, Jordan Egstad | SIL Open Font License 1.1 |
| Hanken Grotesk   | Alfredo Marco Pradil                           | SIL Open Font License 1.1 |

The SIL Open Font License permits use, modification and redistribution, including in commercial work, provided the font files themselves are not sold on their own. Full text: <https://openfontlicense.org/>

## Imagery

All illustration in this project is hand-authored SVG, written as React components in `src/components/graphics/`. No stock photography, no third-party illustration sets and no icon fonts are used, and there are no photographs of people anywhere on the site.

## Open-source dependencies

The project is built on the following, each under its own licence as declared in its package metadata. This list covers the direct dependencies that shape the architecture; `package-lock.json` is the complete record.

| Package                | Licence          | Use                                                         |
| ---------------------- | ---------------- | ----------------------------------------------------------- |
| Next.js                | MIT              | Framework, App Router, static generation                    |
| React                  | MIT              | —                                                           |
| TypeScript             | Apache-2.0       | —                                                           |
| Tailwind CSS           | MIT              | Styling, theme driven by CSS custom properties              |
| next-intl              | MIT              | Internationalisation                                        |
| `@next/mdx`            | MIT              | Articles                                                    |
| react-hook-form        | MIT              | Contact form                                                |
| Zod                    | MIT              | Schema validation, shared between client and submit handler |
| Vitest                 | MIT              | Unit tests                                                  |
| React Testing Library  | MIT              | Unit tests                                                  |
| Playwright             | Apache-2.0       | End-to-end, accessibility and overflow tests                |
| `@axe-core/playwright` | MPL-2.0          | Accessibility assertions                                    |
| `@lhci/cli`            | Apache-2.0       | Performance gate                                            |
| ESLint                 | MIT              | —                                                           |
| typescript-eslint      | MIT              | Type-aware linting                                          |
| Prettier               | MIT              | —                                                           |
| lychee                 | Apache-2.0 / MIT | Link checking in CI                                         |

## Standards and vocabularies

- **schema.org** — the JSON-LD vocabulary, fetched at validation time by `scripts/validate-jsonld.mjs`. Published under CC BY-SA 3.0.
- **Eurocodes and national annexes** are referred to by name in the site copy as the basis of assessment. No normative text is reproduced, and no accreditation is claimed. Lintel Engineering is a fictional company; see the legal notice on the site.

## Services

- **Plausible Analytics** — loaded only after the visitor accepts analytics cookies. No analytics request is made before consent; this is asserted in the test suite against network activity rather than against a stored flag.
- **Vercel** — hosting and deployment.

## A note on authorship

The site copy, the Romanian adaptation, the SVG illustration and the code were produced by the author with AI assistance, worked spec-first against a written brief with a review gate at the end of each phase. `DECISIONS.md` records each non-obvious choice and the reasoning behind it; the README describes the verification practice that came out of it.

The company, its staff, its case studies and its registration details are invented. Nothing on the site describes work that was carried out.
