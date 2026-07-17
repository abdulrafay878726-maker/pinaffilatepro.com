# Design system — PinAffiliate Pro

Rejected the obvious "Pinterest red + generic SaaS" look. Positioned this as a warm editorial
magazine crossed with a corkboard — pins are treated like tagged, priced items, which ties the
visual identity directly to the affiliate-commerce angle of the product.

## Palette

| Token | Hex | Use |
|---|---|---|
| `--color-paper` | `#FFF8F1` | Page background (warm cream, not stark white) |
| `--color-ink` | `#1F1B16` | Primary text |
| `--color-ink-soft` | `#574F45` | Secondary text |
| `--color-coral` | `#FF5A45` | Primary CTA / affiliate buy buttons |
| `--color-plum` | `#2B2140` | Dark sections, secondary buttons |
| `--color-gold` | `#E8A33D` | Featured/earnings accents |
| `--color-sage` | `#4F7965` | Positive stats |
| `--color-line` | `#E8DDCD` | Borders, dividers |

## Type

- **Display / headlines:** Fraunces (variable, optical sizing) — an editorial serif with personality, used with restraint on H1/H2 only.
- **UI / body:** Inter — neutral, highly legible for dashboards and forms.
- **Stats / data:** IBM Plex Mono — used for numbers in dashboard stat cards and analytics, so figures read as data rather than prose.

## Signature element

The **torn-tag affiliate ribbon**: every `PinCard` and the pin detail page render the affiliate
"Buy Now" button as a die-cut price tag pinned to the top corner of the image (`.tag-ribbon` CSS
clip-path in `globals.css`). It's the one place the design takes a visible risk — everything else
(cards, forms, nav) stays quiet and disciplined so the ribbon reads as intentional, not decorative.

## Layout

- Homepage hero is an asymmetric two-column spread (headline + a tilted preview card), not a
  centered hero with a gradient blob.
- Pin feeds use CSS columns (masonry-style), matching the real Pinterest browsing pattern users
  already know.

Keep new UI consistent with these tokens rather than introducing new ad-hoc colors or fonts.
