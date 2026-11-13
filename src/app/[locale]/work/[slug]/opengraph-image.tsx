import { getCaseStudy, slugsFor } from '@/content/registry';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';
import { requireLocale } from '@/lib/params';
import { locales } from '@/lib/routing';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Lintel Engineering';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    slugsFor(locale, 'caseStudy').map((slug) => ({ locale, slug })),
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: requested, slug } = await params;
  const locale = requireLocale(requested);
  const caseStudy = getCaseStudy(locale, slug);

  /* The card leads with the result, as the case study index does. */
  return renderOgImage({
    title: caseStudy?.title ?? 'Lintel Engineering',
    eyebrow: caseStudy === undefined ? '' : `${caseStudy.sector} · ${String(caseStudy.year)}`,
  });
}
