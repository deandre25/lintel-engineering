'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { TextInput } from '@/components/ui/TextInput';
import { contactSchema, toSubmission } from '@/lib/contact';
import { createContactTransport } from '@/lib/contactTransport';

import type { SelectOption } from '@/components/ui/Select';
import type { ContactMessages, ContactValues } from '@/lib/contact';
import type { ReactNode } from 'react';

export interface ContactFormLabels {
  readonly heading: string;
  readonly name: string;
  readonly company: string;
  readonly email: string;
  readonly emailHint: string;
  readonly enquiryType: string;
  readonly enquiryPlaceholder: string;
  readonly message: string;
  readonly messageHint: string;
  readonly consent: string;
  readonly optional: string;
  readonly submit: string;
  readonly submitting: string;
  readonly successHeading: string;
  readonly successBody: string;
  readonly failureHeading: string;
  readonly failureBody: string;
  readonly errors: ContactMessages;
}

export interface ContactFormProps {
  labels: ContactFormLabels;
  options: readonly SelectOption[];
  /** The privacy policy link, rendered inside the consent label. */
  consentLink: ReactNode;
}

type Status = 'idle' | 'submitting' | 'success' | 'failure';

/**
 * The contact form.
 *
 * Every string arrives as a prop, so next-intl's ICU runtime and the message
 * catalogue stay out of the client bundle; the same arrangement as the locale
 * switcher.
 *
 * Validation runs on blur rather than on every keystroke (§10): correcting a
 * field while the error updates under the caret is hostile, and a message that
 * appears before a field is finished is usually wrong.
 */
export function ContactForm({ labels, options, consentLink }: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const mountedAt = useRef<number | null>(null);

  /* Stamped in an effect: `Date.now()` during render is not pure. */
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  const transport = useMemo(() => createContactTransport(), []);
  const schema = useMemo(() => contactSchema(labels.errors), [labels.errors]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { name: '', company: '', email: '', enquiry: '', message: '', website: '' },
  });

  async function onSubmit(values: ContactValues) {
    setStatus('submitting');

    try {
      await transport.send(toSubmission(values));
      setStatus('success');
      reset();
    } catch {
      setStatus('failure');
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="border-t-2 border-accent pt-6">
        <h2 className="font-display text-h4 leading-snug tracking-tight text-primary">
          {labels.successHeading}
        </h2>
        <p className="mt-4 max-w-measure leading-relaxed text-secondary">{labels.successBody}</p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
      className="flex max-w-measure flex-col gap-6"
    >
      <h2 className="font-display text-h4 leading-snug tracking-tight text-primary">
        {labels.heading}
      </h2>

      {/*
       * The honeypot is a field a person never sees and so never fills. The
       * elapsed time is stamped at submit. Both are form values, so the schema
       * is the only place either rule lives and the submit handler enforces
       * them even if the browser side is bypassed.
       */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <Field
        label={labels.name}
        name="name"
        required
        {...(errors.name?.message === undefined ? {} : { error: errors.name.message })}
      >
        {(control) => <TextInput {...control} {...register('name')} autoComplete="name" />}
      </Field>

      <Field label={labels.company} name="company">
        {(control) => (
          <TextInput {...control} {...register('company')} autoComplete="organization" />
        )}
      </Field>

      <Field
        label={labels.email}
        name="email"
        required
        hint={labels.emailHint}
        {...(errors.email?.message === undefined ? {} : { error: errors.email.message })}
      >
        {(control) => (
          <TextInput {...control} {...register('email')} type="email" autoComplete="email" />
        )}
      </Field>

      <Field
        label={labels.enquiryType}
        name="enquiry"
        required
        {...(errors.enquiry?.message === undefined ? {} : { error: errors.enquiry.message })}
      >
        {(control) => (
          <Select
            {...control}
            {...register('enquiry')}
            options={options}
            placeholder={labels.enquiryPlaceholder}
          />
        )}
      </Field>

      <Field
        label={labels.message}
        name="message"
        required
        hint={labels.messageHint}
        {...(errors.message?.message === undefined ? {} : { error: errors.message.message })}
      >
        {(control) => <Textarea {...control} {...register('message')} />}
      </Field>

      <div className="flex flex-col gap-2">
        <label className="flex max-w-measure items-start gap-3 text-caption leading-relaxed text-secondary">
          <input
            type="checkbox"
            {...register('consent')}
            className="mt-1 size-4 shrink-0 accent-[var(--accent)]"
          />
          <span>
            {labels.consent} {consentLink}
          </span>
        </label>
        <div aria-live="polite" className="text-micro text-accent">
          {errors.consent?.message}
        </div>
      </div>

      {/*
       * The time check cannot fail for a person, so its message belongs with
       * the submission rather than beside a field nobody filled in wrongly.
       */}
      {errors.elapsedSeconds?.message === undefined ? null : (
        <p role="alert" className="text-micro text-accent">
          {errors.elapsedSeconds.message}
        </p>
      )}

      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          disabled={status === 'submitting'}
          onClick={() => {
            /* Stamped at submit, so it measures how long the visit lasted. */
            const started = mountedAt.current;
            setValue('elapsedSeconds', started === null ? 0 : (Date.now() - started) / 1000);
          }}
        >
          {status === 'submitting' ? labels.submitting : labels.submit}
        </Button>

        {status === 'failure' ? (
          <div role="alert" className="border-t-2 border-accent pt-4">
            <h3 className="text-body-lg text-primary">{labels.failureHeading}</h3>
            <p className="mt-2 max-w-measure leading-relaxed text-secondary">
              {labels.failureBody}
            </p>
          </div>
        ) : null}
      </div>
    </form>
  );
}
