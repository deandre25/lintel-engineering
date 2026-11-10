import type { ReactNode } from 'react';

export interface StyleguideSectionProps {
  title: string;
  /** One line on what the section demonstrates and what constrains it. */
  note: string;
  children: ReactNode;
}

/**
 * One section of the styleguide: a heading, a note on the rule being
 * demonstrated, and the specimens.
 *
 * Local to the styleguide route rather than in `components/ui`, because it is
 * scaffolding for a development page and nothing on the public site uses it.
 */
export function StyleguideSection({ title, note, children }: StyleguideSectionProps) {
  return (
    <section className="border-t border-rule pt-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-3">
          <h2 className="font-display text-h4 leading-snug tracking-tight text-primary">{title}</h2>
          <p className="mt-3 max-w-measure-narrow text-micro leading-relaxed text-muted">{note}</p>
        </div>
        <div className="md:col-span-9">{children}</div>
      </div>
    </section>
  );
}
