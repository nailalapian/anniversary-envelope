import { WaxSeal } from "./WaxSeal";

interface EnvelopeProps {
  /** "closed" shows the sealed envelope; "opening" plays the flap + seal break. */
  state: "closed" | "opening";
  onOpen: () => void;
}

/**
 * The sealed red envelope: a crimson body with a darker closed triangular flap
 * and a cream wax seal centered on the flap point. The whole envelope is the
 * interaction surface — a single button with a visible focus ring.
 */
export function Envelope({ state, onOpen }: EnvelopeProps) {
  const opening = state === "opening";

  return (
    <button
      type="button"
      data-ocid="envelope.open_button"
      onClick={onOpen}
      aria-label="Open the anniversary envelope"
      className="group perspective-envelope relative block w-[min(78vw,20rem)] cursor-pointer rounded-md outline-none transition-smooth hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:w-[22rem]"
    >
      {/* Envelope body */}
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md bg-gradient-envelope shadow-envelope">
        {/* Inner pocket shading */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[oklch(0.32_0.14_22)] to-transparent"
        />
        {/* Side folds */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1/2 origin-left bg-gradient-to-r from-[oklch(0.44_0.17_23)] to-transparent"
          style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-1/2 origin-right bg-gradient-to-l from-[oklch(0.44_0.17_23)] to-transparent"
          style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }}
        />

        {/* Triangular flap — rotates up and back on open. The back face stays
            visible (no backface-hidden) so the flap reads as lifting rather
            than vanishing once the rotation passes 90 degrees. */}
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 h-[62%] origin-top preserve-3d ${
            opening ? "animate-flap-open" : ""
          }`}
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
        >
          <div className="h-full w-full bg-gradient-flap" />
          <div className="absolute inset-0 bg-gradient-flap-back" />
        </div>

        {/* Wax seal centered on the flap point (flap tip sits at 62% of the
            height) — large and ornate, as in the reference. */}
        <div className="absolute left-1/2 top-[62%] z-10 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2">
          <WaxSeal breaking={opening} className="h-full w-full" />
        </div>
      </div>
    </button>
  );
}
