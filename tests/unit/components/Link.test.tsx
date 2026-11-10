import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Link } from '@/components/ui/Link';
import { Select } from '@/components/ui/Select';

describe('Link', () => {
  it('resolves registry routes to localised paths, including slugs', () => {
    render(
      <>
        <Link locale="ro" route="about">
          Despre noi
        </Link>
        <Link locale="ro" route="service" slug="inginerie-structurala">
          Inginerie structurală
        </Link>
      </>,
    );

    expect(screen.getByRole('link', { name: 'Despre noi' })).toHaveAttribute(
      'href',
      '/ro/despre-noi',
    );
    expect(screen.getByRole('link', { name: 'Inginerie structurală' })).toHaveAttribute(
      'href',
      '/ro/servicii/inginerie-structurala',
    );
  });

  it('opens cross-origin links safely and leaves same-document schemes alone', () => {
    render(
      <>
        <Link href="https://example.org/standard">An external standard</Link>
        <Link href="mailto:office@lintel-engineering.com">Email the office</Link>
      </>,
    );

    const external = screen.getByRole('link', { name: 'An external standard' });
    expect(external).toHaveAttribute('rel', 'noreferrer');
    expect(external).toHaveAttribute('target', '_blank');

    /* A mailto opening in a new tab would leave an empty window behind. */
    const mail = screen.getByRole('link', { name: 'Email the office' });
    expect(mail).not.toHaveAttribute('target');
    expect(mail).not.toHaveAttribute('rel');
  });
});

describe('Button and ButtonLink', () => {
  it('defaults a button to type="button", so it cannot submit a form by accident', () => {
    render(
      <form>
        <Button>Clear</Button>
        <Button type="submit">Send</Button>
      </form>,
    );

    expect(screen.getByRole('button', { name: 'Clear' })).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit');
  });

  it('renders navigation as an anchor rather than a button that looks like one', () => {
    render(
      <ButtonLink locale="en" route="contact">
        Start a conversation
      </ButtonLink>,
    );

    const link = screen.getByRole('link', { name: 'Start a conversation' });
    expect(link).toHaveAttribute('href', '/en/contact');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('Select', () => {
  it('renders the placeholder as a disabled, empty-valued option so it cannot be submitted', () => {
    render(
      <Select
        name="enquiry"
        placeholder="Select a discipline"
        options={[
          { value: 'structural', label: 'Structural engineering' },
          { value: 'energy', label: 'Energy and efficiency audits' },
        ]}
      />,
    );

    const placeholder = screen.getByRole('option', { name: 'Select a discipline' });
    expect(placeholder).toBeDisabled();
    expect(placeholder).toHaveValue('');

    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByRole('combobox')).toHaveValue('');
  });
});
