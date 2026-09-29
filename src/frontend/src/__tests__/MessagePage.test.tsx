import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { InnerMessage } from "@/components/InnerMessage";
import { MessagePhotoSection } from "@/components/MessagePhotoSection";
import { AnniversaryCard } from "@/pages/AnniversaryCard";

const OPEN_BUTTON = "Open the anniversary envelope";
const REVEAL_TIMEOUT = 4000;

// The accepted Indonesian copy: the letter title and the photo caption share
// the relationship-anniversary greeting, and the body is the user's original
// letter translated to Indonesian.
const TITLE = "Selamat hari jadi hubungan kita, sayang.";
const BODY_OPENING =
  /Terima kasih karena menjadi orangku, sapaan favoritku, dan perpisahan tersulitku/i;
const BODY_CLOSING = /Selamat hari jadi hubungan kita, sayang\./i;

/** Open the envelope and wait for the "Gifts for you" selection screen. */
async function openGifts(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: OPEN_BUTTON }));
  await screen.findByTestId("gifts.page", {}, { timeout: REVEAL_TIMEOUT });
}

/**
 * Coverage for the accepted Message page: a long handwritten letter on the
 * velvet stage, a small script title, the embedded two-polaroid keepsake with
 * heart balloons and a caption, and an underlined Back link. The old
 * "Seal it again" control and its short copy are intentionally gone.
 */
describe("InnerMessage", () => {
  it("renders the Indonesian script title and the long translated letter body", () => {
    render(<InnerMessage onClose={() => {}} />);

    expect(screen.getByTestId("letter.card")).toBeInTheDocument();
    expect(screen.getByTestId("letter.title")).toHaveTextContent(TITLE);
    // The long letter runs in the handwriting face with generous line spacing.
    const body = screen.getByText(BODY_OPENING);
    expect(body.className).toContain("font-hand");
    expect(body.className).toContain("leading-[1.9]");
  });

  it("keeps the whole letter body in Indonesian with no wedding 'Happy Anniversary' copy", () => {
    render(<InnerMessage onClose={() => {}} />);

    const card = screen.getByTestId("letter.card");
    const paragraphs = Array.from(card.querySelectorAll("p.font-hand"));
    expect(paragraphs.length).toBeGreaterThanOrEqual(4);

    // Every body paragraph is the Indonesian translation, not the old English.
    for (const paragraph of paragraphs) {
      expect(paragraph.textContent ?? "").not.toMatch(/happy anniversary/i);
      expect(paragraph.textContent ?? "").not.toMatch(
        /all the anniversaries still to come/i,
      );
    }

    // The closing body paragraph carries the relationship-anniversary greeting.
    const closing = paragraphs.find((p) =>
      BODY_CLOSING.test(p.textContent ?? ""),
    );
    expect(closing).toBeDefined();
    expect(card.textContent ?? "").not.toMatch(/happy anniversary/i);
  });

  it("embeds the photo keepsake between the letter paragraphs", () => {
    render(<InnerMessage onClose={() => {}} />);

    const card = screen.getByTestId("letter.card");
    expect(
      card.querySelector('[data-ocid="message.photos"]'),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("figure")).toHaveLength(2);
  });

  it("renders the letter body in warm white handwriting on the velvet stage", () => {
    render(<InnerMessage onClose={() => {}} />);

    // The long copy is white (the `foreground` token) handwriting, centered.
    const body = screen.getByText(BODY_OPENING);
    expect(body.className).toContain("text-foreground");
    expect(body.className).toContain("font-hand");
    // The letter column centers its paragraphs.
    expect(body.parentElement?.className).toContain("text-center");

    // The title is the small script heading, not a large display headline.
    const title = screen.getByTestId("letter.title");
    expect(title.className).toContain("font-display");
    expect(title.className).toContain("italic");
    expect(title.className).toContain("text-2xl");
  });

  it("calls onClose when the underlined Back link is activated", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<InnerMessage onClose={onClose} />);

    const back = screen.getByRole("button", { name: "Back" });
    expect(back.className).toContain("underline");

    await user.click(back);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("MessagePhotoSection", () => {
  it("shows both message photos as-is inside tilted polaroid frames", () => {
    render(<MessagePhotoSection />);

    expect(screen.getAllByRole("figure")).toHaveLength(2);

    const left = screen.getByRole("img", {
      name: "A cherished moment together",
    });
    expect(left).toHaveAttribute("src", "/assets/images/message-1.jpg");
    // object-contain keeps the whole photo visible without cropping.
    expect(left.className).toContain("object-contain");

    const right = screen.getByRole("img", {
      name: "Another cherished moment together",
    });
    expect(right).toHaveAttribute("src", "/assets/images/message-2.jpg");
    expect(right.className).toContain("object-contain");
  });

  it("flanks the photos with heart balloons and a script caption", () => {
    render(<MessagePhotoSection />);

    const section = screen.getByTestId("message.photos");
    // Balloons are decorative inline SVG, never broken images.
    expect(section.querySelectorAll("svg").length).toBeGreaterThanOrEqual(4);
    expect(section.querySelector("img")).not.toBeNull();

    const caption = screen.getByTestId("message.photos_caption");
    expect(caption).toHaveTextContent(TITLE);
    expect(caption.className).toContain("font-display");
    expect(caption.className).toContain("italic");
    // The caption is the relationship-anniversary greeting, not the wedding one.
    expect(caption.textContent ?? "").not.toMatch(/happy anniversary/i);
  });

  it("falls back to a tidy placeholder instead of a broken image when a photo is missing", () => {
    render(<MessagePhotoSection />);

    const left = screen.getByRole("img", {
      name: "A cherished moment together",
    });
    fireEvent.error(left);

    expect(
      screen.queryByRole("img", { name: "A cherished moment together" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("/assets/images/message-1.jpg"),
    ).toBeInTheDocument();
    // The other slot is unaffected and still shows its photo.
    expect(
      screen.getByRole("img", { name: "Another cherished moment together" }),
    ).toBeInTheDocument();
  });
});

describe("Message page journey", () => {
  it("opens Message from the gift selection and returns via Back", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Message" }));

    expect(screen.getByTestId("letter.card")).toBeInTheDocument();
    expect(screen.getByTestId("letter.title")).toHaveTextContent(TITLE);
    expect(screen.getAllByRole("figure")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByTestId("gifts.page")).toBeInTheDocument();
    expect(screen.queryByTestId("letter.card")).not.toBeInTheDocument();
  });

  it("restores the full 'Gifts for you' selection with all three choices after Back", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Message" }));
    expect(screen.getByTestId("letter.card")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back" }));

    // The selection screen is back with its heading and every choice usable.
    expect(screen.getByTestId("gifts.page")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Gifts for you" }),
    ).toBeInTheDocument();
    for (const label of ["Message", "Memories", "Flowers"]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
    expect(screen.queryByTestId("letter.card")).not.toBeInTheDocument();

    // The restored choices are live: picking Memories still navigates.
    await user.click(screen.getByRole("button", { name: "Memories" }));
    expect(screen.getByTestId("memories.page")).toBeInTheDocument();
  });

  it("shows the Message page on the full-bleed velvet stage with no navigation chrome", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Message" }));

    // The dark maroon stage is the page background, and the letter fills it.
    const stage = screen.getByTestId("anniversary.page");
    expect(stage.className).toContain("bg-velvet");
    expect(stage.className).toContain("min-h-dvh");

    // No navigation chrome is rendered around the letter.
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
  });
});
