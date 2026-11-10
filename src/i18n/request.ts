import { locale as localeRootParam } from 'next/root-params';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, localeTags, locales } from '@/lib/routing';

import en from '../../messages/en.json';
import ro from '../../messages/ro.json';

import type { Locale } from '@/lib/routing';

/**
 * Messages are imported statically rather than through a dynamic `import()`.
 *
 * Two reasons: a dynamic import of a templated path resolves to `any`, which
 * §2 forbids; and `satisfies` makes Romanian structurally checked against
 * English, so a message added to one locale and forgotten in the other fails
 * `tsc` instead of surfacing as a missing string at runtime. Both files are a
 * few kilobytes and the site is prerendered, so nothing is paid per request.
 */
const messagesByLocale = { en, ro } satisfies Record<Locale, typeof en>;

export default getRequestConfig(async () => {
  /*
   * `next/root-params` reads the `[locale]` segment of the route being
   * rendered. It replaces the deprecated `requestLocale`, and because root
   * params are known at build time it keeps every page statically rendered
   * without each page having to announce its locale.
   */
  const requested = await localeRootParam();
  const locale = hasLocale(locales, requested) ? requested : defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale],
    timeZone: 'Europe/Bucharest',
    formats: {
      dateTime: {
        long: { day: 'numeric', month: 'long', year: 'numeric' },
        short: { day: '2-digit', month: '2-digit', year: 'numeric' },
      },
    },
    getMessageFallback({ key }) {
      /*
       * A missing message is a content bug. It is loud in development and
       * degrades to the key path in production, so a page never shows the word
       * "undefined" to a visitor.
       */
      if (process.env.NODE_ENV === 'development') {
        throw new Error(`Missing message "${key}" for locale ${localeTags[locale]}`);
      }
      return key;
    },
  };
});
