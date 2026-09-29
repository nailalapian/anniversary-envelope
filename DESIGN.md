# Design Brief

## Direction

Velvet & Candlelight — a dark, intimate luxury-keepsake anniversary card: deep burgundy velvet stage, warm antique-gold light, cream script headline.

## Tone

Luxury/refined executed with conviction — candlelit and tactile, never playful or candy-colored; every surface should feel like heavy paper and soft velvet.

## Differentiation

A single centered envelope lit by a warm candlelight halo, with a hand-tooled gold wax seal that breathes — the whole screen behaves like an object on a table, not a web page.

## Color Palette

| Token      | OKLCH        | Role                                          |
| ---------- | ------------ | --------------------------------------------- |
| background | 0.17 0.075 20 | Deep burgundy velvet stage (dark mode primary) |
| foreground | 0.96 0.015 80 | Soft cream text                               |
| card       | 0.23 0.085 22 | Raised velvet panels / inner letter           |
| primary    | 0.74 0.12 82  | Warm antique gold — seals, accents, active    |
| accent     | 0.74 0.12 82  | Same gold; used sparingly for emphasis only   |
| muted      | 0.27 0.09 22  | Recessed burgundy, instruction text base      |

Support: envelope body `0.42 0.16 22` (deep red), letter paper cream `0.97 0.02 80`, border `0.32 0.09 24`.

## Typography

- Display: Instrument Serif (italic) — headline "Happy Anniversary, Love !" and inner-message salutation; elegant high-contrast script feel.
- Body: General Sans — instructions, message body, and any UI labels.
- Scale: hero `text-4xl sm:text-5xl md:text-6xl font-normal italic tracking-tight`, h2 `text-2xl md:text-3xl`, label `text-xs font-medium tracking-[0.25em] uppercase`, body `text-base md:text-lg`.

## Elevation & Depth

Depth comes from light, not flat shadows: a radial candlelight halo behind the envelope, a soft vignette darkening the stage corners, and layered warm shadows so the envelope and letter read as physical objects on velvet.

## Structural Zones

| Zone    | Background              | Border                        | Notes                                                        |
| ------- | ----------------------- | ----------------------------- | ------------------------------------------------------------ |
| Header  | none (no chrome)        | —                             | No navigation; headline floats directly on the velvet stage. |
| Content | `.bg-velvet` + grain    | —                             | Single centered column; envelope is the focal object.        |
| Footer  | transparent             | —                             | Instruction line only, quiet and understated.                |

## Spacing & Rhythm

One centered column with generous vertical breathing room (`gap-10 md:gap-14`); headline sits high, envelope dead-center, instruction tucked below with `mt-8` — deliberate emptiness around the envelope is the rhythm.

## Component Patterns

- Buttons: none visible; the envelope itself is the interaction surface (cursor-pointer, subtle lift on hover).
- Cards: the inner letter is a cream paper card, `rounded-sm`, `shadow-letter`, thin gold hairline border.
- Badges: the wax seal is the only badge — round, `bg-gradient-seal`, `shadow-seal`, botanical glyph, gently pulsing.

## Motion

- Entrance: `animate-fade-rise` on headline, envelope, and instruction, staggered ~120ms apart.
- Hover: envelope lifts 2px and halo brightens over 300ms (`transition-smooth`).
- Decorative: `animate-seal-pulse` on the wax seal, optional `animate-float-soft` on the envelope; flap lifts on open (frontend owns the reveal animation).

## Constraints

- No navigation chrome, no header/footer bars, no page scroll — one full-viewport centered scene.
- Never use raw hex/rgb in components; consume semantic tokens and the custom utilities only.
- No background music or sound; no personalized name or message editing (out of scope).
- Keep AA+ contrast: cream on burgundy, gold only for accents — never for body copy.

## Signature Detail

The candlelight halo: a warm gold radial glow pooled behind the envelope that makes the wax seal feel lit from within — a lighting treatment, not a decoration.
