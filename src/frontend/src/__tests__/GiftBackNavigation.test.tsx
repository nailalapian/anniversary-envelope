import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

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
 * Accepted requirement: the Memories and Flowers content pages each expose a
 * visible, clickable Back control that returns the user to the three-choice
 * "Gifts for you" screen. These tests pin the exact Back controls the app
 * exposes and prove the restored selection is fully usable, not just present.
 */
describe("Gift page Back navigation", () => {
  it("exposes a visible, clickable Back control on the Memories page", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Memories" }));

    const back = screen.getByTestId("memories.back_button");
    expect(back).toBeInTheDocument();
    expect(back).toBeVisible();
    expect(back).toBeEnabled();
    expect(back).toHaveTextContent("Back");
  });

  it("exposes a visible, clickable Back control on the Flowers page", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Flowers" }));

    const back = screen.getByTestId("flowers.back_button");
    expect(back).toBeInTheDocument();
    expect(back).toBeVisible();
    expect(back).toBeEnabled();
    expect(back).toHaveTextContent("Back");
  });

  it("returns from Memories to the three-choice 'Gifts for you' screen", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Memories" }));
    await user.click(screen.getByTestId("memories.back_button"));

    expectThreeChoices();
    expect(screen.queryByTestId("memories.page")).not.toBeInTheDocument();
  });

  it("returns from Flowers to the three-choice 'Gifts for you' screen", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Flowers" }));
    await user.click(screen.getByTestId("flowers.back_button"));

    expectThreeChoices();
    expect(screen.queryByTestId("flowers.page")).not.toBeInTheDocument();
  });

  it("keeps the restored choices live after returning from each gift page", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);

    // Memories -> Back -> the selection still navigates.
    await user.click(screen.getByRole("button", { name: "Memories" }));
    await user.click(screen.getByTestId("memories.back_button"));
    await user.click(screen.getByRole("button", { name: "Flowers" }));
    expect(screen.getByTestId("flowers.page")).toBeInTheDocument();

    // Flowers -> Back -> the selection still navigates.
    await user.click(screen.getByTestId("flowers.back_button"));
    await user.click(screen.getByRole("button", { name: "Memories" }));
    expect(screen.getByTestId("memories.page")).toBeInTheDocument();
  });
});
