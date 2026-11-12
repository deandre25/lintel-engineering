import { getTranslations } from 'next-intl/server';

import { SectionRule } from '@/components/graphics/SectionRule';
import { ContactForm } from '@/components/sections/ContactForm';
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
  const t = await getTranslations({ locale, namespace: 'contact' });

  return pageMetadata({
    locale,
    route: 'contact',
    title: t('title'),
    description: t('description'),
  });
}

/**
 * The contact page.
 *
 * The form itself is Phase 6, together with its validation, spam handling and
 * transport. Until then this page carries the direct routes a visitor would
 * otherwise have to hunt for — a named address, a phone number and the office
 * — rather than a disabled form or a button that does nothing.
 */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const content = getContent(locale);
  const t = await getTranslations('common');
  const tContact = await getTranslations('contact');
  const tNav = await getTranslations('nav');
  const tFooter = await getTranslations('footer');

  return (
    <Container width="bleed" as="section" className="pt-8 pb-section">
      <JsonLd
        data={breadcrumbFor(locale, [{ name: tNav('home'), route: 'home' }], tNav('contact'))}
      />

      <Breadcrumb
        locale={locale}
        label={t('breadcrumbLabel')}
        items={[{ label: tNav('home'), route: 'home' }, { label: tNav('contact') }]}
      />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <h1 className="font-display text-h2 leading-display tracking-display text-balance text-primary">
            {tContact('title')}
          </h1>
          <p className="mt-6 max-w-measure text-lead leading-snug text-secondary">
            {tContact('description')}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <SectionRule index="01" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <ContactForm
            options={content.services.map((service) => ({
              value: service.id,
              label: service.name,
            }))}
            consentLink={
              <Link
                locale={locale}
                route="privacy"
                className="underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
              >
                {tContact('consentLink')}
              </Link>
            }
            labels={{
              heading: tContact('formHeading'),
              name: tContact('name'),
              company: tContact('company'),
              email: tContact('email'),
              emailHint: tContact('emailHint'),
              enquiryType: tContact('enquiryType'),
              enquiryPlaceholder: tContact('enquiryPlaceholder'),
              message: tContact('message'),
              messageHint: tContact('messageHint'),
              consent: tContact('consent'),
              optional: tContact('optional'),
              submit: tContact('submit'),
              submitting: tContact('submitting'),
              successHeading: tContact('successHeading'),
              successBody: tContact('successBody', {
                phone: company.contact.phoneDisplay,
              }),
              failureHeading: tContact('failureHeading'),
              failureBody: tContact('failureBody', { email: company.contact.email }),
              errors: {
                nameRequired: tContact('errors.nameRequired'),
                emailRequired: tContact('errors.emailRequired'),
                emailInvalid: tContact('errors.emailInvalid'),
                enquiryRequired: tContact('errors.enquiryRequired'),
                messageRequired: tContact('errors.messageRequired'),
                messageTooShort: tContact('errors.messageTooShort'),
                consentRequired: tContact('errors.consentRequired'),
                tooFast: tContact('errors.tooFast'),
              },
            }}
          />
        </div>
      </div>

      <div className="mt-10">
        <SectionRule index="02" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4">
          <h2 className="text-micro font-medium tracking-eyebrow text-muted uppercase">
            {tFooter('contactHeading')}
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <Link
                href={`mailto:${company.contact.email}`}
                className="text-body-lg text-primary underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
              >
                {company.contact.email}
              </Link>
            </li>
            <li>
              <Link
                href={`tel:${company.contact.phone}`}
                className="text-body-lg text-primary tabular-nums underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
              >
                {company.contact.phoneDisplay}
              </Link>
            </li>
          </ul>
          <p className="mt-4 max-w-measure-narrow text-micro leading-relaxed text-muted">
            {tContact('emailHint')}
          </p>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-micro font-medium tracking-eyebrow text-muted uppercase">
            {tFooter('officeHeading')}
          </h2>
          <address className="mt-4 leading-relaxed text-secondary not-italic">
            {company.address.street}
            <br />
            {company.address.postalCode} {company.address.city}
            <br />
            {company.address.country[locale]}
          </address>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <h2 className="text-micro font-medium tracking-eyebrow text-muted uppercase">
            {content.home.engagement.heading}
          </h2>
          <div className="mt-4 flex max-w-measure flex-col gap-4">
            {content.home.engagement.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="leading-relaxed text-secondary">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
