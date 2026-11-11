import { getTranslations } from 'next-intl/server';

import { CallToAction } from '@/components/sections/CallToAction';
import { CaseStudyGrid } from '@/components/sections/CaseStudyGrid';
import { DisciplineList } from '@/components/sections/DisciplineList';
import { Figures } from '@/components/sections/Figures';
import { Hero } from '@/components/sections/Hero';
import { Positioning } from '@/components/sections/Positioning';
import { JsonLd } from '@/components/seo/JsonLd';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Link } from '@/components/ui/Link';
import { company } from '@/content/company';
import { getContent } from '@/content/registry';
import { requireLocale } from '@/lib/params';
import { locales } from '@/lib/routing';
import { organizationSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

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
  const { home } = getContent(locale);

  /*
   * The home page is the one route whose title is not run through the
   * `%s — Lintel Engineering` template: §9 specifies
   * `Lintel Engineering — {positioning}`, which is the other way round.
   */
  return {
    ...pageMetadata({ locale, route: 'home', title: home.title, description: home.description }),
    title: { absolute: `${company.name} — ${home.title}` },
  };
}

/**
 * The home page.
 *
 * Sections receive typed content as props and know nothing about routing or
 * locale (§7), so the links they contain are passed in as render props from
 * here — the one place that is allowed to know both.
 *
 * Two of the four case studies are shown rather than all four: the page is an
 * argument, and the index exists for the full list.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const content = getContent(locale);
  const t = await getTranslations('common');

  const { home, disciplines, services, caseStudies } = content;

  const groups: DisciplineGroup[] = disciplines.map((discipline) => ({
    id: discipline.id,
    name: discipline.name,
    description: discipline.description,
    headcount: discipline.headcount,
    services: services
      .filter((service) => service.discipline === discipline.id)
      .map((service) => ({ slug: service.slug, name: service.name, summary: service.summary })),
  }));

  return (
    <>
      <JsonLd data={organizationSchema(locale)} />

      <Hero
        eyebrow={home.hero.eyebrow}
        heading={home.hero.heading}
        lead={home.hero.lead}
        action={
          <ButtonLink locale={locale} route="contact" variant="secondary">
            {home.engagement.cta}
          </ButtonLink>
        }
      />

      <Positioning index="01" heading={home.positioning.heading} body={home.positioning.body} />

      <DisciplineList
        index="02"
        heading={home.disciplines.heading}
        standfirst={home.disciplines.standfirst}
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

      <CaseStudyGrid
        index="03"
        heading={home.work.heading}
        standfirst={home.work.standfirst}
        items={caseStudies.slice(0, 2)}
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
        footer={
          <Link
            locale={locale}
            route="work"
            className="text-caption font-medium tracking-wide text-primary uppercase underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
          >
            {home.work.cta}
          </Link>
        }
      />

      <Figures index="04" heading={home.figures.heading} items={home.figures.items} />

      <CallToAction
        heading={home.engagement.heading}
        body={home.engagement.body}
        action={
          <ButtonLink locale={locale} route="contact" variant="inverse">
            {home.engagement.cta}
          </ButtonLink>
        }
      />
    </>
  );
}
