# Accessibility QA

Covers tasks T192–T199 (audits), T212 and T213 (automation). T201 (manual screen-reader
pass) and T226 (final pass on published content) are still open — see **Open items**.

Standard: WCAG 2.2 AA. Last run: 2026-09-20, against the production build with
`CONTENT_INCLUDE_DRAFTS=true` (so draft pages are audited too).

## How it is verified

| Check | Where | Result |
| --- | --- | --- |
| axe-core (`wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`) on all 37 routes at 1440px and 375px | `tests/e2e/sweeps.spec.ts` | 0 critical, 0 serious |
| axe on the form in its idle, invalid, failed and success states | same | 0 critical, 0 serious |
| axe with the mobile menu open, at 375×800 and 568×320 (landscape) | same | 0 critical, 0 serious |
| Keyboard-only journey: skip link → header CTA → complete and submit the form | `tests/e2e/interaction.spec.ts` | Passes; focus ring ≥ 2px at each step |
| Reduced motion: no running animations after load and scroll | `tests/e2e/interaction.spec.ts` | Passes |
| Repeated link text resolves to a single target per page | `tests/e2e/sweeps.spec.ts` | Passes |
| Heading order, single `h1`, landmarks | `tests/e2e/sweeps.spec.ts` (SEO sweep + axe) | Passes |

Run them with `npm run test:e2e`.

`content-visibility: auto` on below-the-fold sections is removed before each axe scan
(`tests/e2e/support/routes.ts`), because otherwise the off-screen content is not rendered
and axe cannot resolve its colours.

## T192 Semantic structure (manual outline review)

Reviewed every template's rendered outline:

- One `<h1>` per page; headings descend without skipping (asserted site-wide).
- Landmarks: `<header>`, `<nav aria-label="Primary">`, `<main id="main" tabindex="-1">`,
  `<footer>`. Each `<section>` is labelled by its heading (`aria-labelledby`), and
  visually hidden headings are used where a section has no visible title.
- Lists are real lists: services, industries, features, benefits, workflows, FAQs (`<dl>`),
  navigation, breadcrumbs.
- Project screenshots are `<figure>`/`<figcaption>`; article dates are `<time datetime>`.
- No clickable `div`s: cards use a stretched link over a real `<a>`; the menu toggles are
  `<button>`; the mega menu and mobile menu use the native Popover API.
- `<html lang="en">`.

## T194 Focus states

The focus ring is a token per surface (`--focus-ring` in `src/styles/globals.css`), applied
through `:focus-visible` with a 2px outline and a 2px offset:

| Surface | Ring colour | Contrast against the surface |
| --- | --- | --- |
| `surface-white` | brand green dark (#008a2e) | 4.49:1 |
| `surface-gray` | brand green dark (#008a2e) | 4.23:1 |
| `surface-ink` | brand green (#00d84a) | 10.24:1 |
| `surface-deep` | brand green (#00d84a) | 6.49:1 |

All four exceed the 3:1 required for a focus indicator. The ratios, the 2px outline and the
2px offset are asserted in `tests/unit/tokens-contrast.test.ts`, so a token change that
weakens a ring fails the unit suite.

Checked that the ring is never clipped: the sticky header has no `overflow: hidden`, and
cards keep `overflow: visible` where a stretched link can receive focus.

## T195 Form accessibility

- Visible `<label>` for every field; required fields say "required" in the label text, not
  only with an asterisk.
- `autocomplete`: `name`, `organization`, `email`, `tel`.
- Errors set `aria-invalid` and `aria-describedby` on the field, and the summary links move
  focus to the field.
- The outcome heading (success or failure) receives focus, so it is announced.
- The character counter uses a polite live region that only speaks near the limit.
- The honeypot is `aria-hidden`, `tabindex="-1"`, `autocomplete="off"`, and visually hidden.

## T197 Colour contrast

- axe `color-contrast` passes on every route and surface.
- Grep for the forbidden pairings from the constitution: no `text-brand-green` on a light
  surface (one icon on `/contact` was corrected to `text-brand-green-dark` during this
  audit), and `text-brand-green-dark` is used only for icons, never for body text.
- Body links are ink text with a green underline (`link-inline`), not green text.

## T199 Screen-reader content

- `DashboardPreview` hides the visual (`aria-hidden`) and carries an `sr-only` `figcaption`
  summarising what it shows; `JourneyDiagram` hides its connectors and announces each stage
  as text.
- Decorative icons and arrows are `aria-hidden` (the `Icon` component hides any icon without
  a `label`).
- Repeated link text ("Learn more", "View Case Study") carries `sr-only` context naming the
  target, verified automatically: no link name on a page resolves to two different targets.
- Badges read as text; the eyebrow is a `<p>`, not a heading.

## Known limitations

1. **WebKit popover focus restore.** When the mobile menu is dismissed with `Escape`, Safari
   does not return focus to the toggle (Chromium does). The panel has a visible Close button
   that does return focus, and touch users dismiss by tapping outside. The assertion is
   skipped on WebKit in `tests/e2e/navigation.spec.ts` and this remains a browser gap, not a
   site defect.
2. **Lighthouse reports accessibility 96, not 100**, on pages with `content-visibility: auto`.
   Its axe pass cannot resolve colours inside skipped content and reports contrast
   false positives. With `content-visibility` disabled the same pages score 100, which is why
   the e2e axe sweep disables it before scanning. See `qa/performance.md`.

## Open items

- **T201 — manual NVDA + Firefox (Windows) and VoiceOver + Safari (iOS) pass.** Not done:
  it needs a person with the assistive technology. Script: navigate Home,
  `/industries/manufacturing` and `/contact` by landmark and by heading, complete the form
  once with an error and once successfully, and open and close the mobile menu.
- **T226 — final pass after publishing**, once the real logo, contact details and project
  screenshots are in place (new images need alt text review).
