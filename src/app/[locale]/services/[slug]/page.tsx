import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { AxisDiagram } from '@/components/graphics/AxisDiagram';
import { SectionRule } from '@/components/graphics/SectionRule';
import { CallToAction } from '@/components/sections/CallToAction';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { Disclosure } from '@/components/ui/Disclosure';
import { Link } from '@/components/ui/Link';
import { Prose } from '@/components/ui/Prose';
import { getContent, getService, slugsFor } from '@/content/registry';
import { requireLocale } from '@/lib/params';
import { isLocale, locales } from '@/lib/routing';

import type { Locale } from '@/lib/routing';
import type { Metadata } from 'next';

interface Params {
  locale: Locale;
  slug: string;
}

export function generateStaticParams() {
  return locales.flatMap((locale) => slugsFor(locale, 'service').map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: requested, slug } = await params;
  if (!isLocale(requested)) return {};

  const service = getService(requested, slug);
  if (service === undefined) return {};

  return { title: service.title, description: service.description };
}

/**
 * A service page.
 *
 * The order is the order a prospective client reads in: what this is, when you
 * would call, what it covers, how we work, what we work to, how long it takes,
 * and the questions we are actually asked. The related case study sits at the
 * end as evidence rather than at the top as decoration.
 */
export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { locale: requested, slug } = await params;
  const locale = requireLocale(requested);
  const service = getService(locale, slug);
  if (service === undefined) notFound();

  const content = getContent(locale);
  const t = await getTranslations('common');
  const tServices = await getTranslations('services');
  const tNav = await getTranslations('nav');

  const related = content.caseStudies.find(
    (caseStudy) => caseStudy.id === service.relatedCaseStudy,
  );
  const discipline = content.disciplines.find((item) => item.id === service.discipline);

  return (
    <>
      <Container width="bleed" as="section" className="pt-8 pb-section-tight">
        <Breadcrumb
          locale={locale}
          label={t('breadcrumbLabel')}
          items={[
            { label: tNav('home'), route: 'home' },
            { label: tNav('services'), route: 'services' },
            { label: service.name },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            {discipline === undefined ? null : (
              <p className="text-micro font-medium tracking-eyebrow text-accent uppercase">
                {discipline.name}
              </p>
            )}
            <h1 className="mt-6 font-display text-h2 leading-display tracking-display text-balance text-primary">
              {service.title}
            </h1>
            <p className="mt-6 max-w-measure text-lead leading-snug text-secondary">
              {service.intro}
            </p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <AxisDiagram className="h-auto w-full text-ink-600" />
          </div>
        </div>
      </Container>

      <Container width="bleed" as="section" className="pb-section-tight">
        <SectionRule index="01" />
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <h2 className="font-display text-h4 leading-snug tracking-tight text-primary lg:col-span-4">
            {service.whenToCall.heading}
          </h2>
          <ul className="flex max-w-measure flex-col lg:col-span-7 lg:col-start-6">
            {service.whenToCall.items.map((item) => (
              <li key={item} className="border-b border-rule py-4 leading-relaxed text-secondary">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container width="bleed" as="section" className="pb-section-tight">
        <SectionRule index="02" />
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <h2 className="font-display text-h4 leading-snug tracking-tight text-primary lg:col-span-4">
            {service.coverage.heading}
          </h2>
          <dl className="flex flex-col gap-8 lg:col-span-7 lg:col-start-6">
            {service.coverage.items.map((item) => (
              <div key={item.term}>
                <dt className="text-body-lg text-primary">{item.term}</dt>
                <dd className="mt-2 max-w-measure leading-relaxed text-secondary">
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>

      {[service.howWeWork, service.standards, service.engagements].map((block, position) => (
        <Container key={block.heading} width="bleed" as="section" className="pb-section-tight">
          <SectionRule index={`0${String(position + 3)}`} />
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

      <Container width="bleed" as="section" className="pb-section-tight">
        <SectionRule index="06" />
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <h2 className="font-display text-h4 leading-snug tracking-tight text-primary lg:col-span-4">
            {tServices('faqHeading')}
          </h2>
          <div className="lg:col-span-7 lg:col-start-6">
            {service.faq.map((entry, position) => (
              <Disclosure
                key={entry.question}
                summary={entry.question}
                defaultOpen={position === 0}
              >
                <Prose>
                  <p>{entry.answer}</p>
                </Prose>
              </Disclosure>
            ))}
          </div>
        </div>
      </Container>

      {related === undefined ? null : (
        <Container width="bleed" as="section" className="pb-section-tight">
          <SectionRule index="07" />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <h2 className="font-display text-h4 leading-snug tracking-tight text-primary lg:col-span-4">
              {t('relatedWork')}
            </h2>
            <article className="lg:col-span-7 lg:col-start-6">
              <p className="font-display text-h3 leading-tight tracking-tight text-accent tabular-nums">
                {related.headline.value}
              </p>
              <p className="mt-2 text-caption text-muted">{related.headline.label}</p>
              <h3 className="mt-5 font-display text-h5 leading-snug text-primary">
                <Link
                  locale={locale}
                  route="caseStudy"
                  slug={related.slug}
                  className="underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {related.title}
                </Link>
              </h3>
              <p className="mt-3 max-w-measure leading-relaxed text-secondary">{related.summary}</p>
            </article>
          </div>
        </Container>
      )}

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
