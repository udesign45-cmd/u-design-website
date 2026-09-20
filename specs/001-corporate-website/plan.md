# Implementation Plan: U Design Corporate Website

**Branch**: `001-corporate-website` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-corporate-website/spec.md`, the constitution
v2.0.0, and the `/speckit-plan` technical brief.

**Companion artifacts**: [research.md](./research.md) (architecture decisions AD-01 to AD-19 and
clarification resolutions) · [data-model.md](./data-model.md) · [contracts/](./contracts/) ·
[quickstart.md](./quickstart.md)

## Summary

Build a statically generated, content-driven B2B marketing website for U Design with Next.js
(App Router), React Server Components, TypeScript (strict), and Tailwind CSS v4, deployed on
Vercel. The site's job is lead generation. Every page leads to one consultation form. The form
uses a progressively enhanced Server Action and delivers leads through a configurable adapter
(email and/or webhook).

All business content (solutions, marketing services, industries, projects, testimonials, stats,
logos, company profile, navigation, form options) lives in typed content modules and MDX, and is
read through a repository layer that a CMS can later replace without touching the UI. Routes,
navigation, the sitemap, and cross-links are generated from **published** content only. Sections
that depend on unverified proof (logos, metrics, testimonials, results) render only when verified
data exists. This enforces constitution Principle II in code.

Performance and accessibility are designed in from the start: a coded (non-raster) hero visual,
four small client islands, a native Popover API for navigation, CSS-only motion, self-hosted
fonts, and CI-enforced budgets.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), Node.js 24 LTS (minimum 22 LTS), React 19.

**Primary Dependencies**: Next.js, the latest stable major at scaffold time (16.x expected;
App Router, Server Actions, Metadata API, `next/image`, `next/font`, `next/og`). Tailwind CSS v4.
Zod (server-only validation). `@next/mdx` (blog and legal pages). `lucide-react` (optional
icons). See [Dependency Decisions](#dependency-decisions).

**Storage**: None. Content is file-based in the repository. Leads are not stored by the site;
they are delivered to email and/or a webhook (research R-1).

**Testing**: Vitest (unit tests and the content integrity suite). Playwright (end-to-end,
responsive, keyboard, SEO). `@axe-core/playwright` (accessibility). Lighthouse CI
(performance, SEO, and best-practice budgets).

**Target Platform**: Vercel (Edge CDN for static assets, Node runtime for the Server Action).
Browsers: the latest two versions of Chrome, Edge, Safari (macOS and iOS), Firefox, and Samsung
Internet.

**Project Type**: Web application (single Next.js project: static marketing site plus one
server action).

**Performance Goals**: Lighthouse mobile ≥ 90 in all four categories. LCP ≤ 2.5s (target
1.8s), INP ≤ 200ms, CLS ≤ 0.1 at the 75th percentile. First-load JS ≤ 130 KB gzip on content
routes and ≤ 160 KB on `/contact`.

**Constraints**: WCAG 2.2 AA. No horizontal overflow from 320 to 1920px. No third-party scripts by
default. Approved palette and typography only (with the documented exceptions in Complexity
Tracking). No fabricated content. Leads are never lost silently.

**Scale/Scope**: About 30 launch routes: home, 5 solutions, 8 industries, 5 marketing (hub plus 4
pages), 3 projects, about, contact, privacy, plus hubs. The blog is gated until posts exist.
Traffic is modest (B2B), and static hosting scales with no effort.

## Constitution Check

*GATE: must pass before Phase 0 research. Re-checked after Phase 1 design.*

| # | Principle | How the plan complies | Pre | Post-design |
|---|---|---|---|---|
| I | Business-First B2B Positioning | Content schemas enforce business problem → approach → features → benefits order (data-model). Manufacturing has `priority: 1`. Both service categories are modelled. Copy guidance in [Content Implementation Rules](#content-implementation-rules). | ✅ | ✅ |
| II | Content Integrity (non-negotiable) | Discriminated `Project` union blocks client fields and results on concepts. `verified` and `permissionConfirmed` gates on testimonials, stats, and logos. Proof sections are hidden when empty. The integrity suite rejects placeholders. JSON-LD uses only present fields. The hero mock uses neutral illustrative data. | ✅ | ✅ |
| III | Performance by Architecture | Full SSG (AD-01), coded hero (AD-05), 4 client islands (AD-06), CSS motion (AD-12, AD-16), `next/font`, CI budgets. | ✅ | ✅ |
| IV | SEO-First Architecture | `buildMetadata` plus per-entry `seo` (AD-04), sitemap and robots from the repository, JSON-LD builders (AD-13), breadcrumbs, redirects, internal-link guarantees ([routes contract](./contracts/routes-and-seo.md)). | ✅ | ✅ |
| V | Accessibility (WCAG 2.2 AA) | Semantic templates, native Popover navigation, form accessibility contract, contrast-safe tokens (dark green is never used for normal text), per-surface focus ring tokens, reduced motion, axe in CI. | ✅ | ✅ |
| VI | Intentional Responsive Design | Mobile-first Tailwind. Per-component mobile layouts are specified in [Responsive Strategy](#responsive-strategy). Overflow test at 6 widths. | ✅ | ✅ |
| VII | Premium U Design System | A single `@theme` token source, variant-based primitives, and no arbitrary values. **Exceptions**: Deep Green surface, functional neutrals, and the error red, all justified in Complexity Tracking. | ⚠️ justified | ⚠️ justified |
| VIII | Purposeful, Lightweight Motion | CSS only, `transform` and `opacity` only, reduced-motion guard, content never hidden by default. | ✅ | ✅ |
| IX | Conversion-Focused Journeys | `CtaLabel` union type, consultation CTA on every template, above-the-fold CTA on home, solution, industry, and marketing templates, form contract (validation on both sides, retry, fallback, no silent loss), analytics readiness. No pop-ups. | ✅ | ✅ |
| X | Proof Through Portfolio & Industry Depth | Project schema enforces Problem → Solution → Features → Business Application with captioned screenshots. Industry schema requires specific challenges and workflows, plus a similarity test. | ✅ | ✅ |
| XI | Scalable, Content-Driven Architecture | Repository layer, dynamic templates, derived navigation, form options, and sitemap. Adding an entry requires no layout edits (SC-013). | ✅ | ✅ |
| — | Tech & Quality Standards | Next.js App Router, RSC, strict TypeScript, Tailwind; ESLint and Prettier; no `any`; secrets in server environment variables only; dependency table below. | ✅ | ✅ |
| — | Quality Gates 1 to 7 | Automated in CI ([Testing Strategy](#testing-strategy)); Design Quality Gate as a PR checklist. | ✅ | ✅ |

**Gate result: PASS.** The one ⚠️ item is a justified, documented exception that needs U Design's
approval of the proposed Deep Green surface token (see Open Questions). No unresolved
clarifications remain; see research §R.

## Project Structure

### Documentation (this feature)

```text
specs/001-corporate-website/
├── plan.md              # This file
├── research.md          # Phase 0: decisions AD-01..AD-19, clarification resolutions
├── data-model.md        # Phase 1: entities, validation, repository API, integrity rules
├── quickstart.md        # Phase 1: setup, env, scripts, validation scenarios
├── contracts/
│   ├── consultation-action.md
│   ├── lead-delivery.md
│   ├── routes-and-seo.md
│   └── analytics-events.md
├── checklists/requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks) — not created here
```

### Source Code (repository root)

```text
.
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # fonts, root metadata, Organization JSON-LD, Header/Footer, SkipLink
│   │   ├── page.tsx                   # Home (composes home sections)
│   │   ├── not-found.tsx · error.tsx · global-error.tsx
│   │   ├── sitemap.ts · robots.ts · opengraph-image.tsx · icon.svg / apple-icon.png
│   │   ├── solutions/page.tsx · solutions/[slug]/{page,opengraph-image}.tsx
│   │   ├── industries/page.tsx · industries/[slug]/{page,opengraph-image}.tsx
│   │   ├── digital-marketing/page.tsx · digital-marketing/[slug]/{page,opengraph-image}.tsx
│   │   ├── portfolio/page.tsx · portfolio/[slug]/{page,opengraph-image}.tsx
│   │   ├── blog/page.tsx · blog/[slug]/{page,opengraph-image}.tsx · blog/category/[category]/page.tsx
│   │   ├── about/page.tsx · contact/page.tsx · privacy-policy/page.tsx
│   │   └── actions/consultation.ts    # 'use server' — submitConsultation
│   ├── components/
│   │   ├── ui/            # Button, ButtonLink, Card, Badge, SectionHeading, Input, Select, Textarea, Field, LogoCloud, Icon
│   │   ├── layout/        # Header, Footer, Container, Section, Breadcrumbs, SkipLink
│   │   ├── navigation/    # DesktopNav, NavMenu (popover), MobileNav (popover)
│   │   ├── cards/         # ServiceCard, IndustryCard, PortfolioCard, CaseStudyCard, TestimonialCard, StatCard, ProcessStep, ArticleCard
│   │   ├── sections/
│   │   │   ├── home/      # Hero, TrustLogos, ServicesOverview, IndustriesGrid, FeaturedProjects, DigitalizationJourney,
│   │   │   │              # ProcessSteps, MarketingOverview, WhyUDesign, CredibilityMetrics, Testimonials, FinalCta
│   │   │   └── shared/    # CtaBanner, FeatureGrid, ChallengeList, WorkflowList, BenefitList, RelatedProjects, RelatedLinks, PageHero
│   │   ├── templates/     # SolutionTemplate, IndustryTemplate, MarketingServiceTemplate, ProjectTemplate, ArticleTemplate
│   │   ├── visuals/       # DashboardPreview, JourneyDiagram
│   │   ├── portfolio/     # ProjectTypeBadge, ScreenshotGallery, PortfolioFilter ('use client')
│   │   ├── forms/         # ConsultationForm ('use client'), FormField, FormSuccess, FormError
│   │   ├── seo/           # JsonLd
│   │   └── analytics/     # AnalyticsScripts, TrackClicks ('use client', mounted only when configured)
│   ├── content/
│   │   ├── site.ts · navigation.ts · home.ts · digitalization.ts · process.ts · why.ts · about.ts
│   │   ├── solutions/{index,custom-software,erp,crm,business-dashboards,automation}.ts
│   │   ├── marketing/{index,social-media,meta-ads,content,lead-generation,digital-strategy}.ts
│   │   ├── industries/{index,manufacturing,distribution,real-estate,construction,logistics,travel,healthcare,retail}.ts
│   │   ├── projects/{index,manufacturing-erp,travel-agency-management,real-estate-crm}.ts
│   │   ├── testimonials.ts · stats.ts · client-logos.ts · faqs.ts · form-options.ts · redirects.ts
│   │   ├── blog/categories.ts · blog/posts/{index.ts,*.mdx}
│   │   └── legal/privacy-policy.mdx
│   ├── lib/
│   │   ├── content/       # repository: getters, relation resolver, published filter
│   │   ├── seo/           # metadata.ts, jsonld.ts, site-url.ts, breadcrumbs.ts
│   │   ├── forms/         # fields.ts, consultation-schema.ts (server-only), spam.ts, rate-limit.ts, delivery/{index,email,webhook,console}.ts
│   │   ├── analytics/     # events.ts, track.ts
│   │   └── utils/         # cx.ts, format-date.ts (Intl), env.ts (validated env access)
│   ├── styles/globals.css # Tailwind v4 @import + @theme tokens + base layer + motion utilities
│   ├── types/content.ts
│   ├── mdx-components.tsx # must live in src/ when using the src/ layout (see tasks T139)
│   └── assets/            # logos/, portfolio/<slug>/*.png|webp, og/, blog/
├── tests/
│   ├── unit/              # content-integrity, consultation-schema, delivery adapters, jsonld, metadata, spam
│   └── e2e/               # home, consultation-form, navigation, mobile-menu, industries, solutions, portfolio,
│                          # marketing, contact, blog, seo, responsive, keyboard, motion, a11y, links, not-found
├── public/                # robots-independent static files (favicons if not in app/)
├── next.config.ts · postcss.config.mjs · eslint.config.mjs · .prettierrc · tsconfig.json
├── vitest.config.ts · playwright.config.ts · lighthouserc.json
├── .env.example · .gitignore · .nvmrc (24)
└── .github/workflows/ci.yml
```

**Structure Decision**: A single Next.js project with a `src/` directory. There is no separate
backend: the only server logic is one Server Action, and the delivery adapters are colocated in
`src/lib/forms`. Content, repository, presentation, and routes are separate top-level folders, as
Principle XI requires.

## Architecture Overview

```text
                ┌────────────── build time (SSG) ──────────────┐
 src/content ──▶│ lib/content (repository: published-only,      │──▶ app/ routes (thin) ──▶ templates ──▶ sections/cards/ui
 (TS + MDX)     │ relations, derived nav/form options)          │        │                         (Server Components)
                └───────────────────────────────────────────────┘        ├──▶ lib/seo ──▶ metadata, JSON-LD, sitemap, robots, OG images
                                                                         └──▶ static HTML + CSS on Vercel CDN
 runtime:  browser ──(form POST, with or without JS)──▶ Server Action submitConsultation
                     ──▶ spam checks ──▶ Zod validation ──▶ LeadDeliveryAdapter(s) ──▶ email API / webhook (CRM, Sheet)
 client islands: ConsultationForm · PortfolioFilter · TrackClicks* · AnalyticsScripts*   (*only when analytics configured)
