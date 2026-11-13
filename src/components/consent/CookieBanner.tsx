'use client';

import { useCallback, useEffect, useState } from 'react';

import { useConsent } from '@/components/consent/useConsent';
import { Button } from '@/components/ui/Button';
import { ACCEPT_ALL, CONSENT_EVENT, DECLINE_ALL, serialiseConsent } from '@/lib/consent';

import type { ConsentChoice } from '@/lib/consent';
import type { ReactNode } from 'react';

export interface CookieBannerLabels {
  readonly heading: string;
  readonly body: string;
  readonly acceptAll: string;
  readonly rejectAll: string;
  readonly manage: string;
  readonly save: string;
  readonly necessary: string;
  readonly necessaryDescription: string;
  readonly analytics: string;
  readonly analyticsDescription: string;
  readonly preferences: string;
  readonly preferencesDescription: string;
}

export interface CookieBannerProps {
  labels: CookieBannerLabels;
  policyLink: ReactNode;
}

/**
 * The consent banner.
 *
 * Nothing optional loads until a choice is made: the absence of a cookie is
 * not consent. Rejecting everything is one click, in the same position and at
 * the same weight as accepting — §10 requires the two to be equally prominent,
 * and a reject button styled as the quiet option fails that however it is
 * worded.
 *
 * Reopened from the footer, which dispatches the same event this listens for.
 */
export function CookieBanner({ labels, policyLink }: CookieBannerProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState<{ analytics: boolean; preferences: boolean } | null>(null);

  const stored = useConsent();
  /* No stored choice means the banner is due; a stored one means it is not. */
  const visible = open || stored === null;

  useEffect(() => {
    function reopen() {
      setOpen(true);
      setExpanded(true);
    }

    window.addEventListener('lintel:consent-reopen', reopen);
    return () => {
      window.removeEventListener('lintel:consent-reopen', reopen);
    };
  }, []);

  const persist = useCallback((choice: ConsentChoice) => {
    document.cookie = serialiseConsent(choice);
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setOpen(false);
    setExpanded(false);
  }, []);

  if (!visible) return null;

  /* The toggles start from the stored choice and are edited locally until saved. */
  const analytics = draft?.analytics ?? stored?.analytics ?? false;
  const preferences = draft?.preferences ?? stored?.preferences ?? false;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={labels.heading}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-surface-raised"
    >
      <div className="mx-auto w-full max-w-bleed px-gutter py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <h2 className="font-display text-h5 leading-snug text-primary">{labels.heading}</h2>
            <p className="mt-3 max-w-measure text-caption leading-relaxed text-secondary">
              {labels.body} {policyLink}
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:col-span-4 lg:col-start-9">
            <div className="flex flex-wrap gap-3">
              {/* Equal weight, equal size, reject first. */}
              <Button
                variant="secondary"
                onClick={() => {
                  persist(DECLINE_ALL);
                }}
              >
                {labels.rejectAll}
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  persist(ACCEPT_ALL);
                }}
              >
                {labels.acceptAll}
              </Button>
            </div>

            <Button
              variant="quiet"
              size="sm"
              aria-expanded={expanded}
              onClick={() => {
                setExpanded((value) => !value);
              }}
            >
              {labels.manage}
            </Button>
          </div>
        </div>

        {expanded ? (
          <div className="mt-6 border-t border-rule pt-6">
            <ul className="flex flex-col gap-4">
              {[
                {
                  id: 'necessary',
                  name: labels.necessary,
                  description: labels.necessaryDescription,
                  checked: true,
                  disabled: true,
                  onChange: () => undefined,
                },
                {
                  id: 'analytics',
                  name: labels.analytics,
                  description: labels.analyticsDescription,
                  checked: analytics,
                  disabled: false,
                  onChange: () => {
                    setDraft({ analytics: !analytics, preferences });
                  },
                },
                {
                  id: 'preferences',
                  name: labels.preferences,
                  description: labels.preferencesDescription,
                  checked: preferences,
                  disabled: false,
                  onChange: () => {
                    setDraft({ analytics, preferences: !preferences });
                  },
                },
              ].map((category) => (
                <li key={category.id}>
                  <label className="flex max-w-measure items-start gap-3">
                    <input
                      type="checkbox"
                      checked={category.checked}
                      disabled={category.disabled}
                      onChange={category.onChange}
                      className="mt-1 size-4 shrink-0"
                    />
                    <span>
                      <span className="text-caption font-medium text-primary">{category.name}</span>
                      <span className="mt-1 block text-micro leading-relaxed text-muted">
                        {category.description}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  persist({ analytics, preferences, version: 1 });
                }}
              >
                {labels.save}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
