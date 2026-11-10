import type en from '../../messages/en.json';
import type { Locale } from '@/lib/routing';

/**
 * Teaches `next-intl` about this project's locales and message shape.
 *
 * With this in place `useTranslations('nav')` only accepts keys that exist in
 * messages/en.json, and a typo in a message key is a compile error rather than
 * a string rendered to a visitor. English is the reference shape because §5
 * requires copy to be written in English first.
 */
declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof en;
  }
}
