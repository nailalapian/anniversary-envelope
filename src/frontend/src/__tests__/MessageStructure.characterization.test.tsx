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
 * Characterization baseline for the Message-page copy replacement.
 *
 * The accepted request swaps the letter body for a new Indonesian translation
 * of a newly sent message and changes the photo caption to the
 * relationship-anniversary greeting. Those exact strings are intentionally
 * changing, so this suite deliberately does NOT freeze any Indonesian copy.
 *
 * Instead it pins the *structural* invariants the copy change must preserve and
 * that a careless text edit is most likely to break:
 *   - the letter keeps a distinct title element separate from the body;
 *   - the body stays a multi-paragraph handwritten sequence;
 *   - the photo keepsake stays embedded *between* body paragraphs (there is
 *     body text both before and after it), not appended at the end;
 *   - the caption stays a distinct element from the title;
 *   - the whole envelope -> gifts -> Message -> Back journey still works.
 */
describe("Message structure characterization", () => {
  it("keeps the title as a distinct element separate from the body paragraphs", () => {
    render(<InnerMessage onClose={() => {}} />);

    const title = screen.getByTestId("letter.title");
    expect(title).toBeInTheDocument();
    // The title is not itself one of the handwriting body paragraphs.
    expect(title.className).not.toContain("font-hand");
    expect(title.tagName).toBe("P");
  });

  it("keeps the body as a multi-paragraph handwritten sequence", () => {
    render(<InnerMessage onClose={() => {}} />);

    const card = screen.getByTestId("letter.card");
    const paragraphs = Array.from(card.querySelectorAll("p.font-hand"));
    // Several body paragraphs, not a single collapsed block.
    expect(paragraphs.length).toBeGreaterThanOrEqual(4);
    for (const paragraph of paragraphs) {
      expect((paragraph.textContent ?? "").trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps the photo keepsake embedded between body paragraphs, not appended", () => {
    render(<InnerMessage onClose={() => {}} />);

    const card = screen.getByTestId("letter.card");
    const photos = card.querySelector('[data-ocid="message.photos"]');
    expect(photos).toBeInTheDocument();

    // Body paragraphs must exist on both sides of the keepsake: the letter
    // wraps around the photos rather than ending before them.
    const paragraphs = Array.from(card.querySelectorAll("p.font-hand"));
    const before = paragraphs.filter(
      (p) =>
        photos!.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_PRECEDING,
    );
    const after = paragraphs.filter(
      (p) =>
        photos!.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(before.length).toBeGreaterThanOrEqual(1);
    expect(after.length).toBeGreaterThanOrEqual(1);
  });

  it("keeps the caption as a distinct element from the letter title", () => {
    render(<InnerMessage onClose={() => {}} />);

    const title = screen.getByTestId("letter.title");
    const caption = screen.getByTestId("message.photos_caption");
    expect(caption).toBeInTheDocument();
    expect(caption).not.toBe(title);
    // The caption is a script line carrying the decorative heart glyph.
    expect(caption.className).toContain("font-display");
    expect(caption.className).toContain("italic");
    expect(caption.querySelector("svg")).not.toBeNull();
  });

  it("keeps the two-photo keepsake with both photos and the Back control", () => {
    render(<InnerMessage onClose={() => {}} />);

    expect(screen.getAllByRole("figure")).toHaveLength(2);
    expect(
      screen.getByRole("img", { name: "A cherished moment together" }),
    ).toHaveAttribute("src", "/assets/images/message-1.jpg");
    expect(
      screen.getByRole("img", { name: "Another cherished moment together" }),
    ).toHaveAttribute("src", "/assets/images/message-2.jpg");
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("keeps the caption and title as separate lines in the standalone photo section", () => {
    render(<MessagePhotoSection />);

    const caption = screen.getByTestId("message.photos_caption");
    expect(caption).toBeInTheDocument();
    expect(caption.textContent?.trim().length ?? 0).toBeGreaterThan(0);
    // The caption is its own element, not a duplicate of the letter title.
    expect(screen.queryByTestId("letter.title")).not.toBeInTheDocument();
  });

  it("keeps the full envelope -> gifts -> Message -> Back journey working", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Message" }));

    expect(screen.getByTestId("letter.card")).toBeInTheDocument();
    expect(screen.getByTestId("letter.title")).toBeInTheDocument();
    expect(screen.getByTestId("message.photos_caption")).toBeInTheDocument();
    expect(screen.getAllByRole("figure")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByTestId("gifts.page")).toBeInTheDocument();
    expect(screen.queryByTestId("letter.card")).not.toBeInTheDocument();
  });
});
