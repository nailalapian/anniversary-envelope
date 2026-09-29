interface IconProps {
  className?: string;
}

/** A soft, rounded heart outline centred on (cx, cy) with the given size. */
function heartPath(cx: number, cy: number, s: number): string {
  return [
    `M ${cx} ${cy + s}`,
    `C ${cx - s * 1.15} ${cy - s * 0.25}, ${cx - s * 0.95} ${cy - s * 1.15}, ${cx} ${cy - s * 0.4}`,
    `C ${cx + s * 0.95} ${cy - s * 1.15}, ${cx + s * 1.15} ${cy - s * 0.25}, ${cx} ${cy + s}`,
    "Z",
  ].join(" ");
}

interface RoseProps {
  cx: number;
  cy: number;
  r: number;
  base: string;
  light: string;
}

/**
 * A soft watercolor rose bloom: a rounded base, a lighter wash offset toward
 * the light, and a small curled centre so the petals read as painted rather
 * than flat.
 */
function Rose({ cx, cy, r, base, light }: RoseProps) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={base} />
      <circle
        cx={cx - r * 0.28}
        cy={cy - r * 0.3}
        r={r * 0.62}
        fill={light}
        opacity="0.7"
      />
      <circle
        cx={cx + r * 0.24}
        cy={cy + r * 0.2}
        r={r * 0.5}
        fill={base}
        opacity="0.85"
      />
      <path
        d={`M ${cx - r * 0.34} ${cy + r * 0.06} a ${r * 0.34} ${r * 0.34} 0 1 1 ${r * 0.68} 0`}
        fill="none"
        stroke={light}
        strokeWidth={r * 0.16}
        strokeLinecap="round"
        opacity="0.75"
      />
      <circle cx={cx - r * 0.04} cy={cy - r * 0.04} r={r * 0.22} fill={light} />
    </g>
  );
}

/** Cream envelope sealed with a red wax heart — the Message gift. */
export function EnvelopeIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="gi-env-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.99 0.015 90)" />
          <stop offset="55%" stopColor="oklch(0.96 0.025 86)" />
          <stop offset="100%" stopColor="oklch(0.9 0.035 80)" />
        </linearGradient>
        <linearGradient id="gi-env-flap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(1 0.01 92)" />
          <stop offset="100%" stopColor="oklch(0.94 0.03 84)" />
        </linearGradient>
        <radialGradient id="gi-wax" cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor="oklch(0.72 0.2 28)" />
          <stop offset="55%" stopColor="oklch(0.55 0.2 26)" />
          <stop offset="100%" stopColor="oklch(0.4 0.16 24)" />
        </radialGradient>
      </defs>

      <ellipse
        cx="60"
        cy="104"
        rx="40"
        ry="6"
        fill="oklch(0.1 0.05 20 / 0.32)"
      />

      {/* Slight tilt gives the envelope a hand-placed, painted feel. */}
      <g transform="rotate(-4 60 63)">
        <rect
          x="12"
          y="30"
          width="96"
          height="66"
          rx="9"
          fill="url(#gi-env-body)"
        />
        <path
          d="M12 96 L60 62 L108 96"
          fill="none"
          stroke="oklch(0.84 0.03 78)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M12 30 H108 L60 72 Z"
          fill="url(#gi-env-flap)"
          stroke="oklch(0.87 0.03 80)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Soft paper highlight along the top edge. */}
        <path
          d="M20 36 H100"
          stroke="oklch(1 0.01 92 / 0.7)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <circle cx="60" cy="70" r="15" fill="url(#gi-wax)" />
        <circle
          cx="60"
          cy="70"
          r="15"
          fill="none"
          stroke="oklch(0.34 0.14 24)"
          strokeWidth="1"
          opacity="0.45"
        />
        <path
          d={heartPath(60, 69, 7)}
          fill="oklch(0.88 0.09 88)"
          opacity="0.92"
        />
      </g>
    </svg>
  );
}

