/**
 * Security response headers (§10).
 *
 * The Content-Security-Policy is split in two. This file carries the
 * directives that only work as a header; `scripts/generate-csp.mjs` injects
 * the rest, including `script-src` and its hashes, into each page's `<head>`.
 *
 * There is no `unsafe-inline` for scripts and no `unsafe-eval` anywhere.
 */

export interface HeaderRule {
  readonly key: string;
  readonly value: string;
}

/**
 * The part of the policy that has to travel as a header.
 *
 * Everything else is delivered per page in a `<meta http-equiv>` tag, written
 * by `scripts/generate-csp.mjs` after the build — see that file for the
 * document policy and for why it is not here.
 *
 * The split is forced by arithmetic. `script-src` has to name the SHA-256 hash
 * of every inline script that may execute, and the host's build produces 649
 * distinct inline scripts across 54 pages, or 35 KB of hashes. That is four
 * times the host's limit on its whole routing configuration, so it cannot be a
 * header at any amount of trimming. A page only ever executes its own scripts,
 * though, so a per-page policy names a few dozen hashes instead of 649.
 *
 * What stays here is what a `<meta>` CSP is specified to ignore:
 * `frame-ancestors`, `report-to` and `sandbox`. None of them take a hash, so
 * none of them grow. `frame-ancestors` is the one in use.
 *
 * A nonce would collapse the problem to one value per page, and is still
 * rejected — not for §2's sake, but because a per-request nonce makes every
 * page dynamic and destroys the full static generation this project is built
 * around.
 */
export function contentSecurityPolicy(): string {
  return ["frame-ancestors 'none'"].join('; ');
}

/** The headers that are the same for every response. */
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
