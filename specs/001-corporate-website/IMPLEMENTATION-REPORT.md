# U Design website — implementation report

**Date:** 2026-09-20 · **Branch:** `master` · **Spec:** `001-corporate-website`
**Stack:** Next.js 16.3.5 (App Router, Turbopack), React 19.3.0, TypeScript 6.0.3,
Tailwind CSS v4, Vitest 5, Playwright, Node 24.

## 1. Status

**212 of 232 tasks complete.** Every task that can be finished without U Design's business
inputs, content approval or a production deployment is done and verified. The 20 open tasks
are listed in §8 with the reason each is blocked.

The site builds, passes all quality gates and runs as a complete, fully static website. It is
**not yet publishable**: every content entry is deliberately `status: "draft"` until U Design
approves it, and the launch gate reports 7 outstanding blockers (§8).

## 2. What was built

### Pages (30 routes, all statically generated)

| Group | Routes |
| --- | --- |
| Core | `/`, `/about`, `/contact`, 404 |
| Solutions | `/solutions` + 5 detail pages (custom software, ERP, CRM, dashboards, automation) |
| Industries | `/industries` + 8 detail pages (manufacturing first, then distribution, real estate, construction, logistics, travel & tourism, healthcare, retail) |
| Digital marketing | `/digital-marketing` + 4 detail pages (social media, Meta Ads, content, lead generation) |
| Portfolio | `/portfolio` + 3 case studies, each badged "Concept / Demo" |
| Blog | `/blog`, one article, one category page (draft-gated) |
| Legal | `/privacy-policy`, `/terms-of-service` (draft, pending legal review) |
| Machine | `/sitemap.xml`, `/robots.txt`, OG image routes |

### Code

- **67 components** in `src/components` (ui, layout, navigation, cards, sections, templates,
  forms, visuals, portfolio, seo, analytics) — about 10,700 lines of TypeScript in `src`.
- **46 content files** in `src/content`, the single source of truth, read only through
  `src/lib/content`. A CMS can replace that layer without touching components.
- The design system is CSS-first: brand tokens, four surfaces (white, gray, ink, deep), a
  type scale, spacing rhythm and focus rings defined in `src/styles/globals.css`.

### Consultation form (the site's conversion path)

A server action (`submitConsultation`) with Zod validation, four spam layers (honeypot, HMAC
render token, per-instance rate limit, idempotent `submissionId`) and pluggable delivery
(`console`, `email`, `webhook` or both) selected by `LEAD_DELIVERY_PROVIDER`. It works
**without JavaScript** (native POST re-renders the result) and, with JavaScript, validates
instantly and submits in a transition so the visitor never loses what they typed.

No credential is ever exposed: secrets are read only in `server-only` modules, and a grep of
`.next/static` for every secret name and value finds nothing.

## 3. Content integrity

Nothing was invented. The following are **absent by design**, and their sections stay hidden
until U Design supplies them: client testimonials, client logos, results, revenue figures,
statistics, awards, certifications, partnerships, contact details, company history and the
founding story. The three portfolio projects are labelled "Concept / Demo" and no case study
claims a client or a result.

Twelve integrity rules run as unit tests (banned buzzwords, placeholder text, approved CTA
labels, slug format, cross-references, gating). 125 unit tests pass.

## 4. SEO

- Unique title and description on every route, absolute canonical, one `h1`, no skipped
  heading levels — all asserted automatically across all 30 routes.
- JSON-LD per the routes contract: `Organization`, `WebSite`, `Service`, `BlogPosting`,
  `BreadcrumbList`, plus `FAQPage` when FAQ content exists. No `Review` or `AggregateRating`
  (forbidden without real reviews).
- Generated 1200×630 OG images, `twitter:card`, sitemap driven by the published content, and
  environment-aware robots: anything that is not production serves `Disallow: /` plus
  `noindex`.
- **Two SEO defects were found and fixed during this phase**: hub pages shipped without an
  `og:image` (Next 16 does not inherit `app/opengraph-image.tsx` into nested routes), and
  blog category pages had no `BreadcrumbList`.

## 5. Performance

