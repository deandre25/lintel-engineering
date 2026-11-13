import { getFormatter, getTranslations } from 'next-intl/server';

import { LegalPageBody } from '@/components/sections/LegalPageBody';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getContent } from '@/content/registry';
import { breadcrumbFor } from '@/lib/schema';

import type { Locale } from '@/lib/routing';

export type LegalKey = 'privacy' | 'cookies' | 'terms' | 'legalNotice';

export interface LegalRouteProps {
  locale: Locale;
  page: LegalKey;
}

/**
 * Renders one legal page, resolving its content, breadcrumb and date.
 *
 * The four route files are three lines each and call this, which keeps the
 * formatting and breadcrumb logic in one place while leaving each route a real
 * file in the tree rather than a catch-all segment.
 */
export async function LegalRoute({ locale, page }: LegalRouteProps) {
  const content = getContent(locale).legal[page];
  const t = await getTranslations('common');
  const tFooter = await getTranslations('footer');
  const tNav = await getTranslations('nav');
  const format = await getFormatter();

  return (
    <>
      <JsonLd
        data={breadcrumbFor(locale, [{ name: tNav('home'), route: 'home' }], tFooter(page))}
      />

      <LegalPageBody
        page={content}
        updatedLabel={t('updated', {
          date: format.dateTime(new Date(content.updated), 'long'),
        })}
        breadcrumb={
          <Breadcrumb
            locale={locale}
            label={t('breadcrumbLabel')}
            items={[{ label: tNav('home'), route: 'home' }, { label: tFooter(page) }]}
          />
        }
      />
    </>
  );
}
