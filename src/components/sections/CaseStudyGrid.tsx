import { SectionRule } from '@/components/graphics/SectionRule';
import { Container } from '@/components/ui/Container';

import type { ReactNode } from 'react';

export interface CaseStudyCard {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly sector: string;
  readonly year: number;
  readonly headline: { readonly value: string; readonly label: string };
}

export interface CaseStudyGridProps {
  index: string;
  heading: string;
  standfirst: string;
  items: readonly CaseStudyCard[];
  renderLink: (slug: string, label: string) => ReactNode;
  footer?: ReactNode;
}

/**
 * Case studies as an index, led by the number each engagement was measured by.
 *
 * The figure is set large in the display face and the title beneath it, so the
 * row scans as a result rather than as a headline with a statistic attached.
 * Rows are hairline-separated; nothing is a floating card with a shadow, and
 * nothing animates a number upward (§17).
 */
export function CaseStudyGrid({
  index,
  heading,
  standfirst,
  items,
  renderLink,
  footer,
}: CaseStudyGridProps) {
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

      <ul className="mt-10 flex flex-col">
        {items.map((item) => (
          <li key={item.slug} className="border-t border-rule py-8">
            <article className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
              <div className="lg:col-span-4">
                <p className="font-display text-h3 leading-tight tracking-tight text-accent tabular-nums">
                  {item.headline.value}
                </p>
                <p className="mt-2 max-w-measure-narrow text-caption leading-relaxed text-muted">
                  {item.headline.label}
                </p>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                <p className="text-micro tracking-wide text-muted uppercase tabular-nums">
                  {item.sector} · {item.year}
                </p>
                <h3 className="mt-3 font-display text-h5 leading-snug text-primary">
                  {renderLink(item.slug, item.title)}
                </h3>
                <p className="mt-3 max-w-measure leading-relaxed text-secondary">{item.summary}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {footer === undefined ? null : <div className="border-t border-rule pt-8">{footer}</div>}
    </Container>
  );
}
