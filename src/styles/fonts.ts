import { Hanken_Grotesk, Instrument_Serif } from 'next/font/google';

/*
 * Both faces are downloaded at build time and served from this origin, so there
 * is no connection to a font CDN at runtime and no render-blocking stylesheet.
 *
 * `latin-ext` is not optional: Romanian needs ă, â, î, ș and ț, and the `latin`
 * subset alone would fall back mid-word on half the site's content.
 */
export const sans = Hanken_Grotesk({
  /*
   * `vietnamese` is not a mistake. Google Fonts puts U+0102/U+0103 — Ă and ă,
   * a core Romanian letter — in the Vietnamese subset rather than in
   * latin-ext. Without it the browser finds no loaded face covering ă and
   * renders that one letter from the system fallback, so Romanian body text
   * is set in two typefaces at once. Verified with `document.fonts.check`.
   */
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  display: 'swap',
  variable: '--font-hanken-grotesk',
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
  adjustFontFallback: true,
});

export const display = Instrument_Serif({
  /*
   * No `vietnamese` here: this face's latin-ext already covers ă, confirmed
   * with `document.fonts.check`. Only Hanken Grotesk splits it out.
   */
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  display: 'swap',
  variable: '--font-instrument-serif',
  preload: true,
  fallback: ['ui-serif', 'Georgia', 'serif'],
  adjustFontFallback: true,
});

export const fontVariables = `${sans.variable} ${display.variable}`;
