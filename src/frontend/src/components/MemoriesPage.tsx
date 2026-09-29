import { PolaroidFrame } from "@/components/PolaroidFrame";

interface MemoriesPageProps {
  onBack: () => void;
}

/** A soft red hibiscus tucked into the top-right corner of the card. */
function HibiscusAccent({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className={className}
      fill="none"
    >
      <g fill="oklch(0.55 0.19 22)">
        <path d="M60 58c-6-16-4-34 6-46 8 12 10 30 4 46-3 8-7 8-10 0Z" />
        <path d="M60 58c16-6 34-4 46 6-12 8-30 10-46 4-8-3-8-7 0-10Z" />
        <path d="M60 58c6 16 4 34-6 46-8-12-10-30-4-46 3-8 7-8 10 0Z" />
        <path d="M60 58c-16 6-34 4-46-6 12-8 30-10 46-4 8 3 8 7 0 10Z" />
      </g>
      <g fill="oklch(0.42 0.16 20)">
        <path d="M60 58c-11-11-24-20-38-24 6 14 17 27 30 34 6 3 10-4 8-10Z" />
        <path d="M60 58c11 11 24 20 38 24-6-14-17-27-30-34-6-3-10 4-8 10Z" />
      </g>
      <circle cx="60" cy="58" r="7" fill="oklch(0.78 0.14 355)" />
      <circle cx="60" cy="58" r="3" fill="oklch(0.9 0.08 90)" />
    </svg>
  );
}

/** A cluster of lilies resting in the bottom-left corner of the card. */
function LilyClusterAccent({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 140 140"
      className={className}
      fill="none"
    >
      <g stroke="oklch(0.42 0.12 145)" strokeWidth="3" strokeLinecap="round">
        <path d="M70 138c-4-30-10-52-22-70" />
        <path d="M70 138c6-26 16-44 30-58" />
      </g>
      <g fill="oklch(0.5 0.17 22)">
        <path d="M48 68c-14-4-24-14-26-28 14 0 26 8 32 20 3 7-1 10-6 8Z" />
        <path d="M48 68c4-14 14-24 28-26 0 14-8 26-20 32-7 3-10-1-8-6Z" />
        <path d="M48 68c-12 6-27 6-38-2 10-9 25-11 37-5 7 3 6 5 1 7Z" />
      </g>
      <g fill="oklch(0.58 0.18 24)">
        <path d="M100 80c-12-2-21-10-24-22 12-1 23 5 29 15 3 6 0 8-5 7Z" />
        <path d="M100 80c2-12 10-21 22-24 1 12-5 23-15 29-6 3-8 0-7-5Z" />
        <path d="M100 80c-10 5-23 5-32-2 8-8 21-10 31-5 6 3 5 5 1 7Z" />
      </g>
      <circle cx="48" cy="68" r="4" fill="oklch(0.85 0.1 90)" />
      <circle cx="100" cy="80" r="3.5" fill="oklch(0.85 0.1 90)" />
    </svg>
  );
}

/**
 * The "Memories" gift: a white keepsake card on the velvet burgundy stage,
 * with a cursive heading, a warm note, a vertical strip of polaroid photos,
 * and soft red floral accents in the corners.
 */
export function MemoriesPage({ onBack }: MemoriesPageProps) {
  return (
    <section
      data-ocid="memories.page"
      className="animate-fade-rise relative flex w-full flex-col items-center"
    >
      <div className="relative w-full max-w-3xl">
        {/* Floral accents framing the card */}
        <HibiscusAccent className="pointer-events-none absolute -right-3 -top-6 z-10 h-20 w-20 rotate-12 drop-shadow-[0_10px_18px_oklch(0.08_0.04_18_/_0.55)] sm:-right-8 sm:-top-10 sm:h-28 sm:w-28" />
        <LilyClusterAccent className="pointer-events-none absolute -bottom-8 -left-4 z-10 h-24 w-24 -rotate-6 drop-shadow-[0_10px_18px_oklch(0.08_0.04_18_/_0.55)] sm:-bottom-12 sm:-left-10 sm:h-32 sm:w-32" />

        {/* The white keepsake card */}
        <article
          data-ocid="memories.card"
          className="relative overflow-hidden rounded-[1.75rem] bg-[oklch(0.98_0.008_85)] px-5 py-8 shadow-letter sm:px-10 sm:py-12"
        >
          <h2
            data-ocid="memories.heading"
            className="text-center font-display text-4xl italic leading-tight text-[oklch(0.42_0.16_22)] sm:text-5xl"
          >
            Kenangan Bersamamu
          </h2>

          <div className="mt-6 flex flex-col gap-6 sm:mt-8 sm:flex-row sm:items-start sm:gap-8">
            {/* Vertical photo strip on the left */}
            <div className="flex shrink-0 justify-center gap-3 sm:flex-col sm:gap-4">
              <PolaroidFrame
                src="/assets/images/memory-1.jpg"
                alt="Kenangan indah kita berdua"
                tilt={-4}
                offset={0}
                className="!w-[min(38vw,11rem)] sm:!w-[13rem]"
              />
              <PolaroidFrame
                src="/assets/images/memory-2.jpg"
                alt="Momen manis yang kita lalui bersama"
                tilt={3}
                offset={0}
                className="!w-[min(38vw,11rem)] sm:!w-[13rem]"
              />
            </div>

            {/* Warm note in dark serif */}
            <div className="min-w-0 flex-1 space-y-4 font-display text-lg leading-relaxed text-[oklch(0.3_0.05_25)] sm:text-xl">
              <p>
                Setiap momen yang kita lewati bersama adalah kenangan yang
                paling berharga untukku. Tawa, cerita, dan perjalanan kita
                tersimpan rapi di dalam hati.
              </p>
              <p>
                Terima kasih sudah menjadi rumah untuk pulang, tempat berbagi
                cerita, dan orang yang selalu ada di setiap langkahku. Semoga
                kita terus menulis kenangan indah baru, bersama-sama.
              </p>
            </div>
          </div>
        </article>
      </div>

      <button
        type="button"
        data-ocid="memories.back_button"
        onClick={onBack}
        className="mt-10 rounded-full px-4 py-2 font-body text-sm font-medium text-foreground underline decoration-foreground/50 decoration-1 underline-offset-4 transition-smooth hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:mt-12"
      >
        Back
      </button>
    </section>
  );
}
