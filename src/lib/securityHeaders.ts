import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Security response headers (§10).
 *
 * The Content-Security-Policy names the SHA-256 hash of every inline script in
 * the build output rather than carrying a nonce. A nonce has to be generated
 * per request, which needs a server runtime; §2 forbids one, and on a site
 * where every page is prerendered the inline scripts are known at build time,
 * so hashes express exactly the same guarantee without the runtime.
 *
 * There is no `unsafe-inline` and no `unsafe-eval`.
 */

export interface HeaderRule {
  readonly key: string;
  readonly value: string;
}

/**
 * Reads the hashes produced by `scripts/generate-csp.mjs`.
 *
 * Absent on the first pass of a two-pass build, and on a dev server. Returning
 * an empty list there is deliberate: the policy is still emitted, just without
 * hashes, so a missing file breaks the inline scripts loudly in development
 * rather than silently weakening the shipped policy.
 */
function inlineScriptHashes(): string[] {
  try {
    const raw = readFileSync(join(process.cwd(), 'csp-hashes.json'), 'utf8');
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

export function contentSecurityPolicy(): string {
  const hashes = inlineScriptHashes()
    .map((hash) => `'${hash}'`)
    .join(' ');

  return [
    "default-src 'self'",
    /*
     * `'self'` covers the chunk files; the hashes cover the bootstrap and the
     * per-page hydration payload. Nothing else may execute.
     */
    `script-src 'self' ${hashes}`.trim(),
    /*
     * Tailwind emits a stylesheet, but `next/font` injects a small inline style
     * block for the font-face declarations, and style hashes are brittle
     * because the browser normalises CSS text. This is the one relaxation and
     * it is limited to styles, which cannot execute.
     */
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    /* No third-party endpoints: the site makes no cross-origin requests. */
    "connect-src 'self'",
    "form-action 'self'",
    /* Both are set: `frame-ancestors` supersedes X-Frame-Options where honoured. */
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}

/**
 * The headers that are the same for every response.
 *
 * `frame-ancestors` and `report-uri` are ignored in a `<meta>` CSP, so the
 * policy is delivered as a header rather than as markup.
 */
export function securityHeaders(): HeaderRule[] {
  return [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy() },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    /* Deny everything the site does not use, rather than listing what it does. */
    {
      key: 'Permissions-Policy',
      value: [
        'accelerometer=()',
        'autoplay=()',
        'camera=()',
        'display-capture=()',
        'encrypted-media=()',
        'fullscreen=(self)',
        'geolocation=()',
        'gyroscope=()',
        'magnetometer=()',
        'microphone=()',
        'midi=()',
        'payment=()',
        'usb=()',
        'xr-spatial-tracking=()',
      ].join(', '),
    },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  ];
}
