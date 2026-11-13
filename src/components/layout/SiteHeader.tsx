import { getTranslations } from 'next-intl/server';

import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { MobileNav } from '@/components/layout/MobileNav';
import { Wordmark } from '@/components/layout/Wordmark';
import { Container } from '@/components/ui/Container';
import { Link } from '@/components/ui/Link';
import { localeNames, locales } from '@/lib/routing';

import type { LocaleOption } from '@/components/layout/LocaleSwitcher';
import type { MobileNavItem } from '@/components/layout/MobileNav';
import type { Locale } from '@/lib/routing';

export interface SiteHeaderProps {
  locale: Locale;
}

/** Primary navigation, in the order a visitor evaluating the firm would use. */
const NAV_ROUTES = ['services', 'work', 'about', 'insights', 'careers'] as const;

/**
 * Site header.
 *
 * A server component: the only interactive part is the narrow-viewport panel,
 * which is its own client island, so no navigation markup ships as JavaScript.
 * A hairline bottom rule carries the separation instead of a shadow.
 */
export async function SiteHeader({ locale }: SiteHeaderProps) {
  const t = await getTranslations('nav');
  const tSwitcher = await getTranslations('localeSwitcher');

  const localeOptions: LocaleOption[] = locales.map((option) => ({
    locale: option,
    switchLabel: tSwitcher('switchTo', { language: localeNames[option] }),
  }));

  const items: MobileNavItem[] = [
    ...NAV_ROUTES.map((route) => ({ route, label: t(route) })),
    { route: 'contact' as const, label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-surface">
      <Container width="bleed">
        <div className="flex h-header items-center justify-between gap-6">
          <Wordmark locale={locale} />

          <div className="flex items-center gap-6">
            <nav aria-label={t('label')} className="hidden lg:block">
              <ul className="flex items-center gap-6">
                {NAV_ROUTES.map((route) => (
                  <li key={route}>
                    <Link
                      locale={locale}
                      route={route}
                      className="text-caption text-secondary transition-colors hover:text-primary"
                    >
                      {t(route)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden lg:block">
              <LocaleSwitcher current={locale} options={localeOptions} label={tSwitcher('label')} />
            </div>

            <Link
              locale={locale}
              route="contact"
              className="hidden border border-ink-900 px-4 py-2 text-caption font-medium text-primary transition-colors hover:bg-ink-900 hover:text-inverse lg:inline-block"
            >
              {t('contact')}
            </Link>

            <div className="flex items-center gap-4 lg:hidden">
              <LocaleSwitcher current={locale} options={localeOptions} label={tSwitcher('label')} />
              <MobileNav
                locale={locale}
                items={items}
                openLabel={t('openMenu')}
                closeLabel={t('closeMenu')}
                navLabel={t('label')}
              />
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
