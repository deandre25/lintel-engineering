export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'inverse';

export type ButtonSize = 'md' | 'sm';

/*
 * Square corners and hairline borders rather than pills and shadows. The accent
 * never fills a button: §6 caps it below 5% of the viewport, and a page with
 * three accent-filled buttons breaks that immediately. It appears only in the
 * focus ring, which is where state belongs.
 *
 * Disabled states use explicit inert tokens rather than `opacity-50`. Opacity
 * composites the label and the fill together against the page, which on the
 * primary variant measures about 3.1:1, and it reads as a translucent grey blob
 * beside hairline-bordered buttons. The hover rules are restated under
 * `disabled:` because a disabled button can still match `:hover`.
 */
const VARIANT: Record<ButtonVariant, string> = {
  primary: [
    'border border-ink-900 bg-ink-900 text-inverse',
    'hover:border-ink-700 hover:bg-ink-700',
    'disabled:border-ink-200 disabled:bg-ink-200 disabled:text-ink-600',
    'disabled:hover:border-ink-200 disabled:hover:bg-ink-200',
  ].join(' '),
  secondary: [
    'border border-ink-900 bg-transparent text-primary',
    'hover:bg-ink-900 hover:text-inverse',
    'disabled:border-ink-200 disabled:text-muted',
    'disabled:hover:bg-transparent disabled:hover:text-muted',
  ].join(' '),
  /* For the inverse surface, where a dark fill would be invisible. */
  inverse: [
    'border border-paper bg-paper text-primary',
    'hover:border-ink-100 hover:bg-ink-100',
    'disabled:border-ink-600 disabled:bg-ink-600 disabled:text-ink-200',
    'disabled:hover:border-ink-600 disabled:hover:bg-ink-600',
  ].join(' '),
  quiet: [
    'border border-transparent bg-transparent text-primary',
    'underline decoration-rule-strong decoration-1 underline-offset-4',
    'hover:decoration-ink-900',
    'disabled:text-muted disabled:no-underline',
  ].join(' '),
};

const SIZE: Record<ButtonSize, string> = {
  md: 'px-5 py-3 text-caption',
  sm: 'px-4 py-2 text-micro',
};

const BASE = [
  'inline-flex items-center justify-center gap-2',
  'font-medium uppercase tracking-wide',
  'transition-colors disabled:cursor-not-allowed',
].join(' ');

/**
 * The shared appearance of buttons and button-styled links.
 *
 * Extracted so a real `<button>` and a real `<a>` can look identical without
 * either pretending to be the other — which keeps the semantics honest for
 * keyboard and screen-reader users, who get Space on buttons and Enter plus a
 * context menu on links.
 */
export function buttonClassName(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return [BASE, VARIANT[variant], SIZE[size], className].filter(Boolean).join(' ');
}
