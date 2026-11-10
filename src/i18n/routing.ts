import { defineRouting } from 'next-intl/routing';

import { defaultLocale, locales } from '@/lib/routing';

/**
 * `next-intl` is used here for messages, ICU formatting and `Intl` helpers
 * only. URL construction belongs to `@/lib/routing`, so `pathnames` is
 * deliberately absent — see the note at the top of that file.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
});
