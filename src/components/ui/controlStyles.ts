/*
 * One appearance for every control, so an input, a textarea and a select line
 * up on the same baseline grid and share one invalid state.
 *
 * `aria-invalid` drives the invalid styling rather than a separate prop: there
 * is then no way to show an error ring without also telling assistive
 * technology, which is the failure mode of a styled-only error state.
 */
export const CONTROL_CLASS = [
  'w-full border bg-surface-raised px-4 py-3 text-body text-primary',
  'border-rule-strong transition-colors',
  'placeholder:text-ink-300',
  'hover:border-ink-400',
  'aria-invalid:border-accent',
  'disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-muted',
].join(' ');