Measured locally with Lighthouse (3 runs per route, mobile profile) on a busy Windows
workstation — see `qa/performance.md` for both methods in full.

| Metric | Result |
| --- | --- |
| Performance score | 92–95 (simulated throttling), 81–90 (applied throttling) |
| Best Practices / SEO | 100 / 100 |
| LCP | 2.58–2.74 s simulated, **2.10–2.27 s applied** |
| TBT | 142–228 ms simulated, 297–576 ms applied |
| CLS | 0–0.01 |
| JavaScript | 147 KB (153 KB on `/contact`), gzip |
| CSS | 10 KB |
| Interaction latency (INP proxy, 4× CPU) | menu 72 ms, form submit 112 ms — inside 200 ms |

Key decisions that got it there: no raster image on the LCP path (the hero illustration is
coded), icons rendered as static server SVG instead of a client icon library, analytics
aliased to a no-op at build time when unconfigured, link prefetching off by default, and
`content-visibility: auto` on below-the-fold sections.

**Honest caveat:** no single run meets every budget at once on this machine — simulated
throttling is pessimistic about LCP, applied throttling is pessimistic about TBT on a
contended host. That is why T191 and T217 remain open: they need `lhci` on a CI Linux runner
and PageSpeed Insights against a real deployment to close.

## 6. Accessibility

WCAG 2.2 AA. **Zero critical and zero serious axe violations** across all 30 routes at 1440px
and 375px, plus the form in its idle, invalid, failed and success states and the mobile menu
open (including a 568×320 landscape screen).

Also verified: a keyboard-only journey from the skip link through the header CTA to a
successful submission with a visible focus ring at every step; reduced-motion support; focus
rings that clear 3:1 on all four surfaces (now unit-tested); and no repeated link text that
resolves to two different pages.

Two known limitations, both documented in `qa/accessibility.md`: Safari does not restore
focus to the invoker when a native popover is dismissed with Escape (the panel's Close button
does), and Lighthouse scores accessibility 96 rather than 100 because `content-visibility`
produces contrast false positives in its axe pass — the e2e suite disables it before scanning
and scores clean.

## 7. Tests

| Suite | Count | Result |
| --- | --- | --- |
| Unit + content integrity (`npm test`) | 125 tests, 13 files | All pass |
| End-to-end (`npm run test:e2e`) | 139 tests across 4 projects | 132 pass, 7 project-scoped skips, 0 failures |
| Launch readiness (`npm run check:launch`) | 9 checks | 2 pass, 7 blockers — as designed |

The e2e projects are desktop Chromium, Pixel 7, iPhone 14 (WebKit) and **`blog-gate`**, which
runs against a *second* production build made without `CONTENT_INCLUDE_DRAFTS` to prove that
draft content is completely absent: no route, no link, no sitemap entry.

Site-wide sweeps cover every route in one pass: internal link crawl with orphan detection,
horizontal-overflow checks at six widths, axe, SEO metadata and structured data, console
errors and link-name ambiguity.

## 8. Remaining work

**Needs U Design (blocking launch):**

1. **T220** — official logo, email, phone, location, socials, response time; budget ranges;
   real screenshots for the three projects; any testimonials, client logos (with written
   permission) or statistics (with sources); the About founding story.
2. **T222** — approve the copy page by page so entries can move from `draft` to `published`.
   `qa/content-review.md` lists every page ready for that review.
3. Legal review of the Privacy Policy and Terms of Service.

**Needs a deployment:**

4. **T228** Vercel production setup (environment variables per environment, domain, Node 24,
   WAF rate limit on `POST /contact`), **T229** live lead-delivery test with SPF/DKIM/DMARC
   verification, **T230** Search Console, **T231** user testing.
5. **T224, T225, T227** — SEO, performance and technical QA re-run against the Preview and
   Production URLs; **T218** — a green CI run (the workflow is written; there is no remote yet).
6. **T191, T217** — confirm the LCP and TBT budgets on neutral hardware.

**Needs a person with assistive technology:**

7. **T201** — manual NVDA + Firefox and VoiceOver + Safari pass, which in turn gates
   **T195**, **T196**, **T199** and **T226**, whose acceptance criteria name it explicitly.
   Everything automatable in those four tasks is done and passing.

