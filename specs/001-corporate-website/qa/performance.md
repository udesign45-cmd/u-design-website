# Performance QA: U Design Website

**Date**: 2026-09-20 · **Build**: production (`next build`, drafts visible, `VERCEL_ENV=production`)
**Tools**: `scripts/lighthouse-local.mjs` (Lighthouse 12 via Playwright Chromium, median of 3 runs,
mobile profile). CI uses `npm run lhci` with `lighthouserc.json` on Linux.

## Measurement notes

- This Windows machine's CPU benchmark varied between about 440 and 1,400 during testing (other
  applications running). Lighthouse's default 4× CPU slowdown assumes a reference host (about
  1,400), so results on this machine were **calibrated** (`LH_CALIBRATE=1`, slowdown =
  4 × benchmark ÷ 1,400) to approximate the standard mobile profile. Uncalibrated runs on a busy
  host are far more pessimistic.
- Lighthouse CI's Chrome launcher cannot clean up its temporary profile on Windows (`EPERM`), so
  local runs use the Playwright-based runner. CI (Linux) runs `lhci autorun` normally.

## Results

Two measurement methods, same build, median of 3 runs each, taken at feature-complete
(task T217, 2026-09-20).

### A. Calibrated simulated throttling (`LH_CALIBRATE=1`, benchmarkIndex 1128)

| Template | Perf | A11y* | Best Practices | SEO | LCP | TBT | CLS | JS (gzip) | CSS |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 92 | 96 | 100 | 100 | 2.74 s | 218 ms | 0.01 | 147 KB | 10 KB |
| `/solutions/erp` | 94 | 96 | 100 | 100 | 2.70 s | 151 ms | 0 | 147 KB | 10 KB |
| `/industries/manufacturing` | 93 | 96 | 100 | 100 | 2.73 s | 199 ms | 0 | 147 KB | 10 KB |
| `/portfolio/manufacturing-erp` | 95 | 96 | 100 | 100 | 2.73 s | 142 ms | 0 | 147 KB | 10 KB |
| `/contact` | 93 | 100 | 100 | 100 | 2.58 s | 228 ms | 0 | 153 KB | 10 KB |

### B. Applied (DevTools) throttling, same routes

| Template | Perf | LCP | TBT | CLS |
|---|---|---|---|---|
| `/` | 90 | 2.16 s | 297 ms | 0.01 |
| `/solutions/erp` | 89 | 2.10 s | 349 ms | 0 |
| `/industries/manufacturing` | 87 | 2.17 s | 411 ms | 0 |
| `/portfolio/manufacturing-erp` | 81 | 2.27 s | 576 ms | 0 |
| `/contact` | 90 | 2.10 s | 325 ms | 0 |

Read together: **LCP is comfortably inside 2.5 s under applied throttling (2.10–2.27 s) but
2.58–2.74 s under simulation**, and **TBT is inside 200 ms on three of five routes under
simulation but not under applied throttling on this host**. The two methods disagree because
this is a busy Windows workstation, not a clean CI runner: simulation replays an unthrottled
trace (pessimistic for LCP, optimistic for TBT), applied throttling really slows the CPU 4×
on a machine that is already contended (pessimistic for TBT).

**Neither run meets every budget at once, so T191 and T217 remain open.** The honest summary
is: scores 81–95, all category scores except performance at 96–100, CLS ~0, JS and CSS well
inside budget, and LCP/TBT needing confirmation on real hardware — PageSpeed Insights against
the Vercel Preview (T225) and `lhci` on Linux in CI are the deciding measurements.

Interaction latency (INP proxy), measured with the Event Timing API at 4× CPU throttling on
a 390px viewport:

| Interaction | Longest event duration |
|---|---|
| Open the mobile menu | 72 ms |
| Close the mobile menu | 24 ms |
| Typing in the form fields | 16–32 ms |
| Submit the consultation form | 112 ms |

All are inside the 200 ms "good" INP threshold. The menu is a native popover and the form
submit is a server action, so neither does client rendering work beyond a state swap.

## Optimizations applied

| Change | Effect |
|---|---|
| Coded hero illustration (no raster), H1 is the LCP element | No image on the LCP path; CLS 0 |
| Icons rendered as static server SVG from generated data (`scripts/generate-icons.mjs`) | Removed lucide-react's client `Icon` runtime (about 10 KB gzip) and icon hydration |
| Analytics aliased to a no-op at build time when unconfigured (`next.config.ts` `turbopack.resolveAlias`) | No analytics JavaScript ships by default |
| Link prefetching off by default (`AppLink`) | Stops each page from prefetching dozens of routes; lower JS transfer and TBT |
| `content-visibility: auto` on below-the-fold sections and footer | TBT down about 40–60% (style/layout was the largest main-thread cost) |
| Removed `text-wrap: pretty` on paragraphs | Lower layout cost |
| Inter not preloaded (body renders in a metric-adjusted fallback); Poppins 600/700 preloaded | Less bandwidth contention for the heading font |
| One responsive dashboard illustration instead of two copies | Smaller hero DOM |
| Scroll reveal animates transform only | Content is never rendered at low opacity |

## Budget changes (documented deviation)

- **JavaScript budget**: plan AD-12 set 130 KB (content routes) and 160 KB (`/contact`). The Next.js
  16 + React 19 runtime alone measures about 140 KB gzip on an otherwise empty route, so the
  original budget was below the framework floor. Adjusted to **160 KB** (content) and **170 KB**
  (`/contact`) in `lighthouserc.json` and the local runner, which allows about 7–17 KB of
  application code above the runtime.

## Open items

- **Confirm LCP and TBT on neutral hardware.** Run `lhci` in CI (Linux) and PageSpeed
  Insights against the Preview deployment (T225). Only then can T191 and T217 close.
- If TBT is still above 200 ms on the home page in CI, the next steps are shorter class
  strings via component utilities and trimming duplicate navigation markup (the home page
  carries about 1,430 DOM elements and about 185 KB of RSC payload).
- `/portfolio/manufacturing-erp` has the highest TBT under applied throttling (576 ms); it
  renders the screenshot gallery. Re-measure once the real screenshots replace the
  placeholders, since image decode will change the profile.
