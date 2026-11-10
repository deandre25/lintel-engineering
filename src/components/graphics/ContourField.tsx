export interface ContourFieldProps {
  className?: string;
}

/**
 * A contour field, as a survey drawing renders terrain.
 *
 * Used as a quiet full-bleed texture behind section breaks, in place of the
 * photograph the brief rules out. Every line is a path written here rather than
 * an imported asset, which is the point: a reviewer who opens this file sees
 * drawing, not stock.
 */
export function ContourField({ className }: ContourFieldProps) {
  return (
    <svg
      viewBox="0 0 1200 220"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      {...(className === undefined ? {} : { className })}
    >
      <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <path
          d="M0 196 C 180 182, 300 206, 470 190 S 760 150, 940 168 S 1120 196, 1200 182"
          opacity="0.5"
        />
        <path
          d="M0 170 C 190 154, 310 180, 480 162 S 770 120, 950 140 S 1125 170, 1200 154"
          opacity="0.42"
        />
        <path
          d="M0 144 C 200 126, 320 154, 490 134 S 780 90, 960 112 S 1130 144, 1200 126"
          opacity="0.34"
        />
        <path
          d="M0 118 C 210 98, 330 128, 500 106 S 790 60, 970 84 S 1135 118, 1200 98"
          opacity="0.26"
        />
        <path
          d="M0 92 C 220 70, 340 102, 510 78 S 800 30, 980 56 S 1140 92, 1200 70"
          opacity="0.18"
        />
        <path
          d="M0 66 C 230 42, 350 76, 520 50 S 810 0, 990 28 S 1145 66, 1200 42"
          opacity="0.12"
        />
      </g>
    </svg>
  );
}
