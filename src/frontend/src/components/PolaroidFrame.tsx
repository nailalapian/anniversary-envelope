import { useState } from "react";

interface PolaroidFrameProps {
  /** Path to the user's own photo, served from the app's images folder. */
  src: string;
  /** Accessible description of the photo. */
  alt: string;
  /** Tilt in degrees — a slight, hand-placed rotation. */
  tilt: number;
  /** Vertical offset in rem so the pair sits at different heights. */
  offset?: number;
  className?: string;
}

/**
 * A single polaroid: a thick white frame around the photo with a soft drop
 * shadow and a gentle tilt. The photo is shown as-is — object-contain keeps the
 * whole image visible without cropping or stretching it. If the file is missing
 * the frame falls back to a tidy in-frame placeholder instead of a broken image.
 */
export function PolaroidFrame({
  src,
  alt,
  tilt,
  offset = 0,
  className,
}: PolaroidFrameProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure
      className={`relative w-[min(40vw,15rem)] rounded-[3px] bg-[oklch(0.98_0.008_85)] p-2.5 pb-10 shadow-letter sm:w-[16rem] sm:p-4 sm:pb-14 ${className ?? ""}`}
      style={{ transform: `rotate(${tilt}deg) translateY(${offset}rem)` }}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[oklch(0.9_0.012_80)]">
        {failed ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
            <svg
              aria-hidden="true"
              viewBox="0 0 48 48"
              className="h-9 w-9 text-[oklch(0.62_0.05_40)]"
            >
              <rect
                x="6"
                y="10"
                width="36"
                height="28"
                rx="3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="17" cy="20" r="3.5" fill="currentColor" />
              <path
                d="M9 33l9-8 7 6 6-5 8 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="font-body text-[0.7rem] leading-snug text-[oklch(0.5_0.04_40)]">
              Add your photo to
              <br />
              <span className="font-mono text-[0.65rem]">{src}</span>
            </p>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-contain"
          />
        )}
      </div>
    </figure>
  );
}
