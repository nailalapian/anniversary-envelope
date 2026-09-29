interface FlowerBouquetProps {
  className?: string;
}

interface BloomProps {
  cx: number;
  cy: number;
  r: number;
  base: string;
  light: string;
  deep: string;
}

/**
 * A soft watercolor rose: a rounded base wash, a lighter highlight offset
 * toward the light, a curled centre, and a faint outer petal ring so the bloom
 * reads as painted rather than flat.
 */
function Bloom({ cx, cy, r, base, light, deep }: BloomProps) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r={r} fill={base} />
      <circle r={r * 0.82} fill={light} opacity="0.45" />
      <circle r={r * 0.58} fill={base} opacity="0.9" />
      <path
        d={`M ${-r * 0.42} ${r * 0.06} a ${r * 0.42} ${r * 0.42} 0 1 1 ${r * 0.84} 0`}
        fill="none"
        stroke={light}
        strokeWidth={r * 0.16}
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d={`M ${-r * 0.24} ${-r * 0.02} a ${r * 0.24} ${r * 0.24} 0 1 1 ${r * 0.48} 0`}
        fill="none"
        stroke={deep}
        strokeWidth={r * 0.12}
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle r={r * 0.16} fill={light} />
    </g>
  );
}

/**
 * A hand-drawn rose bouquet: red and pink blooms over green stems, wrapped in
 * cream paper. Inline SVG artwork so it renders crisply at any size and never
 * appears as a broken image.
 */
export function FlowerBouquet({ className }: FlowerBouquetProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 360"
      className={className}
      role="presentation"
    >
      <defs>
        <radialGradient id="rose-red" cx="36%" cy="30%" r="72%">
          <stop offset="0%" stopColor="oklch(0.76 0.18 26)" />
          <stop offset="60%" stopColor="oklch(0.58 0.2 25)" />
          <stop offset="100%" stopColor="oklch(0.44 0.17 25)" />
        </radialGradient>
        <radialGradient id="rose-pink" cx="36%" cy="30%" r="72%">
          <stop offset="0%" stopColor="oklch(0.92 0.07 350)" />
          <stop offset="60%" stopColor="oklch(0.8 0.13 352)" />
          <stop offset="100%" stopColor="oklch(0.68 0.15 355)" />
        </radialGradient>
        <linearGradient id="stem" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.58 0.13 145)" />
          <stop offset="100%" stopColor="oklch(0.42 0.11 148)" />
        </linearGradient>
        <linearGradient id="wrap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.98 0.02 80)" />
          <stop offset="100%" stopColor="oklch(0.89 0.03 78)" />
        </linearGradient>
      </defs>

      {/* Stems */}
      <g stroke="url(#stem)" strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M160 300C150 250 128 210 112 176" />
        <path d="M160 300C160 246 160 208 160 168" />
        <path d="M160 300C170 250 192 210 208 176" />
        <path d="M160 300C142 262 120 240 96 224" />
        <path d="M160 300C178 262 200 240 224 224" />
      </g>

      {/* Leaves */}
      <g fill="oklch(0.54 0.12 146)">
        <path d="M132 236c-16-6-30-2-38 10 14 8 30 6 38-10Z" />
        <path d="M188 236c16-6 30-2 38 10-14 8-30 6-38-10Z" />
        <path d="M150 268c-14-4-26 0-32 10 12 7 26 5 32-10Z" />
        <path d="M170 268c14-4 26 0 32 10-12 7-26 5-32-10Z" />
      </g>

      {/* Blooms */}
      <g>
        <Bloom
          cx={112}
          cy={150}
          r={34}
          base="url(#rose-red)"
          light="oklch(0.82 0.14 27)"
          deep="oklch(0.4 0.16 25)"
        />
        <Bloom
          cx={208}
          cy={150}
          r={32}
          base="url(#rose-red)"
          light="oklch(0.82 0.14 27)"
          deep="oklch(0.4 0.16 25)"
        />
        <Bloom
          cx={160}
          cy={118}
          r={36}
          base="url(#rose-pink)"
          light="oklch(0.95 0.05 350)"
          deep="oklch(0.6 0.14 355)"
        />
        <Bloom
          cx={96}
          cy={214}
          r={26}
          base="url(#rose-pink)"
          light="oklch(0.95 0.05 350)"
          deep="oklch(0.6 0.14 355)"
        />
        <Bloom
          cx={224}
          cy={214}
          r={26}
          base="url(#rose-pink)"
          light="oklch(0.95 0.05 350)"
          deep="oklch(0.6 0.14 355)"
        />
      </g>

      {/* Cream wrap */}
      <path
        d="M104 268h112l-16 74a10 10 0 0 1-10 8h-60a10 10 0 0 1-10-8l-16-74Z"
        fill="url(#wrap)"
      />
      <path
        d="M104 268h112"
        stroke="oklch(0.8 0.04 78)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Gold ribbon */}
      <path
        d="M104 292h112"
        stroke="oklch(0.76 0.12 82)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M160 292c-14-10-30-8-34 4 12 8 26 6 34-4Zm0 0c14-10 30-8 34 4-12 8-26 6-34-4Z"
        fill="oklch(0.8 0.13 84)"
      />
    </svg>
  );
}
