import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Breadcrumb } from '@/components/ui/Breadcrumb';

describe('Breadcrumb', () => {
  it('links earlier steps to localised paths and marks the last as the current page', () => {
    render(
      <Breadcrumb
        locale="ro"
        label="Firul Ariadnei"
        items={[
          { label: 'Acasă', route: 'home' },
          { label: 'Servicii', route: 'services' },
          { label: 'Inginerie structurală' },
        ]}
      />,
    );

    expect(screen.getByRole('navigation', { name: 'Firul Ariadnei' })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Acasă' })).toHaveAttribute('href', '/ro');
    /* The localised spelling, not the English file-system route. */
    expect(screen.getByRole('link', { name: 'Servicii' })).toHaveAttribute('href', '/ro/servicii');

    const current = screen.getByText('Inginerie structurală');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: 'Inginerie structurală' })).not.toBeInTheDocument();
  });

  it('builds a dynamic step from its slug and hides the separators from assistive technology', () => {
    render(
      <Breadcrumb
        locale="en"
        label="Breadcrumb"
        items={[
          { label: 'Work', route: 'work' },
          { label: 'Press line migration', route: 'caseStudy', slug: 'press-line-migration' },
          { label: 'Results' },
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'Press line migration' })).toHaveAttribute(
      'href',
      '/en/work/press-line-migration',
    );

    /*
     * Three steps means two separators, and neither should be announced — a
     * screen reader should read a list of steps, not "Work slash Press line".
     */
    const separators = screen.getAllByText('/');
    expect(separators).toHaveLength(2);
    for (const separator of separators) {
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    }
  });
});