/** A cute teddy bear with pink accents — the Memories gift. */
export function MemoriesIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="gi-bear" cx="38%" cy="28%" r="82%">
          <stop offset="0%" stopColor="oklch(0.78 0.08 66)" />
          <stop offset="60%" stopColor="oklch(0.68 0.09 60)" />
          <stop offset="100%" stopColor="oklch(0.56 0.08 54)" />
        </radialGradient>
        <radialGradient id="gi-bear-muzzle" cx="42%" cy="34%" r="80%">
          <stop offset="0%" stopColor="oklch(0.93 0.04 78)" />
          <stop offset="100%" stopColor="oklch(0.85 0.05 72)" />
        </radialGradient>
        <radialGradient id="gi-heart" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="oklch(0.86 0.12 350)" />
          <stop offset="100%" stopColor="oklch(0.68 0.18 350)" />
        </radialGradient>
      </defs>

      <ellipse
        cx="60"
        cy="106"
        rx="34"
        ry="5"
        fill="oklch(0.1 0.05 20 / 0.32)"
      />

      {/* Ears with pink inner discs. */}
      <circle cx="40" cy="30" r="11" fill="url(#gi-bear)" />
      <circle cx="80" cy="30" r="11" fill="url(#gi-bear)" />
      <circle cx="40" cy="30" r="5.5" fill="oklch(0.82 0.09 350)" />
      <circle cx="80" cy="30" r="5.5" fill="oklch(0.82 0.09 350)" />

      {/* Head, muzzle, eyes, nose and a tiny smile. */}
      <circle cx="60" cy="46" r="24" fill="url(#gi-bear)" />
      <ellipse cx="60" cy="54" rx="12" ry="9" fill="url(#gi-bear-muzzle)" />
      <circle cx="51" cy="42" r="2.6" fill="oklch(0.24 0.04 40)" />
      <circle cx="69" cy="42" r="2.6" fill="oklch(0.24 0.04 40)" />
      <circle cx="51.8" cy="41.2" r="0.9" fill="oklch(0.98 0.01 90)" />
      <circle cx="69.8" cy="41.2" r="0.9" fill="oklch(0.98 0.01 90)" />
      <ellipse cx="60" cy="50" rx="4" ry="3" fill="oklch(0.3 0.06 40)" />
      <path
        d="M60 53 v3 M60 56 c-2 2 -5 2 -6 0 M60 56 c2 2 5 2 6 0"
        fill="none"
        stroke="oklch(0.34 0.05 40)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Pink cheeks. */}
      <ellipse
        cx="46"
        cy="50"
        rx="4"
        ry="2.6"
        fill="oklch(0.82 0.1 350)"
        opacity="0.6"
      />
      <ellipse
        cx="74"
        cy="50"
        rx="4"
        ry="2.6"
        fill="oklch(0.82 0.1 350)"
        opacity="0.6"
      />

      {/* Body with a small pink dress and a heart. */}
      <ellipse cx="60" cy="88" rx="27" ry="24" fill="url(#gi-bear)" />
      <path
        d="M40 82 c6 -6 34 -6 40 0 l-4 22 a6 6 0 0 1 -6 5 h-20 a6 6 0 0 1 -6 -5 Z"
        fill="oklch(0.84 0.1 350)"
        opacity="0.85"
      />
      <path d={heartPath(60, 86, 15)} fill="url(#gi-heart)" />

      {/* Arms and paws. */}
      <ellipse
        cx="36"
        cy="84"
        rx="9"
        ry="13"
        fill="url(#gi-bear)"
        transform="rotate(18 36 84)"
      />
      <ellipse
        cx="84"
        cy="84"
        rx="9"
        ry="13"
        fill="url(#gi-bear)"
        transform="rotate(-18 84 84)"
      />
      <ellipse
        cx="34"
        cy="90"
        rx="4.5"
        ry="5.5"
        fill="oklch(0.86 0.05 70)"
        transform="rotate(18 34 90)"
      />
      <ellipse
        cx="86"
        cy="90"
        rx="4.5"
        ry="5.5"
        fill="oklch(0.86 0.05 70)"
        transform="rotate(-18 86 90)"
      />
    </svg>
  );
}

