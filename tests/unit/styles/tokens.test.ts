import { describe, expect, it } from 'vitest';

import { AA_LARGE_TEXT, AA_TEXT, contrastRatio, formatRatio, parseHexColor } from '@/lib/color';
import { readColorTokens } from '@/lib/tokens';

const tokens = readColorTokens();

interface Pairing {
  readonly foreground: string;
  readonly background: string;
  readonly usage: string;
}

/**
 * Every text pairing the components actually use. Adding a combination to the
 * UI without adding it here is the gap this suite exists to make obvious.
 */
const TEXT_PAIRS: readonly Pairing[] = [
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
];

/** Focus rings and borders, which WCAG treats as interface components at 3:1. */
const UI_PAIRS: readonly Pairing[] = [
  { foreground: 'accent', background: 'paper', usage: 'focus ring on the page surface' },
  { foreground: 'accent', background: 'paper-raised', usage: 'focus ring on raised panels' },
  { foreground: 'accent-on-dark', background: 'ink-900', usage: 'focus ring, inverse' },
  { foreground: 'ink-900', background: 'paper', usage: 'bordered button outline' },
];

function colorOf(token: string): string {
  const value = tokens[token];
  if (value === undefined) {
    throw new Error(`Token --${token} is not declared in src/styles/tokens.css`);
  }
  return value;
}

/**
 * Collects every pairing below the threshold rather than failing on the first,
 * so one run reports the whole problem instead of one pair at a time.
 */
function failuresBelow(pairs: readonly Pairing[], threshold: number): string[] {
  return pairs.flatMap((pair) => {
    const ratio = contrastRatio(colorOf(pair.foreground), colorOf(pair.background));
    if (ratio >= threshold) return [];
    return [`${pair.foreground} on ${pair.background} (${pair.usage}) is ${formatRatio(ratio)}`];
  });
}

describe('colour tokens', () => {
  it('declares every token a pairing references', () => {
    const referenced = new Set(
      [...TEXT_PAIRS, ...UI_PAIRS].flatMap((pair) => [pair.foreground, pair.background]),
    );

    const undeclared = [...referenced].filter((token) => tokens[token] === undefined);
    expect(undeclared).toEqual([]);
  });

  it('uses no pure black or white, and gives every neutral a hue', () => {
    const pureValues = Object.entries(tokens)
      .filter(([, value]) => ['#000000', '#ffffff'].includes(value.toLowerCase()))
      .map(([name]) => name);
    expect(pureValues).toEqual([]);

    const flatGreys = ['ink-900', 'ink-700', 'ink-500', 'ink-300', 'ink-100'].filter((name) => {
      const { r, g, b } = parseHexColor(colorOf(name));
      return new Set([r, g, b]).size === 1;
    });
    expect(flatGreys).toEqual([]);
  });
});

describe('contrast', () => {
  it(`meets ${AA_TEXT.toFixed(1)}:1 for all ${String(TEXT_PAIRS.length)} text pairings`, () => {
    expect(failuresBelow(TEXT_PAIRS, AA_TEXT)).toEqual([]);
  });

  it(`meets ${AA_LARGE_TEXT.toFixed(1)}:1 for all ${String(UI_PAIRS.length)} interface pairings`, () => {
    expect(failuresBelow(UI_PAIRS, AA_LARGE_TEXT)).toEqual([]);
  });
});
