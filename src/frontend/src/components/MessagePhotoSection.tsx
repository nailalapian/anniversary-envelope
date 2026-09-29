import { HeartBalloon } from "@/components/HeartBalloon";
import { PolaroidFrame } from "@/components/PolaroidFrame";

/**
 * The photo keepsake embedded in the middle of the Message page: two polaroid
 * frames holding the user's own photos as-is, flanked by pink and red heart
 * balloons, with a script caption beneath. On phones the flanking columns are
 * hidden and a dedicated balloon row sits under the photos so nothing is cut
 * off at narrow widths.
 */
export function MessagePhotoSection() {
  return (
    <section
      data-ocid="message.photos"
      className="flex w-full flex-col items-center"
    >
      <div className="relative flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-8 sm:flex-nowrap sm:gap-6">
        {/* Left balloons — hidden on phones, they reflow below the photos */}
        <div className="hidden flex-col items-center gap-6 sm:flex sm:gap-10">
          <HeartBalloon
            tone="light"
            delay={0}
            className="animate-float-soft h-24 w-12 sm:h-32 sm:w-16"
          />
          <HeartBalloon
            tone="deep"
            delay={1.4}
            className="animate-float-soft h-20 w-10 sm:h-28 sm:w-14"
          />
        </div>

        {/* Polaroid pair */}
        <div className="flex w-full items-center justify-center gap-3 sm:w-auto sm:gap-6">
          <PolaroidFrame
            src="/assets/images/message-1.jpg"
            alt="A cherished moment together"
            tilt={-5}
            offset={-0.75}
          />
          <PolaroidFrame
            src="/assets/images/message-2.jpg"
            alt="Another cherished moment together"
            tilt={4}
            offset={0.75}
          />
        </div>

        {/* Right balloons — hidden on phones, they reflow below the photos */}
        <div className="hidden flex-col items-center gap-6 sm:flex sm:gap-10">
          <HeartBalloon
            tone="deep"
            delay={0.7}
            className="animate-float-soft h-20 w-10 sm:h-28 sm:w-14"
          />
          <HeartBalloon
            tone="light"
            delay={2.1}
            className="animate-float-soft h-24 w-12 sm:h-32 sm:w-16"
          />
        </div>

        {/* Balloon row for narrow screens: four hearts beneath the photos */}
        <div className="flex w-full items-end justify-center gap-4 sm:hidden">
          <HeartBalloon
            tone="light"
            delay={0}
            className="animate-float-soft h-20 w-10"
          />
          <HeartBalloon
            tone="deep"
            delay={1.4}
            className="animate-float-soft h-16 w-8"
          />
          <HeartBalloon
            tone="deep"
            delay={0.7}
            className="animate-float-soft h-16 w-8"
          />
          <HeartBalloon
            tone="light"
            delay={2.1}
            className="animate-float-soft h-20 w-10"
          />
        </div>
      </div>

      <p
        data-ocid="message.photos_caption"
        className="text-glow mt-10 flex items-center gap-2 text-center font-display text-3xl italic leading-tight text-foreground sm:mt-12 sm:text-4xl"
      >
        Selamat hari jadi hubungan kita, sayang.
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0 text-[oklch(0.78_0.14_355)] sm:h-6 sm:w-6"
        >
          <path
            d="M12 21C6 16 2 12.5 2 8.5 2 5.5 4.4 3 7.4 3c1.9 0 3.6 1 4.6 2.6C13 4 14.7 3 16.6 3 19.6 3 22 5.5 22 8.5c0 4-4 7.5-10 12.5Z"
            fill="currentColor"
          />
        </svg>
      </p>
    </section>
  );
}
