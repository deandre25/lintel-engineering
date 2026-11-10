import { Hanken_Grotesk, Instrument_Serif } from 'next/font/google';

/*
 * Both faces are downloaded at build time and served from this origin, so there
 * is no connection to a font CDN at runtime and no render-blocking stylesheet.
 *
 * `latin-ext` is not optional: Romanian needs ă, â, î, ș and ț, and the `latin`
 * subset alone would fall back mid-word on half the site's content.
 */
export const sans = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-hanken-grotesk',
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
  adjustFontFallback: true,
});

export const display = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  display: 'swap',
  variable: '--font-instrument-serif',
  preload: true,
  fallback: ['ui-serif', 'Georgia', 'serif'],
  adjustFontFallback: true,
});

export const fontVariables = `${sans.variable} ${display.variable}`;
