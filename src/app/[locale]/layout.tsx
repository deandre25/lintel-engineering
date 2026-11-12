import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { Analytics } from '@/components/consent/Analytics';
import { CookieBanner } from '@/components/consent/CookieBanner';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Link } from '@/components/ui/Link';
import { SkipLink } from '@/components/ui/SkipLink';
import { company } from '@/content/company';
import { localeTags, locales } from '@/lib/routing';
import { siteOrigin } from '@/lib/seo';
import { fontVariables } from '@/styles/fonts';

import '@/styles/globals.css';

import type { Locale } from '@/lib/routing';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const MAIN_CONTENT_ID = 'main-content';

/**
 * Both locales are prerendered, and nothing is rendered per request, so the
 * route segment is fully static. Without this, a dynamic API reached anywhere
 * in the tree would quietly opt the whole site into on-demand rendering.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Baseline document metadata.
 *
 * The title template is set here so every page below supplies only its own
 * name, and the home page falls back to the positioning line. Canonical URLs,
 * `hreflang` alternates, OG tags and per-page descriptions are Phase 5.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolved: Locale = hasLocale(locales, locale) ? locale : 'en';

  return {
    /*
     * Every relative URL in metadata — Open Graph images in particular — is
     * resolved against this, so a crawler is given absolute URLs.
     */
    metadataBase: new URL(siteOrigin()),
    title: {
      default: `${company.name} — ${company.positioning[resolved]}`,
      template: `%s — ${company.name}`,
    },
    description: company.shortDescription[resolved],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  /* A path like /fr/services reaches this layout; it is a 404, not a fallback. */
  if (!hasLocale(locales, locale)) notFound();

  const t = await getTranslations('nav');
  const tCookies = await getTranslations('cookies');
  const analyticsDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang={localeTags[locale]} className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <SkipLink targetId={MAIN_CONTENT_ID} label={t('skipToContent')} />
        {/*
         * No `NextIntlClientProvider`: every client component in this tree
         * receives its strings as props, so neither the message catalogue nor
         * the ICU runtime is sent to the browser. Adding a client component
         * that calls `useTranslations` would require re-introducing it, and
         * paying for it — see DECISIONS.md.
         */}
        <SiteHeader locale={locale} />
        <main id={MAIN_CONTENT_ID} className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} />

        {/*
         * The banner decides; the loader obeys. No analytics request is made
         * until the analytics category has been accepted, and the absence of a
         * choice is never read as consent (§10).
         */}
        <CookieBanner
          labels={{
            heading: tCookies('heading'),
            body: tCookies('body'),
            acceptAll: tCookies('acceptAll'),
            rejectAll: tCookies('rejectAll'),
            manage: tCookies('manage'),
            save: tCookies('save'),
            necessary: tCookies('necessary'),
            necessaryDescription: tCookies('necessaryDescription'),
            analytics: tCookies('analytics'),
            analyticsDescription: tCookies('analyticsDescription'),
            preferences: tCookies('preferences'),
            preferencesDescription: tCookies('preferencesDescription'),
          }}
          policyLink={
            <Link
              locale={locale}
              route="cookies"
              className="underline decoration-rule-strong decoration-1 underline-offset-4"
            >
              {tCookies('policyLink')}
            </Link>
          }
        />

        {analyticsDomain === undefined ? null : <Analytics domain={analyticsDomain} />}
      </body>
    </html>
  );
}
