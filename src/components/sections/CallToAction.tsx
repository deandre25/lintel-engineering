import { ContourField } from '@/components/graphics/ContourField';
import { Container } from '@/components/ui/Container';

import type { ReactNode } from 'react';

export interface CallToActionProps {
  heading: string;
  body: readonly string[];
  action: ReactNode;
}

/**
 * The closing section, on the inverse surface.
 *
 * `data-surface="inverse"` switches the focus ring to its light variant for
 * everything inside, which is why that rule is written against the attribute in
 * globals.css rather than restated here. The contour drawing sits behind the
 * text at low opacity and is the only texture on the page.
 */
export function CallToAction({ heading, body, action }: CallToActionProps) {
  return (
    <section data-surface="inverse" className="relative overflow-hidden bg-surface-inverse">
      <ContourField className="h-40 absolute inset-x-0 bottom-0 w-full text-ink-300 opacity-20" />

      <Container width="bleed" className="relative py-section-tight">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
          <h2 className="font-display text-h3 leading-snug tracking-tight text-balance text-inverse lg:col-span-5">
            {heading}
          </h2>
          <div className="flex flex-col gap-5 lg:col-span-6 lg:col-start-7">
            {body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="max-w-measure leading-relaxed text-inverse-muted"
              >
                {paragraph}
              </p>
            ))}
            <div className="mt-2">{action}</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
