import { useEffect, useState } from "react";

import { Envelope } from "@/components/Envelope";
import { FlowersPage } from "@/components/FlowersPage";
import { type Gift, GiftSelection } from "@/components/GiftSelection";
import { InnerMessage } from "@/components/InnerMessage";
import { MemoriesPage } from "@/components/MemoriesPage";

type Stage = "closed" | "opening" | "gifts" | Gift;

const OPEN_ANIMATION_MS = 900;
const REDUCED_MOTION_MS = 60;

/**
 * The full-screen anniversary scene: a velvet burgundy stage that moves from
 * the sealed envelope, through the "Gifts for you" selection, into the chosen
 * gift page and back again.
 */
export function AnniversaryCard() {
  const [stage, setStage] = useState<Stage>("closed");

  useEffect(() => {
    if (stage !== "opening") return;
    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(
      () => setStage("gifts"),
      reducedMotion ? REDUCED_MOTION_MS : OPEN_ANIMATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [stage]);

  const handleOpen = () => {
    setStage((current) => (current === "closed" ? "opening" : current));
  };

  const handleSelect = (gift: Gift) => setStage(gift);
  const handleBack = () => setStage("gifts");

  const showOpening = stage === "closed" || stage === "opening";
  const envelopeState: "closed" | "opening" =
    stage === "opening" ? "opening" : "closed";

  return (
    <main
      data-ocid="anniversary.page"
      className="bg-velvet relative flex min-h-dvh w-full flex-col items-center justify-center overflow-x-hidden px-6 py-12"
    >
      <div className="flex w-full max-w-3xl flex-col items-center gap-10 md:gap-14">
        {showOpening && (
          <h1
            data-ocid="anniversary.heading"
            className="animate-fade-rise text-glow text-center font-display text-4xl italic leading-tight text-foreground sm:text-5xl md:text-6xl"
          >
            Happy Anniversary, Love !
          </h1>
        )}

        {stage === "gifts" && <GiftSelection onSelect={handleSelect} />}
        {stage === "message" && <InnerMessage onClose={handleBack} />}
        {stage === "memories" && <MemoriesPage onBack={handleBack} />}
        {stage === "flowers" && <FlowersPage onBack={handleBack} />}

        {showOpening && (
          <div className="flex min-h-[13rem] w-full items-center justify-center sm:min-h-[15rem]">
            <div className="animate-fade-rise [animation-delay:120ms]">
              <Envelope state={envelopeState} onOpen={handleOpen} />
            </div>
          </div>
        )}

        {showOpening && (
          <p
            data-ocid="anniversary.instruction"
            className="animate-fade-rise text-center font-body text-sm tracking-wide text-muted-foreground transition-smooth [animation-delay:240ms] sm:text-base"
          >
            tap the envelope for the surprise...
          </p>
        )}
      </div>
    </main>
  );
}
