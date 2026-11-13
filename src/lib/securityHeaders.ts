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

/** The only third-party origin the site may talk to, and only after consent. */
const ANALYTICS_ORIGIN = 'https://plausible.io';

export interface HeaderRule {
  readonly key: string;
  readonly value: string;
}

/**
 * The token the post-build step replaces with the real hashes.
 *
 * `headers()` runs before any page is rendered, so a build cannot know the
 * hashes of its own output. Rather than build twice and hope the host serves
 * the second pass, the policy ships a placeholder and
 * `scripts/generate-csp.mjs` rewrites it in `.next/routes-manifest.json` —
 * the file both `next start` and the host read to build their routing.
 *
 * The hashes therefore always come from the build that is actually deployed.
 * They cannot be committed: chunk filenames are content-hashed and differ
 * between build environments, so a list produced on one machine does not
 * match HTML produced on another. That was measured — every one of the 54
 * hashes differed between a local build and a CI build of the same commit.
 */
export const CSP_HASH_PLACEHOLDER = "'sha256-REPLACED-AFTER-BUILD'";

export function contentSecurityPolicy(): string {
  return [
    "default-src 'self'",
    /*
     * `'self'` covers the chunk files; the hashes cover the bootstrap and the
     * per-page hydration payload. Nothing else may execute.
     */
    /*
     * The analytics host is named here so that declining consent is the only
     * thing that stops it loading. If CSP blocked it too, the consent gate
     * would appear to work for the wrong reason and a regression in the gate
     * would be invisible. One named host, no wildcard.
     */
    `script-src 'self' ${ANALYTICS_ORIGIN} ${CSP_HASH_PLACEHOLDER}`,
    /*
     * Tailwind emits a stylesheet, but `next/font` injects a small inline style
     * block for the font-face declarations, and style hashes are brittle
     * because the browser normalises CSS text. This is the one relaxation and
     * it is limited to styles, which cannot execute.
     */
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self' ${ANALYTICS_ORIGIN}`,
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
