import { ImageResponse } from 'next/og';

import { company } from '@/content/company';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

export interface OgImageInput {
  /** The page's own title. Set large; the brand mark carries the identity. */
  title: string;
  /** A short label above the title: the discipline, the section, the date. */
  eyebrow: string;
}

/**
 * One renderer for every Open Graph image (§9).
 *
 * Each page passes its own title, so no two pages share an image. Every route
 * that uses it enumerates its params, which is what makes `next/og` emit a PNG
 * at build time rather than rendering one per request — §2 forbids a runtime,
 * and the build output was checked to confirm real 1200x630 files.
 *
 * It uses the system sans rather than the site's display face. `ImageResponse`
 * needs raw font bytes, and `next/font` keeps its copies under hashed names in
 * the build output that source cannot address; committing a second copy of a
 * font the site already ships would be a duplicate asset to keep in step. The
 * layout, the rule and the mark carry the brand instead.
 */
export function renderOgImage({ title, eyebrow }: OgImageInput): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#0e1319',
        padding: '64px 72px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {/* The lintel: a beam on two piers, drawn with the same geometry as the site's mark. */}
        <div style={{ display: 'flex', flexDirection: 'column', width: 48 }}>
          <div style={{ width: 48, height: 7, background: '#d1764a' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', width: 48 }}>
            <div style={{ width: 7, height: 21, background: '#d1764a' }} />
            <div style={{ width: 7, height: 21, background: '#d1764a' }} />
          </div>
        </div>
        <div style={{ color: '#f8f6f2', fontSize: 30, letterSpacing: '-0.01em' }}>
          {company.name}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            color: '#d1764a',
            fontSize: 22,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </div>
        {/*
         * Satori requires an explicit display on any element with more than
         * one child, and it lays out with flexbox only. The size steps down
         * for a long title so a four-line heading still fits the card.
         */}
        <div
          style={{
            display: 'flex',
            marginTop: 24,
            color: '#f8f6f2',
            fontSize: title.length > 64 ? 54 : 68,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 120, height: 1, background: '#2e3845' }} />
        {/* One expression rather than three children: Satori needs a display otherwise. */}
        <div style={{ color: '#98a2b0', fontSize: 20 }}>
          {`${company.address.city}, ${company.address.country.en}`}
        </div>
      </div>
    </div>,
    OG_SIZE,
  );
}
