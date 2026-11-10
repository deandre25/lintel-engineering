import { getFormatter, getTranslations } from 'next-intl/server';

import { Wordmark } from '@/components/layout/Wordmark';
import { Container } from '@/components/ui/Container';
import { Link } from '@/components/ui/Link';
import { company } from '@/content/company';

import type { Locale } from '@/lib/routing';

export interface SiteFooterProps {
  locale: Locale;
}

/* Route ids double as message keys, which keeps the two lists impossible to
 * desynchronise: a missing translation is a build-time error in `messages`. */
const LEGAL_ROUTES = ['privacy', 'cookies', 'terms', 'legalNotice'] as const;

/**
 * Site footer, on the inverse surface.
 *
 * `data-surface="inverse"` switches the focus ring to its light variant for
 * everything inside, which is why the ring is defined against that attribute in
 * globals.css rather than restated on each link here.
 */
export async function SiteFooter({ locale }: SiteFooterProps) {
  const t = await getTranslations('footer');
  const format = await getFormatter();
  const year = format.dateTime(new Date(), { year: 'numeric' });

  return (
    <footer data-surface="inverse" className="mt-auto bg-surface-inverse text-inverse-muted">
      <Container width="bleed">
        <div className="grid grid-cols-1 gap-8 py-9 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <Wordmark locale={locale} className="text-inverse" />
            <p className="mt-4 max-w-measure-narrow text-caption leading-relaxed">
              {company.positioning[locale]}
            </p>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-micro font-medium tracking-eyebrow text-inverse uppercase">
              {t('officeHeading')}
            </h2>
            <address className="mt-4 text-caption leading-relaxed not-italic">
              {company.address.street}
              <br />
              {company.address.postalCode} {company.address.city}
              <br />
              {company.address.country}
            </address>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-micro font-medium tracking-eyebrow text-inverse uppercase">
              {t('contactHeading')}
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-caption">
              <li>
                <Link
                  href={`mailto:${company.contact.email}`}
                  className="transition-colors hover:text-inverse"
                >
                  {company.contact.email}
                </Link>
              </li>
              <li>
                <Link
                  href={`tel:${company.contact.phone}`}
                  className="transition-colors hover:text-inverse"
                >
                  {company.contact.phoneDisplay}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-micro font-medium tracking-eyebrow text-inverse uppercase">
              {t('legalHeading')}
            </h2>
            <nav aria-label={t('navigationLabel')}>
              <ul className="mt-4 flex flex-col gap-2 text-caption">
                {LEGAL_ROUTES.map((route) => (
                  <li key={route}>
                    <Link
                      locale={locale}
                      route={route}
                      className="transition-colors hover:text-inverse"
                    >
                      {t(route)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-rule-inverse py-6 text-micro md:flex-row md:items-center md:justify-between">
          <p>{t('copyright', { year, company: company.legalName })}</p>
          <p className="text-ink-300">{t('disclosure')}</p>
        </div>
      </Container>
    </footer>
  );
}
