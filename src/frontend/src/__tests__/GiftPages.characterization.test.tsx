import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AnniversaryCard } from "@/pages/AnniversaryCard";

const HEADLINE = "Happy Anniversary, Love !";
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

/**
 * Characterization baseline for the gift pages the requested change must
 * preserve. The Message page is intentionally being replaced, so nothing here
 * freezes its current copy or its "Seal it again" control. These tests protect
 * the opening screen, the "Gifts for you" selection, the Memories and Flowers
 * compositions, and the Back-to-gifts navigation.
 */
describe("Gift pages characterization", () => {
  it("keeps the opening screen headline and sealed envelope on the default route", () => {
    render(<AnniversaryCard />);

    expect(screen.getByTestId("anniversary.page")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: HEADLINE })).toBeInTheDocument();
    expect(screen.getByTestId("envelope.open_button")).toBeInTheDocument();
    expect(screen.queryByTestId("gifts.page")).not.toBeInTheDocument();
  });

  it("shows the three labelled gift choices after the envelope is opened", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);

    expect(
      screen.getByRole("heading", { name: GIFTS_HEADING }),
    ).toBeInTheDocument();
    for (const label of ["Message", "Memories", "Flowers"]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
  });

  it("renders the Memories page with both polaroid photos, floral accents, heading and Back", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Memories" }));

    const page = screen.getByTestId("memories.page");
    expect(page).toBeInTheDocument();

    // Two polaroid frames, each showing one of the user's own photos as-is.
    expect(screen.getAllByRole("figure")).toHaveLength(2);
    expect(
      screen.getByRole("img", { name: "Kenangan indah kita berdua" }),
    ).toHaveAttribute("src", "/assets/images/memory-1.jpg");
    expect(
      screen.getByRole("img", { name: "Momen manis yang kita lalui bersama" }),
    ).toHaveAttribute("src", "/assets/images/memory-2.jpg");

    // The floral corner accents are decorative inline SVG, never broken images.
    expect(page.querySelectorAll("svg").length).toBeGreaterThanOrEqual(2);
    expect(page.querySelector("img")).not.toBeNull();

    expect(
      screen.getByRole("heading", { name: "Kenangan Bersamamu" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("renders the Flowers page with the bouquet, caption and Back", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Flowers" }));

    const page = screen.getByTestId("flowers.page");
    expect(page).toBeInTheDocument();
    // The bouquet is inline SVG artwork, not a broken image.
    expect(page.querySelector("svg")).not.toBeNull();
    expect(screen.getByTestId("flowers.caption")).toHaveTextContent(
      "Bunga untukmu, selalu.",
    );
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("returns to 'Gifts for you' from the Memories page via Back", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Memories" }));
    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByTestId("gifts.page")).toBeInTheDocument();
    expect(screen.queryByTestId("memories.page")).not.toBeInTheDocument();
  });

  it("returns to 'Gifts for you' from the Flowers page via Back", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Flowers" }));
    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByTestId("gifts.page")).toBeInTheDocument();
    expect(screen.queryByTestId("flowers.page")).not.toBeInTheDocument();
  });

  it("lets the user visit each gift page and return to the selection", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);

    for (const [label, pageId] of [
      ["Memories", "memories.page"],
      ["Flowers", "flowers.page"],
    ] as const) {
      await user.click(screen.getByRole("button", { name: label }));
      expect(screen.getByTestId(pageId)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Back" }));
      expect(screen.getByTestId("gifts.page")).toBeInTheDocument();
      expect(screen.queryByTestId(pageId)).not.toBeInTheDocument();
    }
  });
});
