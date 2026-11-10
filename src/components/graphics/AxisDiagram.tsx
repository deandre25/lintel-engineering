export interface AxisDiagramProps {
  className?: string;
}

/**
 * A load-duty plot: cycles against stress range, with the governing detail
 * marked.
 *
 * The shape is the point — a measured spectrum sitting well below the assumed
 * classification is the finding the fatigue article and the Sibiu case study
 * both turn on. Axes carry ticks but no numbers, because invented numbers on a
 * chart would be a claim rather than a drawing.
 */
export function AxisDiagram({ className }: AxisDiagramProps) {
  return (
    <svg
      viewBox="0 0 360 240"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...(className === undefined ? {} : { className })}
    >
      <g stroke="currentColor" vectorEffect="non-scaling-stroke">
        {/* Axes. */}
        <path d="M44 20 L44 204 L336 204" strokeWidth="1" />

        {/* Ticks, evenly spaced on both axes. */}
        <g strokeWidth="1" opacity="0.5">
          <path d="M44 168 L38 168 M44 132 L38 132 M44 96 L38 96 M44 60 L38 60" />
          <path d="M102 204 L102 210 M160 204 L160 210 M218 204 L218 210 M276 204 L276 210" />
        </g>

        {/* Gridlines, faint enough to read as paper rather than as structure. */}
        <g strokeWidth="1" opacity="0.12">
          <path d="M44 168 L336 168 M44 132 L336 132 M44 96 L336 96 M44 60 L336 60" />
        </g>

        {/* The assumed classification: a straight, conservative line. */}
        <path d="M44 56 L336 176" strokeWidth="1" strokeDasharray="4 4" opacity="0.55" />
      </g>

      {/* The measured spectrum, sitting below the assumption throughout. */}
      <path
        d="M44 104 C 110 118, 150 150, 196 162 S 280 186, 336 194"
        stroke="var(--accent)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />

      {/* The governing detail, where the two are closest. */}
      <circle cx="196" cy="162" r="4" fill="var(--accent)" />
      <circle cx="196" cy="162" r="9" stroke="var(--accent)" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
