import { notFound } from 'next/navigation';

import { isLocale } from './routing';

import type { Locale } from './routing';

/**
 * Narrows a route parameter to a known locale, or renders the 404.
 *
 * Next passes whatever string is in the URL, so typing a page's `params` as
 * `{ locale: Locale }` is a lie that holds until somebody requests `/de`: the
 * content lookup then returns `undefined` and the page throws a 500 instead of
 * answering 404. Pages take `{ locale: string }` and narrow here.
 */
export function requireLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}
