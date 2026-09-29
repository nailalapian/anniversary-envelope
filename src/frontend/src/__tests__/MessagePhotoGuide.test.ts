import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The accepted request ships a step-by-step guide in the app's images folder so
 * the user can swap the two Message photos themselves through GitHub by
 * uploading files with the same names. That guide is a deliverable, so this
 * suite reads it from disk and asserts it actually documents both filenames and
 * the GitHub upload flow — a missing or gutted README fails here rather than
 * silently shipping.
 */
// Vitest runs with the frontend package as its working directory, so the guide
// resolves relative to the package root rather than to this test file.
const README_PATH = resolve(process.cwd(), "public/assets/images/README.md");

const readme = readFileSync(README_PATH, "utf8");

describe("images folder guide", () => {
  it("documents both Message photo filenames", () => {
    expect(readme).toContain("message-1.jpg");
    expect(readme).toContain("message-2.jpg");
  });

  it("explains replacing the photos through GitHub with the same filename", () => {
    expect(readme).toMatch(/github/i);
    expect(readme).toMatch(/upload|unggah/i);
    // The guide must make the "same name replaces the old file" rule explicit.
    expect(readme).toMatch(/nama yang sama|same name|nama file harus sama/i);
  });

  it("tells the user the photos are shown as-is without cropping", () => {
    expect(readme).toMatch(/tidak pernah dipotong|as-is|without cropping/i);
  });
});
