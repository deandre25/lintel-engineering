export interface SectionRuleProps {
  /** Index shown at the left, as a drawing sheet numbers its sections. */
  index?: string;
  className?: string;
}

/**
 * A hairline rule with a section index, used where a page changes subject.
 *
 * This is the site's main structural device in place of bordered cards: §6 asks
 * for hairline rules carrying structure, and a numbered rule reads as a
 * drawing convention rather than as decoration.
 */
export function SectionRule({ index, className }: SectionRuleProps) {
  return (
    <div
      className={['flex items-center gap-4 text-muted', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      {index === undefined ? null : (
        <span className="font-mono text-micro tracking-wide tabular-nums">{index}</span>
      )}
      <span className="h-px flex-1 bg-rule" />
    </div>
  );
}
