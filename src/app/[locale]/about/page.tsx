import { getTranslations } from 'next-intl/server';

import { SectionRule } from '@/components/graphics/SectionRule';
import { CallToAction } from '@/components/sections/CallToAction';
import { Figures } from '@/components/sections/Figures';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { getContent } from '@/content/registry';
import { requireLocale } from '@/lib/params';
import { locales } from '@/lib/routing';

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
  const { about } = getContent(locale);

  return { title: about.title, description: about.description };
}

/**
 * The about page, including the four people who lead the work.
 *
 * No photographs (§6). Each person is a name, a role, a generic credential and
 * a paragraph about where they came from, which is more informative than a
 * headshot and avoids inventing a likeness for somebody who does not exist.
 */
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const content = getContent(locale);
  const { about } = content;
  const t = await getTranslations('common');
  const tAbout = await getTranslations('about');
  const tNav = await getTranslations('nav');

  return (
    <>
      <Container width="bleed" as="section" className="pt-8 pb-section-tight">
        <Breadcrumb
          locale={locale}
          label={t('breadcrumbLabel')}
          items={[{ label: tNav('home'), route: 'home' }, { label: tNav('about') }]}
        />
        <h1 className="mt-8 max-w-measure-wide font-display text-h2 leading-display tracking-display text-balance text-primary">
          {about.title}
        </h1>
        <p className="mt-6 max-w-measure text-lead leading-snug text-secondary">{about.intro}</p>
      </Container>

      {[about.story, about.howWeAreOrganised].map((block, position) => (
        <Container key={block.heading} width="bleed" as="section" className="pb-section-tight">
          <SectionRule index={`0${String(position + 1)}`} />
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
        <SectionRule index="03" />
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <h2 className="font-display text-h4 leading-snug tracking-tight text-primary lg:col-span-4">
            {tAbout('teamHeading')}
          </h2>
          <p className="max-w-measure leading-relaxed text-secondary lg:col-span-7 lg:col-start-6">
            {about.team.standfirst}
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2">
          {about.team.members.map((member) => (
            <li key={member.name} className="border-t border-rule pt-6">
              <h3 className="font-display text-h5 leading-snug text-primary">{member.name}</h3>
              <p className="mt-2 text-caption text-accent">{member.role}</p>
              <p className="mt-3 text-micro tracking-wide text-muted tabular-nums">
                {member.qualification} · {tAbout('joined', { year: String(member.joined) })}
              </p>
              <p className="mt-4 max-w-measure leading-relaxed text-secondary">
                {member.biography}
              </p>
            </li>
          ))}
        </ul>
      </Container>

      <Figures
        index="04"
        heading={content.home.figures.heading}
        items={content.home.figures.items}
      />

      <CallToAction
        heading={content.home.engagement.heading}
        body={content.home.engagement.body}
        action={
          <ButtonLink locale={locale} route="contact" variant="inverse">
            {content.home.engagement.cta}
          </ButtonLink>
        }
      />
    </>
  );
}
