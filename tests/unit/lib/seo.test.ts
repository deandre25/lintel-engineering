import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { absoluteUrl, buildAlternates, pageMetadata, siteOrigin } from '@/lib/seo';

const ORIGINAL = process.env.NEXT_PUBLIC_SITE_URL;

beforeEach(() => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://lintel-engineering.com';
});

afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL;
});

describe('siteOrigin', () => {
  it('strips a trailing slash and rejects an origin without a scheme', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.org/';
    expect(siteOrigin()).toBe('https://example.org');
    expect(absoluteUrl('/en')).toBe('https://example.org/en');

    /* A relative origin would make every canonical on the site wrong. */
    process.env.NEXT_PUBLIC_SITE_URL = 'example.org';
    expect(() => siteOrigin()).toThrow(/absolute URL/);
  });
});

describe('buildAlternates', () => {
  it('gives a static route a canonical, both locales and x-default', () => {
    expect(buildAlternates({ locale: 'ro', route: 'about' })).toEqual({
      canonical: 'https://lintel-engineering.com/ro/despre-noi',
      languages: {
        en: 'https://lintel-engineering.com/en/about',
        ro: 'https://lintel-engineering.com/ro/despre-noi',
        'x-default': 'https://lintel-engineering.com/en/about',
      },
    });
  });

  it('resolves a dynamic route through the slug resolver it is given', () => {
    const slugs = { en: 'structural-engineering', ro: 'inginerie-structurala' };

    expect(
      buildAlternates({ locale: 'en', route: 'service', resolveSlug: (target) => slugs[target] }),
    ).toEqual({
      canonical: 'https://lintel-engineering.com/en/services/structural-engineering',
      languages: {
        en: 'https://lintel-engineering.com/en/services/structural-engineering',
        ro: 'https://lintel-engineering.com/ro/servicii/inginerie-structurala',
        'x-default': 'https://lintel-engineering.com/en/services/structural-engineering',
      },
    });
  });

  it('omits a locale that has no counterpart rather than inventing a URL', () => {
    const alternates = buildAlternates({
      locale: 'en',
      route: 'insight',
      resolveSlug: (target) => (target === 'en' ? 'only-in-english' : undefined),
    });

    expect(alternates.languages).not.toHaveProperty('ro');
    expect(alternates.languages['x-default']).toBe(alternates.canonical);
  });
});

describe('pageMetadata', () => {
  it('declares a page as a website and an article as an article', () => {
    const page = pageMetadata({
      locale: 'en',
      route: 'about',
      title: 'About',
      description: 'A description.',
    });
    /* Next types `openGraph` as a union, so the shape is matched, not indexed. */
    expect(page.openGraph).toMatchObject({ type: 'website' });
    expect(page.openGraph).not.toHaveProperty('publishedTime');

    const article = pageMetadata({
      locale: 'ro',
      route: 'insight',
      resolveSlug: () => 'oboseala-imbinarilor-sudate',
      title: 'Oboseala',
      description: 'O descriere.',
      publishedTime: '2026-09-22',
      authors: ['Adriana Pîrvu'],
    });
    expect(article.openGraph).toMatchObject({ type: 'article', publishedTime: '2026-09-22' });
  });

  it('maps the locale to the Open Graph locale and keeps the title untemplated', () => {
    const ro = pageMetadata({
      locale: 'ro',
      route: 'contact',
      title: 'Contact',
      description: 'O descriere.',
    });

    expect(ro.openGraph).toMatchObject({ locale: 'ro_RO' });
    /* The layout owns `%s — Lintel Engineering`; repeating it here doubles it. */
    expect(ro.title).toBe('Contact');
    expect(ro.twitter).toMatchObject({ card: 'summary_large_image' });
  });
});
