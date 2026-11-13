import { NotFoundBody } from '@/components/sections/NotFoundBody';

/**
 * The 404 for a path under a valid locale, reached when a page calls
 * `notFound()` for an unknown slug. It renders the same bilingual body as the
 * global boundary, so a visitor sees one page regardless of which Next picks.
 */
export default function LocaleNotFound() {
  return <NotFoundBody />;
}
