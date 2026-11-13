'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { wrapTabFocus } from '@/lib/focus';
import { routePath } from '@/lib/routing';

import type { Locale, StaticRouteId } from '@/lib/routing';

export interface MobileNavItem {
  readonly route: StaticRouteId;
  readonly label: string;
}

export interface MobileNavProps {
  locale: Locale;
  items: readonly MobileNavItem[];
  openLabel: string;
  closeLabel: string;
  navLabel: string;
}

/**
 * Navigation for narrow viewports.
 *
 * The three keyboard obligations from §11 are handled explicitly rather than by
 * a library: Tab cycles within the open panel, Escape closes it, and focus
 * returns to the trigger that opened it. Body scroll is locked while open so
 * the page behind cannot be moved by a wheel or a swipe.
 */
export function MobileNav({ locale, items, openLabel, closeLabel, navLabel }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (panel === null) return;

    /* Move focus in, so the first Tab continues from inside the panel. */
    const firstLink = panel.querySelector<HTMLElement>('a[href]');
    firstLink?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (panel !== null && wrapTabFocus(panel, event)) {
        event.preventDefault();
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => {
          setIsOpen((open) => !open);
        }}
        className="inline-flex items-center gap-2 py-2 text-primary"
      >
        {/*
         * The label is the accessible name but is not painted: at 390px two
         * words plus the wordmark and the locale switcher do not fit the
         * gutter, and the label wrapped to two lines.
         */}
        <span className="sr-only">{isOpen ? closeLabel : openLabel}</span>
        <span aria-hidden="true" className="relative block h-2 w-4">
          <span
            className={`absolute left-0 block h-px w-4 bg-current transition-transform ${
              isOpen ? 'top-1 rotate-45' : 'top-0'
            }`}
          />
          <span
            className={`absolute left-0 block h-px w-4 bg-current transition-transform ${
              isOpen ? 'top-1 -rotate-45' : 'top-2'
            }`}
          />
        </span>
      </button>

      {isOpen ? (
        <div
          id={panelId}
          ref={panelRef}
          className="fixed inset-x-0 top-header bottom-0 z-40 overflow-y-auto border-t border-rule bg-surface px-gutter pt-6 pb-8"
        >
          <nav aria-label={navLabel}>
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.route} className="border-b border-rule">
                  <a
                    href={routePath(locale, item.route)}
                    onClick={close}
                    className="block py-4 font-display text-h5 text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
