import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MessagePhotoSection } from "@/components/MessagePhotoSection";
import { AnniversaryCard } from "@/pages/AnniversaryCard";

const OPEN_BUTTON = "Open the anniversary envelope";
const GIFTS_HEADING = "Gifts for you";

// The scene advances from the opening animation to the gift selection on a
// timer. `findBy*` polls until the transition lands, so no fake timers or
// arbitrary sleeps.
const REVEAL_TIMEOUT = 4000;

/** Open the envelope and wait for the "Gifts for you" selection screen. */
async function openGifts(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: OPEN_BUTTON }));
  await screen.findByTestId("gifts.page", {}, { timeout: REVEAL_TIMEOUT });
}

/** Assert the restored "Gifts for you" screen still offers all three choices. */
function expectThreeChoices() {
  expect(screen.getByTestId("gifts.page")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: GIFTS_HEADING }),
  ).toBeInTheDocument();
  for (const label of ["Message", "Memories", "Flowers"]) {
    expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
  }
}

/**
 * Cover for the accepted gift-flow requirements, closing the gaps the existing
 * suites leave open:
 *
 *   1. "Tombol Back di setiap halaman isi" — the Message page's Back control is
 *      the one content page whose Back is never asserted by its own
 *      `letter.back_button` marker, nor asserted visible/enabled the way the
 *      Memories and Flowers Back controls are. This suite pins all three.
 *   2. The complete journey the user asked to verify end-to-end: sealed
 *      envelope -> open -> "Gifts for you" -> each of Message, Memories and
 *      Flowers opens -> Back returns to the three choices, in one session.
 *   3. "dirender apa adanya tanpa ... diubah ukurannya" — the photo element
 *      carries no inline width/height that would resize or distort it; the
 *      frame sizes the box and object-contain fits the whole photo inside it.
 */
describe("Gift flow cover", () => {
  it("exposes a visible, clickable Back control on the Message page", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Message" }));

    const back = screen.getByTestId("letter.back_button");
    expect(back).toBeInTheDocument();
    expect(back).toBeVisible();
    expect(back).toBeEnabled();
    expect(back).toHaveTextContent("Back");
  });

  it("returns from Message to the three-choice 'Gifts for you' screen", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Message" }));
    await user.click(screen.getByTestId("letter.back_button"));

    expectThreeChoices();
    expect(screen.queryByTestId("letter.card")).not.toBeInTheDocument();
  });

  it("walks the full envelope -> gifts -> each page -> Back journey in one session", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    // Sealed envelope opens to the three-choice selection.
    await openGifts(user);
    expectThreeChoices();

    // Each gift opens its own content page, and Back restores the selection.
    for (const [label, pageId, backId] of [
      ["Message", "letter.card", "letter.back_button"],
      ["Memories", "memories.page", "memories.back_button"],
      ["Flowers", "flowers.page", "flowers.back_button"],
    ] as const) {
      await user.click(screen.getByRole("button", { name: label }));
      expect(screen.getByTestId(pageId)).toBeInTheDocument();

      await user.click(screen.getByTestId(backId));
      expectThreeChoices();
      expect(screen.queryByTestId(pageId)).not.toBeInTheDocument();
    }
  });

  it("renders each Message photo without inline sizing that would resize it", () => {
    render(<MessagePhotoSection />);

    for (const alt of [
      "A cherished moment together",
      "Another cherished moment together",
    ]) {
      const img = screen.getByRole("img", { name: alt });

      // The frame sizes the box; the photo is fitted inside it with
      // object-contain. No inline width/height on the <img> distorts it.
      expect(img).not.toHaveAttribute("width");
      expect(img).not.toHaveAttribute("height");
      expect(img.style.width).toBe("");
      expect(img.style.height).toBe("");
      expect(img.className).toContain("object-contain");
    }
  });
});
