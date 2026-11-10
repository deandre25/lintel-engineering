import { AA_LARGE_TEXT, AA_TEXT } from './color';

export interface ContrastPairing {
  readonly foreground: string;
  readonly background: string;
  /** Where this combination actually appears, so an unused pair is obvious. */
  readonly usage: string;
}

/**
 * Every foreground/background combination the components use.
 *
 * One list, consumed by both the unit suite that asserts the ratios and the
 * styleguide that lists them. Keeping them separate would let the published
 * figures drift from the asserted ones, which is the specific way a contrast
 * table stops being evidence of anything.
 *
 * Adding a combination to the UI without adding it here is the gap this list
 * exists to make visible.
 */
export const TEXT_PAIRINGS: readonly ContrastPairing[] = [
  { foreground: 'ink-900', background: 'paper', usage: 'body and headings' },
  { foreground: 'ink-500', background: 'paper', usage: 'secondary text' },
  { foreground: 'ink-400', background: 'paper', usage: 'muted text and metadata' },
  { foreground: 'ink-900', background: 'paper-sunken', usage: 'headings on sunken panels' },
  { foreground: 'ink-500', background: 'paper-sunken', usage: 'secondary text, sunken' },
  { foreground: 'ink-400', background: 'paper-sunken', usage: 'muted text, sunken' },
  { foreground: 'ink-900', background: 'paper-raised', usage: 'headings on raised panels' },
  { foreground: 'accent', background: 'paper', usage: 'accent text and links' },
  { foreground: 'accent-strong', background: 'paper', usage: 'accent hover and active' },
  { foreground: 'accent', background: 'paper-sunken', usage: 'accent text, sunken' },
  { foreground: 'paper', background: 'ink-900', usage: 'text on the inverse footer' },
  { foreground: 'ink-300', background: 'ink-900', usage: 'muted text and footer disclosure' },
  { foreground: 'ink-200', background: 'ink-900', usage: 'secondary text, inverse' },
  { foreground: 'accent-on-dark', background: 'ink-900', usage: 'accent text, inverse' },
  { foreground: 'paper', background: 'ink-800', usage: 'text on the secondary inverse surface' },
  { foreground: 'ink-600', background: 'ink-200', usage: 'disabled button label' },
];

/** Focus rings and borders, which WCAG treats as interface components at 3:1. */
export const UI_PAIRINGS: readonly ContrastPairing[] = [
  { foreground: 'accent', background: 'paper', usage: 'focus ring on the page surface' },
  { foreground: 'accent', background: 'paper-raised', usage: 'focus ring on raised panels' },
  { foreground: 'accent-on-dark', background: 'ink-900', usage: 'focus ring, inverse' },
  { foreground: 'ink-900', background: 'paper', usage: 'bordered button outline' },
];

export interface PairingGroup {
  readonly name: string;
  readonly threshold: number;
  readonly requirement: string;
  readonly pairings: readonly ContrastPairing[];
}

export const PAIRING_GROUPS: readonly PairingGroup[] = [
  {
    name: 'Text',
    threshold: AA_TEXT,
    requirement: 'WCAG 2.1 AA, 1.4.3 — body text at normal weight',
    pairings: TEXT_PAIRINGS,
  },
  {
    name: 'Interface elements',
    threshold: AA_LARGE_TEXT,
    requirement: 'WCAG 2.1 AA, 1.4.11 — borders and focus indicators',
    pairings: UI_PAIRINGS,
  },
];
