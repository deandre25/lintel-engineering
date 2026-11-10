import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Field } from '@/components/ui/Field';
import { TextInput } from '@/components/ui/TextInput';

describe('Field', () => {
  it('associates the label, hint and error with the control it wraps', () => {
    render(
      <Field
        label="Email"
        name="email"
        required
        hint="We reply from a named engineer."
        error="Enter an address we can reply to."
      >
        {(control) => <TextInput {...control} type="email" />}
      </Field>,
    );

    /* Found by its label, which only works if htmlFor and id agree. */
    const input = screen.getByLabelText('Email');

    const describedBy = input.getAttribute('aria-describedby')?.split(' ') ?? [];
    expect(describedBy).toHaveLength(2);

    const described = describedBy.map((id) => document.getElementById(id)?.textContent);
    expect(described).toEqual([
      'We reply from a named engineer.',
      'Enter an address we can reply to.',
    ]);

    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('marks the control invalid only when an error is present, and keeps the live region mounted', () => {
    const { rerender } = render(
      <Field label="Message" name="message">
        {(control) => <TextInput {...control} />}
      </Field>,
    );

    const input = screen.getByLabelText(/Message/);
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-describedby');

    /*
     * The live region must already exist while the field is valid, otherwise
     * assistive technology is not observing it when a message first arrives.
     */
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion).toBeEmptyDOMElement();

    /* A field without `required` says so in text, not by colour or an asterisk. */
    expect(screen.getByText('(optional)')).toBeInTheDocument();

    rerender(
      <Field label="Message" name="message" error="Tell us roughly what the project is.">
        {(control) => <TextInput {...control} />}
      </Field>,
    );

    expect(screen.getByLabelText(/Message/)).toHaveAttribute('aria-invalid', 'true');
    expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent(
      'Tell us roughly what the project is.',
    );
  });
});
