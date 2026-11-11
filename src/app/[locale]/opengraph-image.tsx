import { getContent } from '@/content/registry';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';
import { requireLocale } from '@/lib/params';
import { locales } from '@/lib/routing';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Lintel Engineering';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** The home page's card: the positioning line over the brand mark. */
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const { home } = getContent(locale);

  return renderOgImage({ title: home.hero.heading, eyebrow: home.hero.eyebrow });
}
