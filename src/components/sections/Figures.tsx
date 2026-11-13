import { SectionRule } from '@/components/graphics/SectionRule';
import { Container } from '@/components/ui/Container';

export interface FigureItem {
  readonly term: string;
  readonly description: string;
}

export interface FiguresProps {
  index: string;
  heading: string;
  items: readonly FigureItem[];
}

/**
 * The firm's standing facts, as a description list.
 *
 * A `dl` rather than a row of stat cards, because these are terms and their
 * values rather than metrics. Nothing counts up on scroll (§17): the numbers
 * are small and true, and animating them would be the tell that they are not.
 */
export function Figures({ index, heading, items }: FiguresProps) {
  return (
    <Container width="bleed" as="section" className="py-section-tight">
      <SectionRule index={index} />
      <h2 className="sr-only">{heading}</h2>
      <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.term} className="border-t border-rule-strong pt-5">
            <dt className="text-micro font-medium tracking-eyebrow text-muted uppercase">
              {item.term}
            </dt>
            <dd className="mt-3 max-w-measure-narrow font-display text-h5 leading-snug text-primary tabular-nums">
              {item.description}
            </dd>
          </div>
        ))}
      </dl>
    </Container>
  );
}
