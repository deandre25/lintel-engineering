'use client';

import { usePathname } from 'next/navigation';

import { alternateRoutePath } from '@/lib/routing';

import type { Locale } from '@/lib/routing';

export interface LocaleOption {
  readonly locale: Locale;
  /** Pre-translated "Switch to X", so no message runtime reaches the client. */
  readonly switchLabel: string;
}

export interface LocaleSwitcherProps {
  current: Locale;
  options: readonly LocaleOption[];
  /** Accessible name for the surrounding `nav`. */
  label: string;
}

/**
 * Language switcher.
 *
 * Client-side for exactly one reason: the equivalent URL in the other locale
 * depends on the path currently displayed, and a layout cannot read a child
 * page's dynamic segment on the server.
 *
 * Every string arrives as a prop rather than through `useTranslations`, which
 * keeps next-intl's ICU runtime and the message catalogue out of the client
 * bundle entirely — worth roughly 20 KB gzipped on every page. The routing
 * logic lives in `alternateRoutePath`, so this file is markup and the part
 * worth testing is testable without a DOM.
 *
 * Rendered as links, not a `<select>`: these are navigations, so they should be
 * crawlable, middle-clickable, and work before hydration.
 */
export function LocaleSwitcher({ current, options, label }: LocaleSwitcherProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="flex items-center gap-2 text-micro">
      {options.map((option, index) => (
        <span key={option.locale} className="flex items-center gap-2">
          {index > 0 ? (
            <span aria-hidden="true" className="text-ink-200">
              /
            </span>
          ) : null}
          {option.locale === current ? (
            <span aria-current="true" className="font-medium tracking-wide text-primary uppercase">
              {option.locale}
            </span>
          ) : (
            <a
              href={alternateRoutePath(pathname, option.locale)}
              hrefLang={option.locale}
              className="tracking-wide text-muted uppercase transition-colors hover:text-primary"
            >
              {/*
               * The two-letter code is for sighted users; the accessible name
               * is the full sentence. An `aria-label` alone would violate WCAG
               * 2.5.3, because the visible text would not appear in the name.
               */}
              <span aria-hidden="true">{option.locale}</span>
              <span className="sr-only">{option.switchLabel}</span>
            </a>
          )}
        </span>
      ))}
    </nav>
  );
}