/** A bouquet of red and pink roses with green stems — the Flowers gift. */
export function FlowersIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="gi-rose-red" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="oklch(0.7 0.2 27)" />
          <stop offset="100%" stopColor="oklch(0.5 0.19 25)" />
        </radialGradient>
        <radialGradient id="gi-rose-pink" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="oklch(0.88 0.1 350)" />
          <stop offset="100%" stopColor="oklch(0.7 0.16 350)" />
        </radialGradient>
        <linearGradient id="gi-wrap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.97 0.02 82)" />
          <stop offset="100%" stopColor="oklch(0.86 0.035 78)" />
        </linearGradient>
      </defs>

      <ellipse
        cx="60"
        cy="110"
        rx="30"
        ry="5"
        fill="oklch(0.1 0.05 20 / 0.32)"
      />

      <g
        stroke="oklch(0.54 0.13 145)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M60 96 C 58 78, 52 62, 44 50" />
        <path d="M60 96 C 60 76, 60 60, 60 46" />
        <path d="M60 96 C 62 78, 68 62, 76 50" />
        <path d="M60 96 C 56 82, 46 72, 36 66" />
        <path d="M60 96 C 64 82, 74 72, 84 66" />
      </g>

      <g fill="oklch(0.6 0.14 145)">
        <path d="M52 74 C 44 70, 40 62, 42 56 C 50 58, 54 66, 52 74 Z" />
        <path d="M68 74 C 76 70, 80 62, 78 56 C 70 58, 66 66, 68 74 Z" />
        <path d="M56 86 C 48 84, 42 78, 42 72 C 50 72, 56 78, 56 86 Z" />
        <path d="M64 86 C 72 84, 78 78, 78 72 C 70 72, 64 78, 64 86 Z" />
      </g>

      <path
        d="M34 78 L60 112 L86 78 Z"
        fill="url(#gi-wrap)"
        stroke="oklch(0.72 0.04 76)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <Rose
        cx={44}
        cy={46}
        r={13}
        base="url(#gi-rose-red)"
        light="oklch(0.78 0.16 28)"
      />
      <Rose
        cx={60}
        cy={40}
        r={14}
        base="url(#gi-rose-pink)"
        light="oklch(0.93 0.07 350)"
      />
      <Rose
        cx={76}
        cy={46}
        r={13}
        base="url(#gi-rose-red)"
        light="oklch(0.78 0.16 28)"
      />
      <Rose
        cx={36}
        cy={64}
        r={11}
        base="url(#gi-rose-pink)"
        light="oklch(0.93 0.07 350)"
      />
      <Rose
        cx={84}
        cy={64}
        r={11}
        base="url(#gi-rose-pink)"
        light="oklch(0.93 0.07 350)"
      />
    </svg>
  );
}

interface HeartBalloonProps extends IconProps {
  tone?: "light" | "deep";
}

/** A floating heart balloon on a thin string. */
export function HeartBalloon({
  tone = "light",
  className = "",
}: HeartBalloonProps) {
  const fill =
    tone === "light" ? "oklch(0.82 0.11 350)" : "oklch(0.62 0.19 350)";
  const highlight =
    tone === "light" ? "oklch(0.92 0.06 350)" : "oklch(0.74 0.15 350)";

  return (
    <svg
      viewBox="0 0 60 96"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={heartPath(30, 26, 22)} fill={fill} />
      <ellipse
        cx="22"
        cy="18"
        rx="5"
        ry="7"
        fill={highlight}
        opacity="0.55"
        transform="rotate(-25 22 18)"
      />
      <path
        d="M30 48 C 30 62, 26 74, 30 92"
        fill="none"
        stroke="oklch(0.9 0.02 80 / 0.5)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A small solid heart used as a caption accent. */
export function HeartGlyph({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={heartPath(12, 11, 9)} fill="currentColor" />
    </svg>
  );
}
