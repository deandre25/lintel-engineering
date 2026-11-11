import { getTranslations } from 'next-intl/server';

import { CallToAction } from '@/components/sections/CallToAction';
import { CaseStudyGrid } from '@/components/sections/CaseStudyGrid';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/ButtonLink';
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
  const t = await getTranslations({ locale, namespace: 'work' });

  return pageMetadata({
    locale,
    route: 'work',
    title: t('indexTitle'),
    description: getContent(locale).home.description,
  });
}

/** All four case studies, newest first, led by the number each was measured by. */
export default async function WorkIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const content = getContent(locale);
  const t = await getTranslations('common');
  const tWork = await getTranslations('work');
  const tNav = await getTranslations('nav');

  return (
    <>
      <Container width="bleed" as="section" className="pt-8 pb-section-tight">
        <JsonLd
          data={breadcrumbFor(locale, [{ name: tNav('home'), route: 'home' }], tNav('work'))}
        />

        <Breadcrumb
          locale={locale}
          label={t('breadcrumbLabel')}
          items={[{ label: tNav('home'), route: 'home' }, { label: tNav('work') }]}
        />
        <h1 className="mt-8 max-w-measure-wide font-display text-h2 leading-display tracking-display text-balance text-primary">
          {tWork('indexTitle')}
        </h1>
      </Container>

      <CaseStudyGrid
        index="01"
        heading={content.home.work.heading}
        standfirst={content.home.work.standfirst}
        items={content.caseStudies}
        renderLink={(slug, label) => (
          <Link
            locale={locale}
            route="caseStudy"
            slug={slug}
            className="underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
          >
            {label}
          </Link>
        )}
      />

      <CallToAction
        heading={content.home.engagement.heading}
        body={content.home.engagement.body}
        action={
          <ButtonLink locale={locale} route="contact" variant="inverse">
            {tWork('cta')}
          </ButtonLink>
        }
      />
    </>
  );
}
