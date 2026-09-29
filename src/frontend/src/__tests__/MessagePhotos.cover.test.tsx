import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MessagePhotoSection } from "@/components/MessagePhotoSection";

/**
 * Cover for the accepted request: the two Message polaroid slots show the two
 * photos the user sent, rendered as-is — not cropped, resized, or given any
 * effect.
 *
 * The characterization suite pins the file-level invariants (both files exist,
 * are non-trivial, start with the JPEG SOI marker, and are two different
 * photos). This suite closes the remaining gap in the accepted criterion:
 *
 *   1. The files are structurally complete JPEGs with real pixel dimensions —
 *      the SOI check alone passes on a truncated or corrupt file, which would
 *      render as a broken image in the browser.
 *   2. The rendered <img> carries no crop or effect styling: object-contain
 *      (never object-cover), and no CSS filter/transform applied to the image
 *      itself. The polaroid frame's decorative tilt lives on the <figure>, not
 *      on the photo, so the photo pixels are untouched.
 *
 * It deliberately does NOT freeze the image bytes or exact dimensions: the
 * whole point of the request is that the user may replace these files, so a
 * byte baseline would fail on the very change it is meant to protect.
 */
// Vitest runs with the frontend package as its working directory, so the images
// resolve relative to the package root rather than to this test file.
const IMAGES_DIR = resolve(process.cwd(), "public/assets/images");

const MESSAGE_PHOTOS = [
  { name: "message-1.jpg", alt: "A cherished moment together" },
  { name: "message-2.jpg", alt: "Another cherished moment together" },
] as const;

interface JpegInfo {
  /** Pixel dimensions from the SOF marker, or null when no SOF was found. */
  dimensions: { width: number; height: number } | null;
  /** True when the file ends with the JPEG EOI marker (FF D9). */
  complete: boolean;
}

/**
 * Walk the JPEG marker segments to read the real pixel dimensions and confirm
 * the file is not truncated. A file that only has a valid SOI header but no
 * SOF/EOI is corrupt and would not decode in a browser.
 *
 * The walk stops at the start-of-scan (SOS) marker: everything after it is
 * entropy-coded image data, not marker segments, so the trailing EOI is checked
 * directly against the file's last two bytes.
 */
function inspectJpeg(bytes: Buffer): JpegInfo {
  let offset = 2; // skip SOI
  let dimensions: JpegInfo["dimensions"] = null;

  while (offset < bytes.length - 1) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1];

    // Standalone markers carry no length payload.
    if (
      marker === 0xd8 ||
      marker === 0x01 ||
      (marker >= 0xd0 && marker <= 0xd7)
    ) {
      offset += 2;
      continue;
    }
    // Start of scan: the rest of the file is scan data, so stop walking.
    if (marker === 0xda) {
      break;
    }

    const segmentLength = bytes.readUInt16BE(offset + 2);
    // SOF0..SOF15, excluding DHT (C4), JPG (C8), and DAC (CC).
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    ) {
      dimensions = {
        height: bytes.readUInt16BE(offset + 5),
        width: bytes.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + segmentLength;
  }

  // A complete JPEG ends with the EOI marker (FF D9).
  const complete =
    bytes.length >= 2 &&
    bytes[bytes.length - 2] === 0xff &&
    bytes[bytes.length - 1] === 0xd9;

  return { dimensions, complete };
}

describe("Message polaroid photos are shown as-is", () => {
  it.each(MESSAGE_PHOTOS)(
    "ships $name as a complete JPEG with real pixel dimensions",
    ({ name }) => {
      const bytes = readFileSync(resolve(IMAGES_DIR, name));
      const { dimensions, complete } = inspectJpeg(bytes);

      // A real photo has a real size — not a 1x1 stub or a corrupt header.
      expect(dimensions).not.toBeNull();
      expect(dimensions?.width ?? 0).toBeGreaterThan(1);
      expect(dimensions?.height ?? 0).toBeGreaterThan(1);

      // The file is not truncated: it ends with the JPEG EOI marker.
      expect(complete).toBe(true);
    },
  );

  it.each(MESSAGE_PHOTOS)(
    "renders $name with contain fitting and no crop or effect on the photo",
    ({ alt }) => {
      render(<MessagePhotoSection />);

      const img = screen.getByRole("img", { name: alt });

      // Contain fitting keeps the whole photo visible; cover would crop it.
      expect(img.className).toContain("object-contain");
      expect(img.className).not.toContain("object-cover");

      // No effect is applied to the photo pixels themselves. The decorative
      // tilt lives on the surrounding <figure>, never on the <img>.
      expect(img.className).not.toMatch(/\bfilter\b/);
      expect(img.className).not.toMatch(/\bblur\b/);
      expect(img.className).not.toMatch(/\bgrayscale\b/);
      expect(img.className).not.toMatch(/\bsepia\b/);
      expect(img.className).not.toMatch(/\bcontrast-/);
      expect(img.className).not.toMatch(/\bsaturate-/);
      expect(img.className).not.toMatch(/\brotate-/);
      expect(img.className).not.toMatch(/\bscale-/);
      expect(img.style.transform).toBe("");
      expect(img.style.filter).toBe("");
    },
  );
});
