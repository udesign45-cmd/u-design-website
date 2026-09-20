# Design review

Task T223. This is the **pre-approval** pass, run on the local production build with draft
content visible (2026-09-20). T223 itself stays open: the constitution's Design Quality Gate
is meant to be answered on the published site, with the real logo, contact details and
project screenshots in place.

Method: full-page and per-section screenshots at 375px and 1440px
(`scripts/visual-snapshot.mjs`, `scripts/visual-sections.mjs`), plus the automated overflow,
contrast and console sweeps.

## Design Quality Gate

| Question | Answer | Evidence |
| --- | --- | --- |
| Does it look premium and corporate? | Yes | Deep-green hero, generous spacing, one accent colour, no stock-photo filler |
| Does it match U Design branding? | Partly | Colours, Poppins/Inter and the "Build. Market. Grow." line are in place. The **official logo is still missing** (Q-2) and a typographic wordmark stands in |
| Is the hierarchy clear? | Yes | One h1, eyebrow → heading → lead → CTA on every template |
| Is it easy to understand? | Yes | Business-first copy; no technology jargon above the fold |
| Is the CTA obvious? | Yes | Persistent header CTA at every width, hero CTA, section CTAs, final CTA band |
| Does it work on mobile? | Yes | 37 routes × 6 widths with no horizontal scrolling; layouts recompose rather than shrink |
| Does it load quickly? | Mostly | 147–153 KB JS, 10 KB CSS, CLS ~0; LCP and TBT need confirmation on neutral hardware (`qa/performance.md`) |
| Is it accessible? | Yes | 0 critical or serious axe violations; keyboard journey passes (`qa/accessibility.md`) |
| Is it SEO-ready? | Yes | Unique metadata, canonicals, JSON-LD, sitemap, OG images (`qa/seo-review.md` pending deployment) |
| Is it free of clutter? | Yes | Unverified proof sections (logos, metrics, testimonials) stay hidden instead of showing empty shells |

## Per-template notes

| Template | Verdict | Note |
| --- | --- | --- |
| Home | Pass | Hero fits above the fold at 375×667 and 1440×900; the section rhythm alternates light and dark, never two dark sections in a row |
| Solutions hub and detail | Pass | Business-first order: problem → approach → features → benefits → industries → related work → CTA |
| Industries hub and detail | Pass | Manufacturing leads with a "Priority focus" badge and an expanded feature list; the others stay compact |
| Portfolio hub and case study | Pass, blocked | Layout is right, but the screenshots are placeholders until Q-4 |
| Digital marketing | Pass | Seven services, no performance promises |
| About | Pass, partial | Reads as complete without a founding story; the section simply is not there |
| Contact | Pass, blocked | The "Contact details" card currently reads "Use the form to reach our team" because no details exist |
| Blog, category, article | Pass | Draft-gated, so this is only visible in preview builds |
| Legal pages | Pass | Long-form prose layout with a clear "last updated" date |
| 404 | Pass | Branded, with route suggestions and the consultation CTA |
| Footer | Pass | Five columns at ≥1280px including the Legal column; the brand column will fill out once contact details exist |

## Issues found and fixed in this pass

1. Header overflowed at 320px — fixed with a compact header below 375px (`qa/responsive.md`).
2. A brand-green icon on a light surface on `/contact` — changed to the dark green token.

## Open items

- Re-run the gate after publishing (T223 closes with T222).
- The brand column in the footer and the contact card both look sparse until the real contact
  details arrive; no layout change is needed, only content.
