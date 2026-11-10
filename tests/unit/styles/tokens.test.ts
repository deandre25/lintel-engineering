import { describe, expect, it } from 'vitest';

import { AA_LARGE_TEXT, AA_TEXT, contrastRatio, formatRatio, parseHexColor } from '@/lib/color';
import { readColorTokens } from '@/lib/tokens';

const tokens = readColorTokens();

/**
 * Every text/background pairing the design system actually uses.
 *
 * §6 requires 4.5:1 for body text and 3:1 for large display text, verified
 * rather than assumed. Each pair here corresponds to a real combination in the
 * components; adding a pairing to the UI without adding it here is the gap this
 * suite is meant to make obvious.
 */
const TEXT_PAIRS: { foreground: string; background: string; usage: string }[] = [
  { foreground: 'ink-900', background: 'paper', usage: 'body and headings on the page surface' },
  { foreground: 'ink-500', background: 'paper', usage: 'secondary text' },
  { foreground: 'ink-400', background: 'paper', usage: 'muted text and metadata' },
  { foreground: 'ink-400', background: 'paper-sunken', usage: 'muted text on sunken panels' },
  { foreground: 'ink-500', background: 'paper-sunken', usage: 'secondary text on sunken panels' },
  { foreground: 'ink-900', background: 'paper-sunken', usage: 'headings on sunken panels' },
  { foreground: 'ink-900', background: 'paper-raised', usage: 'headings on raised panels' },
  { foreground: 'accent', background: 'paper', usage: 'accent text and links' },
  { foreground: 'accent-strong', background: 'paper', usage: 'accent hover and active' },
  { foreground: 'accent', background: 'paper-sunken', usage: 'accent text on sunken panels' },
  { foreground: 'paper', background: 'ink-900', usage: 'text on the inverse footer surface' },
  {
    foreground: 'ink-300',
    background: 'ink-900',
    usage: 'muted text and the footer disclosure on the inverse surface',
  },
  { foreground: 'ink-200', background: 'ink-900', usage: 'secondary text on the inverse surface' },
  {
    foreground: 'accent-on-dark',
    background: 'ink-900',
    usage: 'accent text on the inverse surface',
  },
  { foreground: 'paper', background: 'ink-800', usage: 'text on the secondary inverse surface' },
];

/** Non-text pairs: focus rings and borders, which need 3:1 as UI components. */
const UI_PAIRS: { foreground: string; background: string; usage: string }[] = [
  { foreground: 'accent', background: 'paper', usage: 'focus ring on the page surface' },
  { foreground: 'accent', background: 'paper-raised', usage: 'focus ring on raised panels' },
  {
    foreground: 'accent-on-dark',
    background: 'ink-900',
    usage: 'focus ring on the inverse surface',
  },
  { foreground: 'ink-900', background: 'paper', usage: 'bordered button outline' },
];

function colorOf(token: string): string {
  const value = tokens[token];
  if (value === undefined) {
    throw new Error(`Token --${token} is not declared in src/styles/tokens.css`);
  }
  return value;
}

describe('colour tokens', () => {
  it('declares every token the components reference', () => {
    const required = [
      ...new Set(
        [...TEXT_PAIRS, ...UI_PAIRS].flatMap((pair) => [pair.foreground, pair.background]),
      ),
    ];

    for (const token of required) {
      expect(tokens[token], `--${token}`).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('avoids pure black and pure white, per §6', () => {
    for (const [name, value] of Object.entries(tokens)) {
      expect(value.toLowerCase(), `--${name}`).not.toBe('#000000');
      expect(value.toLowerCase(), `--${name}`).not.toBe('#ffffff');
    }
  });

  it('gives every neutral a hue, so no grey is fully desaturated', () => {
    for (const name of ['ink-900', 'ink-700', 'ink-500', 'ink-300', 'ink-100']) {
      const { r, g, b } = parseHexColor(colorOf(name));
      expect(new Set([r, g, b]).size, `--${name} is a flat grey`).toBeGreaterThan(1);
    }
  });
});

describe('text contrast meets WCAG AA', () => {
  for (const pair of TEXT_PAIRS) {
    it(`${pair.foreground} on ${pair.background} — ${pair.usage}`, () => {
      const ratio = contrastRatio(colorOf(pair.foreground), colorOf(pair.background));
      expect(
        ratio,
        `${formatRatio(ratio)} is below ${AA_TEXT.toFixed(1)}:1`,
      ).toBeGreaterThanOrEqual(AA_TEXT);
    });
  }
});

describe('interface element contrast meets WCAG AA', () => {
  for (const pair of UI_PAIRS) {
    it(`${pair.foreground} on ${pair.background} — ${pair.usage}`, () => {
      const ratio = contrastRatio(colorOf(pair.foreground), colorOf(pair.background));
      expect(
        ratio,
        `${formatRatio(ratio)} is below ${AA_LARGE_TEXT.toFixed(1)}:1`,
      ).toBeGreaterThanOrEqual(AA_LARGE_TEXT);
    });
  }
});
