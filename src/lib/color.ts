/**
 * WCAG 2.1 contrast arithmetic.
 *
 * The brief requires contrast to be verified rather than assumed (§6), so the
 * ratios are computed from the token values themselves — by the styleguide page
 * that lists them and by the test that fails the build if a pair regresses.
 */

export interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

const HEX_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Parses `#rgb` or `#rrggbb`. Throws on anything else, rather than guessing. */
export function parseHexColor(hex: string): Rgb {
  const value = hex.trim();

  if (!HEX_PATTERN.test(value)) {
    throw new Error(`Not a hex colour: "${hex}"`);
  }

  const digits = value.slice(1);
  const expanded =
    digits.length === 3
      ? digits
          .split('')
          .map((digit) => `${digit}${digit}`)
          .join('')
      : digits;

  const channels = [0, 2, 4].map((offset) =>
    Number.parseInt(expanded.slice(offset, offset + 2), 16),
  );
  const [r, g, b] = channels;

  if (r === undefined || g === undefined || b === undefined) {
    throw new Error(`Not a hex colour: "${hex}"`);
  }

  return { r, g, b };
}

/** Linearises one 8-bit sRGB channel, per WCAG 2.1 relative luminance. */
function linearise(channel: number): number {
  const normalised = channel / 255;
  return normalised <= 0.03928 ? normalised / 12.92 : ((normalised + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(color: Rgb): number {
  return 0.2126 * linearise(color.r) + 0.7152 * linearise(color.g) + 0.0722 * linearise(color.b);
}

/** Contrast ratio between two hex colours, from 1 to 21. */
export function contrastRatio(foreground: string, background: string): number {
  const luminances = [parseHexColor(foreground), parseHexColor(background)]
    .map(relativeLuminance)
    .sort((a, b) => b - a);

  const [lighter, darker] = luminances;

  if (lighter === undefined || darker === undefined) {
    throw new Error('Unable to compute luminance');
  }

  return (lighter + 0.05) / (darker + 0.05);
}

/** 4.5:1 — the threshold for body text at normal weight and size. */
export const AA_TEXT = 4.5;

/** 3:1 — the threshold for text at 24px, or 18.66px bold, and above. */
export const AA_LARGE_TEXT = 3;

/** Rounds down to one decimal, so a reported figure never overstates a pass. */
export function formatRatio(ratio: number): string {
  return `${(Math.floor(ratio * 10) / 10).toFixed(1)}:1`;
}
