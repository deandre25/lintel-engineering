import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { PortalFrame } from '@/components/graphics/PortalFrame';
import { SectionRule } from '@/components/graphics/SectionRule';
import { CallToAction } from '@/components/sections/CallToAction';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { Link } from '@/components/ui/Link';
import { getCaseStudy, getContent, slugsFor, translateSlug } from '@/content/registry';
import { requireLocale } from '@/lib/params';
import { isLocale, locales, routePath } from '@/lib/routing';
import { breadcrumbFor, caseStudySchema } from '@/lib/schema';
import { absoluteUrl, pageMetadata } from '@/lib/seo';

import type { Locale } from '@/lib/routing';
import type { Metadata } from 'next';

interface Params {
  locale: Locale;
  slug: string;
}

/**
 * Only the enumerated slugs exist. Without this, Next renders an unknown slug
 * on demand to produce its 404, and a request-time hydration payload cannot be
 * hashed at build time, so the Content-Security-Policy blocks it. With it, an
 * unknown slug is answered from the prerendered 404 and the site stays fully
 * static — which §2 requires anyway.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    slugsFor(locale, 'caseStudy').map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: requested, slug } = await params;
  if (!isLocale(requested)) return {};

  const caseStudy = getCaseStudy(requested, slug);
  if (caseStudy === undefined) return {};

  return pageMetadata({
    locale: requested,
    route: 'caseStudy',
    resolveSlug: (target) => translateSlug('caseStudy', slug, requested, target),
    title: caseStudy.title,
    description: caseStudy.description,
  });
}

/**
 * A case study.
 *
 * The facts panel comes first and is a description list, because sector,
 * location, year and duration are the things a reader checks before deciding
 * whether the rest applies to them. Then constraint, approach, outcome and
 * reflection, in that order, which is the order the engagement happened in.
 */
export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { locale: requested, slug } = await params;
  const locale = requireLocale(requested);
  const caseStudy = getCaseStudy(locale, slug);
  if (caseStudy === undefined) notFound();

  const content = getContent(locale);
  const t = await getTranslations('common');
  const tWork = await getTranslations('work');
  const tNav = await getTranslations('nav');

  const facts = [
    { term: tWork('sector'), description: caseStudy.sector },
    { term: tWork('location'), description: caseStudy.location },
    { term: tWork('year'), description: String(caseStudy.year) },
    { term: tWork('duration'), description: caseStudy.duration },
    { term: tWork('client'), description: caseStudy.client },
  ];

  const usedServices = caseStudy.services
    .map((id) => content.services.find((service) => service.id === id))
    .filter((service) => service !== undefined);

  const narrative = [
    { index: '01', block: caseStudy.constraint },
    { index: '02', block: caseStudy.approach },
    { index: '03', block: caseStudy.outcome },
    { index: '04', block: caseStudy.reflection },
  ];

  const canonical = absoluteUrl(routePath(locale, 'caseStudy', caseStudy.slug));

  return (
    <>
      <JsonLd
        data={[
          caseStudySchema(locale, caseStudy, canonical),
          breadcrumbFor(
            locale,
            [
              { name: tNav('home'), route: 'home' },
              { name: tNav('work'), route: 'work' },
            ],
            caseStudy.title,
          ),
        ]}
      />

      <Container width="bleed" as="section" className="pt-8 pb-section-tight">
        <Breadcrumb
          locale={locale}
          label={t('breadcrumbLabel')}
          items={[
            { label: tNav('home'), route: 'home' },
            { label: tNav('work'), route: 'work' },
            { label: caseStudy.title },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-8">
            <h1 className="font-display text-h2 leading-display tracking-display text-balance text-primary">
              {caseStudy.title}
            </h1>
            <p className="mt-6 max-w-measure text-lead leading-snug text-secondary">
              {caseStudy.summary}
            </p>
          </div>

          <div className="lg:col-span-3 lg:col-start-10">
            <p className="font-display text-h2 leading-tight tracking-tight text-accent tabular-nums">
              {caseStudy.headline.value}
            </p>
            <p className="mt-3 max-w-measure-narrow text-caption leading-relaxed text-muted">
              {caseStudy.headline.label}
            </p>
          </div>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-rule-strong pt-6 sm:grid-cols-3 lg:grid-cols-5">
          {facts.map((fact) => (
            <div key={fact.term}>
              <dt className="text-micro font-medium tracking-eyebrow text-muted uppercase">
                {fact.term}
              </dt>
              <dd className="mt-2 text-caption leading-relaxed text-primary tabular-nums">
                {fact.description}
              </dd>
            </div>
          ))}
        </dl>
      </Container>

      <Container width="bleed" as="section" className="pb-section-tight">
        <PortalFrame className="h-auto w-full text-ink-700" />
      </Container>

      {narrative.map(({ index, block }) => (
        <Container key={block.heading} width="bleed" as="section" className="pb-section-tight">
          <SectionRule index={index} />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <h2 className="font-display text-h4 leading-snug tracking-tight text-primary lg:col-span-4">
              {block.heading}
            </h2>
            <div className="flex max-w-measure flex-col gap-5 lg:col-span-7 lg:col-start-6">
              {block.body.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="leading-relaxed text-secondary">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      ))}

      {usedServices.length === 0 ? null : (
        <Container width="bleed" as="section" className="pb-section-tight">
          <SectionRule index="05" />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <h2 className="font-display text-h4 leading-snug tracking-tight text-primary lg:col-span-4">
              {tWork('servicesUsed')}
            </h2>
            <ul className="flex flex-col gap-5 lg:col-span-7 lg:col-start-6">
              {usedServices.map((service) => (
                <li key={service.id}>
                  <h3 className="text-body-lg text-primary">
                    <Link
                      locale={locale}
                      route="service"
                      slug={service.slug}
                      className="underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
                    >
                      {service.name}
                    </Link>
                  </h3>
                  <p className="mt-1 max-w-measure text-caption leading-relaxed text-muted">
                    {service.summary}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      )}

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
