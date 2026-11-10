import type { ReactNode } from 'react';

export interface ProseProps {
  children: ReactNode;
  /** `text` caps the measure at 68ch; `wide` relaxes it to 76ch for tables. */
  measure?: 'text' | 'wide' | 'narrow';
  className?: string;
}

const MEASURE: Record<NonNullable<ProseProps['measure']>, string> = {
  narrow: 'max-w-measure-narrow',
  text: 'max-w-measure',
  wide: 'max-w-measure-wide',
};

/**
 * Typographic context for long-form content: insight articles, legal pages and
 * anything authored as MDX, where the markup is generated and cannot carry
 * utility classes.
 *
 * The rules live in `globals.css` under `.prose` rather than as utilities here,
 * because they have to reach elements this component never sees. Written by
 * hand rather than through a typography plugin, since §2 rules out dropping in
 * a component library and the vertical rhythm is the thing being demonstrated.
 */
export function Prose({ children, measure = 'text', className }: ProseProps) {
  return (
    <div className={['prose', MEASURE[measure], className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
