# Responsive QA

Covers tasks T200 (layout refinement) and T211 (automation). Last run: 2026-09-20 against
the production build with drafts visible.

## Automated check

`tests/e2e/sweeps.spec.ts` loads every route in the sitemap plus the two legal pages at
**320, 375, 768, 1280, 1440 and 1920 px** and asserts, per page and width:

- `document.documentElement.scrollWidth <= clientWidth` — no horizontal scrolling;
- the header consultation CTA is visible;
- the `h1` is visible.

Result: **37 routes × 6 widths, 0 failures.** The mobile projects (Pixel 7, iPhone 14) also
run the whole functional suite at their own device widths.

## Layout behaviour per breakpoint

| Area | < 375px | 375–639 | 640–767 | 768–1023 | 1024–1279 | ≥ 1280 |
| --- | --- | --- | --- | --- | --- | --- |
| Header | Logo mark, compact CTA, menu button | Wordmark returns | Same | Same | Full nav, no menu button | Same, wider gutters |
| Hero | 1 column, CTAs stack | 1 column | 1 column | 1 column | 2 columns with the dashboard visual | 2 columns |
| Dashboard visual | Core panel only | Core panel only | Core panel only | Core panel only | Sidebar and overlay cards appear | Full composition |
| Solution cards | 1 column | 1 column | 2 columns | 2 columns | 3 columns | 3 columns |
| Marketing cards | 1 column | 1 column | 2 columns | 2 columns | 3 columns | 4 columns |
| Industry cards | 1 column | 1 column | 1 column | 2 columns | 4 columns | 4 columns |
| Portfolio | 1 column | 1 column | 1 column | 2 columns | 3 columns | 3 columns |
| Process steps | Stacked | Stacked | Stacked | 2 columns per step | 2 columns per step | 6-column timeline |
| Form | 1 column | 1 column | 1 column | 2 columns | 2 columns | 2 columns |
| Footer link groups | 2 columns | 2 columns | 3 columns | 3 columns | 3 columns | 5 columns |

Nothing is a shrunken desktop layout: each breakpoint changes the composition, not just the
scale.

## Issues found and fixed

1. **Header overflowed by 51px at 320px** (every page). The wordmark, the CTA and the menu
   button could not share a 288px content row. Fixed by adding an `xs` breakpoint (375px) in
   `src/styles/globals.css`: below it the logo shows the mark alone (the accessible name
   stays "U Design, home") and the header CTA uses tighter horizontal padding. Verified at
   320, 360, 374, 375, 390 and 414px.
2. **Mobile menu on a short landscape screen (568×320)**: checked that the panel scrolls and
   the last link is reachable; covered by the axe sweep.

## Notes

- Tap targets are at least 44×44px (menu button, CTAs, nav links, form controls).
- Long unbroken strings (email addresses, URLs in MDX) use `break-words`; grid children set
  `min-w-0` so text can shrink instead of forcing the row wider.
- The 320px case assumes the browser's default font size. A user zoom of 200% is handled by
  the same fluid layout (tested informally at 1280px / 200%, equivalent to 640px).
