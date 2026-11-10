import { describe, expect, it } from 'vitest';

import { contrastRatio, formatRatio, parseHexColor } from '@/lib/color';

describe('parseHexColor', () => {
  it('accepts six-digit, shorthand, mixed case and padded input', () => {
    expect(parseHexColor('#0e1319')).toEqual({ r: 14, g: 19, b: 25 });
    expect(parseHexColor('#abc')).toEqual({ r: 170, g: 187, b: 204 });
    expect(parseHexColor('  #F8F6F2 ')).toEqual(parseHexColor('#f8f6f2'));
  });

  it('throws rather than guessing at anything that is not a hex colour', () => {
    for (const input of ['f8f6f2', '#12345', 'rgb(0,0,0)', '']) {
      expect(() => parseHexColor(input), input).toThrow(/Not a hex colour/);
    }
  });
});

describe('contrastRatio', () => {
  it('matches the WCAG reference values and is order-independent', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
    expect(contrastRatio('#9c3f17', '#9c3f17')).toBeCloseTo(1, 5);
    expect(contrastRatio('#0e1319', '#f8f6f2')).toBeCloseTo(
      contrastRatio('#f8f6f2', '#0e1319'),
      10,
    );
  });
});

describe('formatRatio', () => {
  it('rounds down, so a reported ratio never overstates a pass', () => {
    expect(formatRatio(4.49)).toBe('4.4:1');
    expect(formatRatio(4.58)).toBe('4.5:1');
  });
});
