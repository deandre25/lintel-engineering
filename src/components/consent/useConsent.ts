'use client';

import { useSyncExternalStore } from 'react';

import { CONSENT_EVENT, readConsent } from '@/lib/consent';

import type { ConsentChoice } from '@/lib/consent';

/**
 * Subscribes to the stored consent choice.
 *
 * `document.cookie` is an external store, so this is `useSyncExternalStore`
 * rather than an effect that calls `setState`: reading it in an effect body
 * causes a cascading render, and React's own rule says so.
 *
 * The snapshot is cached against the raw cookie string because
 * `getSnapshot` must return the same reference while nothing has changed, or
 * React re-renders without end.
 */

let cachedCookie: string | null = null;
let cachedChoice: ConsentChoice | null = null;

function getSnapshot(): ConsentChoice | null {
  const raw = document.cookie;
  if (raw !== cachedCookie) {
    cachedCookie = raw;
    cachedChoice = readConsent(raw);
  }
  return cachedChoice;
}

/** On the server there is no choice, which is what keeps the banner out of the HTML. */
function getServerSnapshot(): ConsentChoice | null {
  return null;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
  };
}

export function useConsent(): ConsentChoice | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
