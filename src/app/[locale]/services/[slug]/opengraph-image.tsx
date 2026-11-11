import { getContent, getService, slugsFor } from '@/content/registry';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';
import { requireLocale } from '@/lib/params';
import { locales } from '@/lib/routing';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Lintel Engineering';

export function generateStaticParams() {
  return locales.flatMap((locale) => slugsFor(locale, 'service').map((slug) => ({ locale, slug })));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: requested, slug } = await params;
  const locale = requireLocale(requested);

  const service = getService(locale, slug);
  const discipline = getContent(locale).disciplines.find((item) => item.id === service?.discipline);

  return renderOgImage({
    title: service?.title ?? 'Lintel Engineering',
    eyebrow: discipline?.name ?? '',
  });
}
