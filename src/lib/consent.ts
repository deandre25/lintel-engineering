/**
 * Cookie consent: the categories, and where the choice is kept.
 *
 * The choice is stored in a first-party cookie rather than in `localStorage`
 * so it is readable before any script decides what to load, and so it expires
 * on its own. Twelve months, after which the question is asked again.
 */

export const CONSENT_COOKIE = 'lintel_consent';
export const CONSENT_MAX_AGE_DAYS = 365;

/** The version of the categories. Bumping it re-asks everyone. */
const CONSENT_VERSION = 1;

export interface ConsentChoice {
  readonly analytics: boolean;
  readonly preferences: boolean;
  readonly version: number;
}

export const DECLINE_ALL: ConsentChoice = {
  analytics: false,
  preferences: false,
  version: CONSENT_VERSION,
};

export const ACCEPT_ALL: ConsentChoice = {
  analytics: true,
  preferences: true,
  version: CONSENT_VERSION,
};

/**
 * Reads the stored choice.
 *
 * Returns `null` when there is none, which is what makes the banner appear —
 * and, crucially, what keeps every optional script unloaded. No choice is not
 * the same as consent, and the absence of a cookie must never be read as yes.
 */
export function readConsent(cookieHeader: string | undefined): ConsentChoice | null {
  if (cookieHeader === undefined) return null;

  const entry = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`));

  if (entry === undefined) return null;

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(entry.slice(CONSENT_COOKIE.length + 1)));

    if (typeof parsed !== 'object' || parsed === null) return null;
    const record = parsed as Record<string, unknown>;
    if (record.version !== CONSENT_VERSION) return null;

    return {
      analytics: record.analytics === true,
      preferences: record.preferences === true,
      version: CONSENT_VERSION,
    };
  } catch {
    /* A malformed cookie is treated as no choice, never as consent. */
    return null;
  }
}

export function serialiseConsent(choice: ConsentChoice): string {
  const value = encodeURIComponent(JSON.stringify(choice));
  const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;

  return `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${String(maxAge)}; SameSite=Lax`;
}

/** The event the banner fires so the analytics loader can react immediately. */
export const CONSENT_EVENT = 'lintel:consent';
