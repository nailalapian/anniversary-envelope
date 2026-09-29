interface HeartBalloonProps {
  /** "light" is the soft blush pink, "deep" is the richer rose pink. */
  tone: "light" | "deep";
  /** Vertical drift delay in seconds so the balloons do not bob in lockstep. */
  delay?: number;
  className?: string;
}

const TONE_FILL: Record<HeartBalloonProps["tone"], string> = {
  light: "oklch(0.86 0.09 350)",
  deep: "oklch(0.68 0.16 355)",
};

/**
 * A single heart-shaped balloon with a thin trailing string. Purely decorative
 * artwork rendered as inline SVG so it never surfaces as a broken image.
 */
export function HeartBalloon({
  tone,
  delay = 0,
  className,
}: HeartBalloonProps) {
  const fill = TONE_FILL[tone];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 132"
      className={className}
      style={{ animationDelay: `${delay}s` }}
    >
      <defs>
        <radialGradient id={`balloon-${tone}`} cx="34%" cy="28%" r="72%">
          <stop offset="0%" stopColor="oklch(0.96 0.05 350)" />
          <stop offset="55%" stopColor={fill} />
          <stop offset="100%" stopColor={fill} />
        </radialGradient>
      </defs>

      {/* Heart body */}
      <path
        d="M32 46C20 34 8 27 8 17.5 8 9.9 14 4 21.5 4 26.4 4 30.4 6.7 32 10.6 33.6 6.7 37.6 4 42.5 4 50 4 56 9.9 56 17.5 56 27 44 34 32 46Z"
        fill={`url(#balloon-${tone})`}
      />
      {/* Soft highlight */}
      <ellipse
        cx="22"
        cy="15"
        rx="5.5"
        ry="7"
        fill="oklch(0.99 0.02 350 / 0.55)"
        transform="rotate(-24 22 15)"
      />
      {/* Knot */}
      <path d="M29 46h6l-3 5-3-5Z" fill={fill} />
      {/* Thin string */}
      <path
        d="M32 51c4 12-4 20 0 32s-4 20 0 32"
        fill="none"
        stroke="oklch(0.96 0.015 80 / 0.45)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
