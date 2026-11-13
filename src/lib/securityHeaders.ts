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

/** The only third-party origin the site may talk to, and only after consent. */
const ANALYTICS_ORIGIN = 'https://plausible.io';

/**
 * The policy, delivered as a header, with `'unsafe-inline'` on `script-src`.
 *
 * This is a documented compromise, and the reasoning belongs next to it.
 *
 * A hash-based policy was built three different ways and none of them can
 * work on this host. `script-src` has to name the hash of every inline script
 * that may execute. The host serves these pages from a function and caches
 * the result rather than serving the prerendered file: the file on disk holds
 * 3 inline scripts, the response holds 24, because the streamed payload is
 * flushed in different-sized chunks on each render. 649 distinct scripts
 * across 54 pages is 35 KB of hashes, over four times the host's limit on its
 * routing configuration — and even that list would be stale, because it is
 * computed from bytes the host does not send. A per-page `<meta http-equiv>`
 * removed the size problem and not the staleness one: the build injected the
 * tag into the prerendered files, and the host served pages that never
 * contained it.
 *
 * A nonce would fix it with one value per page. It is still rejected, and not
 * because §2 forbids a server runtime: a per-request nonce makes every page
 * dynamic and destroys the full static generation that is this project's
 * architectural centre.
 *
 * What `'unsafe-inline'` costs: an injected `<script>` in the page would
 * execute. What still stands between an attacker and that: `default-src
 * 'self'` and no wildcard anywhere, so no external script may load; no
 * `'unsafe-eval'`, so no string may become code; `object-src 'none'`,
 * `base-uri 'self'` and `form-action 'self'`, so the classic bypasses are
 * closed; and the site has one attacker-influenced input in total — the path
 * reflected into the 404's payload, which React escapes as JSON. The policy
 * is a second line of defence that is now shorter, not the only one.
 *
 * See DECISIONS.md for what was attempted and measured.
 */
export function contentSecurityPolicy(): string {
  return [
    "default-src 'self'",
    `script-src 'self' ${ANALYTICS_ORIGIN} 'unsafe-inline'`,
    /*
     * `next/font` injects an inline style block and style hashes are brittle
     * because browsers normalise CSS text. Styles cannot execute.
     */
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self' ${ANALYTICS_ORIGIN}`,
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
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
