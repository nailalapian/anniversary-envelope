import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Characterization baseline for the two Message-page polaroid photos.
 *
 * The accepted request replaces the two image FILES (message-1.jpg,
 * message-2.jpg) with new photos the user sent, and requires them to be shown
 * as-is — not cropped, resized, or given any effect. The component-level tests
 * already pin the DOM contract (both slots, the exact src paths, object-contain,
 * the placeholder fallback). What they cannot see is the files themselves: a
 * swap that ships a truncated, empty, or re-encoded file, or that accidentally
 * points both slots at the same photo, would still pass every DOM assertion.
 *
 * This suite therefore reads the two files from disk and pins the invariants
 * that must survive any future photo swap:
 *   - both files exist and are non-trivial;
 *   - both are real JPEGs (SOI marker) — not a renamed PNG/WebP or a stub;
 *   - the two slots hold two DIFFERENT photos, not the same file twice.
 *
 * It deliberately does NOT freeze the image bytes or dimensions: the whole
 * point of the request is that the user may replace these files, so a byte
 * baseline would fail on the very change it is meant to protect.
 */
// Vitest runs with the frontend package as its working directory, so the images
// resolve relative to the package root rather than to this test file.
const IMAGES_DIR = resolve(process.cwd(), "public/assets/images");

const MESSAGE_PHOTOS = [
  { name: "message-1.jpg", slot: "left" },
  { name: "message-2.jpg", slot: "right" },
] as const;

/** Read a photo from the images folder as raw bytes. */
function readPhoto(name: string): Buffer {
  return readFileSync(resolve(IMAGES_DIR, name));
}

describe("Message polaroid photos", () => {
  it.each(MESSAGE_PHOTOS)(
    "ships $name as a non-trivial JPEG for the $slot slot",
    ({ name }) => {
      const bytes = readPhoto(name);

      // A real photo, not an empty or near-empty placeholder file.
      expect(bytes.length).toBeGreaterThan(1024);

      // JPEG SOI marker (FF D8 FF) — proves the file is actually a JPEG and not
      // a renamed PNG/WebP or a text stub that would render as a broken image.
      expect(bytes[0]).toBe(0xff);
      expect(bytes[1]).toBe(0xd8);
      expect(bytes[2]).toBe(0xff);
    },
  );

  it("keeps the two slots as two different photos, not the same file twice", () => {
    const left = readPhoto("message-1.jpg");
    const right = readPhoto("message-2.jpg");

    // The user sent two distinct photos; a swap that copies one over the other
    // would silently show the same picture in both polaroids.
    expect(left.equals(right)).toBe(false);
  });
});
