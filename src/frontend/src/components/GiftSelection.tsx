import type { ComponentType } from "react";

import { GiftOption } from "@/components/GiftOption";
import {
  EnvelopeIcon,
  FlowersIcon,
  MemoriesIcon,
} from "@/components/icons/GiftIcons";

export type Gift = "message" | "memories" | "flowers";

interface GiftSelectionProps {
  onSelect: (gift: Gift) => void;
}

const GIFTS: {
  id: Gift;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { id: "message", label: "Message", Icon: EnvelopeIcon },
  { id: "memories", label: "Memories", Icon: MemoriesIcon },
  { id: "flowers", label: "Flowers", Icon: FlowersIcon },
];

/**
 * The "Gifts for you" screen: a script headline over three side-by-side gift
 * choices that stack cleanly on narrow screens.
 */
export function GiftSelection({ onSelect }: GiftSelectionProps) {
  return (
    <section
      data-ocid="gifts.page"
      className="animate-fade-rise flex w-full flex-col items-center gap-10 sm:gap-14"
    >
      <h2
        data-ocid="gifts.heading"
        className="text-glow text-center font-display text-4xl italic leading-tight text-foreground sm:text-5xl md:text-6xl"
      >
        Gifts for you
      </h2>

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4 md:gap-8">
        {GIFTS.map(({ id, label, Icon }) => (
          <GiftOption
            key={id}
            id={id}
            label={label}
            onSelect={() => onSelect(id)}
          >
            <Icon className="h-full w-full" />
          </GiftOption>
        ))}
      </div>
    </section>
  );
}
