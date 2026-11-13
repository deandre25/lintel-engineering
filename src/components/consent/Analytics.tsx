'use client';

import { useEffect } from 'react';

import { useConsent } from '@/components/consent/useConsent';

export interface AnalyticsProps {
  /** The site domain registered with the analytics provider. */
  domain: string;
}

/**
 * Loads the analytics script, and only after consent.
 *
 * The script element is created here rather than rendered unconditionally with
 * a flag, because §10 is explicit: a banner that sets a flag and loads
 * everything regardless is worse than none, and a reviewer checks the network
 * tab. If the visitor has not accepted the analytics category, no element is
 * created and no request is made to the provider at all.
 *
 * It listens for the consent event so accepting takes effect immediately
 * rather than on the next navigation, and it never removes the script on
 * withdrawal — unloading a script does not unrun it. Withdrawal stops it
 * loading on every subsequent page, which is what the cookie policy says.
 */
export function Analytics({ domain }: AnalyticsProps) {
  const allowed = useConsent()?.analytics === true;

  useEffect(() => {
    if (!allowed) return;
    if (document.querySelector('script[data-analytics]') !== null) return;

    const script = document.createElement('script');
    script.src = 'https://plausible.io/js/script.js';
    script.defer = true;
    script.dataset.domain = domain;
    script.dataset.analytics = 'true';
    document.head.appendChild(script);
  }, [allowed, domain]);

  return null;
}
