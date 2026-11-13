import { SectionRule } from '@/components/graphics/SectionRule';
import { Container } from '@/components/ui/Container';

import type { ReactNode } from 'react';

export interface DisciplineGroup {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly headcount: number;
  readonly services: readonly {
    readonly slug: string;
    readonly name: string;
    readonly summary: string;
  }[];
}

export interface DisciplineListProps {
  index: string;
  heading: string;
  standfirst: string;
  groups: readonly DisciplineGroup[];
  /** Renders the link for a service; supplied by the page, which owns routing. */
  renderServiceLink: (slug: string, label: string) => ReactNode;
  headcountLabel: (count: number) => string;
}

/**
 * The six services under their three disciplines.
 *
 * This is the section that answers the "three disciplines" claim made in the
 * hero and the figures: the grouping is shown rather than asserted. Rows are
 * separated by hairline rules rather than being boxed into cards, which also
 * keeps the three groups readable as one list at narrow widths.
 */
export function DisciplineList({
  index,
  heading,
  standfirst,
  groups,
  renderServiceLink,
  headcountLabel,
}: DisciplineListProps) {
  return (
    <Container width="bleed" as="section" className="py-section-tight">
      <SectionRule index={index} />
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <h2 className="font-display text-h3 leading-snug tracking-tight text-balance text-primary lg:col-span-4">
          {heading}
        </h2>
        <p className="max-w-measure leading-relaxed text-secondary lg:col-span-7 lg:col-start-6">
          {standfirst}
        </p>
      </div>

      <div className="mt-10 flex flex-col">
        {groups.map((group) => (
          <section key={group.id} className="border-t border-rule py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h3 className="font-display text-h5 leading-snug text-primary">{group.name}</h3>
                <p className="mt-2 text-micro tracking-wide text-muted uppercase tabular-nums">
                  {headcountLabel(group.headcount)}
                </p>
                <p className="mt-4 max-w-measure-narrow text-caption leading-relaxed text-secondary">
                  {group.description}
                </p>
              </div>

              <ul className="flex flex-col gap-5 lg:col-span-7 lg:col-start-6">
                {group.services.map((service) => (
                  <li key={service.slug}>
                    <h4 className="text-body-lg text-primary">
                      {renderServiceLink(service.slug, service.name)}
                    </h4>
                    <p className="mt-1 max-w-measure text-caption leading-relaxed text-muted">
                      {service.summary}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
