import { SectionRule } from '@/components/graphics/SectionRule';
import { Container } from '@/components/ui/Container';

export interface PositioningProps {
  index: string;
  heading: string;
  body: readonly string[];
}

/**
 * A heading in the short column with its prose in the long one — the 4/8 split
 * used for every explanatory section on the site, so the left edge of running
 * text lands in the same place down the page.
 */
export function Positioning({ index, heading, body }: PositioningProps) {
  return (
    <Container width="bleed" as="section" className="py-section-tight">
      <SectionRule index={index} />
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <h2 className="font-display text-h3 leading-snug tracking-tight text-balance text-primary lg:col-span-4">
          {heading}
        </h2>
        <div className="flex max-w-measure flex-col gap-5 lg:col-span-7 lg:col-start-6">
          {body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="leading-relaxed text-secondary">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Container>
  );
}
