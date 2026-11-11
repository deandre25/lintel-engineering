import { getTranslations } from 'next-intl/server';

import { SectionRule } from '@/components/graphics/SectionRule';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Container } from '@/components/ui/Container';
import { Link } from '@/components/ui/Link';
import { company } from '@/content/company';
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
  const { careers } = getContent(locale);

  return pageMetadata({
    locale,
    route: 'careers',
    title: careers.title,
    description: careers.description,
  });
}

/**
 * Open positions.
 *
 * Each vacancy is one section with its own heading, so the page is navigable by
 * heading rather than being a wall of accordions. Applications go to a mailto
 * addressed to the office — there is no applicant tracking system behind this
 * and pretending otherwise would be a dead button.
 */
export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const content = getContent(locale);
  const { careers, disciplines } = content;
  const t = await getTranslations('common');
  const tCareers = await getTranslations('careers');
  const tNav = await getTranslations('nav');

  return (
    <Container width="bleed" as="section" className="pt-8 pb-section">
      <JsonLd
        data={breadcrumbFor(locale, [{ name: tNav('home'), route: 'home' }], tNav('careers'))}
      />

      <Breadcrumb
        locale={locale}
        label={t('breadcrumbLabel')}
        items={[{ label: tNav('home'), route: 'home' }, { label: tNav('careers') }]}
      />

      <h1 className="mt-8 max-w-measure-wide font-display text-h2 leading-display tracking-display text-balance text-primary">
        {careers.title}
      </h1>
      <p className="mt-6 max-w-measure text-lead leading-snug text-secondary">{careers.intro}</p>

      {[careers.working, careers.process].map((block, position) => (
        <section key={block.heading} className="mt-10">
          <SectionRule index={`0${String(position + 1)}`} />
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
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
        </section>
      ))}

      <section className="mt-10">
        <SectionRule index="03" />
        <h2 className="mt-6 font-display text-h3 leading-snug tracking-tight text-primary">
          {tCareers('positionsHeading')}
        </h2>

        <div className="mt-8 flex flex-col">
          {careers.vacancies.map((vacancy) => {
            const discipline = disciplines.find((item) => item.id === vacancy.discipline);

            return (
              <article key={vacancy.slug} className="border-t border-rule py-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <h3 className="font-display text-h5 leading-snug text-primary">
                      {vacancy.title}
                    </h3>
                    {discipline === undefined ? null : (
                      <p className="mt-2 text-caption text-accent">{discipline.name}</p>
                    )}

                    <dl className="mt-5 flex flex-col gap-3 text-micro">
                      {[
                        { term: tCareers('location'), description: vacancy.location },
                        { term: tCareers('commitment'), description: vacancy.commitment },
                        { term: tCareers('experience'), description: vacancy.experience },
                      ].map((fact) => (
                        <div key={fact.term}>
                          <dt className="tracking-wide text-muted uppercase">{fact.term}</dt>
                          <dd className="mt-1 text-secondary">{fact.description}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="lg:col-span-7 lg:col-start-6">
                    <p className="max-w-measure leading-relaxed text-secondary">
                      {vacancy.summary}
                    </p>

                    {[
                      { heading: tCareers('responsibilities'), items: vacancy.responsibilities },
                      { heading: tCareers('requirements'), items: vacancy.requirements },
                      { heading: tCareers('offer'), items: vacancy.offer },
                    ].map((block) => (
                      <div key={block.heading} className="mt-6">
                        <h4 className="text-micro font-medium tracking-eyebrow text-muted uppercase">
                          {block.heading}
                        </h4>
                        <ul className="mt-3 flex max-w-measure flex-col">
                          {block.items.map((item) => (
                            <li
                              key={item}
                              className="border-b border-rule py-3 leading-relaxed text-secondary"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    <p className="mt-6">
                      <Link
                        href={`mailto:${company.contact.email}?subject=${encodeURIComponent(vacancy.title)}`}
                        className="text-caption font-medium tracking-wide text-primary uppercase underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
                      >
                        {tCareers('apply')}
                      </Link>
                    </p>
                    <p className="mt-2 text-micro text-muted">{tCareers('applyHint')}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-10 border-t border-rule pt-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <h2 className="font-display text-h4 leading-snug tracking-tight text-primary lg:col-span-4">
            {careers.speculative.heading}
          </h2>
          <div className="flex max-w-measure flex-col gap-5 lg:col-span-7 lg:col-start-6">
            {careers.speculative.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="leading-relaxed text-secondary">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
}