```

Architecture decisions and their reasoning (Decision, Reason, Alternatives, Why) are in
[research.md](./research.md):

| # | Topic | Decision (short) |
|---|---|---|
| AD-01 | Rendering | Full SSG with RSC; `dynamicParams=false`; the Server Action is the only runtime code |
| AD-02 | Routing | One dynamic template per content type; routes exist only for published entries |
| AD-03 | Content | Typed TS modules plus MDX behind a repository layer (the CMS seam) |
| AD-04 | SEO | `buildMetadata` plus per-entry `seo`; generated sitemap, robots, and OG images; preview noindex |
| AD-05 | Images | `next/image` static imports; coded hero visual; captioned screenshots |
| AD-06 | Components | Layered, variant-based; 4 client islands |
| AD-07 | Forms | Server Action with progressive enhancement; native client constraints; Zod on the server; adapters |
| AD-08 | Blog | `@next/mdx` with typed `metadata`; gated until the first post |
| AD-09 | Analytics | Off by default; typed events; declarative `data-track` attributes |
| AD-10 | Deployment | Vercel preview and production; CI quality gates |
| AD-11 | Dependencies | Minimal; see the table below |
| AD-12 | Performance | Budgets and design measures per metric |
| AD-13 to AD-19 | JSON-LD, tokens, navigation, motion, testing, spam, headers | See research |

## Design System

Tokens are defined once in `src/styles/globals.css` using Tailwind v4 `@theme` (AD-14). Utilities
such as `bg-brand-green`, `text-ink`, `rounded-card`, and `shadow-card` are generated from them.
Arbitrary values (`[#…]`, `[13px]`) are prohibited without a plan note (constitution VII).

### Color tokens

| Token | Value | Role | Contrast notes |
|---|---|---|---|
| `brand-green` | `#00D84A` | Primary CTA background, accents, highlights on dark surfaces | Ink text on it: 10.24:1. **Never** text on white or gray (1.92:1). |
| `brand-green-dark` | `#008A2E` | Accent shapes, icons, large display text (≥ 24px), borders, focus ring on light surfaces | 4.49:1 on white, so large text and UI only |
| `green-deep` ⚠️ | `#003D1A` | **Proposed** dark hero and feature surface, the "dark green hero" | White 12.48:1; brand-green 6.49:1. Needs approval. |
| `ink` | `#0B0B0B` | Body and heading text on light surfaces; dark sections | White on ink: 19.68:1 |
| `white` | `#FFFFFF` | Primary surface; text on dark surfaces | — |
| `surface-gray` | `#F7F8FA` | Alternating light sections, cards on white | — |
| `ink-muted` ⚠️ | `#555555` | Secondary text | 7.46:1 on white, 7.02:1 on gray |
| `line` ⚠️ | `#E4E6EB` | Decorative dividers and card borders (non-essential) | Decorative only |
| `control-border` ⚠️ | `#767676` | Form input borders (must meet 3:1 non-text contrast) | About 4.5:1 on white |
| `danger` ⚠️ | `#B42318` | Form error text and icons | 6.57:1 on white. Always paired with an icon and text, never color alone. |

⚠️ = functional exceptions (Complexity Tracking). **Links in body text**: ink text with a
brand-green-dark underline, because `#008A2E` text on white fails AA at 4.49:1. **Primary button
hover** keeps a green background and adds a shadow and slight lift; it never switches to
dark-green with normal text. **Focus ring**: a 2px ring with a 2px offset, `brand-green-dark` on
light surfaces and `brand-green` on `ink` and `green-deep` surfaces.

**Section surface rhythm (home)**: green-deep (Hero) → white (Services) → gray (Industries) →
white (Projects) → ink (Spreadsheets journey) → white (Process) → gray (Marketing) → white (Why)
→ green-deep (Final CTA). There are at most three dark surfaces per page, and they are never
adjacent.

### Typography

- **Poppins** 600 and 700 for headings. **Inter** (variable, 400/500/600) for body, UI, and
  eyebrows. Both use `next/font/google`, self-hosted and latin subset, with `display: swap` and
  exposed as CSS variables.
- The fluid scale uses `clamp()` (mobile → desktop):

| Token | Size / line height | Use |
|---|---|---|
| `text-display` | 36/44 → 60/68, Poppins 700 | Home H1 |
| `text-h1` | 32/40 → 48/56, Poppins 700 | Page H1 |
| `text-h2` | 26/34 → 38/46, Poppins 700 | Section headings |
| `text-h3` | 20/28 → 24/32, Poppins 600 | Card and sub-section titles |
| `text-h4` | 18/26 → 20/28, Poppins 600 | Minor headings |
| `text-lead` | 18/30 → 20/32, Inter 400 | Intros, hero supporting text |
| `text-body` | 16/26, Inter 400 | Body (minimum 16px on mobile, constitution VI) |
| `text-small` | 14/22, Inter 500 | Meta, captions |
| `text-eyebrow` | 13/16, Inter 600, uppercase, tracking 0.12em | "BUILD. MARKET. GROW." |

### Other tokens

| Group | Tokens |
|---|---|
| Spacing | Tailwind 4px scale; `section-y` 64px (mobile) → 96px (md) → 128px (xl); `stack` 16/24/32 |
| Radius | `radius-control` 12px (buttons, inputs), `radius-card` 16px, `radius-panel` 24px (hero panels, dashboard frame), `radius-pill` 9999px (badges) |
| Shadow | `shadow-card` (subtle, 1 layer), `shadow-raised` (hover), `shadow-panel` (dashboard mock). All are low-opacity ink; no colored glows. |
| Containers | `container` max 1200px content plus gutters of 16 (mobile), 24 (md), 32 (xl); `container-narrow` 720px (articles, legal) |
| Breakpoints | `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1440. Chosen where layouts break, not by device. |
| Motion | `duration-fast` 150ms, `duration-base` 250ms, `duration-slow` 400ms; `ease-standard` cubic-bezier(0.2, 0, 0, 1) |
| Z-index | `z-header` 40, `z-consent` 50 (popovers use the native top layer) |

**Visual rules**: at most one subtle gradient (hero backdrop) and no glassmorphism beyond a single
translucent header on scroll. Cards are rounded with generous whitespace. Dashboard visuals sit in
a `radius-panel` frame with `shadow-panel`. The visual reference is followed for direction only
(Open Question Q-2).

### Component variants

- **Button / ButtonLink**: `primary` (brand-green background, ink text), `secondary` (on light:
  ink outline; on dark: white outline), `ghost` (text with an arrow). Sizes `md` and `lg`. All
  have a minimum height of 44px.
- **Section**: `surface` = `white | gray | ink | deep`; it sets text color and focus-ring
  tokens automatically.
- **Card**: `default | feature | link` (a link card has the whole card clickable through a
  stretched link, with one link per card for screen readers).
- **Badge**: `neutral | concept | client | category`.

## Page & Section Architecture

### Homepage (FR-010 to FR-020): section order, purpose, and gating

| # | Section | Component | Purpose (constitution goal) | Data | Render condition |
|---|---|---|---|---|---|
| 1 | Header | `Header` | Navigation plus persistent CTA | `navigation` | Always |
| 2 | Hero | `Hero` + `DashboardPreview` | Explain the service in 5s | `home.hero` | Always |
| 3 | Trust / logos | `TrustLogos` | Trust | `getApprovedLogos()` | **At least 3 approved logos** |
| 4 | Services | `ServicesOverview` (two groups) | Explain the service | Solutions and marketing services (summaries) | Always |
| 5 | Industries | `IndustriesGrid` | Relevance | `getIndustries()` | Always |
| 6 | Featured software | `FeaturedProjects` | Demonstrate capability | `getFeaturedProjects()` | At least 1 published project |
| 7 | Spreadsheets journey | `DigitalizationJourney` + `JourneyDiagram` | Make buyers recognize the problem, then lead | `digitalization` | Always |
| 8 | How we work | `ProcessSteps` | Reduce uncertainty | `process` | Always |
| 9 | Digital marketing | `MarketingOverview` | Explain the service | `home.marketing` + services | Always |
| 10 | Why U Design | `WhyUDesign` | Trust | `why` | Always |
| 11 | Credibility / metrics | `CredibilityMetrics` | Trust | `getVerifiedStats()` | **At least 3 verified stats** (empty at launch) |
| 12 | Testimonials | `Testimonials` | Trust | `getVerifiedTestimonials()` | **At least 1 verified** (empty at launch) |
| 13 | Final CTA | `FinalCta` | Lead | `home.finalCta` | Always |
| 14 | Footer | `Footer` | Navigation and contact | `navigation.footer`, `site` | Always |

**Hero**: the eyebrow "BUILD. MARKET. GROW.", the H1 "Digital Solutions That Help Businesses
Grow", the lead text (spec FR-010), primary "Get Free Consultation" → `/contact#consultation`,
and secondary "View Our Solutions" → `/solutions`. The layout is a two-column grid at `lg` and
above (copy left, visual right). On mobile, copy and CTAs come first and a simplified single-card
visual follows. `DashboardPreview` composes an ERP-style KPI and production panel, a CRM pipeline
card, and a marketing-performance mini chart in HTML, CSS, and SVG with a fixed aspect ratio (no
CLS). Its labels are illustrative ("Production", "Orders", "Leads"), with no claims, and it has an
`aria-hidden` visual plus a visually hidden one-sentence description.

### Solutions (FR-030 to FR-032), Industries (FR-040 to FR-043), Digital Marketing (FR-060 to FR-061)

Each uses a hub page plus a dynamic `[slug]` page rendered by a template. Template section order:

- **SolutionTemplate**: PageHero (H1, intro, primary CTA with `need=<slug>`, secondary "View
  Case Study" if projects exist) → Business problem (`ChallengeList`) → How it helps (approach) →
  Features (`FeatureGrid`) → Benefits (`BenefitList`) → Suitable industries (`RelatedLinks`) →
  Related projects (`RelatedProjects`, hidden if empty) → Process (compact `ProcessSteps`) → FAQ
  (only if present) → `CtaBanner`.
- **IndustryTemplate**: PageHero (CTA with `industry=<slug>`) → Challenges → Workflows
  (`WorkflowList`) → Suitable solutions → Features → Benefits → Related projects (or a portfolio
  link) → `CtaBanner`.
- **MarketingServiceTemplate**: PageHero ("Grow Your Business" secondary) → Problem → What we do
  → Outcomes (no guarantees) → How it connects to software (Build. Market. Grow.) → `CtaBanner`.
- **Hubs**: an intro plus a card grid (`ServiceCard` / `IndustryCard`). A card links only if its
  target page is published; otherwise it is informational. The Industries hub puts Manufacturing
  first and larger (feature card), and ends with an "Other industry?" note plus a CTA (spec edge
  case).

### Portfolio (FR-050 to FR-054)

- `/portfolio`: a `PortfolioCard` grid with a ProjectTypeBadge (Concept/Demo or Client Project),
  industry, and summary. **PortfolioFilter** (a client island) filters by industry and solution
  type through URL-hash state. It appears only when there are more than 6 projects. The full list
  is always in the HTML, so it stays crawlable and works without JS.
- `/portfolio/[slug]` uses **ProjectTemplate**: header (title, badge, industry label, solution
  tags) → Challenge → Solution → Modules/Features → `ScreenshotGallery` (captioned `<figure>`
  elements; horizontally scrollable, snap-aligned strip on mobile inside its own region; grid on
  desktop; each image opens full-size through a plain link, with no lightbox JS) → Business
  application → Technologies (optional, secondary) → Results (only for client projects with
  verified results) → Related industry and solutions → `CtaBanner` ("Discuss Your Business").

### About, Contact, Privacy (FR-070 to FR-072, FR-111)

- **About**: sections from `about.ts` (who, what, approach, software expertise, marketing
  expertise, philosophy, why) → `ProcessSteps` → `CtaBanner`. Founding story and team sections
  render only if their content is provided.
- **Contact**: a two-column layout at `lg` (form | contact details), stacked on mobile with the
  form first. The details block renders each provided channel (`mailto:`, `tel:` using E.164,
  socials, location) and omits the rest. The form has the anchor `id="consultation"`.
- **Privacy Policy**: MDX in the narrow container. It is a **launch blocker** until the text is
  supplied or approved.

### Blog (FR-090 to FR-092)

See AD-08. `ArticleTemplate`: breadcrumbs → title, meta (author if present, dates, category) →
featured image → MDX body (narrow container, styled prose via `mdx-components`) → related
solution and industry links → related articles → `CtaBanner`. The index shows a category nav
(static category routes) and `ArticleCard` items newest first.

### Global layout & navigation (FR-001 to FR-008)

- **Header**: a sticky white header (it becomes translucent over the hero at the top of the home
  page) with the logo, `DesktopNav`, and the CTA. At `lg` and above, Solutions, Industries, and
  Digital Marketing have popover menus. Below `lg`, a menu button opens `MobileNav` (a full-height
  popover panel) with all items, submenus as grouped lists, and the CTA pinned at the bottom.
- **SkipLink** to `#main`. `<header>`, `<nav aria-label="Primary">`, `<main id="main">`, and
  `<footer>` landmarks.
- **Footer**: column groups (Solutions, Industries, Company, Legal), a contact block, socials, and
  a Blog link when posts exist.
- **Breadcrumbs** on all detail pages (FR-008), with matching BreadcrumbList JSON-LD.
- **Error handling**: `not-found.tsx` (a branded 404 with links to Home, Solutions, Industries,
  and the CTA); `error.tsx` (a friendly message plus retry and home link, with no stack trace);
  `global-error.tsx` (a minimal branded fallback). Dynamic routes call `notFound()` for unknown or
  unpublished slugs (blog and portfolio not-found states). Image fallback per AD-05. Empty states:
  proof sections are hidden, a related-projects gap links to the portfolio, and blog routes are
  absent.

## Content Implementation Rules

- Order every page Problem → Solution → Business benefit → Proof/example → CTA.
- Write for business decision makers: business value first, and technical terms only when
  explained by their benefit (constitution I).
- Banned unless justified: "innovative", "cutting-edge", "revolutionary", "best-in-class",
  "guaranteed", "world-class", "synergy". This is enforced by the integrity test with an
  allowlist.
- No numbers, client names, or outcomes unless verified (constitution II). Drafted copy is
  committed with `status: "draft"` and published only after U Design review.
- Industry copy must reference that industry's real workflows (data-model similarity rule).

## Accessibility Strategy

- Semantic landmarks, one H1 per page, and heading order enforced by e2e checks. Lists use
  `<ul>`/`<ol>`, process steps an `<ol>`, screenshots `<figure>`/`<figcaption>`, and the journey
  diagram an `<ol>` with visual connectors.
- Keyboard: every interactive element is a native `<a>` or `<button>`. Popover menus close on
  Escape with native focus return. Visible focus uses per-surface tokens. No positive `tabindex`.
- Forms follow the accessibility contract in [consultation-action.md](./contracts/consultation-action.md).
- Color: the token rules above; status is never conveyed by color alone (icons and text).
- Motion: `prefers-reduced-motion` disables all non-essential motion (AD-16).
- Images: required `alt` in the type system. Decorative visuals use `alt=""` or `aria-hidden`.
- Target size: at least 44×44px for controls (exceeds WCAG 2.2 2.5.8).
- Verification: axe on every route, keyboard e2e, and a manual screen reader pass (NVDA and
  VoiceOver) on Home, an industry page, and Contact before launch.

## Responsive Strategy

The approach is mobile-first, and each item below is a deliberate layout, not a scaled-down
desktop one (constitution VI).

| Area | Mobile (< 768) | Tablet (768 to 1023) | Laptop/Desktop (≥ 1024) |
|---|---|---|---|
| Header | Logo, menu button, compact CTA ("Free Consultation" visible label with the full accessible name) | Same | Full navigation with popovers and a CTA button |
| Hero | Copy, CTAs stacked full-width, simplified single-card visual | Copy above a 2-card visual | Two columns: copy and the full DashboardPreview |
| Dashboard visuals | Single panel; charts reflow; no fixed widths | 2 panels | 3-panel composition |
| Service and industry cards | 1 column (industries: 2-column compact tiles) | 2 columns | 3 or 4 columns; Manufacturing as the feature tile |
| Portfolio | 1 column; screenshot strip scrolls inside its own region | 2 columns | 3 columns; gallery grid |
| Process timeline | Vertical `<ol>` with a left rail | 2 × 3 grid | Horizontal 6-step row |
| Spreadsheets journey | Vertical 3 stages with down arrows | Vertical | Horizontal with arrows |
| Tables (features, if used) | Converted to stacked definition lists | Table | Table |
| Consultation form | Single column, full-width controls | 2-column field pairs | 2-column pairs beside the contact details |
| Footer | Accordion-free stacked columns | 2 × 2 | 4 columns and a contact block |

A global safeguard allows no fixed widths above the container. Media are `max-width: 100%`. The
overflow e2e test checks 6 widths on every route.

## Security Considerations

- **Secrets** are only in server environment variables (never `NEXT_PUBLIC_`). `lib/utils/env.ts`
  validates required variables at build and startup. Files under `lib/forms` import
  `server-only`.
- **Input**: Zod allowlists and length limits. Control characters are stripped. All values are
  HTML-escaped in the email body. The webhook uses JSON with no templating.
- **Output**: JSON-LD is escaped. MDX is authored in the repository (trusted), and no user HTML is
  ever rendered.
- **Abuse**: honeypot, signed minimum fill time, in-memory limiter, Vercel WAF rate-limit rule,
  and optional Turnstile (AD-18). Server Actions have built-in origin checks. `serverActions.
  allowedOrigins` is set to the production domain.
- **Headers**: AD-19 (CSP, frame, referrer, nosniff, permissions; HSTS via Vercel).
- **Privacy**: no lead storage and no personal data in logs or analytics. The Privacy Policy
  describes the processors (the email provider and webhook target). Only the listed fields are
  collected.
- **Dependencies**: a minimal set, `npm audit` in CI, and Dependabot or Renovate for updates.

## Analytics Readiness

This follows AD-09 and the [analytics contract](./contracts/analytics-events.md). CTAs and contact
links render `data-track` attributes from day one, at zero cost. Enabling GA4 or Meta Pixel needs
only environment variables and a consent banner decision, with no component restructuring.
Search Console verification is done through a metadata environment variable.

## Testing Strategy

| Layer | Tool | Scope | Gate |
|---|---|---|---|
| Static | ESLint (`next/core-web-vitals`, TypeScript rules, `no-explicit-any`, jsx-a11y), Prettier, `tsc --noEmit` | All code | CI blocking |
| Unit | Vitest | Consultation schema, spam and timestamp signing, delivery adapters (mocked `fetch`: success, 5xx retry, timeout, dual-adapter partial failure), `buildMetadata`, JSON-LD builders (no empty or invented fields), repository relation resolution | CI blocking |
| Content integrity | Vitest | All 10 rules in [data-model](./data-model.md#integrity-rules-enforced-by-testsunitcontent-integritytestts) | CI blocking |
| Functional e2e | Playwright (Chromium and WebKit) | Navigation and dropdowns, mobile menu (open, Escape, links), CTA to contact pre-selection, form (success, validation, delivery failure, no-JS, double submit), portfolio (list, detail, 404, filter when more than 6), industry and solution pages, marketing pages, contact channels, blog gating, 404 and error pages | CI blocking |
| Link integrity | Playwright crawl from `sitemap.xml` | No broken internal links, no orphans (every sitemap URL is linked from at least one page) | CI blocking |
| Responsive | Playwright | No horizontal overflow at 320/375/768/1280/1440/1920 on every route; header and CTA visible | CI blocking |
| Accessibility | `@axe-core/playwright` plus a keyboard spec | Zero critical or serious violations; keyboard journey; reduced motion | CI blocking |
| SEO | Playwright | Unique title and description, canonical, one H1, heading order, valid JSON-LD, OG tags, robots and sitemap by environment | CI blocking |
| Performance | Lighthouse CI (mobile preset, 3 runs) | `/`, `/solutions/erp`, `/industries/manufacturing`, `/portfolio/manufacturing-erp`, `/contact`: all categories ≥ 0.9; LCP ≤ 2500ms; CLS ≤ 0.1; TBT ≤ 200ms | CI blocking |
| JS budget | Build output check | ≤ 130 KB / ≤ 160 KB gzip | CI blocking |
| Console | Playwright | No console errors or warnings on any route | CI blocking |
| Manual | Checklist | Design Quality Gate (constitution), screen reader pass, real-device check (iOS Safari, Android Chrome), live form test to the real inbox and webhook | Pre-launch |

## Deployment Strategy

- **Environments**: Local (the `console` adapter), Preview (per PR; noindex; test adapters or
  a staging inbox), Production (`main` branch; real adapters; indexable).
- **CI** (`.github/workflows/ci.yml`): install → lint → typecheck → unit and integrity tests →
  build → e2e plus axe against `next start` → Lighthouse CI → bundle budget. The workflow is
  required to pass before merge.
- **Vercel configuration**: environment variables per environment, the production domain with
  HTTPS, a WAF rate-limit rule for POST `/contact`, and Node 24 runtime.
- **Launch checklist**: all launch blockers resolved (Privacy Policy, at least one contact
  channel, logo files, lead delivery configured and live-tested, sender domain SPF and DKIM
  verified), sitemap submitted to Search Console, and the redirects list reviewed.

## Dependency Decisions

| Package | Type | Why needed / problem solved | Native alternative? | Performance impact |
|---|---|---|---|---|
| `next`, `react`, `react-dom` | runtime | Required framework (brief) | — | Baseline React runtime about 85 to 100 KB gzip |
| `zod` | runtime, **server-only** | Declarative server validation with typed field errors (FR-081, security) | A hand-written validator is possible but error-prone for 12 fields | 0 KB client (imported only in `server-only` modules) |
| `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx` | runtime/build | Blog and Privacy Policy with design-system components (AD-08) | Plain Markdown cannot embed components; a CMS is rejected for v1 | Build-time compile; 0 KB extra client JS for server-rendered MDX |
| `lucide-react` (optional) | runtime | A consistent, tree-shaken icon set rendered as inline SVG in Server Components | Hand-drawn SVGs (acceptable fallback) | 0 KB client JS when used in RSC; only the imported icons are bundled |
| `tailwindcss`, `@tailwindcss/postcss` | dev | Required styling system (brief); tokens via `@theme` | — | CSS only, purged at build |
| `typescript`, `@types/node`, `@types/react`, `@types/react-dom` | dev | Strict typing (constitution) | — | None at runtime |
| `eslint`, `eslint-config-next`, `eslint-plugin-jsx-a11y` (bundled with next config) | dev | Lint gate | — | None |
| `prettier`, `prettier-plugin-tailwindcss` | dev | Formatting gate; consistent class order that makes token misuse visible in review | — | None |
| `vitest` | dev | Unit tests and the integrity suite (fast, ESM, TypeScript native) | `node:test` (weaker DX and mocking) | None |
| `@playwright/test`, `@axe-core/playwright` | dev | e2e, responsive, keyboard, and accessibility gates | — | None |
| `@lhci/cli` | dev | Automated Lighthouse budgets (constitution III gate) | Manual Lighthouse runs (not enforceable) | None |
| `server-only` | runtime (tiny) | Build error if server modules are imported client-side (secret safety) | — | 0 KB |

**Rejected**: Framer Motion or GSAP (CSS covers the need), UI kits or Radix (native HTML covers
the need), react-hook-form (native constraints plus a Server Action), `clsx` or `tailwind-merge`
(a local `cx`), `next-seo` (Metadata API), date-fns or dayjs (`Intl`), a CMS (AD-03), Redux,
Zustand, or other state managers (no shared client state), Contentlayer (unmaintained), Upstash
(AD-18), and reCAPTCHA (AD-18).

## Implementation Phases

The brief's recommended order has been **adjusted in two places**, and the reasons are given
below. Phases are sized so `/speckit-tasks` can break each into dependency-ordered tasks.

1. **Forms moved from Phase 11 to Phase 3**. The consultation form is P1 (US2), and Contact,
   Home, and every template CTA depend on it. Building it late would leave the MVP without a
   conversion path.
2. **SEO foundations (`buildMetadata`, site URL, root metadata) moved into Phase 1**. Every page
   built from Phase 2 onward needs them. Phase 10 then completes structured data, the sitemap, OG
   images, and redirects.

| Phase | Name | Scope (what gets built) | Depends on | Exit criteria |
|---|---|---|---|---|
| **1** | Foundation & design system | Scaffold Next.js (TypeScript strict, `src/`, App Router), Tailwind v4 tokens (`globals.css @theme`), fonts, ESLint and Prettier, Vitest and Playwright configs, CI workflow skeleton, `.env.example`, `lib/utils/env.ts`, `cx`; **content types** (`types/content.ts`) and the **repository skeleton** with the published filter; `buildMetadata` and root metadata; UI primitives (Button, ButtonLink, Card, Badge, SectionHeading, Container, Section, Icon, Field, Input, Select, Textarea); integrity test harness | — | `npm run check` passes on an empty home; primitives render on all 4 surfaces with passing contrast (axe) |
| **2** | Global layout, navigation & footer | Root layout (landmarks, SkipLink), Header, DesktopNav, NavMenu, MobileNav (popover), Footer, Breadcrumbs, `navigation.ts` (derived menus), `site.ts` (with no invented values), `not-found`, `error`, `global-error` | 1 | Keyboard and axe pass on the shell; mobile menu e2e; 404 renders |
| **3** | Consultation form & lead delivery | `form-options.ts` (derived), `fields.ts`, Zod schema, spam and timestamp signing, rate limiter, idempotency, delivery adapters (email, webhook, console) plus the selector, the `submitConsultation` Server Action, `ConsultationForm` (states, a11y, pre-selection, fallback contacts), FormSuccess and FormError, the `/contact` page shell with `#consultation` | 1, 2 | The [consultation contract](./contracts/consultation-action.md) and [delivery contract](./contracts/lead-delivery.md) are fully tested (unit and e2e, including no-JS) |
| **4** | Homepage **(MVP complete after this phase)** | All home sections and gating rules, `DashboardPreview`, `JourneyDiagram`, card components (ServiceCard, IndustryCard, PortfolioCard, ProcessStep, StatCard, TestimonialCard), home copy (`home.ts`, `digitalization.ts`, `process.ts`, `why.ts`), **summary-level** entries for solutions, marketing, industries, and projects (cards link only to published pages) | 2, 3 | Quickstart V1 passes; Lighthouse home ≥ 90; proof sections hidden with empty data |
| **5** | Solutions | Solutions hub, `SolutionTemplate`, shared sections (PageHero, ChallengeList, FeatureGrid, BenefitList, RelatedLinks, RelatedProjects, CtaBanner), full content for 5 solutions (draft, then published after review), `generateStaticParams` and `generateMetadata` | 4 (cards and shared sections) | Quickstart V3; integrity passes |
| **6** | Industries | Industries hub, `IndustryTemplate`, `WorkflowList`, content for 8 industries with Manufacturing first, similarity rule enabled | 5 (reuses shared sections; links to solutions) | Quickstart V2; FR-042 similarity passes |
| **7** | Portfolio & case studies | Portfolio index, `ProjectTemplate`, `ProjectTypeBadge`, `ScreenshotGallery`, `PortfolioFilter` (active when more than 6 projects), CaseStudyCard, content for 3 projects (concept by default), screenshot assets | 4; content input: screenshots | Quickstart V4; concept rules pass |
| **8** | Digital Marketing | Marketing hub, `MarketingServiceTemplate`, content for 4 pages plus the Digital Strategy hub entry | 5 (shared sections) | Quickstart V5; no-guarantee rule passes |
| **9** | About & Contact | About page (content-gated subsections), full Contact page (details block, socials, location), Privacy Policy page (MDX) | 3, 5 | Quickstart V6; only provided details render |
| **10** | Blog | MDX setup (`@next/mdx`, `mdx-components.tsx`), posts index module, categories, blog index, category pages, `ArticleTemplate`, related posts, gating (routes, navigation, sitemap) | 5, 6 (related links) | Quickstart V7 in both the zero-post and one-post states |
| **11** | SEO completion & structured data | `sitemap.ts`, `robots.ts` (by environment), JSON-LD builders and `JsonLd` on all templates, per-entry `opengraph-image.tsx`, redirects from content, Search Console verification variable, internal-link audit | 5 to 10 | SEO e2e and link-crawl e2e pass; JSON-LD unit tests pass |
| **12** | Analytics readiness, performance & accessibility hardening | Analytics events module, `data-track` attributes, TrackClicks and AnalyticsScripts (off by default), motion utilities (scroll-driven reveals under guards), security headers and CSP, image `sizes` audit, bundle budget check, font audit, manual screen-reader fixes | 4 to 11 | Lighthouse CI and JS budget pass on all key templates; axe clean; reduced-motion e2e passes |
| **13** | Testing, content audit & launch QA | Complete the e2e matrix, cross-browser runs, real-device checks, Design Quality Gate review per page, content integrity audit (no placeholders or unverified claims), live form test to the real destinations, Vercel production configuration (environment variables, domain, WAF rule), launch checklist | All | All constitution Technical Gates 1 to 7 and the Design Quality Gate pass; the launch blockers are resolved |

### Phase dependency graph

```text
1 ─▶ 2 ─▶ 3 ─▶ 4 ─┬─▶ 5 ─┬─▶ 6 ─┐
                  │      ├─▶ 8  ├─▶ 10 ─▶ 11 ─▶ 12 ─▶ 13
                  │      └─▶ 9 ─┤
                  └─▶ 7 ────────┘
```

- **Parallelizable after Phase 5**: 6, 8, and 9 (different content and templates, shared
  sections already built). Phase 7 can run in parallel with 5 once Phase 4's cards exist.
- **Content workstream (parallel to all phases)**: drafting copy for each entry (status
  `draft`) → U Design review → `published`. Business inputs (logos, contact details,
  screenshots, Privacy Policy, budget ranges) arrive asynchronously. The gating rules mean their
  absence never blocks a build; it hides the dependent sections.
- **MVP release option**: Phases 1 to 4 plus the Privacy Policy and a minimal Phase 11 subset
  (sitemap, robots, Organization JSON-LD) can go live as the first release. Later phases add pages
  without restructuring.

## Requirements Traceability

Each spec functional requirement is mapped to its implementation approach and phase.

| Spec requirements | Implementation approach | Phase |
|---|---|---|
| FR-001 to FR-003 Navigation, persistent CTA, mobile menu | Header, DesktopNav, NavMenu, MobileNav (popover, AD-15), derived menus | 2 |
| FR-004, FR-005 CTA presence and approved labels | `CtaLabel` union type; PageHero and CtaBanner in every template; integrity rule 7 | 1, 4 to 9 |
| FR-006 Footer | Footer with derived groups and SiteProfile contact block | 2 |
| FR-007 404 | `not-found.tsx` | 2 |
| FR-008 Breadcrumbs | `Breadcrumbs` plus the BreadcrumbList builder | 2, 11 |
| FR-010, FR-011 Hero copy and visual | `Hero`, `DashboardPreview` (AD-05) | 4 |
| FR-012 Trust logos (real only) | `TrustLogos` gated by `permissionConfirmed` | 4 |
| FR-013 Two service groups | `ServicesOverview` | 4 |
| FR-014 Industries section | `IndustriesGrid` | 4 |
| FR-015 Software showcase | `FeaturedProjects`, `PortfolioCard`, type badge | 4, 7 |
| FR-016 Spreadsheets journey | `DigitalizationJourney`, `JourneyDiagram` | 4 |
| FR-017 Six-step process | `ProcessSteps` (`process.ts`) | 4 |
| FR-018 Marketing section | `MarketingOverview` | 4 |
| FR-019 Why U Design | `WhyUDesign` (`why.ts`) | 4 |
| FR-020 Closing CTA | `FinalCta` | 4 |
| FR-030 to FR-032 Solutions | Hub plus `SolutionTemplate` plus the Solution schema | 5 |
| FR-040 to FR-043 Industries | Hub plus `IndustryTemplate`; `priority`; similarity rule | 6 |
| FR-050 to FR-054 Portfolio | Index, `ProjectTemplate`, discriminated `Project` union, `ScreenshotGallery`, `PortfolioFilter` | 7 |
| FR-060, FR-061 Digital Marketing | Hub plus `MarketingServiceTemplate`; no-guarantee rule (AD-02 note on subpages) | 8 |
| FR-070 to FR-072 About and Contact | About sections; Contact details block with `mailto:` and `tel:` | 9 |
| FR-080 to FR-088 Consultation form | AD-07, AD-18; [consultation contract](./contracts/consultation-action.md); [delivery contract](./contracts/lead-delivery.md) | 3 |
| FR-090 to FR-092 Blog | AD-08; gating | 10 |
| FR-100 to FR-104 SEO and sharing | AD-04, AD-13; [routes contract](./contracts/routes-and-seo.md) | 1, 11 |
| FR-110 Content integrity | Type system plus integrity suite plus render gates | 1 onward, 13 |
| FR-111 Privacy Policy | MDX page; launch blocker | 9 |
| FR-112 Analytics and consent | AD-09; [analytics contract](./contracts/analytics-events.md) | 12 |
| FR-120 Responsive | [Responsive Strategy](#responsive-strategy); overflow e2e | All, 12 |
| FR-121 WCAG 2.2 AA | [Accessibility Strategy](#accessibility-strategy); axe | All, 12 |
| FR-122 Performance and motion | AD-12, AD-16; Lighthouse CI | All, 12 |
| FR-123 Visual system | [Design System](#design-system) | 1 onward |
| FR-124 Copy tone | [Content Implementation Rules](#content-implementation-rules); buzzword rule | All |
| FR-130 Launch scope | Published-only route generation (research R-2) | 2 onward |
| Spec edge cases | Missing content → gating; concept labels → union type; unlisted industry → "Other" option plus hub note; form failure, duplicates, spam → AD-07, AD-18; no-JS → progressive enhancement; small screens → responsive e2e; reduced motion → AD-16; unknown URL → 404 plus redirects; shared links → OG images; missing screenshots → publish rule 5 | Various |
| SC-001 to SC-013 | SC-003 to SC-010 and SC-013 are verified by the automated gates above. SC-001, SC-002, and SC-011 need a moderated user test (5 to 8 target-audience participants) before launch. SC-012 needs analytics or a CRM baseline after launch. | 13, post-launch |

**Result**: every functional requirement, edge case, and success criterion maps to an approach and
a phase.

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Business content inputs (logos, screenshots, contact details, Privacy Policy) arrive late | Sections missing; launch delayed | Gating hides sections cleanly. Launch blockers are limited to the Privacy Policy, one contact channel, the logo, and lead delivery. The content tracker starts in Phase 1. |
| Industry pages become generic | Principle X violation; thin SEO | Schema requires specific fields, the similarity test, U Design review, and Manufacturing written first as the reference quality |
| Deep Green token not approved | Hero design rework | Decide in Phase 1 (Q-1). The fallback is an ink hero with brand-green-dark accent shapes, with no normal text on `#008A2E`. |
| Performance regression as sections grow | Principle III violation | CI Lighthouse and JS budgets block the merge; no raster hero; client islands listed and reviewed |
| Spam floods the inbox | Lost real leads | Layered defenses; Turnstile ready behind a flag; WAF rule |
| Email deliverability (leads land in spam) | Lost leads | Verified sender domain (SPF, DKIM, DMARC); `email+webhook` redundancy; live test at launch |
| Next.js major version API shifts (e.g., image `priority` vs `preload`, linting commands) | Build or config churn | Pin exact versions; follow the installed version's docs; upgrade deliberately with the CI gate |
| CSS scroll-driven animation support varies | Inconsistent motion | Progressive enhancement: content is visible by default and motion only where supported |
| Legal and consent obligations unknown (jurisdiction) | Compliance gap when analytics is added | Analytics off by default; consent banner decision required before enabling (Q-5) |
| Visual reference image not in the repository | Design drift from expectations | Obtain it before Phase 4 (Q-2); tokens and components follow the documented rules meanwhile |
| Drafted copy mistaken for approved | Unverified claims shipped | `status: "draft"` default; integrity rules; pre-launch audit (Phase 13) |

## Open Questions / Clarifications

None of these block `/speckit-tasks`. Each is tied to the phase that needs the answer.

| # | Question | Needed by | Default if unanswered |
|---|---|---|---|
| Q-1 | Approve **Deep Green `#003D1A`** as the dark hero and CTA surface (the constitution forbids normal text on `#008A2E`)? | Phase 1 | Use an ink `#0B0B0B` hero with dark-green accent shapes |
| Q-2 | Provide the approved U Design **visual reference image** and **logo files** (SVG) | Phase 1 (logo), Phase 4 (reference) | Build to the documented tokens; logo is a launch blocker |
| Q-3 | Lead delivery: recipient inbox, email provider account, optional webhook target (CRM or Sheet) | Phase 3 (dev uses `console`), Phase 13 (live) | `email` only |
| Q-4 | Confirm the **showcase projects' status** (concept/demo or client) | Phase 7 | All `concept` |
| Q-5 | Analytics: which provider(s) and the consent approach (depends on target markets) | Phase 12 | Analytics stays off |
| Q-6 | Budget ranges and currency for the form | Phase 3 | Budget field hidden |
| Q-7 | Contact details, socials, location, response-time statement, About content | Phase 9 | Omitted or generic, per spec |
| Q-8 | Privacy Policy text (or approval of a draft for legal review) | Phase 9 | **Launch blocker** |
| Q-9 | Production domain name | Phase 11 | Placeholder in `.env.example` only |

## Complexity Tracking

> Justified deviations from the constitution, as required by the governance rules.

| Deviation | Why needed | Simpler alternative rejected because |
|---|---|---|
| New color token `green-deep #003D1A` (Principle VII: palette only) | Functional: the brief requires a dark green hero, and Principle V forbids normal-size text on `#008A2E` (4.49:1). `#003D1A` is a shade of the brand green that gives 12.48:1 for white text. | Using `#008A2E` fails AA for body text. A pure ink hero loses the required green identity. **Pending approval (Q-1).** |
| Functional neutrals `ink-muted #555555`, `line #E4E6EB`, `control-border #767676` and status `danger #B42318` | Functional: secondary text hierarchy, non-text contrast for input borders (WCAG 1.4.11), and error states. The constitution allows colors for a "documented functional need". | Opacity-derived ink tints give unpredictable contrast across surfaces. Using brand greens for errors would confuse meaning and fail contrast. |
| CSP `script-src 'unsafe-inline'` | Nonce-based CSP forces dynamic rendering of every page, which breaks the full-SSG performance architecture (Principle III) | Nonces are rejected because of the performance cost. Mitigated by no user-generated HTML, escaped JSON-LD, and strict `object-src`, `base-uri`, `form-action`, and `frame-ancestors`. |
| `LeadDeliveryAdapter` abstraction (Principle "simple over abstract") | The brief requires the email or API provider to be configurable, and FR-086 requires redundancy against silent loss | A hard-coded single provider cannot meet the configurability or redundancy requirements. The abstraction is one interface and three small adapters. |
| Four client components (Principle III: minimal client JS) | ConsultationForm (form states), PortfolioFilter (filtering, only when more than 6 projects), TrackClicks and AnalyticsScripts (only when analytics is configured) | Each is the smallest island for a real interaction. Navigation, menus, motion, and galleries are JS-free. |
