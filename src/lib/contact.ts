import { z } from 'zod';

/*
 * Zod compiles validators with `new Function` by default, which needs
 * `script-src 'unsafe-eval'`. The policy does not have it and will not: the
 * whole point of hashing the inline scripts is that nothing outside that set
 * can execute. `jitless` makes Zod interpret instead of compile.
 *
 * Set here rather than in the component because the schema is shared with the
 * submit handler, and the setting has to hold wherever the schema is used.
 */
z.config({ jitless: true });

/**
 * The contact form's shape and rules.
 *
 * One schema, used by the browser to validate on blur and by the submit
 * handler to validate what actually arrives (§10). A rule that exists in only
 * one of those places is a rule the other side does not have.
 *
 * Messages are injected rather than hard-coded so the same schema serves both
 * locales without the ICU runtime reaching the client bundle.
 */

export interface ContactMessages {
  readonly nameRequired: string;
  readonly emailRequired: string;
  readonly emailInvalid: string;
  readonly enquiryRequired: string;
  readonly messageRequired: string;
  readonly messageTooShort: string;
  readonly consentRequired: string;
  readonly tooFast: string;
}

/** A submission faster than this was not typed by a person. */
export const MINIMUM_SECONDS_TO_SUBMIT = 3;

/** Enough to say what the project is; shorter cannot be routed. */
const MINIMUM_MESSAGE_LENGTH = 24;

export function contactSchema(messages: ContactMessages) {
  return z.object({
    name: z.string().trim().min(1, messages.nameRequired),
    company: z.string().trim().optional(),
    email: z.string().trim().min(1, messages.emailRequired).pipe(z.email(messages.emailInvalid)),
    enquiry: z.string().trim().min(1, messages.enquiryRequired),
    message: z
      .string()
      .trim()
      .min(1, messages.messageRequired)
      .min(MINIMUM_MESSAGE_LENGTH, messages.messageTooShort),
    consent: z.literal(true, messages.consentRequired),

    /*
     * Spam controls. Both are checked here rather than in the component, so
     * the submit handler enforces them even if the client is bypassed.
     *
     * The honeypot is a field a person never sees and therefore never fills;
     * anything in it means an automated submission.
     */
    website: z.string().max(0).optional(),
    /** Seconds between the form mounting and the submission. */
    elapsedSeconds: z.number().min(MINIMUM_SECONDS_TO_SUBMIT, messages.tooFast),
  });
}

export type ContactValues = z.infer<ReturnType<typeof contactSchema>>;

/** What a transport receives: the message, without the anti-spam fields. */
export type ContactSubmission = Omit<ContactValues, 'website' | 'elapsedSeconds' | 'consent'>;

export function toSubmission(values: ContactValues): ContactSubmission {
  return {
    name: values.name,
    company: values.company,
    email: values.email,
    enquiry: values.enquiry,
    message: values.message,
  };
}
