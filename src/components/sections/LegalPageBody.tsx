import { SectionRule } from '@/components/graphics/SectionRule';
import { Container } from '@/components/ui/Container';

import type { LegalPage } from '@/content/schema';

export interface LegalPageBodyProps {
  page: LegalPage;
  /** Pre-formatted and localised, because this component does no formatting. */
  updatedLabel: string;
  breadcrumb: React.ReactNode;
}

/**
 * The shared body of the four legal pages.
 *
 * One template rather than four, because the pages differ only in content —
 * and because a policy whose layout drifts from its siblings reads as having
 * been written at a different time by somebody else.
 */
export function LegalPageBody({ page, updatedLabel, breadcrumb }: LegalPageBodyProps) {
  return (
    <Container width="bleed" as="section" className="pt-8 pb-section">
      {breadcrumb}

      <header className="mt-8 border-b border-rule pb-8">
        <h1 className="max-w-measure-wide font-display text-h2 leading-display tracking-display text-balance text-primary">
          {page.title}
        </h1>
        <p className="mt-6 max-w-measure text-lead leading-snug text-secondary">{page.intro}</p>
        <p className="mt-6 text-micro tracking-wide text-muted uppercase tabular-nums">
          {updatedLabel}
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-10">
        {page.sections.map((section, position) => (
          <section key={section.heading}>
            <SectionRule index={String(position + 1).padStart(2, '0')} />
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
              <h2 className="font-display text-h4 leading-snug tracking-tight text-primary lg:col-span-4">
                {section.heading}
              </h2>

              <div className="flex max-w-measure flex-col gap-5 lg:col-span-7 lg:col-start-6">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)} className="leading-relaxed text-secondary">
                    {paragraph}
                  </p>
                ))}

                {section.items === undefined ? null : (
                  <dl className="mt-2 flex flex-col">
                    {section.items.map((item) => (
                      <div key={item.term} className="border-t border-rule py-4">
                        <dt className="text-caption font-medium text-primary">{item.term}</dt>
                        <dd className="mt-1 leading-relaxed text-secondary">{item.description}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
