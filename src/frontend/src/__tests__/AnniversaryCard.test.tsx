import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import App from "@/App";
import { AnniversaryCard } from "@/pages/AnniversaryCard";

const HEADLINE = "Happy Anniversary, Love !";
const INSTRUCTION = "tap the envelope for the surprise...";
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

describe("AnniversaryCard", () => {
  it("renders the opening screen without a blank page", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: HEADLINE })).toBeInTheDocument();
    expect(screen.getByText(INSTRUCTION)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: OPEN_BUTTON }),
    ).toBeInTheDocument();
  });

  it("shows the sealed envelope and hides the gift selection before opening", () => {
    render(<AnniversaryCard />);

    expect(screen.getByTestId("envelope.open_button")).toBeInTheDocument();
    expect(screen.queryByTestId("gifts.page")).not.toBeInTheDocument();
  });

  it("reveals the 'Gifts for you' selection after the envelope is tapped", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);

    expect(
      screen.getByRole("heading", { name: GIFTS_HEADING }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Message" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Memories" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Flowers" })).toBeInTheDocument();
    // The sealed envelope is gone once the selection screen is shown.
    expect(
      screen.queryByTestId("envelope.open_button"),
    ).not.toBeInTheDocument();
  });

  it("hides the tap instruction once the envelope has been opened", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);

    expect(screen.queryByText(INSTRUCTION)).not.toBeInTheDocument();
  });

  it("opens the Message letter with its title, long copy and Back link", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Message" }));

    expect(screen.getByTestId("letter.card")).toBeInTheDocument();
    expect(screen.getByTestId("letter.title")).toHaveTextContent(
      "Selamat hari jadi hubungan kita, sayang.",
    );
    expect(
      screen.getByText(
        /Terima kasih karena menjadi orangku, sapaan favoritku, dan perpisahan tersulitku/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("returns to the gift selection from the Message page via Back", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Message" }));
    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByTestId("gifts.page")).toBeInTheDocument();
    expect(screen.queryByTestId("letter.card")).not.toBeInTheDocument();
  });

  it("opens the Memories page with two polaroids, floral accents, heading and Back", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Memories" }));

    expect(screen.getByTestId("memories.page")).toBeInTheDocument();
    expect(screen.getAllByRole("figure")).toHaveLength(2);
    // The floral corner accents are decorative inline SVG, not broken images.
    expect(
      screen.getByTestId("memories.page").querySelectorAll("svg").length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      screen.getByRole("heading", { name: "Kenangan Bersamamu" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("opens the Flowers page with a bouquet, caption and Back", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Flowers" }));

    expect(screen.getByTestId("flowers.page")).toBeInTheDocument();
    expect(screen.getByTestId("flowers.caption")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("returns to the gift selection from the Memories page", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Memories" }));
    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByTestId("gifts.page")).toBeInTheDocument();
    expect(screen.queryByTestId("memories.page")).not.toBeInTheDocument();
  });

  it("returns to the gift selection from the Flowers page", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Flowers" }));
    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByTestId("gifts.page")).toBeInTheDocument();
    expect(screen.queryByTestId("flowers.page")).not.toBeInTheDocument();
  });

  it("uses distinct display and body typography for headline and instruction", () => {
    render(<AnniversaryCard />);

    const heading = screen.getByRole("heading", { name: HEADLINE });
    const instruction = screen.getByText(INSTRUCTION);

    expect(heading.className).toContain("font-display");
    expect(heading.className).toContain("italic");
    expect(instruction.className).toContain("font-body");
  });

  it("gives the envelope and gift options hover/focus transitions", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    const envelope = screen.getByTestId("envelope.open_button");
    expect(envelope.className).toContain("transition-smooth");
    expect(envelope.className).toContain("focus-visible:ring-2");

    await openGifts(user);

    const message = screen.getByTestId("gifts.option.message");
    expect(message.className).toContain("transition-smooth");
    expect(message.className).toContain("focus-visible:ring-2");
  });

  it("renders the wax seal as inline SVG artwork rather than a missing image", () => {
    render(<AnniversaryCard />);

    const envelope = screen.getByTestId("envelope.open_button");
    const svgs = envelope.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(2);
    // The seal is decorative and must not surface as a broken <img>.
    expect(envelope.querySelector("img")).toBeNull();
  });
});
