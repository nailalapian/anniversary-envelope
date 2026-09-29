interface WaxSealProps {
  /** When true, the seal plays its break animation and fades out. */
  breaking?: boolean;
  className?: string;
}

/**
 * A hand-tooled cream wax seal with a scalloped edge and an embossed
 * botanical sprig. Purely decorative — the envelope owns the interaction.
 */
export function WaxSeal({ breaking = false, className = "" }: WaxSealProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative grid place-items-center rounded-full bg-gradient-seal shadow-seal ${
        breaking ? "animate-seal-break" : "animate-seal-pulse"
      } ${className}`}
    >
      {/* Scalloped melted-wax edge */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="wax-edge" cx="34%" cy="28%" r="78%">
            <stop offset="0%" stopColor="oklch(0.98 0.02 92)" />
            <stop offset="45%" stopColor="oklch(0.93 0.035 88)" />
            <stop offset="100%" stopColor="oklch(0.8 0.05 82)" />
          </radialGradient>
        </defs>
        <path
          fill="url(#wax-edge)"
          d="M50 2c6 0 9 5 15 6s11-3 16 1 2 10 6 15 8 7 7 13-6 9-6 15 4 10 0 15-10 3-15 7-7 9-13 8-9-6-15-6-10 5-15 1-3-10-7-15-9-7-8-13 6-9 6-15-5-10-1-15 10-3 15-7 7-9 13-8 9 6 15 6Z"
        />
      </svg>

      {/* Embossed botanical sprig */}
      <svg
        viewBox="0 0 48 48"
        className="relative h-[58%] w-[58%]"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="oklch(0.62 0.06 74)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M24 40V12" />
          <path d="M24 20c-4-1-7-4-8-8 4 0 7 2 8 6" />
          <path d="M24 20c4-1 7-4 8-8-4 0-7 2-8 6" />
          <path d="M24 28c-4-1-7-4-8-8 4 0 7 2 8 6" />
          <path d="M24 28c4-1 7-4 8-8-4 0-7 2-8 6" />
          <path d="M24 12c-2-2-2-5 0-7 2 2 2 5 0 7Z" />
        </g>
        <g
          fill="none"
          stroke="oklch(0.99 0.015 92)"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        >
          <path d="M24 40V12" />
          <path d="M24 20c-4-1-7-4-8-8 4 0 7 2 8 6" />
          <path d="M24 20c4-1 7-4 8-8-4 0-7 2-8 6" />
          <path d="M24 28c-4-1-7-4-8-8 4 0 7 2 8 6" />
          <path d="M24 28c4-1 7-4 8-8-4 0-7 2-8 6" />
        </g>
      </svg>
    </div>
  );
}
