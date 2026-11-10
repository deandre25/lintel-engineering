import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Disclosure } from '@/components/ui/Disclosure';

describe('Disclosure', () => {
  it('starts collapsed and reports its state through aria-expanded', async () => {
    const user = userEvent.setup();

    render(
      <Disclosure summary="How long does a technical due diligence take?">
        <p>Between two and six weeks.</p>
      </Disclosure>,
    );

    const trigger = screen.getByRole('button', {
      name: 'How long does a technical due diligence take?',
    });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Between two and six weeks.')).not.toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Between two and six weeks.')).toBeInTheDocument();
    /* The panel is a labelled region, so it is reachable as a landmark. */
    expect(screen.getByRole('region', { name: /technical due diligence/ })).toBeInTheDocument();
  });

  it('unmounts the panel when collapsed, so its links leave the tab order', async () => {
    const user = userEvent.setup();

    render(
      <Disclosure summary="Can you assess a structure without drawings?" defaultOpen>
        <a href="/en/contact">Ask an engineer</a>
      </Disclosure>,
    );

    expect(screen.getByRole('link', { name: 'Ask an engineer' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /without drawings/ }));

    /*
     * Hiding with CSS would leave this link focusable while invisible, which is
     * the usual keyboard trap in an accordion.
     */
    expect(screen.queryByRole('link', { name: 'Ask an engineer' })).not.toBeInTheDocument();
  });
});
