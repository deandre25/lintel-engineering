import { NotFoundBody } from '@/components/sections/NotFoundBody';

/**
 * The 404 for a path under a valid locale, reached when a prerendered page
 * calls `notFound()` for an unknown slug. It renders inside
 * `[locale]/layout.tsx` and so inherits the document, its `lang`, the header
 * and the footer.
 *
 * A path matching no route at all goes to the global boundary instead. A
 * catch-all used to route those here, but it was the one route rendered per
 * request, and a request-time hydration payload cannot be hashed at build
 * time, so the Content-Security-Policy blocked it. See DECISIONS.md.
 *
 * It renders the same bilingual body as the global boundary, so a visitor sees
 * one page whichever boundary Next picks.
 */
export default function LocaleNotFound() {
  return <NotFoundBody />;
}
