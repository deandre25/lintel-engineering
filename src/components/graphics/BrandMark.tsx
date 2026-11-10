export interface BrandMarkProps {
  /** Rendered height in pixels; the width follows the 4:3 viewBox. */
  size?: number;
  className?: string;
}

/**
 * The company mark: a lintel.
 *
 * A lintel is the horizontal member carrying load across an opening, which is
 * the whole of what the firm does — so the mark is the structure itself, drawn
 * as a beam bearing on two piers with the opening left as negative space.
 * Decorative, and named by the adjacent wordmark, so it is hidden from
 * assistive technology rather than given a redundant label.
 */
export function BrandMark({ size = 24, className }: BrandMarkProps) {
  return (
    <svg
      width={(size * 4) / 3}
      height={size}
      viewBox="0 0 32 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...(className === undefined ? {} : { className })}
    >
      <rect x="0" y="2" width="32" height="4.5" />
      <rect x="3" y="9" width="4.5" height="13" />
      <rect x="24.5" y="9" width="4.5" height="13" />
    </svg>
  );
}
