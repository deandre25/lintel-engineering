import { getFormatter, getTranslations } from 'next-intl/server';

import { SectionRule } from '@/components/graphics/SectionRule';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Container } from '@/components/ui/Container';
import { Link } from '@/components/ui/Link';
import { getContent } from '@/content/registry';
import { requireLocale } from '@/lib/params';
import { locales } from '@/lib/routing';
import { breadcrumbFor } from '@/lib/schema';
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
  const t = await getTranslations({ locale, namespace: 'insights' });

  return pageMetadata({
    locale,
    route: 'insights',
    title: t('indexTitle'),
    description: getContent(locale).home.description,
  });
}

/** The insights index, newest first. */
export default async function InsightsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = requireLocale((await params).locale);
  const content = getContent(locale);
  const t = await getTranslations('common');
  const tInsights = await getTranslations('insights');
  const tNav = await getTranslations('nav');
  const format = await getFormatter();

  return (
    <Container width="bleed" as="section" className="pt-8 pb-section">
      <JsonLd
        data={breadcrumbFor(locale, [{ name: tNav('home'), route: 'home' }], tNav('insights'))}
      />

      <Breadcrumb
        locale={locale}
        label={t('breadcrumbLabel')}
        items={[{ label: tNav('home'), route: 'home' }, { label: tNav('insights') }]}
      />
      <h1 className="mt-8 max-w-measure-wide font-display text-h2 leading-display tracking-display text-balance text-primary">
        {tInsights('indexTitle')}
      </h1>

      <div className="mt-10">
        <SectionRule index="01" />
      </div>

      <ul className="flex flex-col">
        {content.insights.map((insight) => (
          <li key={insight.slug} className="border-b border-rule py-8">
            <article className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
              <div className="lg:col-span-4">
                <p className="text-micro tracking-wide text-muted uppercase tabular-nums">
                  {tInsights('publishedOn', {
                    date: format.dateTime(new Date(insight.publishedAt), 'long'),
                  })}
                </p>
                <p className="mt-2 text-micro text-muted tabular-nums">
                  {tInsights('readingTime', { minutes: String(insight.readingMinutes) })}
                </p>
                <p className="mt-4 text-caption text-secondary">
                  {tInsights('writtenBy', { author: insight.author })}
                </p>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                <h2 className="font-display text-h4 leading-snug tracking-tight text-balance text-primary">
                  <Link
                    locale={locale}
                    route="insight"
                    slug={insight.slug}
                    className="underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
                  >
                    {insight.title}
                  </Link>
                </h2>
                <p className="mt-4 max-w-measure leading-relaxed text-secondary">
                  {insight.standfirst}
                </p>
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                  {insight.topics.map((topic) => (
                    <li key={topic} className="text-micro tracking-wide text-muted uppercase">
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Container>
  );
}
