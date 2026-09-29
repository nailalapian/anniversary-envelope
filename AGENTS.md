# Project Guidance

## User Preferences

- Romantic anniversary greeting-card experience with a sealed envelope that opens to a 'Gifts for you' choice screen
- Dark burgundy 'Velvet & Candlelight' palette with gold accents; Instrument Serif Italic display, General Sans body, Caveat handwriting for the letter
- Use the user's own photos as-is, never cropped or edited; square polaroid frames with contain fitting
- Keep photo replacement simple: users swap images by uploading files with the same filename to GitHub
- Every gift content page (Message, Memories, Flowers) must have a visible Back control that returns to the three-choice 'Gifts for you' screen
- Message copy is in Indonesian and written for a dating couple: use 'selamat hari jadi hubungan kita', never wedding-anniversary wording
- Match the reference screenshots closely: soft watercolor-style illustrations, cream wax seal, white Memories card with floral accents

## Verified Commands

- **typecheck**: `pnpm --dir src/frontend typecheck`
- **fix**: `pnpm --dir src/frontend fix`
- **build**: `pnpm --dir src/frontend build`

## Learnings

- The Message page is a full-bleed scrollable section (data-ocid='letter.card') with a small script title, long handwriting body, an embedded MessagePhotoSection (two PolaroidFrame + HeartBalloon), and an underlined Back link (data-ocid='letter.back_button').
- A handwriting body font is exposed as Tailwind font-hand via --font-hand; Caveat.woff2 must ship in src/frontend/public/assets/fonts or the letter falls through to generic cursive on Linux/Android/ChromeOS.
- A @font-face src pointing at a missing file silently falls through to the next family in the stack; verify the referenced font file actually exists in public/assets/fonts.
- Message photo slots use /assets/images/message-1.jpg and message-2.jpg with PolaroidFrame's object-contain (no crop) and an in-frame placeholder fallback.
- Generic 'cursive' is not a script face on Linux/Android/ChromeOS, so a handwriting requirement needs a bundled font file, not just a cursive fallback.
- The Message page polaroid slots are now bundled with the user's real photos at src/frontend/public/assets/images/message-1.jpg and message-2.jpg; PolaroidFrame's object-contain shows them uncropped.
- Vite copies public/assets/images/* verbatim into dist/assets/images/; verify with md5sum on the dist copies to prove no re-encode happened.
- md5sum plus `od -An -tx1 -N4` (expect ff d8 ff e0) verifies a JPEG copy is byte-identical when the `file` command is unavailable.
- The images README at src/frontend/public/assets/images/README.md is the single user-facing upload guide; it must name the exact filenames the components reference (message-1/2.jpg, memory-1/2.jpg).
- PolaroidFrame uses object-contain (never crops) and swaps in an inline placeholder printing the src path on load error, so a missing image never shows a broken frame.
- The app is purely frontend; the backend has no domain logic and the UI does not call it.
- Test setup remaps testIdAttribute to data-ocid; the tester owns src/frontend/src/__tests__ and vitest.config.ts.
- The Message page Back button (data-ocid='letter.back_button') is wired via InnerMessage's onClose prop to AnniversaryCard's handleBack, which sets the stage back to 'gifts'; the 'gifts' stage renders GiftSelection with exactly three choices (Message, Memories, Flowers).
- MemoriesPage/FlowersPage Back buttons use data-ocid memories.back_button / flowers.back_button and call onBack, wired to AnniversaryCard handleBack which sets stage='gifts'; the 'gifts' stage renders GiftSelection with exactly three choices.
- The Message page letter body is a sequence of font-hand paragraphs inside InnerMessage.tsx; the embedded MessagePhotoSection sits between paragraphs, so new body text must be inserted around it rather than appended.
- The user's original letter text lives in .platform/attachments screenshots; OCR of those images is the authoritative source for verifying the message matches what the user sent.
- The app's copy is Indonesian for a dating couple: use 'selamat hari jadi hubungan kita', never wedding-anniversary wording.
- The Message page letter body is exactly five font-hand paragraphs in the user's order, with <MessagePhotoSection /> embedded between paragraphs 3 and 4 (never appended at the end).
- The Message page title (letter.title) and photo caption (message.photos_caption) intentionally share the same string 'Selamat hari jadi hubungan kita, sayang.'
- When the user sends replacement message text, use exactly the paragraphs they sent in that message — do not pull extra paragraphs from older attachments.
- The two Message polaroid photos are bundled at src/frontend/public/assets/images/message-1.jpg (left) and message-2.jpg (right); replace them with a plain binary copy (cp) and verify with md5sum plus `od -An -tx1 -N4` showing ff d8 ff e0.
- The full gift journey is covered by GiftJourney.cover.test.tsx: sealed envelope -> 'Gifts for you' -> Message/Memories/Flowers each open -> Back returns to the three choices, all in one session.
- The Memories page references memory-1.jpg/memory-2.jpg, which are not bundled (only message-1/2.jpg exist), so its polaroids show PolaroidFrame's placeholder until the user uploads those files.
- The wax seal's color is driven by the .bg-gradient-seal utility plus the --wax tokens in index.css, so recoloring the seal requires editing those tokens, not just WaxSeal.tsx.
- The gift illustrations are inline SVGs sized by the parent span in GiftOption; keeping the viewBox and h-full w-full className preserves layout while redrawing the art.
