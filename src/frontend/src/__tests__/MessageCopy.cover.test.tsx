import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { InnerMessage } from "@/components/InnerMessage";
import { MessagePhotoSection } from "@/components/MessagePhotoSection";
import { AnniversaryCard } from "@/pages/AnniversaryCard";

const OPEN_BUTTON = "Open the anniversary envelope";
const REVEAL_TIMEOUT = 4000;

// The accepted Indonesian copy: the letter title and the photo caption share the
// relationship-anniversary greeting, and the body is the user's original letter
// translated to Indonesian. These are the exact strings the accepted request
// ships, so this suite freezes them (unlike the characterization baseline, which
// deliberately did not).
const TITLE = "Selamat hari jadi hubungan kita, sayang.";

// The exact accepted Indonesian body, in the user's order. These are the five
// paragraphs the accepted request ships (the user's original message translated
// to Indonesian), so this suite freezes the full text rather than just each
// paragraph's opening line.
const BODY_PARAGRAPHS = [
  "Terima kasih karena menjadi orangku, sapaan favoritku, dan perpisahan tersulitku. Terima kasih karena telah mengisi hidupku dengan cinta, kebahagiaan, dan kenangan indah yang tak terhitung. Aku sangat beruntung bisa menyebutmu milikku.",
  "Selamat hari jadi hubungan kita, sayang. Untuk semua kenangan yang telah kita buat, semua pelajaran yang telah kita pelajari, dan semua momen indah yang masih menanti kita di masa depan. Aku mencintaimu lebih dari yang bisa dijelaskan kata-kata, dan aku akan terus memilihmu hari ini, besok, dan setiap hari setelahnya. ❤️",
  "Kamu adalah ketenanganku, tempat pulangku yang aman, sahabat terbaikku, dan orang yang membuat hari-hari biasa terasa luar biasa. Setiap kali hidup terasa berat, kamu adalah orang yang ingin aku tuju. Kehadiranmu saja sudah memberiku kedamaian, dan cintamu memberiku kekuatan dengan cara yang mungkin tak pernah sepenuhnya kamu sadari.",
  "Aku mencintai hal-hal kecil tentangmu — caramu membuatku tersenyum tanpa berusaha, caramu mendengarkanku, caramu peduli, dan caramu membuatku merasa dicintai bahkan dari kejauhan. Setiap kenangan yang kita ciptakan bersama adalah sesuatu yang sangat kuhargai, dan aku tak sabar membuat lebih banyak lagi bersamamu.",
  "Apa pun tantangan yang datang, aku berharap kita terus saling memilih, terus berkomunikasi, terus bertumbuh, dan terus saling mencintai dengan ketulusan yang sama seperti yang menyatukan kita. Aku tahu masa depan tidak akan selalu mudah, tapi memilikimu di sisiku membuatku percaya bahwa kita bisa melewati apa pun.",
];

/** Collapse the JSX whitespace so a paragraph can be compared to its source. */
function normalize(text: string | null): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

/** Open the envelope and wait for the "Gifts for you" selection screen. */
async function openGifts(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: OPEN_BUTTON }));
  await screen.findByTestId("gifts.page", {}, { timeout: REVEAL_TIMEOUT });
}

/**
 * Cover for the accepted Message-page copy change: the letter title and every
 * body paragraph are the Indonesian translation of the user's sent message, and
 * the wedding "Happy Anniversary" wording is gone in favour of a
 * relationship-anniversary greeting for a dating couple.
 */
describe("Message copy cover", () => {
  it("renders the accepted Indonesian title and all five translated body paragraphs", () => {
    render(<InnerMessage onClose={() => {}} />);

    expect(screen.getByTestId("letter.title")).toHaveTextContent(TITLE);

    const card = screen.getByTestId("letter.card");
    const paragraphs = Array.from(card.querySelectorAll("p.font-hand"));
    expect(paragraphs).toHaveLength(BODY_PARAGRAPHS.length);

    // The body is the user's original message translated to Indonesian, in the
    // same order — assert the full accepted text, not just each opening line.
    expect(paragraphs.map((p) => normalize(p.textContent))).toEqual(
      BODY_PARAGRAPHS,
    );
  });

  it("keeps the photo keepsake between the third and fourth body paragraphs", () => {
    render(<InnerMessage onClose={() => {}} />);

    const card = screen.getByTestId("letter.card");
    const photos = card.querySelector('[data-ocid="message.photos"]');
    expect(photos).toBeInTheDocument();

    // The accepted letter wraps the keepsake: three paragraphs before it and
    // two after. A regression that appends the photos at the end fails here.
    const paragraphs = Array.from(card.querySelectorAll("p.font-hand"));
    const before = paragraphs.filter(
      (p) =>
        photos!.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_PRECEDING,
    );
    const after = paragraphs.filter(
      (p) =>
        photos!.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(before).toHaveLength(3);
    expect(after).toHaveLength(2);
  });

  it("has no wedding 'Happy Anniversary' wording anywhere on the Message page", () => {
    render(<InnerMessage onClose={() => {}} />);

    const card = screen.getByTestId("letter.card");
    const text = card.textContent ?? "";
    expect(text).not.toMatch(/happy anniversary/i);
    expect(text).not.toMatch(/anniversary/i);
    // The relationship-anniversary greeting is present instead.
    expect(text).toMatch(/selamat hari jadi hubungan kita/i);
  });

  it("uses the relationship-anniversary greeting as the photo caption, not the wedding one", () => {
    render(<MessagePhotoSection />);

    const caption = screen.getByTestId("message.photos_caption");
    expect(caption).toHaveTextContent(TITLE);
    expect(caption.textContent ?? "").not.toMatch(/happy anniversary/i);
  });

  it("shows the accepted copy on the Message page reached through the gift flow", async () => {
    const user = userEvent.setup();
    render(<AnniversaryCard />);

    await openGifts(user);
    await user.click(screen.getByRole("button", { name: "Message" }));

    expect(screen.getByTestId("letter.title")).toHaveTextContent(TITLE);
    const card = screen.getByTestId("letter.card");
    const paragraphs = Array.from(card.querySelectorAll("p.font-hand"));
    expect(paragraphs.map((p) => normalize(p.textContent))).toEqual(
      BODY_PARAGRAPHS,
    );
    expect(card.textContent ?? "").not.toMatch(/happy anniversary/i);
  });
});
