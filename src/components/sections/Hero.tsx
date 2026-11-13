import { PortalFrame } from '@/components/graphics/PortalFrame';
import { Container } from '@/components/ui/Container';

export interface HeroProps {
  eyebrow: string;
  heading: string;
  lead: string;
  /** Rendered under the lead; usually a single call to action. */
  action?: React.ReactNode;
}

/**
 * The home page hero.
 *
 * Deliberately not a centred headline over a gradient with two buttons (§17).
 * The type is set left on a 7/5 split, the drawing occupies the short column,
 * and the only coloured element on the screen is the eyebrow and the runway
 * beam in the frame — which keeps the accent well under the 5% cap.
 */
export function Hero({ eyebrow, heading, lead, action }: HeroProps) {
  return (
    <Container width="bleed" as="section" className="pt-8 pb-section-tight lg:pt-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-6">
        <div className="lg:col-span-7">
          <p className="text-micro font-medium tracking-eyebrow text-accent uppercase">{eyebrow}</p>
          <h1 className="mt-6 font-display text-h1 leading-display tracking-display text-balance text-primary">
            {heading}
          </h1>
        </div>

        <div className="lg:col-span-5">
          <p className="max-w-measure text-lead leading-snug text-secondary">{lead}</p>
          {action === undefined ? null : <div className="mt-7">{action}</div>}
        </div>
      </div>

      <div className="mt-9 border-t border-rule pt-8">
        <PortalFrame className="h-auto w-full text-ink-700" />
      </div>
    </Container>
  );
}
