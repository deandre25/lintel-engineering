import { describe, expect, it } from 'vitest';

import { MINIMUM_SECONDS_TO_SUBMIT, contactSchema, toSubmission } from '@/lib/contact';

import type { ContactMessages } from '@/lib/contact';

/**
 * The schema is the only place the form's rules live, including the two spam
 * checks, so this is where they are asserted. The browser and the submit
 * handler both run this same schema (§10); testing the rule through the UI
 * would test the UI, and the timing rule cannot be exercised reliably there
 * because filling a form with a driver already takes longer than the threshold.
 */

const messages: ContactMessages = {
  nameRequired: 'name required',
  emailRequired: 'email required',
  emailInvalid: 'email invalid',
  enquiryRequired: 'enquiry required',
  messageRequired: 'message required',
  messageTooShort: 'message too short',
  consentRequired: 'consent required',
  tooFast: 'too fast',
};

const schema = contactSchema(messages);

const valid = {
  name: 'Andrei Popescu',
  company: 'A Tier-1 supplier',
  email: 'a.popescu@example.com',
  enquiry: 'structural-engineering',
  message: 'A 1974 hall needs recertifying for a heavier crane, by March.',
  consent: true as const,
  website: '',
  elapsedSeconds: 12,
};

function errorsFor(input: unknown): string[] {
  const result = schema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe('contact schema', () => {
  it('accepts a complete submission', () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it('reports every missing field at once rather than the first', () => {
    const errors = errorsFor({ ...valid, name: '', email: '', message: '', consent: false });

    expect(errors).toContain('name required');
    expect(errors).toContain('email required');
    expect(errors).toContain('message required');
    expect(errors).toContain('consent required');
  });

  it('requires an address that could receive a reply', () => {
    expect(errorsFor({ ...valid, email: 'not-an-address' })).toContain('email invalid');
    expect(errorsFor({ ...valid, email: 'someone@' })).toContain('email invalid');
  });

  it('requires enough of a message to route the enquiry', () => {
    expect(errorsFor({ ...valid, message: 'help' })).toContain('message too short');
  });

  it('requires consent to be given, not merely present', () => {
    expect(errorsFor({ ...valid, consent: false })).toContain('consent required');
  });

  it('rejects a filled honeypot, which only an automated client would do', () => {
    expect(schema.safeParse({ ...valid, website: 'https://spam.example' }).success).toBe(false);
  });

  it('rejects a submission faster than a person could have typed it', () => {
    expect(errorsFor({ ...valid, elapsedSeconds: 0.4 })).toContain('too fast');
    expect(errorsFor({ ...valid, elapsedSeconds: MINIMUM_SECONDS_TO_SUBMIT })).not.toContain(
      'too fast',
    );
  });

  it('strips the anti-spam fields and the consent flag before transport', () => {
    const submission = toSubmission(schema.parse(valid));

    expect(submission).not.toHaveProperty('website');
    expect(submission).not.toHaveProperty('elapsedSeconds');
    expect(submission).not.toHaveProperty('consent');
    expect(submission.email).toBe(valid.email);
  });
});
