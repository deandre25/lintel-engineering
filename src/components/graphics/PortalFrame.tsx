export interface PortalFrameProps {
  className?: string;
}

/**
 * An isometric portal frame with its crane runway — the structure most of the
 * case studies are about.
 *
 * Drawn as a sectional diagram rather than an illustration: hairline strokes,
 * a single accent on the member that carries the load in question, and
 * dimension lines that behave the way they do on a real drawing. Decorative in
 * the page, so it is hidden from assistive technology; anything it conveys is
 * stated in the adjacent copy.
 */
export function PortalFrame({ className }: PortalFrameProps) {
  return (
    <svg
      viewBox="0 0 420 300"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...(className === undefined ? {} : { className })}
    >
      <g
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
        vectorEffect="non-scaling-stroke"
      >
        {/* Ground line, drawn long so the frame sits in a plane rather than floating. */}
        <path d="M10 268 L410 268" opacity="0.35" />

        {/* Near frame: two columns and the rafters meeting at the ridge. */}
        <path d="M80 268 L80 120 L210 72 L340 120 L340 268" />
        {/* Far frame, offset in the isometric direction and drawn lighter. */}
        <path d="M128 240 L128 92 L258 44 L388 92 L388 240" opacity="0.4" />
        {/* The two frames tied together at eaves and ridge. */}
        <path d="M80 120 L128 92 M340 120 L388 92 M210 72 L258 44" opacity="0.4" />

        {/* Eaves haunches: the detail that governs a portal frame. */}
        <path d="M80 142 L102 128 M340 142 L318 128" opacity="0.7" />

        {/* Column bases, as the plates they actually are. */}
        <path d="M68 268 L92 268 M328 268 L352 268" strokeWidth="2" />

        {/* Bracing in the end bay. */}
        <path d="M80 268 L128 92 M128 240 L80 120" opacity="0.18" />
      </g>

      {/*
       * The runway beam and its bracket, in the accent: this is the member the
       * Sibiu assessment turned on, and the only coloured element in the frame.
       */}
      <g
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="square"
        vectorEffect="non-scaling-stroke"
      >
        <path d="M80 168 L340 168" />
        <path d="M80 168 L96 182 M340 168 L324 182" />
      </g>

      {/* Dimension line under the span, with the ticks a drawing would carry. */}
      <g stroke="currentColor" strokeWidth="1" opacity="0.45" vectorEffect="non-scaling-stroke">
        <path d="M80 288 L340 288" />
        <path d="M80 282 L80 294 M340 282 L340 294" />
      </g>
    </svg>
  );
}
