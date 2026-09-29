import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { InnerMessage } from "@/components/InnerMessage";
import { MessagePhotoSection } from "@/components/MessagePhotoSection";
import { AnniversaryCard } from "@/pages/AnniversaryCard";

const OPEN_BUTTON = "Open the anniversary envelope";
const REVEAL_TIMEOUT = 4000;

/** Open the envelope and wait for the "Gifts for you" selection screen. */
async function openGifts(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: OPEN_BUTTON }));
  await screen.findByTestId("gifts.page", {}, { timeout: REVEAL_TIMEOUT });
}

/**
 * Characterization baseline for the Message-page localization change.
 *
 * The accepted request replaces the English letter copy and the
 * "Happy Anniversary" wedding caption with an Indonesian translation and a
 * relationship-anniversary greeting. Those exact strings are intentionally
 * changing, so this suite deliberately does NOT freeze them. Instead it pins the
 * structure and behavior the change must preserve: the letter's title/body/
 * signature composition, the embedded two-photo keepsake, the Back control, and
 * the full envelope -> gifts -> Message -> Back journey.
 */
describe("Message localization characterization", () => {
  it("keeps the letter composition: title, body paragraphs, signature and Back", () => {
    render(<InnerMessage onClose={() => {}} />);

    expect(screen.getByTestId("letter.card")).toBeInTheDocument();
    expect(screen.getByTestId("letter.title")).toBeInTheDocument();

    // The letter body is a multi-paragraph handwritten message, not a single
    // line: at least three body paragraphs plus a signature line.
    const body = screen.getByTestId("letter.card");
    const paragraphs = body.querySelectorAll("p.font-hand");
    expect(paragraphs.length).toBeGreaterThanOrEqual(4);

    // The signature line is the largest handwriting line in the letter.
    const signature = Array.from(paragraphs).find((p) =>
      p.className.includes("text-2xl"),
    );
    expect(signature).toBeDefined();

    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("keeps the letter body in the handwriting face with generous line spacing", () => {
    render(<InnerMessage onClose={() => {}} />);

    const body = screen.getByTestId("letter.card");
    const paragraphs = Array.from(body.querySelectorAll("p.font-hand"));
    expect(paragraphs.length).toBeGreaterThanOrEqual(4);

    for (const paragraph of paragraphs) {
      expect(paragraph.className).toContain("font-hand");
      expect(paragraph.className).toContain("leading-[1.9]");
    }
  });

  it("keeps the title as the small script heading, not a large display headline", () => {
    render(<InnerMessage onClose={() => {}} />);

    const title = screen.getByTestId("letter.title");
    expect(title.className).toContain("font-display");
    expect(title.className).toContain("italic");
    expect(title.className).toContain("text-2xl");
  });

  it("keeps the two-photo keepsake embedded between the letter paragraphs", () => {
    render(<InnerMessage onClose={() => {}} />);

    const card = screen.getByTestId("letter.card");
    expect(
      card.querySelector('[data-ocid="message.photos"]'),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("figure")).toHaveLength(2);
  });

  it("keeps the photo keepsake caption as a script line with a heart glyph", () => {
    render(<MessagePhotoSection />);

    const caption = screen.getByTestId("message.photos_caption");
    expect(caption.className).toContain("font-display");
    expect(caption.className).toContain("italic");
    // The caption is non-empty and carries the decorative heart SVG.
    expect(caption.textContent?.trim().length ?? 0).toBeGreaterThan(0);
    expect(caption.querySelector("svg")).not.toBeNull();
  });

  it("keeps both message photos shown as-is inside the polaroid frames", () => {
    render(<MessagePhotoSection />);

    const left = screen.getByRole("img", {
      name: "A cherished moment together",
    });
    expect(left).toHaveAttribute("src", "/assets/images/message-1.jpg");
    expect(left.className).toContain("object-contain");

    const right = screen.getByRole("img", {
      name: "Another cherished moment together",
    });
    expect(right).toHaveAttribute("src", "/assets/images/message-2.jpg");
    expect(right.className).toContain("object-contain");
  });

  it("keeps the full envelope -> gifts -> Message -> Back journey working", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Message" }));

    expect(screen.getByTestId("letter.card")).toBeInTheDocument();
    expect(screen.getAllByRole("figure")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByTestId("gifts.page")).toBeInTheDocument();
    expect(screen.queryByTestId("letter.card")).not.toBeInTheDocument();
  });
});