**Optional:** **T190** Cloudflare Turnstile, to be added only if spam gets through the four
existing layers.

**Also open:** **T223** design QA re-run after publishing (the pre-approval pass is recorded
in `qa/design-review.md`).

## 9. Deviations from the plan

Each of these is a deliberate, recorded change, not an oversight.

| # | Deviation | Why |
| --- | --- | --- |
| 1 | TypeScript 6.0.3 instead of 7 | typescript-eslint does not support TS 7 yet |
| 2 | JS budget raised to 160 KB (170 KB on `/contact`) from 130/160 | The Next 16 + React 19 runtime alone is about 140 KB gzip, below which no budget is achievable |
| 3 | `content-visibility: auto` added | Largest single TBT win; costs a Lighthouse a11y false positive |
| 4 | Icons generated as static SVG data; `lucide-react` moved to devDependencies | lucide v1 ships `"use client"`, which hydrated every icon |
| 5 | Analytics aliased to a no-op via `turbopack.resolveAlias` | Ships zero analytics JS until an ID is configured |
| 6 | `AppLink` disables prefetch by default | Prefetching dozens of routes per page inflated JS and TBT |
| 7 | Terms of Service page added | Requested in the implementation brief; not in the original spec |
| 8 | `issueRenderToken` server action for the HMAC timestamp | The contact page is static, so the token cannot be embedded at build time |
| 9 | Some components combined per file (`ContentBlocks.tsx`, `Related.tsx`) | They are variants of one idea; one file per component would have fragmented them |
| 10 | Blog and legal metadata live in the TypeScript registry, not MDX exports | Keeps one typed content contract and avoids loading MDX to read a title |
| 11 | Header cannot set `aria-current` | The layout is a server component with no pathname; the alternative was making the whole header a client component |
| 12 | `xs` breakpoint (375px) added, with a mark-only logo below it | The header overflowed by 51px at 320px |
| 13 | e2e specs grouped by theme (`pages.spec.ts`, `sweeps.spec.ts`, `interaction.spec.ts`) instead of one file per task | The sweeps share one traversal of all 30 routes; splitting them multiplied the run time |
| 14 | `npm run lhci` is not run locally on Windows | Lighthouse CI cannot clean up its Chrome profile (EPERM); `scripts/lighthouse-local.mjs` replaces it locally, CI runs the real thing |
| 15 | `NEXT_DIST_DIR` support added to `next.config.ts` | Lets the draft-gated `blog-gate` build coexist with the preview build during e2e |

## 10. Defects found and fixed during this phase

1. **Hidden form fields were wiped on every re-render.** React 19 re-applies `defaultValue`
   to hidden inputs, so typing in the message field cleared `submissionId`, `renderedAt` and
   `sourcePage` — the spam and idempotency signals. The hidden inputs no longer carry React
   value props. Covered by a regression test.
2. **Header overflowed the viewport at 320px** on every page.
3. **Hub pages had no `og:image`.**
4. **Blog category pages had no breadcrumb structured data.**
5. **The contact form linked to `/privacy-policy` even when that page was gated**, producing a
   404 link in a draft-gated build. The link now appears only when the page is published.
6. **The digital marketing hub was missing its umbrella `Service` JSON-LD** required by the
   routes contract.
7. **A brand-green icon sat on a light surface** on `/contact`, against the design system's
   own contrast rule.
8. **Mixed spelling conventions** in four industry content files.
9. **HSTS was missing** from the security headers; now emitted in production builds.

## 11. How to run it

```bash
npm run dev                  # development
npm run check                # lint → typecheck → unit tests → build
npm run test:e2e             # 4 Playwright projects (builds and serves twice)
npm run check:launch         # launch readiness gate (expected to fail until launch)
node scripts/lighthouse-local.mjs   # local Lighthouse (Windows-friendly)
```

QA records live in `specs/001-corporate-website/qa/`: `accessibility.md`, `performance.md`,
`responsive.md`, `content-review.md`, `design-review.md`, `seo-review.md`, `technical.md`.
