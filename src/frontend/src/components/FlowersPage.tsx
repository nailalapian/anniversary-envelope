import { FlowerBouquet } from "@/components/icons/FlowerBouquet";

interface FlowersPageProps {
  onBack: () => void;
}

interface PetalProps {
  x: number;
  y: number;
  r: number;
  rotate: number;
  fill: string;
  opacity: number;
  delay: string;
  duration: string;
}

const PETALS: PetalProps[] = [
  {
    x: 34,
    y: 96,
    r: 9,
    rotate: -18,
    fill: "oklch(0.8 0.13 352)",
    opacity: 0.55,
    delay: "0s",
    duration: "7s",
  },
  {
    x: 286,
    y: 132,
    r: 7,
    rotate: 24,
    fill: "oklch(0.58 0.2 25)",
    opacity: 0.5,
    delay: "1.4s",
    duration: "8.5s",
  },
  {
    x: 62,
    y: 268,
    r: 6,
    rotate: 12,
    fill: "oklch(0.92 0.07 350)",
    opacity: 0.45,
    delay: "2.6s",
    duration: "9.5s",
  },
  {
    x: 262,
    y: 300,
    r: 8,
    rotate: -30,
    fill: "oklch(0.76 0.18 26)",
    opacity: 0.5,
    delay: "0.8s",
    duration: "8s",
  },
  {
    x: 150,
    y: 44,
    r: 5,
    rotate: 40,
    fill: "oklch(0.88 0.09 92)",
    opacity: 0.4,
    delay: "3.2s",
    duration: "10s",
  },
];

/**
 * A single soft watercolor petal that drifts gently, echoing the painted
 * blooms in the bouquet without competing with them.
 */
function Petal({
  x,
  y,
  r,
  rotate,
  fill,
  opacity,
  delay,
  duration,
}: PetalProps) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate})`}
      style={{
        animation: `float-soft ${duration} ease-in-out ${delay} infinite`,
      }}
    >
      <path
        d={`M 0 ${-r} C ${r * 0.9} ${-r * 0.5} ${r * 0.9} ${r * 0.5} 0 ${r} C ${-r * 0.9} ${r * 0.5} ${-r * 0.9} ${-r * 0.5} 0 ${-r} Z`}
        fill={fill}
        opacity={opacity}
      />
    </g>
  );
}

/**
 * The "Flowers" gift: a soft watercolor rose bouquet held in a candlelit halo
 * on the velvet burgundy stage, with a script caption and a quiet Back link.
 */
export function FlowersPage({ onBack }: FlowersPageProps) {
  return (
    <section
      data-ocid="flowers.page"
      className="animate-fade-rise relative flex w-full flex-col items-center"
    >
      <div className="relative flex w-full items-center justify-center">
        {/* Candlelight halo pooled behind the bouquet */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-72 w-72 rounded-full bg-[radial-gradient(circle,oklch(0.74_0.12_82_/_0.22)_0%,oklch(0.55_0.16_25_/_0.14)_42%,transparent_72%)] blur-2xl sm:h-96 sm:w-96" />
        </div>

        {/* Drifting petals, drawn in the same watercolor style */}
        <svg
          aria-hidden="true"
          viewBox="0 0 320 360"
          preserveAspectRatio="xMidYMid meet"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {PETALS.map((petal) => (
            <Petal key={`${petal.x}-${petal.y}`} {...petal} />
          ))}
        </svg>

        <div className="animate-float-soft relative flex w-full items-center justify-center">
          <FlowerBouquet className="h-64 w-auto drop-shadow-[0_28px_46px_oklch(0.08_0.04_18_/_0.72)] sm:h-80" />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-5 sm:mt-10">
        <p
          data-ocid="flowers.caption"
          className="text-glow text-center font-display text-3xl italic leading-tight text-foreground sm:text-4xl"
        >
          Bunga untukmu, selalu.
        </p>

        <button
          type="button"
          data-ocid="flowers.back_button"
          onClick={onBack}
          className="rounded-full px-4 py-2 font-body text-sm font-medium text-foreground underline decoration-foreground/50 decoration-1 underline-offset-4 transition-smooth hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Back
        </button>
      </div>
    </section>
  );
}
