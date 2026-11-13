import { getTranslations } from 'next-intl/server';

import { CallToAction } from '@/components/sections/CallToAction';
import { DisciplineList } from '@/components/sections/DisciplineList';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { Link } from '@/components/ui/Link';
import { getContent } from '@/content/registry';
import { requireLocale } from '@/lib/params';
import { locales } from '@/lib/routing';

import type { DisciplineGroup } from '@/components/sections/DisciplineList';
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
  const t = await getTranslations({ locale, namespace: 'services' });

  return { title: t('indexTitle'), description: getContent(locale).home.description };
}

/** The services index: the same grouping the home page shows, in full. */
export default async function ServicesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = requireLocale((await params).locale);
  const content = getContent(locale);
  const t = await getTranslations('common');
  const tServices = await getTranslations('services');
  const tNav = await getTranslations('nav');

  const groups: DisciplineGroup[] = content.disciplines.map((discipline) => ({
    id: discipline.id,
    name: discipline.name,
    description: discipline.description,
    headcount: discipline.headcount,
    services: content.services
      .filter((service) => service.discipline === discipline.id)
      .map((service) => ({ slug: service.slug, name: service.name, summary: service.summary })),
  }));

  return (
    <>
      <Container width="bleed" as="section" className="pt-8 pb-section-tight">
        <Breadcrumb
          locale={locale}
          label={t('breadcrumbLabel')}
          items={[{ label: tNav('home'), route: 'home' }, { label: tNav('services') }]}
        />
        <h1 className="mt-8 max-w-measure-wide font-display text-h2 leading-display tracking-display text-balance text-primary">
          {tServices('indexTitle')}
        </h1>
        <p className="mt-6 max-w-measure text-lead leading-snug text-secondary">
          {tServices('indexDescription')}
        </p>
      </Container>

      <DisciplineList
        index="01"
        heading={content.home.disciplines.heading}
        standfirst={content.home.disciplines.standfirst}
        groups={groups}
        headcountLabel={(count) => t('peopleInDiscipline', { count })}
        renderServiceLink={(slug, label) => (
          <Link
            locale={locale}
            route="service"
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
            {tServices('cta')}
          </ButtonLink>
        }
      />
    </>
  );
}
