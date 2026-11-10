export interface SkipLinkProps {
  /** Id of the `<main>` element this jumps to. */
  targetId: string;
  label: string;
}

/**
 * Bypass link for keyboard and screen-reader users (§11).
 *
 * It is in the DOM and focusable at all times — never `display: none`, which
 * would remove it from the tab order — and only becomes visible on focus.
 */
export function SkipLink({ targetId, label }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="absolute top-0 left-4 z-50 -translate-y-full bg-ink-900 px-4 py-3 text-caption font-medium tracking-wide text-paper uppercase transition-transform focus-visible:translate-y-4"
    >
      {label}
    </a>
  );
}
