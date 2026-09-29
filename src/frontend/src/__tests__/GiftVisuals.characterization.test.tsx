import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { FlowersPage } from "@/components/FlowersPage";
import { GiftSelection } from "@/components/GiftSelection";
import { MemoriesPage } from "@/components/MemoriesPage";
import { FlowerBouquet } from "@/components/icons/FlowerBouquet";
import {
  EnvelopeIcon,
  FlowersIcon,
  MemoriesIcon,
} from "@/components/icons/GiftIcons";
import { AnniversaryCard } from "@/pages/AnniversaryCard";

const OPEN_BUTTON = "Open the anniversary envelope";
const REVEAL_TIMEOUT = 4000;

/** Open the envelope and wait for the "Gifts for you" selection screen. */
async function openGifts(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: OPEN_BUTTON }));
  await screen.findByTestId("gifts.page", {}, { timeout: REVEAL_TIMEOUT });
}

/**
 * Characterization baseline for the visual refinement of the gift artwork.
 *
 * The accepted request is to make the app look as close as possible to the
 * user's reference screenshots — layout, colour, font, icons and proportion.
 * The inline-SVG illustrations (EnvelopeIcon, MemoriesIcon, FlowersIcon,
 * FlowerBouquet) are the pieces being redrawn, so this suite deliberately does
 * NOT freeze any SVG path data, gradient stop, or exact coordinate: a byte
 * baseline would fail on the very change it is meant to protect.
 *
 * Instead it pins the *contract* the redraw must preserve, which a careless
 * visual edit is most likely to break:
 *   - every illustration stays a real inline <svg> (never a broken <img>),
 *     with a viewBox and decorative aria-hidden, and non-trivial geometry;
 *   - the three gift choices keep their exact labels, order and one distinct
 *     icon each;
 *   - the Velvet & Candlelight palette and the display/hand typography stay
 *     applied to the stage, headings and letter;
 *   - the stage machine and Back navigation still work end to end.
 */
describe("Gift artwork visual characterization", () => {
  it("renders each gift illustration as a real inline SVG, not a broken image", () => {
    const { container } = render(
      <div>
        <EnvelopeIcon />
        <MemoriesIcon />
        <FlowersIcon />
        <FlowerBouquet />
      </div>,
    );

    const svgs = Array.from(container.querySelectorAll("svg"));
    expect(svgs).toHaveLength(4);

    for (const svg of svgs) {
      // A real vector illustration with a coordinate system, not an empty stub.
      expect(svg.getAttribute("viewBox")).toBeTruthy();
      // Decorative artwork must not surface as a broken <img>.
      expect(svg.getAttribute("aria-hidden")).toBe("true");
      // Non-trivial geometry: a redraw that ships an empty <svg> fails here.
      expect(
        svg.querySelectorAll("path, circle, ellipse, rect").length,
      ).toBeGreaterThan(0);
    }

    expect(container.querySelector("img")).toBeNull();
  });

  it("keeps the three gift choices in order, each with its own distinct icon", () => {
    render(<GiftSelection onSelect={() => {}} />);

    const labels = ["Message", "Memories", "Flowers"];
    const buttons = labels.map((label) =>
      screen.getByRole("button", { name: label }),
    );

    // The accepted order is Message, Memories, Flowers.
    expect(buttons.map((b) => b.textContent?.trim())).toEqual(labels);

    // Each choice renders exactly one inline SVG, and the three are distinct
    // illustrations rather than the same icon repeated.
    const markup = buttons.map((b) => b.querySelector("svg")?.outerHTML ?? "");
    for (const svg of markup) {
      expect(svg).not.toBe("");
    }
    expect(new Set(markup).size).toBe(3);
  });

  it("keeps the Velvet & Candlelight stage and the display/hand typography", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    // The dark burgundy stage is the page background.
    const stage = screen.getByTestId("anniversary.page");
    expect(stage.className).toContain("bg-velvet");

    // The opening headline is the italic display face with the candlelight glow.
    const headline = screen.getByRole("heading", {
      name: "Happy Anniversary, Love !",
    });
    expect(headline.className).toContain("font-display");
    expect(headline.className).toContain("italic");
    expect(headline.className).toContain("text-glow");

    await openGifts(user);

    // The "Gifts for you" heading keeps the same display treatment.
    const giftsHeading = screen.getByRole("heading", { name: "Gifts for you" });
    expect(giftsHeading.className).toContain("font-display");
    expect(giftsHeading.className).toContain("italic");

    // The letter body keeps the bundled handwriting face.
    await user.click(screen.getByRole("button", { name: "Message" }));
    const card = screen.getByTestId("letter.card");
    const body = card.querySelector("p.font-hand");
    expect(body).not.toBeNull();
  });

  it("keeps the Flowers bouquet and Memories floral accents as inline SVG artwork", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);

    await user.click(screen.getByRole("button", { name: "Flowers" }));
    const flowers = screen.getByTestId("flowers.page");
    expect(flowers.querySelector("svg")).not.toBeNull();
    expect(flowers.querySelector("img")).toBeNull();

    await user.click(screen.getByTestId("flowers.back_button"));
    await user.click(screen.getByRole("button", { name: "Memories" }));
    const memories = screen.getByTestId("memories.page");
    // The hibiscus and lily-cluster corner accents, all inline SVG.
    expect(memories.querySelectorAll("svg").length).toBeGreaterThanOrEqual(2);
  });

  it("keeps the standalone Flowers and Memories pages rendering their artwork", () => {
    const { unmount } = render(<FlowersPage onBack={() => {}} />);
    expect(
      screen.getByTestId("flowers.page").querySelector("svg"),
    ).not.toBeNull();
    unmount();

    render(<MemoriesPage onBack={() => {}} />);
    expect(
      screen.getByTestId("memories.page").querySelectorAll("svg").length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("keeps the stage machine and Back navigation working end to end", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);

    for (const [label, pageId, backId] of [
      ["Message", "letter.card", "letter.back_button"],
      ["Memories", "memories.page", "memories.back_button"],
      ["Flowers", "flowers.page", "flowers.back_button"],
    ] as const) {
      await user.click(screen.getByRole("button", { name: label }));
      expect(screen.getByTestId(pageId)).toBeInTheDocument();

      await user.click(screen.getByTestId(backId));
      expect(screen.getByTestId("gifts.page")).toBeInTheDocument();
      expect(screen.queryByTestId(pageId)).not.toBeInTheDocument();
    }
  });
});
