import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import App from "@/App";
import { AnniversaryCard } from "@/pages/AnniversaryCard";

const HEADLINE = "Happy Anniversary, Love !";
const INSTRUCTION = "tap the envelope for the surprise...";
const OPEN_BUTTON = "Open the anniversary envelope";

// The scene advances from the opening animation to the next stage on a timer.
// `findBy*` polls until the transition lands, so no fake timers or sleeps.
const REVEAL_TIMEOUT = 4000;

/**
 * Characterization baseline for the anniversary scene. These tests freeze the
 * behavior the "Gifts for you" change must preserve: the opening screen
 * composition, the visible opening animation, and the ability to return to the
 * closed envelope. They deliberately do NOT assert that opening the envelope
 * reveals the letter directly, because that transition is the behavior the
 * change intentionally replaces with the gift selection screen.
 */
describe("AnniversaryCard characterization", () => {
  it("renders the opening screen on the default route without a blank page", () => {
    render(<App />);

    expect(screen.getByTestId("anniversary.page")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: HEADLINE })).toBeInTheDocument();
    expect(screen.getByText(INSTRUCTION)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: OPEN_BUTTON }),
    ).toBeInTheDocument();
  });

  it("starts in the closed state with the sealed envelope and no inner content", () => {
    render(<AnniversaryCard />);

    expect(screen.getByTestId("envelope.open_button")).toBeInTheDocument();
    expect(screen.queryByTestId("letter.card")).not.toBeInTheDocument();
    expect(screen.queryByTestId("letter.close_button")).not.toBeInTheDocument();
  });

  it("plays a visible opening animation before advancing past the closed state", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    const envelope = screen.getByTestId("envelope.open_button");
    await user.click(envelope);

    // The envelope stays mounted while the flap/seal animation plays, and the
    // flap carries the opening animation class during that window.
    const flap = envelope.querySelector(".animate-flap-open");
    expect(flap).not.toBeNull();
    expect(screen.getByTestId("envelope.open_button")).toBeInTheDocument();
  });

  it("advances past the closed state after the opening animation completes", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await user.click(screen.getByRole("button", { name: OPEN_BUTTON }));

    // The closed envelope is eventually replaced by the next stage. We assert
    // the transition away from the sealed envelope, not which stage follows.
    await screen.findByTestId("gifts.page", {}, { timeout: REVEAL_TIMEOUT });
    expect(
      screen.queryByTestId("envelope.open_button"),
    ).not.toBeInTheDocument();
  });

  it("hides the tap instruction once the envelope has been opened", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await user.click(screen.getByRole("button", { name: OPEN_BUTTON }));
    await screen.findByTestId("gifts.page", {}, { timeout: REVEAL_TIMEOUT });

    expect(screen.queryByText(INSTRUCTION)).not.toBeInTheDocument();
  });

  it("keeps the envelope as a single accessible button with a focus ring", () => {
    render(<AnniversaryCard />);

    const envelope = screen.getByTestId("envelope.open_button");
    expect(envelope.tagName).toBe("BUTTON");
    expect(envelope.className).toContain("focus-visible:ring-2");
    expect(envelope.className).toContain("transition-smooth");
  });

  it("renders the wax seal as inline SVG artwork rather than a missing image", () => {
    render(<AnniversaryCard />);

    const envelope = screen.getByTestId("envelope.open_button");
    expect(envelope.querySelectorAll("svg").length).toBeGreaterThanOrEqual(2);
    expect(envelope.querySelector("img")).toBeNull();
  });
});
