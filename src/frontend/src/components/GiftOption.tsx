import type { ReactNode } from "react";

interface GiftOptionProps {
  /** Stable identifier used for the deterministic `data-ocid` marker. */
  id: string;
  /** Serif label shown beneath the illustration. */
  label: string;
  onSelect: () => void;
  children: ReactNode;
}

/**
 * A single gift choice: an illustration above a serif label, with no card
 * chrome. The whole option is one button with hover, press, and focus states.
 */
export function GiftOption({ id, label, onSelect, children }: GiftOptionProps) {
  return (
    <button
      type="button"
      data-ocid={`gifts.option.${id}`}
      onClick={onSelect}
      className="group flex cursor-pointer flex-col items-center gap-4 rounded-2xl px-4 py-6 outline-none transition-smooth hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background active:translate-y-0 active:scale-[0.97]"
    >
      <span className="block h-28 w-28 transition-smooth group-hover:scale-105 sm:h-32 sm:w-32 md:h-36 md:w-36">
        {children}
      </span>
      <span className="font-display text-2xl italic leading-none text-foreground sm:text-3xl">
        {label}
      </span>
    </button>
  );
}
