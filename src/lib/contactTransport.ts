import type { ContactSubmission } from './contact';

/**
 * How a submission leaves the browser.
 *
 * Behind an interface because the site is static and has no endpoint of its
 * own (§2). Swapping Formspree for a serverless route, or for a different
 * provider, is a change to this file and to nothing else — which is what §10
 * asks for when it says to keep the transport swappable.
 */
export interface ContactTransport {
  send(submission: ContactSubmission): Promise<void>;
}

export class TransportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransportError';
  }
}

/**
 * Posts to Formspree. Used when an endpoint is configured.
 */
function formspreeTransport(formId: string): ContactTransport {
  return {
    async send(submission) {
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        throw new TransportError(`Form endpoint returned ${String(response.status)}`);
      }
    },
  };
}

/**
 * Validates and resolves without sending anything.
 *
 * The default when no endpoint is configured, so the form is exercisable in
 * development and deterministic in tests. It is not a silent no-op: it warns,
 * because a form that appears to send and does not is worse than one that
 * reports a failure.
 */
function inMemoryTransport(): ContactTransport {
  return {
    send(submission) {
      console.warn('No contact endpoint configured; the submission was validated and discarded.', {
        enquiry: submission.enquiry,
      });
      return Promise.resolve();
    },
  };
}

export function createContactTransport(): ContactTransport {
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
  return formId === undefined || formId === '' ? inMemoryTransport() : formspreeTransport(formId);
}
