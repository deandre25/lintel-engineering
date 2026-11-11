import { LegalRoute } from '@/components/sections/LegalRoute';
import { getContent } from '@/content/registry';
import { requireLocale } from '@/lib/params';
import { locales } from '@/lib/routing';
import { pageMetadata } from '@/lib/seo';

import type { Metadata } from 'next';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const page = getContent(locale).legal.terms;

  return pageMetadata({
    locale,
    route: 'terms',
    title: page.title,
    description: page.description,
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);

  return <LegalRoute locale={locale} page="terms" />;
}
