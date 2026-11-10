import { describe, expect, it } from 'vitest';

import { contrastRatio, formatRatio, parseHexColor, relativeLuminance } from '@/lib/color';

describe('parseHexColor', () => {
  it('parses six-digit hex', () => {
    expect(parseHexColor('#0e1319')).toEqual({ r: 14, g: 19, b: 25 });
  });

  it('expands three-digit shorthand', () => {
    expect(parseHexColor('#abc')).toEqual({ r: 170, g: 187, b: 204 });
  });

  it('ignores case and surrounding whitespace', () => {
    expect(parseHexColor('  #F8F6F2 ')).toEqual(parseHexColor('#f8f6f2'));
  });

  it('throws on anything that is not a hex colour', () => {
    expect(() => parseHexColor('f8f6f2')).toThrow(/Not a hex colour/);
    expect(() => parseHexColor('#12345')).toThrow(/Not a hex colour/);
    expect(() => parseHexColor('rgb(0,0,0)')).toThrow(/Not a hex colour/);
  });
});

describe('relativeLuminance', () => {
  it('is 0 for black and 1 for white', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 5);
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5);
  });
});

describe('contrastRatio', () => {
  it('returns 21:1 for black against white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
  });

  it('returns 1:1 for a colour against itself', () => {
    expect(contrastRatio('#9c3f17', '#9c3f17')).toBeCloseTo(1, 5);
  });

  it('is symmetric, so argument order cannot change a pass into a failure', () => {
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
    expect(formatRatio(21)).toBe('21.0:1');
  });
});
