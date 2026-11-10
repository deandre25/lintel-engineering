import { describe, expect, it } from 'vitest';

import { AA_LARGE_TEXT, AA_TEXT, contrastRatio, formatRatio, parseHexColor } from '@/lib/color';
import { TEXT_PAIRINGS, UI_PAIRINGS } from '@/lib/contrastPairs';
import { readColorTokens } from '@/lib/tokens';

import type { ContrastPairing } from '@/lib/contrastPairs';

const tokens = readColorTokens();

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
function failuresBelow(pairs: readonly ContrastPairing[], threshold: number): string[] {
  return pairs.flatMap((pair) => {
    const ratio = contrastRatio(colorOf(pair.foreground), colorOf(pair.background));
    if (ratio >= threshold) return [];
    return [`${pair.foreground} on ${pair.background} (${pair.usage}) is ${formatRatio(ratio)}`];
  });
}

describe('colour tokens', () => {
  it('declares every token a pairing references', () => {
    const referenced = new Set(
      [...TEXT_PAIRINGS, ...UI_PAIRINGS].flatMap((pair) => [pair.foreground, pair.background]),
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
  it(`meets ${AA_TEXT.toFixed(1)}:1 for all ${String(TEXT_PAIRINGS.length)} text pairings`, () => {
    expect(failuresBelow(TEXT_PAIRINGS, AA_TEXT)).toEqual([]);
  });

  it(`meets ${AA_LARGE_TEXT.toFixed(1)}:1 for all ${String(UI_PAIRINGS.length)} interface pairings`, () => {
    expect(failuresBelow(UI_PAIRINGS, AA_LARGE_TEXT)).toEqual([]);
  });
});
