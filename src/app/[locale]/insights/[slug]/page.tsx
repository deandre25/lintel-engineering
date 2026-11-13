import { notFound } from 'next/navigation';
import { getFormatter, getTranslations } from 'next-intl/server';
import { createElement } from 'react';

import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Container } from '@/components/ui/Container';
import { Link } from '@/components/ui/Link';
import { Prose } from '@/components/ui/Prose';
import { getArticleBody } from '@/content/articles';
import { getInsight, slugsFor, translateSlug } from '@/content/registry';
import { requireLocale } from '@/lib/params';
import { isLocale, locales, routePath } from '@/lib/routing';
import { articleSchema, breadcrumbFor } from '@/lib/schema';
import { absoluteUrl, pageMetadata } from '@/lib/seo';

import type { Metadata } from 'next';

interface Params {
  locale: string;
  slug: string;
}

export function generateStaticParams() {
  return locales.flatMap((locale) => slugsFor(locale, 'insight').map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: requested, slug } = await params;
  if (!isLocale(requested)) return {};

  const insight = getInsight(requested, slug);
  if (insight === undefined) return {};

  return pageMetadata({
    locale: requested,
    route: 'insight',
    resolveSlug: (target) => translateSlug('insight', slug, requested, target),
    title: insight.title,
    description: insight.description,
    publishedTime: insight.publishedAt,
    authors: [insight.author],
  });
}

/**
 * An insight article.
 *
 * The body is an MDX module imported by locale and slug. The import is a
 * template literal, which Turbopack resolves at build time against the two
 * directories below; an unknown slug cannot reach here, because
 * `generateStaticParams` enumerates them and anything else is a 404 above.
 */
export default async function InsightPage({ params }: { params: Promise<Params> }) {
  const { locale: requested, slug } = await params;
  const locale = requireLocale(requested);

  const insight = getInsight(locale, slug);
  if (insight === undefined) notFound();

  const t = await getTranslations('common');
  const tInsights = await getTranslations('insights');
  const tNav = await getTranslations('nav');
  const format = await getFormatter();

  /*
   * Looked up from a module-level map, so its identity is stable across
   * renders. The name is lowercase and it is rendered with `createElement`
   * because it is a value selected here, not a component defined here — which
   * is what `react-hooks/static-components` is guarding against.
   */
  const articleBody = getArticleBody(locale, insight.id);
  if (articleBody === undefined) notFound();

  const canonical = absoluteUrl(routePath(locale, 'insight', insight.slug));

  return (
    <Container width="bleed" as="article" className="pt-8 pb-section">
      <JsonLd
        data={[
          articleSchema(locale, insight, canonical, `${canonical}/opengraph-image`),
          breadcrumbFor(
            locale,
            [
              { name: tNav('home'), route: 'home' },
              { name: tNav('insights'), route: 'insights' },
            ],
            insight.title,
          ),
        ]}
      />

      <Breadcrumb
        locale={locale}
        label={t('breadcrumbLabel')}
        items={[
          { label: tNav('home'), route: 'home' },
          { label: tNav('insights'), route: 'insights' },
          { label: insight.title },
        ]}
      />

      <header className="mt-8 border-b border-rule pb-8">
        <h1 className="max-w-measure-wide font-display text-h2 leading-display tracking-display text-balance text-primary">
          {insight.title}
        </h1>
        <p className="mt-6 max-w-measure text-lead leading-snug text-secondary">
          {insight.standfirst}
        </p>

        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-micro text-muted tabular-nums">
          <div className="flex gap-2">
            <dt className="tracking-wide uppercase">{tInsights('writtenBy', { author: '' })}</dt>
            <dd className="text-secondary">{insight.author}</dd>
          </div>
          <div>
            <dt className="sr-only">{tInsights('publishedOn', { date: '' })}</dt>
            <dd>
              <time dateTime={insight.publishedAt}>
                {format.dateTime(new Date(insight.publishedAt), 'long')}
              </time>
            </dd>
          </div>
          <div>
            <dt className="sr-only">{tInsights('topics')}</dt>
            <dd>{tInsights('readingTime', { minutes: String(insight.readingMinutes) })}</dd>
          </div>
        </dl>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Prose>{createElement(articleBody)}</Prose>

          <div className="mt-10 border-t border-rule pt-6">
            <Link
              locale={locale}
              route="insights"
              className="text-caption font-medium tracking-wide text-primary uppercase underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
            >
              {tInsights('backToIndex')}
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
