import { notFound } from 'next/navigation';

/**
 * Catches any path under a valid locale that matched no route, so the 404
 * renders through `[locale]/not-found.tsx` and therefore inside the locale
 * layout: a document with the right `lang`, and the site's header and footer.
 *
 * Without it, a mistyped path like `/en/servces` falls through to the global
 * boundary, which Next renders in a shell it owns and without `lang`.
 *
 * This is the one route that is not prerendered, because the set of paths that
 * do not exist cannot be enumerated. It resolves no data and renders no
 * content: it calls `notFound()` and nothing else.
 */
export default function LocaleCatchAll(): never {
  notFound();
}
