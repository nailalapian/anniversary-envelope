import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Envelope } from "@/components/Envelope";
import { FlowersPage } from "@/components/FlowersPage";
import { MemoriesPage } from "@/components/MemoriesPage";
import { WaxSeal } from "@/components/WaxSeal";
import { AnniversaryCard } from "@/pages/AnniversaryCard";

const OPEN_BUTTON = "Open the anniversary envelope";
const REVEAL_TIMEOUT = 4000;

/** Open the envelope and wait for the "Gifts for you" selection screen. */
async function openGifts(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: OPEN_BUTTON }));
  await screen.findByTestId("gifts.page", {}, { timeout: REVEAL_TIMEOUT });
}

/**
 * Cover for the accepted visual-redesign request: the opening screen, the
 * "Gifts for you" selection, and the Message, Memories and Flowers pages must
 * match the user's reference screenshots as closely as possible.
 *
 * The redesign redraws the illustrations and recomposes the Memories and
 * Flowers pages, so this suite deliberately does NOT freeze SVG path data,
 * gradient stops or exact coordinates — a byte baseline would fail on the very
 * change it is meant to protect. Instead it pins the observable structure the
 * redesign introduces and a careless edit is most likely to break:
 *
 *   - the Memories page is now a white keepsake card with a script heading, a
 *     two-photo strip and floral corner accents (no more heart balloons);
 *   - the Flowers page keeps its bouquet plus the new candlelight halo and
 *     drifting petals, with the Indonesian caption;
 *   - the wax seal is a cream, scalloped inline-SVG medallion;
 *   - the envelope keeps its crimson body, triangular flap and centered seal;
 *   - the full envelope -> gifts -> each page -> Back journey still works.
 */
describe("Gift redesign cover", () => {
  it("renders the Memories page as a white card with heading, two-photo strip and floral accents", () => {
    render(<MemoriesPage onBack={() => {}} />);

    const page = screen.getByTestId("memories.page");
    expect(page).toBeInTheDocument();

    // The white keepsake card is the new composition.
    const card = screen.getByTestId("memories.card");
    expect(card).toBeInTheDocument();
    expect(card.className).toContain("bg-[oklch(0.98_0.008_85)]");

    // The script heading replaces the old caption line.
    expect(
      screen.getByRole("heading", { name: "Kenangan Bersamamu" }),
    ).toBeInTheDocument();

    // A vertical strip of exactly two polaroid photos, shown as-is.
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

    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("renders the Flowers page with the bouquet, candlelight halo, drifting petals and Indonesian caption", () => {
    render(<FlowersPage onBack={() => {}} />);

    const page = screen.getByTestId("flowers.page");
    expect(page).toBeInTheDocument();

    // The bouquet plus the halo/petal overlay are all inline SVG artwork.
    expect(page.querySelectorAll("svg").length).toBeGreaterThanOrEqual(2);
    expect(page.querySelector("img")).toBeNull();

    // The caption is the accepted Indonesian copy.
    expect(screen.getByTestId("flowers.caption")).toHaveTextContent(
      "Bunga untukmu, selalu.",
    );
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("renders the wax seal as a cream, scalloped inline-SVG medallion", () => {
    const { container } = render(<WaxSeal />);

    const seal = container.firstElementChild as HTMLElement;
    expect(seal).not.toBeNull();
    // The seal is recolored to cream via the dedicated gradient utility.
    expect(seal.className).toContain("bg-gradient-seal");
    expect(seal.className).toContain("rounded-full");

    // Two inline SVGs: the scalloped melted-wax edge and the botanical sprig.
    const svgs = seal.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(2);
    for (const svg of svgs) {
      expect(svg.getAttribute("viewBox")).toBeTruthy();
    }
    expect(seal.querySelector("img")).toBeNull();
  });

  it("keeps the envelope as a crimson body with a triangular flap and centered seal", () => {
    render(<Envelope state="closed" onOpen={() => {}} />);

    const envelope = screen.getByTestId("envelope.open_button");
    expect(envelope).toBeInTheDocument();

    // The crimson body and the flap use the dedicated envelope gradients.
    expect(envelope.querySelector(".bg-gradient-envelope")).not.toBeNull();
    expect(envelope.querySelector(".bg-gradient-flap")).not.toBeNull();

    // The seal sits centered on the flap point and is inline SVG artwork.
    expect(envelope.querySelector(".bg-gradient-seal")).not.toBeNull();
    expect(envelope.querySelector("img")).toBeNull();
  });

  it("walks the redesigned envelope -> gifts -> each page -> Back journey in one session", async () => {
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
