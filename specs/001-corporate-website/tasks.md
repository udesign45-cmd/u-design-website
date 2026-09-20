---

description: "Implementation task list for the U Design corporate website"
---

# Tasks: U Design Corporate Website

**Input**: Design documents from `specs/001-corporate-website/`: [plan.md](./plan.md), [spec.md](./spec.md),
[research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/),
[quickstart.md](./quickstart.md), and the constitution v2.0.0 (`.specify/memory/constitution.md`)

**Prerequisites**: All design documents are complete. No application code exists yet.

**Tests**: Requested explicitly in the `/speckit-tasks` brief (§34) and required by the constitution
quality gates. Test tasks are included: unit tests where the logic is created, and end-to-end,
accessibility, SEO, and performance suites in Phase 17.

**Organization**: This file follows the brief's 18 technical phases. Story phases carry `[USn]`
labels that map to the spec's user stories, so each story remains independently testable:

| Story | Spec title | Story priority | Phase |
|---|---|---|---|
| US1 | Understand U Design and request a consultation from the home page | P1 🎯 | 7 |
| US2 | Submit a consultation request | P1 🎯 | 6 |
| US3 | Explore my industry | P2 | 9 |
| US4 | Explore software solutions | P2 | 8 |
| US5 | Review proof of capability in the portfolio | P2 | 10 |
| US6 | Explore digital marketing services | P3 | 11 |
| US7 | Evaluate U Design as a company (About and Contact) | P3 | 12 |
| US8 | Find and read helpful articles (Blog) | P3 | 13 |

## Format

Every task is a checklist line followed by its detail block:

```text
- [ ] T### [P?] [US#?] Title with primary file path(s)
  - Meta: task priority · Depends on · Parallel with · Spec refs · Plan refs
  - Do: description (what to build, with exact constraints)
  - Outcome: the expected result
  - Accept: testable acceptance criteria
```

- **[P]**: can run in parallel. It touches different files and has no dependency on an
  incomplete task. **[USn]**: user story label (story phases only).
- **Task priority** (P0 to P3) is separate from the spec's story priorities. **P0** is a critical
  foundation task or blocker, **P1** is core website functionality, **P2** is an important
  enhancement, and **P3** is optional.
- **Spec refs** use the spec IDs (FR-###, SC-###, US#). Where no FR applies, **Const** cites a
  constitution principle or section. **Plan refs** cite plan sections or research decisions
  (AD-##).

## Phase order vs. the brief's recommended order

The brief's phase names are kept. Three phases are **moved earlier** so that no task depends on
something not yet built (brief §4):

| Brief position | Final position | Reason |
|---|---|---|
| 5 Content/Data | **3** | The Header and Footer (Global Layout) need `navigation.ts` and `site.ts`. The cards (Reusable Components) need the content types. |
| 3 Global Layout | 4 | Follows Content/Data. The Header needs the Button from Design System (brief §6 lists Buttons under Design System). |
| 14 Forms & Conversion | **6** | US2 is a P1 story. The Contact page (Phase 12) and every "Get Free Consultation" CTA on the Homepage (Phase 7) link to the form. This matches plan phase 3. |

Also: the metadata utility (`buildMetadata`) is created in Phase 4 because every page needs root
metadata. The **per-page** metadata tasks stay in Phase 14 SEO, as the brief requests (§37).
Responsive tasks (§31) are grouped with Accessibility in Phase 16. Animation (§32) and analytics
readiness are grouped with Performance in Phase 15.

## Conventions used by all tasks

- **Paths**: a single Next.js project at the repository root, with the `src/` layout from
  [plan.md › Project Structure](./plan.md#project-structure).
- **Server Components by default.** `"use client"` is allowed **only** in
  `src/components/forms/ConsultationForm.tsx`, `src/components/portfolio/PortfolioFilter.tsx`,
  `src/components/analytics/TrackClicks.tsx`, and `src/components/analytics/AnalyticsScripts.tsx`
  (plan AD-06), plus the framework-required error boundaries `src/app/error.tsx` and
  `src/app/global-error.tsx` (T052). T179 enforces this with a test.
- **Styling uses tokens only.** No arbitrary Tailwind values (`[#…]`, `[13px]`) without a
  comment that references a plan note (constitution VII).
- **Content integrity.** Never invent client names, logos, testimonials, statistics, results,
  awards, contact details, or company history (constitution II). Drafted copy is committed with
  `status: "draft"`. Only U Design approval (T222) changes it to `"published"`.
- **Draft visibility.** Draft entries render when `NODE_ENV !== "production"` **or**
  `CONTENT_INCLUDE_DRAFTS === "true"`. The latter is used by the e2e suite and Preview
  deployments. Production (`VERCEL_ENV=production`) never shows drafts. This implements plan
  AD-02 ("Drafts stay out of routes… in production").
- **Business inputs** that are missing (logo, contact details, screenshots, Privacy Policy text,
  budget ranges) never block a build. Dependent sections stay hidden (spec Missing Information
  table). Launch blockers are checked by T219.

---

## Phase 1: Foundation (Setup)

**Purpose**: Initialize a runnable, linted, typed, testable Next.js project with minimal
dependencies.

- [X] T001 Initialize the git repository and create the root `.gitignore`
  - Meta: P0 · Depends on: — · Parallel with: — · Const: Tech & Quality Standards › Security · Plan: AD-10
  - Do: Run `git init` at the repository root (do not commit). Create `.gitignore` covering
    `node_modules/`, `.next/`, `out/`, `coverage/`, `playwright-report/`, `test-results/`,
    `.lighthouseci/`, `.vercel/`, `.env*.local`, `.env`, `*.tsbuildinfo`, and `.DS_Store`. Keep
    `.claude/`, `.specify/`, and `specs/` tracked, but ignore `.claude/settings.local.json`
    (constitution recommendation).
  - Outcome: A git-ready repository in which no secrets or build output can be tracked.
  - Accept: `git status` shows no `.next/` or `.env.local` entries after T016. `git check-ignore .env.local` exits 0.

- [X] T002 Create `package.json`, `.nvmrc`, and install the core runtime dependencies
  - Meta: P0 · Depends on: T001 · Parallel with: — · Const: Tech Stack · Plan: Technical Context, Dependency Decisions, AD-11
  - Do: Initialize the project **manually**. Do not use `create-next-app`, which rejects non-empty
    directories (`.claude/`, `.specify/`, `specs/` exist) and adds template files. Create
    `package.json` with `"private": true`, `"type": "module"`, and `"engines": { "node": ">=22" }`.
    Add `.nvmrc` containing `24`. Install **exact-pinned** latest stable `next`, `react`,
    `react-dom` and dev dependencies `typescript`, `@types/node`, `@types/react`,
    `@types/react-dom` (`npm install --save-exact`). Add scripts `dev` (`next dev`), `build`
    (`next build`), `start` (`next start`).
  - Outcome: Dependencies are installed, with a lockfile committed-ready.
  - Accept: `npm ls next react react-dom` resolves. `package.json` has no caret or tilde ranges. No
    packages other than those listed are installed.

- [X] T003 Configure strict TypeScript in `tsconfig.json`
  - Meta: P0 · Depends on: T002 · Parallel with: T004, T005 · Const: Tech Stack (strict mode) · Plan: Technical Context
  - Do: Configure `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`,
    `forceConsistentCasingInFileNames: true`, `moduleResolution: "bundler"`, `jsx: "preserve"`,
    `paths: { "@/*": ["./src/*"] }`, the `next` plugin, and `include` for `next-env.d.ts`,
    `src/**/*`, `tests/**/*`, and `*.ts`.
  - Outcome: Strict type checking with the `@/` alias.
  - Accept: `npx tsc --noEmit` passes after T006. An import via `@/` resolves.

- [X] T004 Create the baseline `next.config.ts`
  - Meta: P0 · Depends on: T002 · Parallel with: T003, T005 · Spec: FR-122 · Plan: AD-01, AD-05
  - Do: Export a typed `NextConfig` with `reactStrictMode: true`, `poweredByHeader: false`, and
    `images: { formats: ["image/avif", "image/webp"] }`. Leave placeholders (comments) for
    `headers()` (T011), `redirects()` (T036), and MDX wrapping (T139).
  - Outcome: A production-ready config shell.
  - Accept: `npm run build` uses the config (after T006). No `X-Powered-By` header is returned by `npm start`.

- [X] T005 Install Tailwind CSS v4 with PostCSS and create `src/styles/globals.css`
  - Meta: P0 · Depends on: T002 · Parallel with: T003, T004 · Const: Tech Stack › Styling · Plan: AD-14, Dependency Decisions
  - Do: Install dev dependencies `tailwindcss`, `@tailwindcss/postcss`, and `postcss` (exact).
    Create `postcss.config.mjs` with the `@tailwindcss/postcss` plugin. Create
    `src/styles/globals.css` starting with `@import "tailwindcss";` and an empty `@theme {}`
    block (filled in Phase 2).
  - Outcome: Tailwind utilities are available.
  - Accept: A utility class used in T006 renders styled output in `npm run dev`.

- [X] T006 Create the minimal root layout and a temporary home route in `src/app/layout.tsx` and `src/app/page.tsx`
  - Meta: P0 · Depends on: T003, T004, T005 · Parallel with: — · Const: Tech Stack · Plan: Project Structure
  - Do: `layout.tsx` renders `<html lang="en">` and `<body>` and imports `@/styles/globals.css`.
    `page.tsx` renders a single `<h1>U Design</h1>` placeholder that T097 replaces.
  - Outcome: The app boots.
  - Accept: `npm run dev` serves http://localhost:3000 with the heading, and `npm run build` succeeds.

- [X] T007 Configure ESLint (flat config) in `eslint.config.mjs`
  - Meta: P0 · Depends on: T006 · Parallel with: T008 · Const: Code Quality · Plan: Testing Strategy (Static), Dependency Decisions
  - Do: Install `eslint` and `eslint-config-next` (exact). Extend the Next.js **core-web-vitals** and
    **typescript** flat presets (these include `jsx-a11y` rules). Add rules:
    `@typescript-eslint/no-explicit-any: "error"`, `no-console: ["error", { allow: ["warn", "error"] }]`,
    and `@typescript-eslint/no-unused-vars: "error"`. Ignore `.next/`, `coverage/`,
    `playwright-report/`, and `.lighthouseci/`.
  - Outcome: A lint gate is available.
  - Accept: `npx eslint . --max-warnings=0` passes. Adding `const x: any = 1` makes it fail.

- [X] T008 [P] Configure Prettier in `.prettierrc` and `.prettierignore`
  - Meta: P1 · Depends on: T006 · Parallel with: T007 · Const: Code Quality · Plan: Dependency Decisions
  - Do: Install `prettier` and `prettier-plugin-tailwindcss` (exact). Configure `printWidth: 100`,
    `singleQuote: false`, `trailingComma: "all"`, and the plugin with
    `tailwindStylesheet: "./src/styles/globals.css"`. Ignore build and report folders and `specs/`.
  - Outcome: Consistent formatting and class ordering.
  - Accept: `npx prettier --check .` passes.

- [X] T009 Add quality scripts to `package.json`
  - Meta: P0 · Depends on: T007, T008 · Parallel with: — · Const: Development Workflow & Quality Gates (gate 1) · Plan: quickstart › Scripts
  - Do: Add `lint` (`eslint . --max-warnings=0`), `typecheck` (`tsc --noEmit`), `format`
    (`prettier --write .`), `format:check` (`prettier --check .`), and `check`
    (`npm run lint && npm run typecheck && npm test && npm run build`). The `test` script is added in T013.
  - Outcome: One command runs the local quality gate.
  - Accept: `npm run lint` and `npm run typecheck` both exit 0.

- [X] T010 Create the environment variable structure in `.env.example`, `src/lib/utils/env.server.ts`, and `src/lib/utils/env.public.ts`
  - Meta: P0 · Depends on: T003 · Parallel with: T007, T008 · Spec: FR-086 · Const: Security & Data Handling · Plan: Security Considerations, quickstart › Environment variables
  - Do: Install `server-only` (exact). `.env.example` lists every variable from the quickstart table
    with comments, plus the test and dev overrides `CONTENT_INCLUDE_DRAFTS` (default `false`),
    `FORM_MIN_FILL_MS` (default `3000`), and `FORM_RATE_LIMIT_MAX` (default `5`). No real values.
    `NEXT_PUBLIC_SITE_URL` uses a placeholder comment ("replace with production domain, Q-9").
    `env.server.ts` starts with `import "server-only"` and exports typed getters for server
    variables. Required variables throw a descriptive error when read if missing.
    `env.public.ts` exports `siteUrl`, `siteEnv` (`VERCEL_ENV` or `"development"`), `gaId?`, and
    `metaPixelId?`. Secrets are never prefixed `NEXT_PUBLIC_`.
  - Outcome: Typed, validated environment access with secrets confined to the server.
  - Accept: Importing `env.server.ts` from a client component fails the build. `.env.example`
    contains no secret values. `npm run typecheck` passes.

- [X] T011 Add security headers in `next.config.ts` `headers()`
  - Meta: P1 · Depends on: T004 · Parallel with: T010, T012 · Const: Security & Data Handling · Plan: AD-19, Complexity Tracking (CSP)
  - Do: Apply to `/(.*)`: `X-Content-Type-Options: nosniff`,
    `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`,
    `Permissions-Policy: camera=(), microphone=(), geolocation=()`, and a
    `Content-Security-Policy` built by a helper `buildCsp()` in the same file:
    `default-src 'self'; script-src 'self' 'unsafe-inline'` (plus `'unsafe-eval'` only when
    `NODE_ENV === "development"`); `style-src 'self' 'unsafe-inline'`;
    `img-src 'self' data: blob:`; `font-src 'self'`; `connect-src 'self'`; `object-src 'none'`;
    `base-uri 'self'`; `form-action 'self'`; `frame-ancestors 'none'`. Leave an extension point
    for analytics and Turnstile domains (T189).
  - Outcome: Hardened responses that stay compatible with static rendering.
  - Accept: `curl -I` against `npm start` shows all five headers. The dev server works with no CSP console errors.

- [X] T012 [P] Create class-name and date utilities in `src/lib/utils/cx.ts` and `src/lib/utils/format-date.ts`
  - Meta: P1 · Depends on: T003 · Parallel with: T010, T011 · Const: Code Quality (minimal dependencies) · Plan: AD-11 (no clsx or tailwind-merge, no date libraries)
  - Do: `cx(...values: (string | false | null | undefined)[]): string` joins the truthy values.
    `formatDate(iso: string): string` uses `Intl.DateTimeFormat("en", { dateStyle: "long" })`.
  - Outcome: Tiny local helpers instead of dependencies.
  - Accept: Covered by unit tests in T013's smoke suite.

- [X] T013 Set up Vitest in `vitest.config.ts` and `tests/unit/utils.test.ts`
  - Meta: P0 · Depends on: T009, T012 · Parallel with: T014 · Const: Quality Gates · Plan: AD-17
  - Do: Install `vitest` (exact). Configure the `node` environment, the `@/` alias, and
    `include: ["tests/unit/**/*.test.ts"]`. Add a `test` script (`vitest run`) and `test:watch`.
    Write tests for `cx` and `formatDate`.
  - Outcome: A unit test runner is available.
  - Accept: `npm test` passes with at least 2 tests.

- [X] T014 [P] Set up Playwright in `playwright.config.ts` and `tests/e2e/smoke.spec.ts`
  - Meta: P0 · Depends on: T009 · Parallel with: T013 · Const: Quality Gates · Plan: AD-17, Testing Strategy
  - Do: Install `@playwright/test` (exact) and browsers (`npx playwright install chromium webkit`).
    Configure projects `chromium-desktop` (1440×900), `chromium-mobile` (Pixel 7), and
    `webkit-mobile` (iPhone 14). Configure `webServer` with `npm run build && npm start` on port
    3000, `reuseExistingServer: !process.env.CI`, and env `CONTENT_INCLUDE_DRAFTS=true`,
    `NEXT_PUBLIC_SITE_URL=http://localhost:3000`, `FORM_SIGNING_SECRET=test-secret`,
    `FORM_MIN_FILL_MS=0`, `FORM_RATE_LIMIT_MAX=1000`, `LEAD_DELIVERY_PROVIDER=console`. Add the
    `test:e2e` script. The smoke test loads `/` and asserts status 200.
  - Outcome: An e2e runner is available against the production build.
  - Accept: `npm run test:e2e` passes on all 3 projects.

- [X] T015 Create the CI workflow in `.github/workflows/ci.yml`
  - Meta: P1 · Depends on: T013, T014 · Parallel with: — · Const: Development Workflow & Quality Gates · Plan: AD-10, Deployment Strategy
  - Do: Trigger on pull requests and pushes to `main`. Use Node from `.nvmrc`, `npm ci`, and a
    cached `~/.npm`. Steps: `npm run lint` → `npm run typecheck` → `npm test` → `npm run build` →
    `npx playwright install --with-deps chromium webkit` → `npm run test:e2e`. Upload the
    Playwright report on failure. Lighthouse CI is added in T180. Add `npm audit --audit-level=high`
    as a non-blocking step.
  - Outcome: Automated gates on every change.
  - Accept: The workflow YAML validates (`actionlint`, if available, or a GitHub dry run) and
    runs green once the repository is pushed.

- [X] T016 Verify the foundation checkpoint in `specs/001-corporate-website/quickstart.md` (Scripts section)
  - Meta: P0 · Depends on: T001–T015 · Parallel with: — · Const: Quality Gates 1 · Plan: Implementation Phases › Phase 1 exit
  - Do: Run `npm run check` and `npm run test:e2e`. Start `npm run dev` and load `/`. Confirm that
    the dependencies in `package.json` match the Dependency Decisions table (nothing extra).
  - Outcome: A verified foundation.
  - Accept: All commands exit 0. The dependency list matches the plan table.

**Checkpoint**: The project runs locally, and TypeScript, lint, unit, e2e smoke, and build all pass.

---

## Phase 2: Design System (Foundational)

**Purpose**: One token source plus core primitives (Buttons, Container, Section) that every later
task consumes. **⚠️ Blocks all UI work.**

- [X] T017 Define color tokens and surface variables in `src/styles/globals.css`
  - Meta: P0 · Depends on: T005 · Parallel with: — · Spec: FR-121, FR-123 · Const: VII (palette), V (contrast) · Plan: Design System › Color tokens, AD-14, Complexity Tracking
  - Do: In `@theme`, define `--color-brand-green: #00D84A`, `--color-brand-green-dark: #008A2E`,
    `--color-green-deep: #003D1A` (comment: "pending approval Q-1"), `--color-ink: #0B0B0B`,
    `--color-white: #FFFFFF`, `--color-surface-gray: #F7F8FA`, `--color-ink-muted: #555555`,
    `--color-line: #E4E6EB`, `--color-control-border: #767676`, and `--color-danger: #B42318`.
    Reset Tailwind's default palette (`--color-*: initial;`) before these so **no other colors
    exist**. Define surface classes `.surface-white`, `.surface-gray`, `.surface-ink`, and
    `.surface-deep` that set `--surface-bg`, `--surface-fg`, `--surface-fg-muted`, and
    `--focus-ring` per the plan rules. Focus ring: `brand-green-dark` on light surfaces and
    `brand-green` on ink and deep. `.surface-deep` uses `var(--color-green-deep)` through a single
    variable `--surface-deep-bg`, so rejecting Q-1 means changing one line to `ink`.
  - Outcome: The only colors available in the codebase are the approved ones.
  - Accept: `bg-red-500` produces no CSS. `bg-brand-green` works. The contrast test (T026) passes.

- [X] T018 Configure the Poppins and Inter fonts in `src/app/fonts.ts` and apply them in `src/app/layout.tsx`
  - Meta: P0 · Depends on: T017 · Parallel with: — · Spec: FR-123 · Const: VII (typography, ≤ 3 weights) · Plan: Design System › Typography, AD-12
  - Do: Use `next/font/google`: `Poppins({ weight: ["600", "700"], subsets: ["latin"], display: "swap", variable: "--font-heading" })`
    and `Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" })` (variable
    font, weights 400/500/600 used). Add both variables to `<html className>`. In `@theme`, map
    `--font-heading` and `--font-sans`, and set body to `font-sans`.
  - Outcome: Self-hosted fonts with no layout shift from font swapping.
  - Accept: The built HTML has no requests to `fonts.googleapis.com` at runtime. Only Poppins
    600/700 and one Inter variable file are downloaded.

- [X] T019 Define the typography scale and base text styles in `src/styles/globals.css`
  - Meta: P0 · Depends on: T018 · Parallel with: — · Spec: FR-123 · Const: VI (≥ 16px body on mobile), VII · Plan: Design System › Typography
  - Do: Add `@theme` font-size tokens with `clamp()` exactly as in the plan table: `text-display`
    36/44 → 60/68, `text-h1` 32/40 → 48/56, `text-h2` 26/34 → 38/46, `text-h3` 20/28 → 24/32,
    `text-h4` 18/26 → 20/28, `text-lead` 18/30 → 20/32, `text-body` 16/26, `text-small` 14/22,
    and `text-eyebrow` 13/16 (uppercase, `tracking 0.12em`, Inter 600). The base layer sets
    headings to `font-heading` weight 700 (h1, h2) or 600 (h3, h4) and `color: var(--surface-fg)`.
    It also adds a `.prose-udesign` class for MDX and legal text (narrow measure, spacing, link
    underline style).
  - Outcome: Consistent fluid type.
  - Accept: At 320px no text is below 16px except `text-small` and the eyebrow. Headings render
    in Poppins and body text in Inter.

- [X] T020 Define spacing, container, radius, shadow, breakpoint, motion, and z-index tokens in `src/styles/globals.css`
  - Meta: P0 · Depends on: T017 · Parallel with: T018, T019 (same file, so apply sequentially) · Spec: FR-120, FR-123 · Const: VI, VII, VIII · Plan: Design System › Other tokens
  - Do: `--spacing-section-y` 64px, then 96px at `md`, then 128px at `xl` (through a utility
    `py-section`). Container max 1200px plus gutters of 16, 24, and 32px. `--container-narrow`
    720px. Radii: `--radius-control` 12px, `--radius-card` 16px, `--radius-panel` 24px,
    `--radius-pill` 9999px. Shadows: `--shadow-card`, `--shadow-raised`, and `--shadow-panel`
    (ink at low opacity, no colored glow). Breakpoints `sm` 640, `md` 768, `lg` 1024, `xl` 1280,
    `2xl` 1440. Motion: `--duration-fast` 150ms, `--duration-base` 250ms, `--duration-slow`
    400ms, `--ease-standard: cubic-bezier(0.2,0,0,1)`. `--z-header` 40, `--z-consent` 50.
  - Outcome: A complete token set.
  - Accept: Utilities such as `rounded-card`, `shadow-card`, `py-section`, and `duration-base`
    compile, and `max-w-container` limits width to 1200px.

- [X] T021 Add base-layer accessibility styles in `src/styles/globals.css`
  - Meta: P0 · Depends on: T017, T020 · Parallel with: — · Spec: FR-121 · Const: V, VIII · Plan: Accessibility Strategy, AD-16
  - Do: Add a global `:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }`.
    Add `@media (prefers-reduced-motion: reduce) { *, ::before, ::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; } }`.
    Set `html { scroll-padding-top: <header height>; }`, a `::selection` color from the tokens,
    and `img, svg, video { max-width: 100%; height: auto; }`.
  - Outcome: Accessible defaults everywhere.
  - Accept: Tabbing shows a visible ring on all surfaces. With emulated reduced motion, no transition exceeds 0.01ms.

- [X] T022 [P] Create the Container and Section primitives in `src/components/layout/Container.tsx` and `src/components/layout/Section.tsx`
  - Meta: P0 · Depends on: T020, T021 · Parallel with: T023, T024, T025, T026 · Spec: FR-120, FR-123 · Const: VI, VII · Plan: Component variants (Section), AD-06
  - Do: `Container` takes the props `size?: "default" | "narrow"` and `as?` and applies the max
    width plus responsive gutters. `Section` takes the props
    `surface: "white" | "gray" | "ink" | "deep"`, `id?`, `labelledBy?`, and `spacing?: "default" | "compact"`.
    It renders `<section>` with the matching `.surface-*` class and `py-section`. Both are Server
    Components.
  - Outcome: Consistent page rhythm.
  - Accept: Each surface renders the correct background and foreground and a focus ring meeting
    3:1. There is no horizontal overflow at 320px.

- [X] T023 [P] Create the Button and ButtonLink primitives in `src/components/ui/Button.tsx`
  - Meta: P0 · Depends on: T019, T021 · Parallel with: T022, T024, T025, T026 · Spec: FR-005, FR-121, FR-123 · Const: VII, IX, V (44px targets) · Plan: Component variants (Button), Design System (hover rule)
  - Do: `Button` (a `<button>`) and `ButtonLink` (a Next `<Link>`) share the variants `primary`
    (brand-green background, ink text), `secondary` (on light surfaces an ink outline; on
    `surface-ink` and `surface-deep` a white outline, using `--surface-fg`), and `ghost` (text
    plus an arrow icon slot), sizes `md` and `lg`, `min-h-11` (44px), and `rounded-control`. The
    primary hover keeps the green background and adds `shadow-raised` and `-translate-y-px`; it
    **never** switches to dark green with normal-size text. Props: `track?: { event: string; label?: string; location?: string }`,
    rendered as `data-track`, `data-track-label`, and `data-track-location`. `ButtonLink` also
    accepts `external?` (adds `rel="noopener noreferrer"`).
  - Outcome: One CTA system.
  - Accept: The primary button measures 10.24:1 text contrast. The keyboard focus ring is visible
    on all 4 surfaces. The height is at least 44px.

- [X] T024 [P] Create SectionHeading in `src/components/ui/SectionHeading.tsx`
  - Meta: P1 · Depends on: T019 · Parallel with: T022, T023, T025, T026 · Spec: FR-100 (heading order), FR-123 · Const: IV, VII · Plan: AD-06
  - Do: Props: `eyebrow?`, `title`, `intro?`, `level: 1 | 2 | 3` (renders `h1`, `h2`, or `h3`;
    level is required so the heading hierarchy is explicit), `align?: "start" | "center"`, and
    `id?` (for `aria-labelledby`).
  - Outcome: Consistent section headers with a correct outline.
  - Accept: Renders the correct heading element per `level`. The eyebrow is not a heading element.

- [X] T025 [P] Create the Icon component with the approved icon set in `src/components/ui/Icon.tsx`
  - Meta: P2 · Depends on: T003 · Parallel with: T022, T023, T024, T026 · Const: VII · Plan: Dependency Decisions (`lucide-react`, optional), data-model `IconName`
  - Do: Install `lucide-react` (exact). Export `IconName` as a union of the approved names (e.g.,
    `factory`, `truck`, `building`, `hard-hat`, `plane`, `heart-pulse`, `shopping-bag`,
    `warehouse`, `layout-dashboard`, `workflow`, `users`, `boxes`, `megaphone`, `target`,
    `line-chart`, `pen-tool`, `compass`, `arrow-right`, `check`, `alert-circle`, `menu`, `x`,
    `mail`, `phone`, `map-pin`, `linkedin`, `facebook`, `instagram`, `youtube`) and a map to
    Lucide components. `<Icon name size? label? />` is `aria-hidden` unless `label` is given.
    Server Component only.
  - Outcome: A consistent, tree-shaken icon set with zero client JS.
  - Accept: The icon renders inline SVG. The client bundle does not include lucide (verified in T179 and T180).

- [X] T026 [P] Write the token contrast test in `tests/unit/tokens-contrast.test.ts`
  - Meta: P1 · Depends on: T017, T013 · Parallel with: T022–T025 · Spec: FR-121 · Const: V · Plan: Design System › Color tokens
  - Do: Parse the hex values of the `--color-*` tokens from `src/styles/globals.css`. Compute WCAG
    contrast. Assert these **allowed** pairings: ink/white ≥ 4.5, ink/surface-gray ≥ 4.5,
    white/ink ≥ 4.5, white/green-deep ≥ 4.5, ink/brand-green ≥ 4.5, ink-muted/white ≥ 4.5,
    ink-muted/surface-gray ≥ 4.5, danger/white ≥ 4.5, control-border/white ≥ 3,
    brand-green-dark/white ≥ 3 (UI and large text only), brand-green/ink ≥ 3, and
    brand-green/green-deep ≥ 3. Assert these documented **forbidden** normal-text pairings stay
    below 4.5, so a palette change is noticed: brand-green/white and brand-green-dark/white.
  - Outcome: Contrast rules are enforced automatically.
  - Accept: `npm test` passes. Changing a token to a failing value breaks the test.

**Checkpoint**: Tokens, fonts, and core primitives are ready. Every surface passes contrast.

---

## Phase 3: Content/Data Architecture (Foundational)

**Purpose**: Typed content, the repository layer (the CMS seam), and integrity enforcement.
**⚠️ Blocks layout, components, and all story phases.** Only summary-level entries are created
here. Full page content is drafted in each story phase.

- [X] T027 Define all content types in `src/types/content.ts`
  - Meta: P0 · Depends on: T003, T025 · Parallel with: — · Spec: FR-005, FR-052, FR-110, Key Entities · Const: II, XI · Plan: AD-03, data-model (all entities)
  - Do: Implement every type from [data-model.md](./data-model.md), quoting its constraints in
    TSDoc:
    - `Slug` ("matching `^[a-z0-9]+(-[a-z0-9]+)*$`") and `Status` (`"draft" | "published"`).
    - `Seo` ("Title 30–60 chars, description 70–160 chars, both unique site-wide").
    - `CtaLabel`: exactly the union `"Get Free Consultation" | "View Our Solutions" | "View Case Study" | "Discuss Your Business" | "Discuss Your Business Process" | "Grow Your Business"`.
    - `Cta`, `StaticImage` (a static import plus `alt: string`, required), `Screenshot` (`caption`
      mandatory), and `RichText` (`string[]`).
    - `Solution` and `MarketingService` as a discriminated union on `hasPage`. The `false`
      variant has summary fields only (`slug`, `name`, `category`, `summary` (≤ 140 chars),
      `icon`, `order`, `status`). The `true` variant adds `hero`, `problem`, `approach`,
      `features` (≥ 4), `benefits` (≥ 3), `useCases`, `industries`, `projects`, `faqs?`, `cta`,
      and `seo`. `MarketingService` adds `covers: { name: string; benefit: string }[]` (refines
      data-model `covers` with a benefit line for the home Services section) and `outcomes`.
    - `Industry`: the same `hasPage` union, with the summary `shortWorkflows`, `summary`, `icon`,
      and `priority`, and the page fields `challenges` (≥ 3), `workflows`, `solutions`,
      `features`, `benefits`, `projects`, `cta`, and `seo`.
    - `Project` as a discriminated union on `type`. `"concept"` has **no** `client` or `results`
      properties. `"client"` allows `client?: { name; logo?; permissionConfirmed: true }` and
      `results?: { label; value; verifiedBy; verifiedOn }[]`.
    - `Testimonial` (`verified: boolean`), `Stat` (`source` required, `verified`), `ClientLogo`
      (`permissionConfirmed`), `BlogPostMeta`, `BlogCategory`, `SiteProfile` (`email?`,
      `phone?: { display; e164 }`, `location?`, `socials[]`, `responseTime?`, `hours?`,
      `logo?`), `FormOptions`, `NavItem`, `Redirect`, and `Faq`.
  - Outcome: The compiler enforces the content rules.
  - Accept: `npm run typecheck` passes. A concept project with a `results` field fails to compile
    (verified by a `// @ts-expect-error` case in `tests/unit/types.test-d.ts` or in T040).

- [X] T028 Create the site profile with fixed values only in `src/content/site.ts`
  - Meta: P0 · Depends on: T027 · Parallel with: T029 · Spec: FR-071, FR-110, Missing Information · Const: II · Plan: data-model › SiteProfile
  - Do: Export `site` (typed `SiteProfile`) with `name: "U Design"`, `tagline: "Build. Market. Grow."`,
    and `positioning: "Digital Solutions That Help Businesses Grow"`. Leave `email`, `phone`,
    `location`, `responseTime`, `hours`, and `logo` **undefined**, and set `socials: []`. Add
    `// CONTENT INPUT REQUIRED (Q-2, Q-7)` comments. The URL comes from `env.public.ts`.
  - Outcome: A truthful company profile with no invented details.
  - Accept: `grep` finds no email, phone, or address literal in `site.ts`.

- [X] T029 Implement the repository core with visibility and relation resolution in `src/lib/content/core.ts` and `src/lib/content/index.ts`
  - Meta: P0 · Depends on: T027, T010 · Parallel with: T028 · Spec: FR-130, SC-013 · Const: XI · Plan: AD-02, AD-03, data-model › Repository API
  - Do: `includeDrafts()` returns true when `process.env.NODE_ENV !== "production"` or
    `process.env.CONTENT_INCLUDE_DRAFTS === "true"`. `isVisible(entry)` is
    `entry.status === "published" || includeDrafts()`. `hasPage(entry)` is `isVisible && entry.hasPage`.
    Add a generic `resolveSlugs<T>(slugs, collection)` that returns visible targets in the given
    order and silently drops missing or invisible ones, plus `sortBy(order)`. `index.ts`
    re-exports all getters. Components import **only** from `@/lib/content`.
  - Outcome: The single access path to content.
  - Accept: Unit tests in T040 cover draft hiding when both flags are off, and relation filtering.

- [X] T030 [P] Create solution summary entries and getters in `src/content/solutions/{index,custom-software,erp,crm,business-dashboards,automation}.ts` and `src/lib/content/solutions.ts`
  - Meta: P0 · Depends on: T029 · Parallel with: T031–T036 · Spec: FR-013, FR-030 · Const: I, XI · Plan: data-model › Solution
  - Do: Five entries with `hasPage: false` and `status: "draft"`: Custom Software
    (`custom-software`), ERP Systems (`erp`), CRM Solutions (`crm`), Business Dashboards
    (`business-dashboards`), and Workflow Automation (`automation`). Each has a one-line
    business-benefit `summary` (≤ 140 chars, business-first, no numbers), an `icon`, and an
    `order`. Base the wording on the spec descriptions: "Business-specific software designed
    around actual workflows", "Centralized management for operations, inventory, production,
    purchasing, sales and reporting", "Lead, customer, sales and follow-up management", "Real-time
    business visibility and reporting", and "Reduce repetitive manual work and streamline
    processes". Getters: `getSolutions()` and `getSolution(slug)`.
  - Outcome: Solution data for cards and navigation.
  - Accept: `getSolutions()` returns 5 items in order in dev and 0 in a production build without
    `CONTENT_INCLUDE_DRAFTS`.

- [X] T031 [P] Create marketing service summary entries and getters in `src/content/marketing/{index,social-media,meta-ads,content,lead-generation,digital-strategy}.ts` and `src/lib/content/marketing.ts`
  - Meta: P0 · Depends on: T029 · Parallel with: T030, T032–T036 · Spec: FR-013, FR-060 · Const: I · Plan: AD-02 (marketing slugs note), data-model › MarketingService
  - Do: Five entries, all `hasPage: false`, `status: "draft"`, and `category: "marketing"`:
    `social-media` covers Social Media Marketing and Social Media Management; `meta-ads` covers
    Meta Ads; `content` covers Content Creation; `lead-generation` covers Lead Generation and
    Performance Marketing; `digital-strategy` covers Digital Strategy. Each `covers` item has a
    `benefit` line (outcome-based, no guarantees). Getters: `getMarketingServices()` and
    `getMarketingService(slug)`.
  - Outcome: All 7 marketing services are represented under 5 entries.
  - Accept: Flattening `covers` yields exactly the 7 spec service names.

- [X] T032 [P] Create industry summary entries and getters in `src/content/industries/{index,manufacturing,distribution,real-estate,construction,logistics,travel,healthcare,retail}.ts` and `src/lib/content/industries.ts`
  - Meta: P0 · Depends on: T029 · Parallel with: T030, T031, T033–T036 · Spec: FR-014, FR-040, FR-043 · Const: I, X · Plan: data-model › Industry
  - Do: Eight entries with `hasPage: false` and `status: "draft"`. `shortWorkflows` are copied
    **verbatim** from spec FR-040: Manufacturing (Production, Inventory, Purchasing, Sales,
    Operations, Reporting); Distribution (Sales, Inventory, Warehouses, Orders, Customers,
    Reporting); Real Estate (Leads, Properties, Sales, Bookings, Customers, Payments);
    Construction (Projects, Procurement, Materials, Expenses, Progress); Logistics (Fleet,
    Shipments, Drivers, Fuel, Maintenance, Operations); Travel & Tourism (`travel`: Customers,
    Packages, Bookings, Visa Processing, Payments); Healthcare (Patients, Appointments,
    Consultations, Billing, Business Operations); Retail (Products, Inventory, Sales, Customers,
    Reporting). Manufacturing gets `priority: 1`. Getters: `getIndustries()` (sorted by
    priority) and `getIndustry(slug)`.
  - Outcome: Industry data for the grid, navigation, and form options.
  - Accept: The first item from `getIndustries()` is Manufacturing. All 8 slugs match the plan routes.

- [X] T033 [P] Create project summary entries and getters in `src/content/projects/{index,manufacturing-erp,travel-agency-management,real-estate-crm}.ts` and `src/lib/content/projects.ts`
  - Meta: P0 · Depends on: T029 · Parallel with: T030–T032, T034–T036 · Spec: FR-015, FR-050, FR-052 · Const: II, X · Plan: data-model › Project, research R-3
  - Do: Three entries with `type: "concept"` (default until Q-4), `status: "draft"`, and
    `featured: true`. Manufacturing ERP (`industry: "manufacturing"`,
    `industryLabel: "Textile Manufacturing"`, `solutionTypes: ["erp", "business-dashboards"]`,
    modules Executive Dashboard, Production, Inventory, Purchase, Sales, Reports). Travel Agency
    Management (`industry: "travel"`, `solutionTypes: ["custom-software", "crm"]`, modules
    Dashboard, Customers, Leads, Packages, Bookings, Visa Processing, Payments, Reports). Real
    Estate CRM (`industry: "real-estate"`, `solutionTypes: ["crm"]`, modules Dashboard, Leads,
    Customers, Properties, Site Visits, Bookings, Installments, Reports). Each module has a
    one-line description. `summary` states the purpose from the spec. `screenshots: []` and
    `cover` are left unset until T121 and T126–T128. Getters: `getProjects(filter?)`,
    `getProject(slug)`, `getFeaturedProjects()`, and `projectHasPage(p)` (visible **and** at
    least 1 screenshot).
  - Outcome: Showcase data for home and portfolio.
  - Accept: The module lists match the spec exactly. No project has `client` or `results`.

- [X] T034 [P] Create empty, gated proof collections and getters in `src/content/{testimonials,stats,client-logos,faqs}.ts` and `src/lib/content/proof.ts`
  - Meta: P0 · Depends on: T029 · Parallel with: T030–T033, T035, T036 · Spec: FR-012, FR-110 · Const: II · Plan: data-model › Testimonial, Stat, ClientLogo
  - Do: Export typed **empty** arrays, each with a comment "Add only verified, approved entries
    (constitution II)". `getVerifiedTestimonials()` filters `verified === true`.
    `getVerifiedStats()` filters `verified === true`. `getApprovedLogos()` filters
    `permissionConfirmed === true`. `getFaqs(scope)` returns the FAQs for a page.
  - Outcome: Proof sections have safe data sources.
  - Accept: All getters return `[]`, and unit tests in T040 cover the filtering with fixture data.

- [X] T035 [P] Create home page copy singletons in `src/content/{home,digitalization,process,why}.ts`
  - Meta: P0 · Depends on: T027 · Parallel with: T030–T034, T036 · Spec: FR-010, FR-013, FR-016, FR-017, FR-018, FR-019, FR-020 · Const: I, IX · Plan: data-model › Page copy singletons
  - Do: `home.ts` holds the hero (eyebrow "BUILD. MARKET. GROW.", headline "Digital Solutions That
    Help Businesses Grow", lead "We build custom software, dashboards and automation systems while
    helping businesses grow through digital marketing and performance-driven advertising.",
    CTAs "Get Free Consultation" → `/contact#consultation` and "View Our Solutions" →
    `/solutions`); services section headings for the "Business Software & Digital Solutions" and
    "Digital Marketing & Growth" groups plus an extra software item "Business Process
    Digitalization" (benefit line, `href: "#digitalization"`); the marketing section (headline
    "Don't Just Build Your Business. Grow It.", items Social Media Marketing, Content Creation,
    Meta Ads, Lead Generation, Performance Tracking, Digital Strategy, and outcome bullets:
    reaching the right audience, building brand visibility, generating leads, improving digital
    presence, supporting business growth; CTA "Grow Your Business" → `/digital-marketing`); and
    the final CTA copy. `digitalization.ts` holds the headline "Still Managing Your Business With
    Spreadsheets?", pain points (Excel spreadsheets, separate systems, manual reporting, WhatsApp
    communication, paper-based workflows, disconnected data, manual follow-ups, multiple tools
    without centralized visibility), the stages Manual Processes → Centralized Business Software
    → Real-Time Business Visibility with one-line explanations, and the CTA "Discuss Your Business
    Process". `process.ts` holds the six steps verbatim (01 Discover … 06 Grow, with their spec
    descriptions). `why.ts` holds the four themes verbatim (Business-Focused, Custom-Built,
    Scalable, One Digital Partner). Section intros are drafted and marked `// DRAFT: review (T222)`.
  - Outcome: All home copy lives in data.
  - Accept: The verbatim strings match the spec exactly. No numbers or claims appear.

- [X] T036 [P] Create the redirects source and wire it into Next.js in `src/content/redirects.ts` and `next.config.ts`
  - Meta: P2 · Depends on: T027, T004 · Parallel with: T030–T035 · Spec: FR-102, edge case "unknown or removed URL" · Const: IV · Plan: AD-04
  - Do: Export an empty `redirects: Redirect[]`. In `next.config.ts`, add
    `async redirects() { return redirects.map(...) }`.
  - Outcome: Redirects are managed as content.
  - Accept: Adding a test entry locally produces a 308 redirect (the entry is removed afterward).

- [X] T037 Derive the consultation form options in `src/content/form-options.ts` and `src/lib/content/form-options.ts`
  - Meta: P0 · Depends on: T030, T031, T032 · Parallel with: T038 · Spec: FR-080, FR-083, edge case "industry not listed" · Const: IX · Plan: data-model › FormOptions
  - Do: `getFormOptions()` returns three lists. `industries` is **all** industry entries (name
    and slug, regardless of `hasPage`) plus `{ value: "other", label: "Other" }`. `needs` is all
    solutions (group `software`) and all marketing services (group `marketing`) plus
    `{ value: "not-sure", label: "Not sure yet" }`. `budgets` comes from `src/content/form-options.ts`
    as an empty array with the comment "CONTENT INPUT REQUIRED (Q-6): ranges and currency". The
    option lists include draft entries by design (the form options reflect services U Design
    offers).
  - Outcome: Form choices never drift from content.
  - Accept: `industries` has 9 options and `needs` has 11 options. Unit tested in T040.

- [X] T038 Create a blog repository stub in `src/lib/content/blog.ts`
  - Meta: P1 · Depends on: T029 · Parallel with: T037 · Spec: FR-092 · Const: XI · Plan: AD-08 (gate)
  - Do: Export `getPublishedPosts(): BlogPostMeta[]` returning `[]`, and `hasBlog(): boolean`
    returning `getPublishedPosts().length > 0`. T147 replaces the implementation and keeps the
    signatures.
  - Outcome: Navigation and footer can gate the Blog link now.
  - Accept: `hasBlog()` returns false.

- [X] T039 Create derived navigation data in `src/content/navigation.ts` and `src/lib/content/navigation.ts`
  - Meta: P0 · Depends on: T030, T031, T032, T038 · Parallel with: — · Spec: FR-001, FR-002, FR-006, FR-092, FR-130 · Const: IX, XI · Plan: data-model › Navigation and Footer
  - Do: `getNavigation()` returns the following. `primary` is Home `/`; Solutions `/solutions`
    with children = solutions where `hasPage()`; Industries `/industries` with children =
    industries where `hasPage()` (Manufacturing first); Digital Marketing `/digital-marketing`
    with children = marketing services where `hasPage()`; Portfolio `/portfolio`; About
    `/about`; Contact `/contact`. `cta` is `{ label: "Get Free Consultation", href: "/contact#consultation" }`.
    `footer.groups` are Solutions (links = solutions with pages), Digital Marketing (links =
    marketing pages plus the hub), Industries, Company (About, Portfolio, Contact, and Blog only
    if `hasBlog()`), and Legal (initially empty; T144 adds Privacy Policy).
  - Outcome: Menus adapt to published content automatically.
  - Accept: With all entries `hasPage: false`, the menus have no children, and the unit test
    asserts the primary order matches FR-001.

- [X] T040 Implement the content integrity test suite in `tests/unit/content-integrity.test.ts`
  - Meta: P0 · Depends on: T028–T039 · Parallel with: — · Spec: FR-005, FR-042, FR-052, FR-053, FR-110, SC-010 · Const: II, VII, X · Plan: data-model › Integrity rules 1–9, AD-17
  - Do: Implement rules 1–9 from data-model: (1) every slug reference resolves; (2) SEO titles and
    descriptions are unique and within length, for `hasPage` entries; (3) concept projects have
    no `client` or `results`, and every result has `verifiedBy` and `verifiedOn`; (4) only
    verified or approved proof is returned by the getters (fixture-based); (5) projects that
    have a page have at least 1 screenshot with a non-empty caption; (6) no visible string
    contains `TODO`, `TBD`, `PLACEHOLDER`, `lorem`, or `example.com`, checked in
    `status: "published"` entries only, with drafts reported as warnings; (7) all CTA labels are
    in the approved set; (8) the banned-buzzword list ("innovative", "cutting-edge",
    "revolutionary", "best-in-class", "guaranteed", "world-class", "synergy") is checked with an
    allowlist; (9) industry distinctness: the Jaccard similarity of word trigrams between any two
    industries' `challenges` plus `features` text is below 0.35, for entries that have pages. Also
    unit-test `isVisible` and `resolveSlugs` from T029 and `getFormOptions` from T037. Rule 10
    (contact channel) lives in T219.
  - Outcome: Principle II and the structure are enforced on every test run.
  - Accept: `npm test` passes. Each rule has a failing fixture case proving it detects the violation.

**Checkpoint**: The content model, repository, and integrity gates are in place, with summary data for all collections.

---

## Phase 4: Global Layout (Foundational)

**Purpose**: The site shell (landmarks, header, navigation, footer, breadcrumbs, error pages)
and root metadata. **⚠️ Blocks all page work.**

- [X] T041 Create the metadata utility and root metadata in `src/lib/seo/metadata.ts`, `src/lib/seo/site-url.ts`, and `src/app/layout.tsx`
  - Meta: P0 · Depends on: T010, T028 · Parallel with: T042, T043, T044, T049, T051, T052 · Spec: FR-100, FR-101 · Const: IV · Plan: AD-04, contracts/routes-and-seo.md
  - Do: `absoluteUrl(path)` joins `NEXT_PUBLIC_SITE_URL` and the path, with no trailing slash and
    no query. `buildMetadata({ title, description, path, image?, type?: "website" | "article", noindex? })`
    returns `Metadata` with `title`, `description`, `alternates.canonical` (absolute),
    `openGraph` (title, description, url, type, siteName "U Design", images when provided), and
    `twitter` (`summary_large_image`). The root layout exports `metadata` with `metadataBase`,
    `title: { default: "U Design | Digital Solutions That Help Businesses Grow", template: "%s | U Design" }`,
    and a default description. It also sets `robots: { index: false, follow: false }` when
    `siteEnv !== "production"`. Add `tests/unit/metadata.test.ts` covering the canonical format
    and the noindex logic.
  - Outcome: One way to produce correct metadata on every page.
  - Accept: The unit tests pass. The `/` HTML contains a canonical `http://localhost:3000` in test
    and `noindex` outside production.

- [X] T042 [P] Create SkipLink in `src/components/layout/SkipLink.tsx`
  - Meta: P1 · Depends on: T021 · Parallel with: T041, T043, T044, T049, T051, T052 · Spec: FR-121 · Const: V · Plan: Accessibility Strategy
  - Do: A link to `#main` labelled "Skip to main content". It is visually hidden until focused, then
    shown in a high-contrast style.
  - Outcome: Keyboard users can bypass navigation.
  - Accept: The first Tab on any page reveals the link, and Enter moves focus to `<main>`.

- [X] T043 [P] Create the Logo component with a text-wordmark fallback in `src/components/layout/Logo.tsx`
  - Meta: P1 · Depends on: T018, T028 · Parallel with: T041, T042, T044, T049, T051, T052 · Spec: FR-001, FR-123 · Const: II, VII · Plan: Open Questions Q-2
  - Do: If `site.logo` exists, render `next/image` (explicit dimensions, alt "U Design"). Otherwise
    render a text wordmark "U DESIGN" in Poppins 700 with a brand-green accent mark (tokens only;
    this is not a new logo design). Add the comment "Replace with official logo (Q-2, launch
    blocker)". The whole component is a `Link` to `/` with the accessible name "U Design home".
    It adapts to `--surface-fg`.
  - Outcome: The brand is present without inventing assets.
  - Accept: Renders on light and dark surfaces with contrast of at least 4.5:1, and the link name is correct.

- [X] T044 [P] Create the NavMenu popover dropdown in `src/components/navigation/NavMenu.tsx`
  - Meta: P1 · Depends on: T023, T025, T027 · Parallel with: T041, T042, T043, T049, T051, T052 · Spec: FR-002, FR-121 · Const: III, V · Plan: AD-15
  - Do: Props: `label`, `href` (hub), and `items: NavItem[]`. Render the hub link **and** a
    `<button popovertarget={id} aria-label="{label} menu">` with a chevron icon, followed by
    `<div id={id} popover="auto">` containing a `<ul>` of links. When `items` is empty, render only
    the hub link. Position the panel under the trigger with CSS. There is no JS. Style it with
    `surface-white`, `rounded-card`, and `shadow-raised`.
  - Outcome: JS-free accessible dropdowns.
  - Accept: The panel opens on click or Enter and closes on Escape and outside click, and focus
    returns to the trigger. The hub link works without popover support.

- [X] T045 Create DesktopNav in `src/components/navigation/DesktopNav.tsx`
  - Meta: P1 · Depends on: T044, T039 · Parallel with: T046 · Spec: FR-001, FR-002 · Const: IX · Plan: Global layout & navigation
  - Do: `<nav aria-label="Primary">` with a `<ul>` of `getNavigation().primary`. Items with
    children use `NavMenu`, the rest are plain links. Mark the current page with
    `aria-current="page"` (via the `pathname` prop passed from the Header). Visible only at
    `lg:` and above.
  - Outcome: Desktop primary navigation.
  - Accept: The 7 items appear in the FR-001 order and all links resolve to the plan routes.

- [X] T046 Create the MobileNav popover panel in `src/components/navigation/MobileNav.tsx`
  - Meta: P1 · Depends on: T023, T025, T039 · Parallel with: T045 · Spec: FR-003, FR-120, FR-121 · Const: V, VI · Plan: AD-15, Responsive Strategy (Header)
  - Do: A `<button popovertarget="mobile-nav" aria-label="Open menu">` with a menu icon (hidden at
    `lg:`), and `<div id="mobile-nav" popover="auto">` as a full-height panel containing
    `<nav aria-label="Mobile">`, a close button (`popovertarget` with
    `popovertargetaction="hide"`), all primary items, children as grouped nested `<ul>` lists
    (no nested popovers), and the "Get Free Consultation" `ButtonLink` pinned at the bottom.
    Tap targets are at least 44px.
  - Outcome: A JS-free mobile menu exposing every item and the CTA.
  - Accept: At 320px the menu opens, all items are reachable by keyboard and touch, Escape closes
    it, and there is no horizontal overflow.

- [X] T047 Create the Header in `src/components/layout/Header.tsx`
  - Meta: P0 · Depends on: T043, T045, T046, T022, T023 · Parallel with: T048 · Spec: FR-001, FR-003, FR-004, FR-082 · Const: IX, VI · Plan: Global layout & navigation, Responsive Strategy
  - Do: `<header>` is sticky (`z-header`) on `surface-white` with a bottom `line` border. It
    contains the Logo, DesktopNav (lg+), the primary `ButtonLink` "Get Free Consultation" →
    `/contact#consultation` with `track={{ event: "cta_click", location: "header" }}`, and
    MobileNav (below lg). On mobile the CTA shows the visible label "Free Consultation" with the
    `aria-label` "Get Free Consultation". The header height is fixed so there is no CLS.
  - Outcome: A persistent navigation and CTA on every page.
  - Accept: The CTA is visible at 320, 768, and 1440px, and the header does not overflow at 320px.

- [X] T048 Create the Footer in `src/components/layout/Footer.tsx`
  - Meta: P1 · Depends on: T039, T028, T043, T022, T025 · Parallel with: T047 · Spec: FR-006, FR-071, FR-110 · Const: II, IX · Plan: Global layout & navigation
  - Do: `<footer>` on `surface-ink` with the Logo, the tagline "Build. Market. Grow.", and the
    positioning line. Link columns come from `getNavigation().footer.groups` and render only
    non-empty groups. The contact block renders only the channels present in `site` (`mailto:`,
    `tel:` using `e164`) and social icons only for configured `socials`, each with an accessible
    platform name and `rel="noopener noreferrer"`. Finish with "© {current year} U Design". Use a
    responsive grid: stacked on mobile, 2×2 on tablet, 4 columns plus the contact block on
    desktop.
  - Outcome: A complete, truthful footer.
  - Accept: With an empty `site` profile, no contact or social markup renders. All footer links
    resolve (checked in T210).

- [X] T049 [P] Create Breadcrumbs and the trail builder in `src/components/layout/Breadcrumbs.tsx` and `src/lib/seo/breadcrumbs.ts`
  - Meta: P1 · Depends on: T022 · Parallel with: T041–T044, T051, T052 · Spec: FR-008 · Const: IV · Plan: contracts/routes-and-seo.md (Breadcrumbs column)
  - Do: `buildTrail(items: { name; path }[])` always starts with Home. `<nav aria-label="Breadcrumb"><ol>`
    renders the items, with the last item marked `aria-current="page"` and not linked. Separators
    are decorative (`aria-hidden`). T168 reuses the same trail for BreadcrumbList JSON-LD.
  - Outcome: Consistent breadcrumbs.
  - Accept: The screen reader announces the "Breadcrumb" navigation, and the trail order matches the routes contract.

- [X] T050 Wire SkipLink, Header, `<main id="main">`, and Footer into `src/app/layout.tsx`
  - Meta: P0 · Depends on: T041, T042, T047, T048 · Parallel with: — · Spec: FR-001, FR-006, FR-121 · Const: V · Plan: Global layout & navigation
  - Do: Body order: SkipLink → Header → `<main id="main" tabIndex={-1}>{children}</main>` → Footer.
    Keep the font classes and metadata from T018 and T041.
  - Outcome: Every route has the shell.
  - Accept: The axe landmark rules pass on `/`, and there is exactly one `<header>`, `<main>`, and `<footer>`.

- [X] T051 [P] Create the branded 404 page in `src/app/not-found.tsx`
  - Meta: P1 · Depends on: T022, T023, T024 · Parallel with: T041–T044, T049, T052 · Spec: FR-007, edge case "unknown URL" · Const: IV, IX · Plan: Global layout › Error handling
  - Do: `h1` "Page not found", a short helpful message, links to Home, Solutions, and Industries,
    and the primary CTA "Get Free Consultation".
  - Outcome: A helpful dead end.
  - Accept: `/does-not-exist` returns HTTP 404 with the page and a `noindex` robots meta.

- [X] T052 [P] Create the error boundaries in `src/app/error.tsx` and `src/app/global-error.tsx`
  - Meta: P1 · Depends on: T022, T023 · Parallel with: T041–T044, T049, T051 · Spec: edge cases (error handling) · Const: IX · Plan: Global layout › Error handling
  - Do: `error.tsx` (`"use client"` is required by Next.js for error boundaries; this is a documented
    exception to the island list, added to the T179 allowlist) shows "Something went wrong", a
    "Try again" button calling `reset()`, and a Home link. It never renders `error.message` or a
    stack. `global-error.tsx` renders its own `<html>` and `<body>` with a minimal branded fallback.
  - Outcome: Graceful failures.
  - Accept: A thrown test error in dev shows the boundary without any stack trace.

**Checkpoint**: The shell renders on every route. Navigation works by keyboard and on mobile.

---

## Phase 5: Reusable Components (Foundational)

**Purpose**: Data-driven, accessible building blocks used by every story. All are Server
Components.

- [X] T053 [P] Create the Card primitive in `src/components/ui/Card.tsx`
  - Meta: P1 · Depends on: T020, T021 · Parallel with: T054–T057, T065, T066, T067, T069 · Spec: FR-123 · Const: VII · Plan: Component variants (Card)
  - Do: Variants `default`, `feature`, and `link`. `link` makes the whole card clickable through
    a single stretched `<a>` on the title (`after:absolute after:inset-0`), so screen readers
    announce one link. Hover uses `shadow-raised` and `-translate-y-0.5` (transform only).
    `rounded-card` and `border-line`.
  - Outcome: A consistent card.
  - Accept: A link card has exactly one focusable element and a visible focus ring around the card.

- [X] T054 [P] Create Badge in `src/components/ui/Badge.tsx`
  - Meta: P1 · Depends on: T019 · Parallel with: T053, T055–T057 · Spec: FR-050, FR-052 · Const: II, V · Plan: Component variants (Badge)
  - Do: Variants `neutral`, `concept` (text "Concept / Demo"), `client` (text "Client Project"),
    and `category`. The label is always text, never color alone. Uses `rounded-pill` and `text-small`.
  - Outcome: Project type labels.
  - Accept: The concept and client variants render their exact text, and contrast is at least 4.5:1.

- [X] T055 [P] Create the form controls Field, Input, Select, and Textarea in `src/components/ui/{Field,Input,Select,Textarea}.tsx`
  - Meta: P0 · Depends on: T019, T021 · Parallel with: T053, T054, T056, T057 · Spec: FR-080, FR-081, FR-121 · Const: V, IX · Plan: contracts/consultation-action.md › Accessibility contract
  - Do: `Field` renders a visible `<label htmlFor>`, a required marker (text "(required)" plus
    `aria-required` on the control), a hint, and an error `<p id>` with an alert icon.
    `Input`, `Select`, and `Textarea` accept `invalid` (sets `aria-invalid`) and `describedBy`,
    and pass through native constraint attributes. The border uses `control-border` (at least 3:1)
    and the focus ring token. `Textarea` accepts `maxLength` and renders a static counter text
    "Up to {n} characters" (the live counter is added by the form in T080). The minimum height is
    44px.
  - Outcome: Accessible, consistent controls.
  - Accept: axe passes on a story fixture. The label click focuses the control, and the error text is referenced by `aria-describedby`.

- [X] T056 [P] Create LogoCloud in `src/components/ui/LogoCloud.tsx`
  - Meta: P2 · Depends on: T020 · Parallel with: T053–T055, T057 · Spec: FR-012 · Const: II · Plan: AD-05 (monochrome logos, reserved ratio)
  - Do: Props: `logos: ClientLogo[]` (only approved ones are passed). A responsive grid with each
    logo in a fixed-aspect box, monochrome via CSS filter, and `alt` = the company name.
    Returns `null` for an empty array.
  - Outcome: A trust strip ready for real logos.
  - Accept: No layout shift, and nothing renders for an empty input.

- [X] T057 [P] Create the consultation link helper in `src/lib/cta.ts`
  - Meta: P0 · Depends on: T027 · Parallel with: T053–T056 · Spec: FR-082, FR-083 · Const: IX · Plan: AD-07 (pre-selection), contracts/consultation-action.md › Pre-selection contract
  - Do: `consultationHref({ industry?, need?, source? })` returns
    `/contact?industry=…&need=…&source=…#consultation`, omitting empty parameters. With no
    arguments it returns `/contact#consultation`. Add `tests/unit/cta.test.ts`.
  - Outcome: One way to build consultation links.
  - Accept: The unit tests pass for every combination.

- [X] T058 [P] Create ServiceCard in `src/components/cards/ServiceCard.tsx`
  - Meta: P1 · Depends on: T053, T025 · Parallel with: T059–T064 · Spec: FR-013, FR-030, FR-060 · Const: I, VII · Plan: AD-06 (Cards)
  - Do: Props: `name`, `benefit`, `icon`, `href?`. With `href` it uses the `link` card variant
    (title is the link); otherwise it is `default`. The heading level is passed as a prop.
  - Outcome: Reusable for home, hubs, and marketing.
  - Accept: With `href` there is one link. Without it there is no link and no hover lift.

- [X] T059 [P] Create IndustryCard in `src/components/cards/IndustryCard.tsx`
  - Meta: P1 · Depends on: T053, T025 · Parallel with: T058, T060–T064 · Spec: FR-014, FR-040, FR-043 · Const: I, X · Plan: Page & Section Architecture (Industries hub)
  - Do: Props: `industry` (summary fields), `href?`, `feature?: boolean`. Shows the icon, name,
    and `shortWorkflows` as a comma-separated or inline list. The `feature` variant (for
    Manufacturing) spans 2 columns at `md:` and above and shows the summary.
  - Outcome: Industry discovery tiles.
  - Accept: The feature variant spans correctly at 768px and above and stacks at 320px.

- [X] T060 [P] Create PortfolioCard and ProjectTypeBadge in `src/components/cards/PortfolioCard.tsx` and `src/components/portfolio/ProjectTypeBadge.tsx`
  - Meta: P1 · Depends on: T053, T054 · Parallel with: T058, T059, T061–T064 · Spec: FR-015, FR-050, FR-052 · Const: II, X · Plan: Portfolio
  - Do: `ProjectTypeBadge` maps `type` to the Badge `concept` or `client` variant. `PortfolioCard`
    props: `project`, `href?`, `showModules?`. It renders the `cover` image when present (via
    `next/image` with `sizes`) or a neutral token-styled frame with the project initials, the
    title, `industryLabel` or the industry name, the badge, the summary, and optionally the
    modules as a `<ul>`. If `href` is given, the link text is "View Case Study" with sr-only
    project name context.
  - Outcome: Honest project tiles.
  - Accept: Concept projects always show "Concept / Demo". There are no client fields in the concept path.

- [X] T061 [P] Create CaseStudyCard in `src/components/cards/CaseStudyCard.tsx`
  - Meta: P3 · Depends on: T053, T054 · Parallel with: T058–T060, T062–T064 · Spec: FR-051 (results only when verified) · Const: II · Plan: AD-06 (CaseStudyCard)
  - Do: Only for `type: "client"` projects **with** verified `results`. It shows the client name
    (permission confirmed), up to 3 results (label and value), and a "View Case Study" link. It
    returns `null` for concept projects or when there are no results.
  - Outcome: Ready for future verified case studies.
  - Accept: Returns `null` for all current (concept) projects. A fixture test covers the client path.

- [X] T062 [P] Create ProcessStep and the ProcessSteps list in `src/components/cards/ProcessStep.tsx`
  - Meta: P1 · Depends on: T020 · Parallel with: T058–T061, T063, T064 · Spec: FR-017 · Const: VI · Plan: Responsive Strategy (Process timeline)
  - Do: `ProcessSteps` renders an `<ol>` of `ProcessStep` (number "01" to "06" as a decorative
    large numeral, title, description), with an optional `compact` mode. Layout: a vertical list
    with a left rail on mobile, a 2×3 grid on `md:`, and a horizontal 6-column row on `xl:`.
  - Outcome: The six-step process on all breakpoints.
  - Accept: Screen readers announce a list of 6. There is no overflow at 320 or 1280px.

- [X] T063 [P] Create StatCard in `src/components/cards/StatCard.tsx`
  - Meta: P3 · Depends on: T020 · Parallel with: T058–T062, T064 · Spec: FR-110 · Const: II · Plan: data-model › Stat
  - Do: Props: `stat: Stat` (only verified stats are passed). It renders the value and label in a
    `<dl>`-friendly structure. It accepts only the `Stat` type, which requires `source`.
  - Outcome: Ready for verified metrics.
  - Accept: The type prevents rendering a stat without `source`.

- [X] T064 [P] Create TestimonialCard in `src/components/cards/TestimonialCard.tsx`
  - Meta: P3 · Depends on: T053 · Parallel with: T058–T063 · Spec: FR-110 · Const: II · Plan: data-model › Testimonial
  - Do: `<figure><blockquote>` quote `</blockquote><figcaption>` name, role, company, and an
    optional photo (with explicit dimensions) `</figcaption></figure>`. It renders only when
    `verified` is true.
  - Outcome: Ready for approved testimonials.
  - Accept: An unverified fixture renders nothing.

- [X] T065 [P] Create the DashboardPreview hero visual in `src/components/visuals/DashboardPreview.tsx`
  - Meta: P0 · Depends on: T020, T025 · Parallel with: T053–T064, T066 · Spec: FR-011 · Const: II, III, V · Plan: AD-05 (coded hero visual), Page & Section Architecture (Hero)
  - Do: A coded composition in HTML, CSS, and inline SVG, with **no raster images**, inside a
    `rounded-panel shadow-panel` frame with a **fixed `aspect-ratio`** per variant.
    - `variant="full"` (lg+) has three panels: an ERP-style panel (KPI tiles labelled
      "Production", "Inventory", "Orders" with neutral illustrative values and a small SVG bar
      chart), a CRM pipeline card ("Leads", "Follow-ups", "Won" stage bars without numbers), and a
      marketing performance mini line chart labelled "Campaign reach".
    - `variant="compact"` (mobile and tablet) shows a single ERP panel.
    - The visual root is `aria-hidden="true"` with a sibling `sr-only` sentence: "Illustration of
      a business dashboard combining operations, sales pipeline and marketing performance."
    - Illustrative values carry no claims (no "%" growth claims and no currency).
    - Tokens only: `surface-white` panels on a `surface-deep` backdrop, with brand-green accents.
  - Outcome: A premium product-style visual with zero LCP cost.
  - Accept: No `<img>` elements, CLS of 0 in Lighthouse, correct rendering at 320px and 1440px, and axe clean.

- [X] T066 [P] Create JourneyDiagram in `src/components/visuals/JourneyDiagram.tsx`
  - Meta: P1 · Depends on: T020, T025 · Parallel with: T053–T065 · Spec: FR-016 · Const: V, VI · Plan: Responsive Strategy (Spreadsheets journey)
  - Do: Props: `stages: { title; description; icon }[]`. It renders an `<ol>` with decorative
    arrow connectors (`aria-hidden`), vertical with down arrows on mobile and horizontal with
    right arrows at `lg:`. It works on the `surface-ink` background.
  - Outcome: The Manual → Centralized → Real-Time journey visual.
  - Accept: Screen readers read 3 ordered stages. No overflow at 320px.

- [X] T067 [P] Create the FormSuccess and FormError states in `src/components/forms/FormSuccess.tsx` and `src/components/forms/FormError.tsx`
  - Meta: P0 · Depends on: T023, T025 · Parallel with: T053–T066 · Spec: FR-084, FR-085 · Const: IX, V · Plan: contracts/consultation-action.md (Output, Accessibility)
  - Do: `FormSuccess` (`role="status"`) has a heading with `tabIndex={-1}` (for programmatic focus),
    a message prop (which includes the response time when configured), and a "Send another
    request" button slot. `FormError` (`role="alert"`) has a heading, a message, a retry
    instruction, and a fallback contacts list that renders only the provided `email` and `phone`
    as `mailto:` and `tel:` links. It also has an optional field-error summary list linking to
    each field id.
  - Outcome: Clear, accessible outcomes.
  - Accept: axe passes. When no contacts are provided, the fallback list is omitted and the text
    still reads correctly.

- [X] T068 Create PageHero and CtaBanner in `src/components/sections/shared/PageHero.tsx` and `src/components/sections/shared/CtaBanner.tsx`
  - Meta: P0 · Depends on: T022, T023, T024, T049, T057 · Parallel with: T069, T070 · Spec: FR-004, FR-005, FR-008, FR-083 · Const: IX · Plan: Page & Section Architecture (templates)
  - Do: `PageHero` props: `breadcrumbs?`, `eyebrow?`, `title` (h1), `intro`, `primaryCta`
    (defaults to "Get Free Consultation" with `consultationHref(context)`), `secondaryCta?` (a
    `CtaLabel`), and `surface` (defaults to `deep`). The CTA is visible without scrolling at 320px
    and above. `CtaBanner` props: `title`, `text`, `context?: { industry?; need? }`, and
    `secondary?`. It renders a closing CTA section with tracking attributes
    (`location: "cta-banner"`). Both enforce the one-primary/one-secondary rule by their prop
    shape.
  - Outcome: A consistent conversion framing on every template.
  - Accept: At 375×667 the H1 and primary CTA are within the first viewport. The hrefs include the context parameters.

- [X] T069 [P] Create content section blocks in `src/components/sections/shared/{FeatureGrid,ChallengeList,BenefitList,WorkflowList}.tsx`
  - Meta: P1 · Depends on: T022, T024, T025, T053 · Parallel with: T068, T070 · Spec: FR-031, FR-041 · Const: I, X · Plan: Page & Section Architecture (template section order)
  - Do: Each takes `heading`, `intro?`, and `items` and renders a semantic list (`<ul>` of cards
    or rows) with a responsive grid (1 column, then 2 at `md:`, then 3 at `lg:`; WorkflowList uses
    2 columns at `lg:`). No component-specific colors.
  - Outcome: Reusable template sections.
  - Accept: Each renders correctly with 1 to 8 items, with no overflow at 320px.

- [X] T070 [P] Create RelatedLinks and RelatedProjects in `src/components/sections/shared/{RelatedLinks,RelatedProjects}.tsx`
  - Meta: P1 · Depends on: T060, T058, T024 · Parallel with: T068, T069 · Spec: FR-031, FR-041, FR-054, US3 scenario 4 · Const: IV (internal linking), X · Plan: contracts/routes-and-seo.md › Internal linking guarantees
  - Do: `RelatedLinks` (a heading plus a list of `{ name, href, summary? }`) returns `null` when
    empty. `RelatedProjects` (`projects` and `fallbackToPortfolio?: boolean`) renders
    PortfolioCards linking only when `projectHasPage`. When the list is empty and
    `fallbackToPortfolio` is set, it renders a short line and a link "Browse our portfolio" →
    `/portfolio`; otherwise it renders `null`.
  - Outcome: Deliberate cross-linking without dead ends.
  - Accept: An empty input produces either nothing or the portfolio fallback, as configured.

**Checkpoint**: All building blocks exist. Story phases can now proceed. After Phase 6, stories
US3 to US8 can run in parallel, subject to the per-phase notes.

---

## Phase 6: Forms & Conversion (User Story 2, Priority P1) 🎯 MVP

**Goal**: A decision maker can request a consultation from any page, and U Design reliably
receives it.

**Independent Test**: From any page, reach `/contact#consultation`. Valid input produces success
plus a delivery. Invalid input produces field errors with values kept. A delivery failure
produces an error, values kept, and fallback contacts. It works with JavaScript disabled
(quickstart V1 steps 4 to 8).

- [X] T071 [US2] Define the form field configuration in `src/lib/forms/fields.ts`
  - Meta: P0 · Depends on: T027, T037 · Parallel with: T073, T074, T075 · Spec: FR-080, FR-081 · Const: IX · Plan: AD-07, data-model › ConsultationRequest
  - Do: Export an ordered field config used for rendering **and** native constraints, quoting the
    data-model:
    - `name`: "Required, trimmed, 2–100 chars", `autocomplete="name"`, `maxLength=100`.
    - `company`: "Required, 2–150 chars", `autocomplete="organization"`, `maxLength=150`.
    - `email`: "Required, valid email, ≤ 254 chars", `type="email"`, `autocomplete="email"`.
    - `phone`: "Required, 7–20 chars of `+`, digits, spaces, `-`, `(`, `)` with 7–15 digits",
      `type="tel"`, `autocomplete="tel"`, `pattern="[+0-9 ()\-]{7,20}"`.
    - `industry`: select, required.
    - `need` ("What do you need?"): select, required.
    - `budget` ("Budget range"): select, optional, and **omitted when `getFormOptions().budgets` is empty**.
    - `message`: textarea, optional, `maxLength=2000`.
    - Hidden fields: `sourcePage`, `submissionId`, `renderedAt`, and honeypot `website`.
    Export the `FieldName` type and user-facing labels and error messages exactly as in
    [contracts/consultation-action.md](./contracts/consultation-action.md).
  - Outcome: A single source for form structure.
  - Accept: `typecheck` passes, and the labels match the spec's field list.

- [X] T072 [US2] Implement the server validation schema in `src/lib/forms/consultation-schema.ts`
  - Meta: P0 · Depends on: T071 · Parallel with: T073–T077 · Spec: FR-081, FR-088 · Const: Security & Data Handling · Plan: AD-07, AD-11 (Zod, server-only)
  - Do: Install `zod` (exact). The file starts with `import "server-only"`. The schema trims every
    string, strips control characters (except `\n` in `message`), and enforces the data-model
    rules verbatim (name 2–100, company 2–150, email valid and ≤ 254 and lowercased, phone 7–20
    characters of the allowed set with 7–15 digits, industry and need in the `getFormOptions()`
    allowlists, budget in the allowlist when enabled, message ≤ 2000, `sourcePage` a same-origin
    path ≤ 200 characters, `submissionId` a UUID). Export `parseConsultation(formData)` returning
    `{ ok: true, data } | { ok: false, fieldErrors, values }` with the contract messages. `values`
    are sanitized for re-population.
  - Outcome: Authoritative validation.
  - Accept: Unit tests in T082 pass. Zod is absent from client bundles (checked in T180).

- [X] T073 [P] [US2] Implement spam checks and the signed render timestamp in `src/lib/forms/spam.ts`
  - Meta: P0 · Depends on: T010 · Parallel with: T071, T072, T074, T075 · Spec: FR-087, edge case "spam" · Const: Security · Plan: AD-18 (layers 1–2)
  - Do: `import "server-only"`. `signTimestamp(now)` returns `"<epochMs>.<hex HMAC-SHA256(epochMs, FORM_SIGNING_SECRET)>"`
    (via `node:crypto`). `verifyTimestamp(token, now)` checks the signature and that
    `now - epochMs >= FORM_MIN_FILL_MS` (default 3000) and `≤ 24h`. `isHoneypotFilled(formData)`
    checks the `website` field. `isSpam(formData)` returns true when the honeypot is filled, or
    when a token is **present** and fails verification. A **missing** token, as happens in no-JS
    submissions from the static page, skips only the time check, and the honeypot and rate limit
    still apply. Document this at the top of the file. Because `/contact` is statically
    generated, the token cannot be signed at render time. The form requests it at mount through
    `issueRenderToken()` (T079).
  - Outcome: Low-friction bot filtering compatible with static rendering.
  - Accept: The unit tests (T082) cover a valid token, a tampered token, a too-fast submission, an expired token, a missing token (not spam), and a filled honeypot.

- [X] T074 [P] [US2] Implement the rate limiter and idempotency store in `src/lib/forms/rate-limit.ts`
  - Meta: P1 · Depends on: T010 · Parallel with: T071–T073, T075 · Spec: FR-087 (duplicates), US2 scenario 7 · Const: Security · Plan: AD-18 (layer 3), AD-07 (duplicates)
  - Do: `import "server-only"`. An in-memory sliding window keyed by client IP (from the
    `x-forwarded-for` first hop via `headers()`) allows `FORM_RATE_LIMIT_MAX` (default 5) per 10
    minutes per instance. `rememberSubmission(id)` and `seenSubmission(id)` use a 10-minute TTL
    map, with pruning on each call. Document at the top of the file that this is best-effort per
    instance and that the Vercel WAF rule (T228) is authoritative.
  - Outcome: Duplicate and abuse control.
  - Accept: The unit tests cover the limit, the window reset, and deduplication.

- [X] T075 [P] [US2] Define the lead delivery types and the console adapter in `src/lib/forms/delivery/types.ts` and `src/lib/forms/delivery/console.ts`
  - Meta: P0 · Depends on: T027 · Parallel with: T071–T074 · Spec: FR-086 · Const: IX · Plan: contracts/lead-delivery.md
  - Do: Define the `Lead` and `LeadDeliveryAdapter` types exactly as in the contract. The console
    adapter logs only `{ id, industry: value, need: value }` via `console.warn("[lead]", …)` and
    returns `{ ok: true }`.
  - Outcome: The adapter contract is in code.
  - Accept: The types match the contract, and the console output contains no personal data.

- [X] T076 [P] [US2] Implement the email delivery adapter in `src/lib/forms/delivery/email.ts`
  - Meta: P0 · Depends on: T075, T010 · Parallel with: T077 · Spec: FR-086 · Const: IX, Security · Plan: contracts/lead-delivery.md › Email adapter
  - Do: `import "server-only"`. `fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + RESEND_API_KEY, "Content-Type": "application/json" }, body })`
    with `from: LEAD_EMAIL_FROM`, `to: LEAD_EMAIL_TO` (comma-split), `reply_to: lead.email`,
    `subject: "New consultation request — {company} ({industry.label})"`, and a `text` and `html`
    body listing all fields, the source page, and the time, with **every value HTML-escaped**. Use
    `AbortSignal.timeout(8000)` and one retry on a network error or 5xx. Return
    `{ ok: false, reason }` without leaking provider bodies.
  - Outcome: Email delivery with no SDK dependency.
  - Accept: The unit tests (T083) with mocked `fetch` cover success, a 500 then success on retry, a
    timeout, and HTML escaping of `<script>`.

- [X] T077 [P] [US2] Implement the webhook delivery adapter in `src/lib/forms/delivery/webhook.ts`
  - Meta: P1 · Depends on: T075, T010 · Parallel with: T076 · Spec: FR-086 · Const: IX, Security · Plan: contracts/lead-delivery.md › Webhook adapter
  - Do: `import "server-only"`. `POST LEAD_WEBHOOK_URL` with the JSON body
    `{ "event": "consultation.created", "lead": Lead }` and the header
    `X-UDesign-Signature: sha256=<hex HMAC of raw body with LEAD_WEBHOOK_SECRET>`. Use an 8s
    timeout and one retry on a network error or 5xx. Any 2xx response counts as success.
  - Outcome: CRM, Sheet, and Zapier compatible delivery.
  - Accept: The unit tests verify the signature, retry, and success rules.

- [X] T078 [US2] Implement the adapter selector in `src/lib/forms/delivery/index.ts`
  - Meta: P0 · Depends on: T075, T076, T077 · Parallel with: — · Spec: FR-086 · Const: IX · Plan: contracts/lead-delivery.md (Adapter interface table), research R-1
  - Do: `getAdapters()` reads `LEAD_DELIVERY_PROVIDER`: `email`, `webhook`, `email+webhook`, or
    `console`. It throws a descriptive configuration error for unknown values or missing required
    variables, and when `console` is used with `VERCEL_ENV === "production"`.
    `deliverLead(lead)` runs the adapters in parallel. It succeeds if **at least one** succeeds,
    and logs `console.error("[lead-delivery]", { id, adapter, reason })` for each failure (no
    personal data).
  - Outcome: Configurable, redundant delivery.
  - Accept: The unit tests cover every provider value, partial failure, total failure, and the production console rejection.

- [X] T079 [US2] Implement the `submitConsultation` Server Action in `src/app/actions/consultation.ts`
  - Meta: P0 · Depends on: T072, T073, T074, T078, T028 · Parallel with: — · Spec: FR-081, FR-084, FR-085, FR-086, FR-087 · Const: IX, Security · Plan: AD-07, contracts/consultation-action.md (Behavior table)
  - Do: `"use server"`. Also export `issueRenderToken(): Promise<string>`, which returns
    `signTimestamp(Date.now())` and is used by the form at mount (see T073). If `submissionId` is
    missing (a no-JS post), generate one with `crypto.randomUUID()`. Signature
    `(prev: ConsultationState, formData: FormData) => Promise<ConsultationState>`. Order of
    checks exactly per the contract:
    1. Rate limit → `failed` ("Too many requests…") with fallback contacts.
    2. Spam (honeypot or timestamp) → generic `success`, no delivery.
    3. `seenSubmission(submissionId)` → `success`.
    4. `parseConsultation` → `invalid` with `fieldErrors` and `values`.
    5. Build the `Lead` (labels resolved from form options, `submittedAt` ISO) → `deliverLead`.
       Success → `rememberSubmission` and `success` with the message "Thank you — your request
       has been received. We'll contact you {site.responseTime ?? "soon"}." Failure → `failed`
       with the message "We couldn't send your request right now. Please try again, or contact
       us directly." plus `values` and `fallback` from `site`.
    Never return error objects or stack traces.
  - Outcome: A secure, contract-compliant submission endpoint.
  - Accept: Integration-style unit tests (T082) invoke the action with FormData and cover every Behavior row.

- [X] T080 [US2] Build the ConsultationForm client component in `src/components/forms/ConsultationForm.tsx`
  - Meta: P0 · Depends on: T079, T055, T067, T071, T037, T028 · Parallel with: — · Spec: FR-080–FR-085, FR-088, US2 scenarios 1–7, edge cases (international phone, long message, interactive features fail) · Const: IX, V, III · Plan: AD-07, contracts/consultation-action.md (Accessibility, Pre-selection)
  - Do: `"use client"`. Props: `options` (from `getFormOptions()`, passed by the server parent)
    and `fallback` (email and phone). On mount, call `issueRenderToken()` and store the result in
    the hidden `renderedAt` input.
    - Use `useActionState(submitConsultation, { status: "idle" })` with
      `<form action={formAction} noValidate={hydrated}>`. Before hydration the native constraints
      apply and the form posts without JS.
    - Render fields from `fields.ts` using Field, Input, Select, and Textarea, in 2-column pairs
      at `md:` and 1 column on mobile. Required markers are visible.
    - Hidden inputs: `renderedAt` (from `issueRenderToken()`; empty without JS);
      `submissionId` (`crypto.randomUUID()` on mount; without JS the action generates one
      server-side); `sourcePage`; and the honeypot
      `website` inside an `aria-hidden` wrapper, with `tabIndex={-1}` and `autoComplete="off"`,
      positioned off-screen.
    - After mount, read `window.location.search` and pre-select `industry` and `need` **only**
      when the values are in the allowlists. Set `sourcePage` from `?source=` or a same-origin
      `document.referrer` path.
    - While pending, the submit button shows "Sending…" and is `disabled`.
    - On `invalid`, show the error summary (FormError field list), set `aria-invalid`, and focus
      the first invalid field. On `success`, replace the form with FormSuccess and focus its
      heading. On `failed`, show FormError above the form, keep the values, and focus the error
      heading.
    - The message textarea has a live character counter (`aria-live="polite"`, announced only at
      the 1800 and 2000 thresholds).
    - Add a privacy notice under the submit button: "We use your details only to respond to your
      enquiry. See our [Privacy Policy](/privacy-policy)."
  - Outcome: A professional, accessible, progressively enhanced form.
  - Accept: Quickstart V1 steps 4 to 8 pass manually. The first-load JS for `/contact` stays within
    budget (T180). There are no console errors.

- [X] T081 [US2] Create the Contact page shell with the consultation form in `src/app/contact/page.tsx`
  - Meta: P0 · Depends on: T080, T068, T022, T041 · Parallel with: T082, T083 · Spec: FR-071, FR-082, SC-003 · Const: IX · Plan: Page & Section Architecture (Contact)
  - Do: A Server Component with a PageHero (h1 "Get Free Consultation", a short intro, no CTA
    button because the form is the CTA) and a `<Section id="consultation">` containing a
    heading and `<ConsultationForm options={getFormOptions()} fallback={{ email: site.email, phone: site.phone }} />`.
    The page stays fully static. The render token is issued at mount (T073, T079). Page metadata
    is added in T157, and the contact details block is added in T143.
  - Outcome: A working `/contact#consultation`.
  - Accept: `/contact` is statically generated (the build output marks it static). Submissions
    with JS succeed after 3s. The no-JS submission path succeeds (honeypot and rate limit still
    apply).

- [X] T082 [P] [US2] Write unit tests for validation, spam, rate limit, and the action in `tests/unit/{consultation-schema,spam,rate-limit,consultation-action}.test.ts`
  - Meta: P0 · Depends on: T072, T073, T074, T079 · Parallel with: T083 · Spec: FR-081, FR-085, FR-087, SC-005 · Const: Quality Gates · Plan: AD-17, contracts/consultation-action.md
  - Do: Schema cases: each field's boundaries (name 1/2/100/101 characters, email 254/255, phone
    digit counts 6/7/15/16, message 2000/2001, unknown select values, control characters). Spam
    cases: from T073. Rate-limit cases: from T074. Action cases: every Behavior table row using
    a mocked `deliverLead`.
  - Outcome: The form logic is proven.
  - Accept: `npm test` passes, and the coverage of `src/lib/forms/**` and `src/app/actions/**` is at least 90% lines.

- [X] T083 [P] [US2] Write unit tests for the delivery adapters in `tests/unit/delivery.test.ts`
  - Meta: P0 · Depends on: T076, T077, T078 · Parallel with: T082 · Spec: FR-086, SC-005 · Const: IX · Plan: contracts/lead-delivery.md
  - Do: Mock `fetch`. Cover email success, 5xx then retry success, timeout, and escaping; the
    webhook signature header value and 2xx or 4xx handling; the selector for `email+webhook` with
    one failure (success plus a logged error) and both failing (failure); an invalid provider;
    and `console` in production (throws). Assert that the logs contain no email or phone strings.
  - Outcome: Leads cannot be lost silently.
  - Accept: `npm test` passes.

- [X] T084 [US2] Validate the US2 checkpoint using `specs/001-corporate-website/quickstart.md` (V1 steps 4–8)
  - Meta: P0 · Depends on: T081, T082, T083 · Parallel with: — · Spec: US2 acceptance scenarios 1–7, SC-004, SC-005 · Const: IX · Plan: Implementation Phases (Phase 3 exit)
  - Do: Run through the quickstart V1 steps 4 to 8 on `npm run build && npm start` with the
    `console` adapter: empty submit, invalid email, valid submit, forced failure
    (`LEAD_DELIVERY_PROVIDER=webhook` with an unreachable URL), JS disabled, and double click.
    Time a full completion on mobile emulation.
  - Outcome: US2 is independently verified.
  - Accept: All scenarios behave as in the contract, and completion takes under 2 minutes (SC-004).

**Checkpoint**: The consultation request works end to end and independently. It is part of the MVP.

---

## Phase 7: Homepage (User Story 1, Priority P1) 🎯 MVP

**Goal**: Within seconds, a first-time visitor understands what U Design does, who it serves, and
how to start, and can request a consultation.

**Independent Test**: With only the home page and `/contact` live, a visitor can explain U
Design's offering and submit a request (quickstart V1 steps 1–3).

- [X] T085 [P] [US1] Build the Hero section in `src/components/sections/home/Hero.tsx`
  - Meta: P0 · Depends on: T065, T023, T035, T022 · Parallel with: T086–T096 · Spec: FR-010, FR-011, US1 scenarios 1–2 · Const: I, III, IX · Plan: Page & Section Architecture (Hero), AD-05, AD-12
  - Do: `Section surface="deep"`. On the left: the eyebrow "BUILD. MARKET. GROW." (`text-eyebrow`,
    brand-green), the **h1** "Digital Solutions That Help Businesses Grow" (`text-display`,
    white), the lead text verbatim (`text-lead`, white), a primary ButtonLink "Get Free
    Consultation" → `/contact#consultation` (track location `hero`), and a secondary ButtonLink
    "View Our Solutions" → `/solutions`. On the right (`lg:`): `DashboardPreview variant="full"`.
    Below `lg`: copy and CTAs first, then `DashboardPreview variant="compact"`. There are no
    background images or video. At most one subtle radial gradient in the tokens is allowed as a
    backdrop.
  - Outcome: A hero that explains U Design in seconds.
  - Accept: At 375×667 and 1440×900 the eyebrow, H1, lead text, and both CTAs are above the fold.
    The LCP element is the H1 (checked in T177). CLS is 0.

- [X] T086 [P] [US1] Build the TrustLogos section in `src/components/sections/home/TrustLogos.tsx`
  - Meta: P1 · Depends on: T056, T034 · Parallel with: T085, T087–T096 · Spec: FR-012, US1 scenario 6 · Const: II · Plan: Homepage table (row 3)
  - Do: Heading "Trusted by Growing Businesses". Render only if `getApprovedLogos().length >= 3`;
    otherwise return `null`.
  - Outcome: A trust strip only with real logos.
  - Accept: With the current empty data the section is absent from the HTML.

- [X] T087 [P] [US1] Build the ServicesOverview section in `src/components/sections/home/ServicesOverview.tsx`
  - Meta: P0 · Depends on: T058, T030, T031, T035 · Parallel with: T085, T086, T088–T096 · Spec: FR-013 · Const: I · Plan: Homepage table (row 4)
  - Do: `Section surface="white"`, h2 plus intro from `home.ts`. There are two labelled groups
    (h3), and each group is a `<ul>` of ServiceCards:
    - **Business Software & Digital Solutions**: the 5 solutions (each links to
      `/solutions/[slug]` when `hasPage`), plus the "Business Process Digitalization" item
      linking to `#digitalization`.
    - **Digital Marketing & Growth**: the 7 items flattened from marketing `covers`, each
      linking to its parent `/digital-marketing/[slug]` when `hasPage`, otherwise to
      `/digital-marketing`.
    A closing line connects both groups under "Build. Market. Grow."
  - Outcome: The two service categories are clearly distinct.
  - Accept: 6 software items and 7 marketing items render, with names matching the spec.

- [X] T088 [P] [US1] Build the IndustriesGrid section in `src/components/sections/home/IndustriesGrid.tsx`
  - Meta: P0 · Depends on: T059, T032 · Parallel with: T085–T087, T089–T096 · Spec: FR-014, FR-043 · Const: I, X · Plan: Homepage table (row 5)
  - Do: `Section surface="gray"`. An h2 plus an intro that says solutions adapt to each industry's
    workflow. Show all 8 industries, with Manufacturing as the `feature` IndustryCard first. Each
    card links to `/industries/[slug]` when `hasPage`. Finish with a link "Explore all industries"
    → `/industries`.
  - Outcome: Visitors can identify their industry.
  - Accept: Manufacturing appears first and larger, and all card hrefs match the plan routes once pages exist.

- [X] T089 [P] [US1] Build the FeaturedProjects section in `src/components/sections/home/FeaturedProjects.tsx`
  - Meta: P0 · Depends on: T060, T033 · Parallel with: T085–T088, T090–T096 · Spec: FR-015 · Const: II, X · Plan: Homepage table (row 6)
  - Do: `Section surface="white"`. An h2 and intro about practical business systems. It renders
    only if `getFeaturedProjects().length >= 1`. Each PortfolioCard has `showModules` and a type
    badge. The "View Case Study" link appears only when `projectHasPage`. Finish with a link to
    `/portfolio`.
  - Outcome: Visible proof of capability.
  - Accept: 3 concept projects show their exact module lists and "Concept / Demo" badges in the preview build.

- [X] T090 [P] [US1] Build the DigitalizationJourney section in `src/components/sections/home/DigitalizationJourney.tsx`
  - Meta: P0 · Depends on: T066, T035, T057 · Parallel with: T085–T089, T091–T096 · Spec: FR-016, US1 scenario 4 · Const: I, IX · Plan: Homepage table (row 7)
  - Do: `Section surface="ink" id="digitalization"`. The h2 "Still Managing Your Business With
    Spreadsheets?", followed by the pain-point list (a checklist style that helps visitors
    recognize their own problem), JourneyDiagram with 3 stages, and a primary ButtonLink
    "Discuss Your Business Process" → `consultationHref({ source: "/#digitalization" })`.
  - Outcome: Business owners recognize their operational problems.
  - Accept: The headline, 3 stages, and CTA match the spec, and the CTA reaches `/contact#consultation`.

- [X] T091 [P] [US1] Build the "How We Work" ProcessSteps section in `src/components/sections/home/ProcessSteps.tsx`
  - Meta: P1 · Depends on: T062, T035 · Parallel with: T085–T090, T092–T096 · Spec: FR-017 · Const: I · Plan: Homepage table (row 8)
  - Do: `Section surface="white"`. An h2 "How We Work" (intro from `process.ts`) and
    `<ProcessSteps steps={process} />`.
  - Outcome: Less uncertainty about working with U Design.
  - Accept: Six steps (01 Discover to 06 Grow) appear with the spec descriptions in the responsive layouts of T062.

- [X] T092 [P] [US1] Build the MarketingOverview section in `src/components/sections/home/MarketingOverview.tsx`
  - Meta: P1 · Depends on: T058, T035 · Parallel with: T085–T091, T093–T096 · Spec: FR-018 · Const: I, II · Plan: Homepage table (row 9)
  - Do: `Section surface="gray"`. The h2 "Don't Just Build Your Business. Grow It.", then the 6
    items as ServiceCards (no links, or links to marketing pages), the outcome bullets, and the
    secondary-style CTA "Grow Your Business" → `/digital-marketing`. There are no guarantees or
    numbers.
  - Outcome: The marketing capability is connected to growth.
  - Accept: The text passes integrity rule 8, and the CTA label is from the approved set.

- [X] T093 [P] [US1] Build the WhyUDesign section in `src/components/sections/home/WhyUDesign.tsx`
  - Meta: P1 · Depends on: T053, T035 · Parallel with: T085–T092, T094–T096 · Spec: FR-019 · Const: I · Plan: Homepage table (row 10)
  - Do: `Section surface="white"`. An h2 "Why U Design" and 4 feature Cards (Business-Focused,
    Custom-Built, Scalable, One Digital Partner) with their spec descriptions, in a responsive
    grid (1, then 2, then 4 columns).
  - Outcome: Trust-building reasons.
  - Accept: 4 cards appear with the exact titles.

- [X] T094 [P] [US1] Build the gated CredibilityMetrics section in `src/components/sections/home/CredibilityMetrics.tsx`
  - Meta: P2 · Depends on: T063, T034 · Parallel with: T085–T093, T095, T096 · Spec: FR-110 · Const: II · Plan: Homepage table (row 11)
  - Do: Render only if `getVerifiedStats().length >= 3` (StatCards in a `<dl>` grid); otherwise
    return `null`.
  - Outcome: The metrics slot is ready without fake numbers.
  - Accept: Absent from the HTML with the current data. A fixture with 3 verified stats renders it.

- [X] T095 [P] [US1] Build the gated Testimonials section in `src/components/sections/home/Testimonials.tsx`
  - Meta: P2 · Depends on: T064, T034 · Parallel with: T085–T094, T096 · Spec: FR-110 · Const: II · Plan: Homepage table (row 12)
  - Do: Render only if `getVerifiedTestimonials().length >= 1`; otherwise return `null`.
  - Outcome: The testimonial slot is ready and easy to enable.
  - Accept: Absent with the current data.

- [X] T096 [P] [US1] Build the FinalCta section in `src/components/sections/home/FinalCta.tsx`
  - Meta: P0 · Depends on: T068, T035 · Parallel with: T085–T095 · Spec: FR-020 · Const: IX · Plan: Homepage table (row 13)
  - Do: Use `CtaBanner` on `surface="deep"` with the title and text from `home.finalCta`, the
    primary "Get Free Consultation", and the optional secondary "View Our Solutions".
  - Outcome: A closing conversion point.
  - Accept: One primary and at most one secondary CTA.

- [X] T097 [US1] Compose the home page in the required section order in `src/app/page.tsx`
  - Meta: P0 · Depends on: T085–T096 · Parallel with: — · Spec: FR-010–FR-020, US1 scenario 3 · Const: I, VII (surface rhythm) · Plan: Homepage table, Design System (section surface rhythm)
  - Do: Replace the T006 placeholder. The order is Hero → TrustLogos → ServicesOverview →
    IndustriesGrid → FeaturedProjects → DigitalizationJourney → ProcessSteps → MarketingOverview →
    WhyUDesign → CredibilityMetrics → Testimonials → FinalCta (the Header and Footer come from
    the layout). Verify the surface rhythm: deep, white, gray, white, ink, white, gray, white,
    deep, with no two dark surfaces adjacent (because the gated sections are absent). Page
    metadata is added in T156.
  - Outcome: The complete home page.
  - Accept: The DOM order matches, and there is exactly one `h1`, with heading levels never skipping.

- [X] T098 [US1] Validate the US1 checkpoint using `specs/001-corporate-website/quickstart.md` (V1 steps 1–3)
  - Meta: P0 · Depends on: T097, T084 · Parallel with: — · Spec: US1 scenarios 1–6, SC-001 (proxy), SC-003 · Const: Design Quality Gate · Plan: Implementation Phases (Phase 4 exit, MVP)
  - Do: On the production build with `CONTENT_INCLUDE_DRAFTS=true`, check 375px and 1440px: the
    above-the-fold content, the section order, the absence of the gated sections, and that
    "Discuss Your Business Process" reaches the form. Run a Lighthouse mobile spot check on `/`.
  - Outcome: The MVP (US1 plus US2) is verified.
  - Accept: All checks pass, and the Lighthouse mobile Performance and Accessibility scores are at least 90.

**Checkpoint**: 🎯 **MVP complete.** The home page and consultation form are ready to demo or
deploy (with a Privacy Policy, see T144).

---

## Phase 8: Solutions (User Story 4, Priority P2)

**Goal**: An IT manager or decision maker can explore the software solutions, understand the
business value, and request a consultation with the relevant need pre-selected.

**Independent Test**: `/solutions` lists 5 solutions. `/solutions/erp` presents problem → approach
→ features → benefits → industries → projects → CTA, and the CTA pre-selects need = ERP
(quickstart V3).

- [X] T099 [US4] Build SolutionTemplate in `src/components/templates/SolutionTemplate.tsx`
  - Meta: P1 · Depends on: T068, T069, T070, T062, T049 · Parallel with: T102–T106 · Spec: FR-008, FR-031, FR-032, US4 scenarios 2–3 · Const: I, IX, X · Plan: Page & Section Architecture (SolutionTemplate)
  - Do: Props: `solution` (the `hasPage: true` variant), resolved `industries` and `projects`. In
    order:
    - PageHero with breadcrumbs Home › Solutions › {name}, the h1 `hero.heading`, `hero.intro`,
      the primary CTA with `need=<slug>`, and the secondary "View Case Study" only if a related
      project has a page.
    - ChallengeList (`problem`), an "How it helps" prose block (`approach`), FeatureGrid,
      BenefitList, and RelatedLinks (suitable industries → `/industries/[slug]`).
    - RelatedProjects (no fallback), then compact ProcessSteps.
    - An FAQ `<dl>` only when `faqs` exist.
    - CtaBanner with `need` context.
  - Outcome: One template for every solution page.
  - Accept: With fixture content, all sections render in order. Empty relations hide their sections. There is one h1.

- [X] T100 [US4] Build the Solutions hub page in `src/app/solutions/page.tsx`
  - Meta: P1 · Depends on: T058, T068, T030 · Parallel with: T101 · Spec: FR-030, US4 scenario 1 · Const: I, XI · Plan: Page & Section Architecture (Hubs)
  - Do: PageHero (h1, an intro on custom-built software around your workflow, breadcrumbs), then
    a grid of ServiceCards for `getSolutions()` (each links when `hasPage`), then a short "Not
    sure what you need?" CtaBanner with `need=not-sure`. Metadata is added in T157.
  - Outcome: The capability overview.
  - Accept: Shows 5 cards with one-line benefits, and links resolve for solutions with pages.

- [X] T101 [US4] Create the dynamic solution route in `src/app/solutions/[slug]/page.tsx`
  - Meta: P1 · Depends on: T099, T030 · Parallel with: T100 · Spec: FR-031, FR-130 · Const: III, XI · Plan: AD-01, AD-02
  - Do: `export const dynamicParams = false`. `generateStaticParams()` returns the slugs of
    solutions where `hasPage()`. The page resolves the solution and its relations and calls
    `notFound()` if the solution is missing. It renders SolutionTemplate. Metadata is added in
    T158.
  - Outcome: Solution pages are generated from data.
  - Accept: The build output lists the statically generated paths, and an unknown slug returns 404.

- [X] T102 [P] [US4] Draft the full Custom Software page content in `src/content/solutions/custom-software.ts`
  - Meta: P1 · Depends on: T030 · Parallel with: T099–T101, T103–T106 · Spec: FR-031, FR-032, FR-104 · Const: I, II · Plan: Content Implementation Rules
  - Do: Convert the entry to `hasPage: true` and keep `status: "draft"`. Write `hero`, `problem`
    (manual and Excel processes, disconnected tools), `approach` (built around the client's actual
    workflow), `features` (≥ 4), `benefits` (≥ 3, business outcomes), `useCases`, `industries`
    (relevant slugs), `projects: ["travel-agency-management"]`, `cta`, and `seo` (a unique title
    of 30–60 characters and a description of 70–160 characters that naturally cover "custom
    software development" and "business software development"). Also cover Business Process
    Digitalization here. No numbers, clients, or guarantees.
  - Outcome: Review-ready copy.
  - Accept: Integrity rules 1, 2, 6, 7, and 8 pass, and the page renders in the preview build.

- [X] T103 [P] [US4] Draft the full ERP Systems page content in `src/content/solutions/erp.ts`
  - Meta: P1 · Depends on: T030 · Parallel with: T099–T102, T104–T106 · Spec: FR-031, FR-032, FR-104 · Const: I, II · Plan: Content Implementation Rules, research R-2 (priority page)
  - Do: As T102. The problem and features cover operations, inventory, production, purchasing,
    sales, and reporting. `industries` includes manufacturing, distribution, and retail.
    `projects: ["manufacturing-erp"]`. `seo` naturally covers "custom ERP development" and
    "manufacturing ERP software".
  - Outcome: Review-ready copy for the priority page.
  - Accept: Same as T102. The page links to Manufacturing (FR-031, internal link ERP → Manufacturing).

- [X] T104 [P] [US4] Draft the full CRM Solutions page content in `src/content/solutions/crm.ts`
  - Meta: P1 · Depends on: T030 · Parallel with: T099–T103, T105, T106 · Spec: FR-031, FR-032, FR-104 · Const: I, II
  - Do: As T102. Focus on leads, customers, sales pipeline, and follow-ups. `industries` includes
    real-estate, travel, and distribution. `projects: ["real-estate-crm", "travel-agency-management"]`.
    `seo` covers "CRM development".
  - Outcome: Review-ready copy.
  - Accept: Same as T102.

- [X] T105 [P] [US4] Draft the full Business Dashboards page content in `src/content/solutions/business-dashboards.ts`
  - Meta: P1 · Depends on: T030 · Parallel with: T099–T104, T106 · Spec: FR-031, FR-032, FR-104 · Const: I, II
  - Do: As T102. Focus on real-time visibility, management reporting, and data from disconnected
    sources. `projects: ["manufacturing-erp"]`. `seo` covers "business dashboard development".
  - Outcome: Review-ready copy.
  - Accept: Same as T102.

- [X] T106 [P] [US4] Draft the full Workflow Automation page content in `src/content/solutions/automation.ts`
  - Meta: P1 · Depends on: T030 · Parallel with: T099–T105 · Spec: FR-031, FR-032, FR-104 · Const: I, II
  - Do: As T102. Focus on reducing repetitive manual work, approvals, notifications, and moving
    off spreadsheets and WhatsApp. `seo` covers "business process automation".
  - Outcome: Review-ready copy.
  - Accept: Same as T102.

- [X] T107 [US4] Validate the US4 checkpoint using `specs/001-corporate-website/quickstart.md` (V3)
  - Meta: P1 · Depends on: T100–T106 · Parallel with: — · Spec: US4 scenarios 1–3 · Const: Design Quality Gate · Plan: Implementation Phases (Phase 5 exit)
  - Do: In the preview build, check the hub and all 5 pages at 375px and 1440px. Confirm the CTA
    on `/solutions/erp` pre-selects ERP in the form, and that `npm test` passes the integrity rules.
  - Outcome: US4 is independently verified.
  - Accept: All scenarios pass, with no overflow and one h1 per page.

---

## Phase 9: Industries (User Story 3, Priority P2)

**Goal**: A manufacturing (or other industry) visitor finds their industry, recognizes their
workflows, sees suitable solutions and related projects, and requests a consultation with the
industry pre-selected.

**Independent Test**: `/industries` → `/industries/manufacturing` within 2 actions from home. The
page covers challenges, workflows (including raw materials and warehouse), solutions, features,
benefits, the related Manufacturing ERP (Concept/Demo), and a CTA that pre-selects Manufacturing
(quickstart V2).

- [X] T108 [US3] Build IndustryTemplate in `src/components/templates/IndustryTemplate.tsx`
  - Meta: P1 · Depends on: T068, T069, T070, T049 · Parallel with: T111–T118 · Spec: FR-008, FR-041, FR-042, US3 scenarios 2–4 · Const: I, IX, X · Plan: Page & Section Architecture (IndustryTemplate)
  - Do: In order:
    - PageHero with breadcrumbs Home › Industries › {name} and the CTA with `industry=<slug>`.
    - ChallengeList (challenges), WorkflowList (workflows), RelatedLinks (suitable solutions →
      `/solutions/[slug]`), FeatureGrid, and BenefitList.
    - RelatedProjects with `fallbackToPortfolio`.
    - CtaBanner with `industry` context.
  - Outcome: One template for every industry.
  - Accept: With fixtures, all 7 required content areas render (FR-041). An empty project list shows the portfolio fallback.

- [X] T109 [US3] Build the Industries hub page in `src/app/industries/page.tsx`
  - Meta: P1 · Depends on: T059, T068, T032 · Parallel with: T110 · Spec: FR-040, FR-043, edge case "industry not listed" · Const: I, X · Plan: Page & Section Architecture (Hubs)
  - Do: PageHero, then an IndustryCard grid (Manufacturing as a `feature` card first, others by
    priority, each linking when `hasPage`), then an "Other industry?" note ("Our solutions are
    adapted to your specific workflow") with a CtaBanner using `industry=other`.
  - Outcome: Industry discovery.
  - Accept: 8 cards appear with Manufacturing first. The "Other" CTA pre-selects Other in the form.

- [X] T110 [US3] Create the dynamic industry route in `src/app/industries/[slug]/page.tsx`
  - Meta: P1 · Depends on: T108, T032 · Parallel with: T109 · Spec: FR-041, FR-130 · Const: III, XI · Plan: AD-01, AD-02
  - Do: The same pattern as T101 (`dynamicParams = false`, `generateStaticParams` from `hasPage`,
    `notFound()`), resolving solutions and projects. Metadata is added in T159.
  - Outcome: Industry pages are generated from data.
  - Accept: Unknown slugs return 404, and the static paths are listed in the build output.

- [X] T111 [P] [US3] Draft the full Manufacturing page content in `src/content/industries/manufacturing.ts`
  - Meta: P1 · Depends on: T032 · Parallel with: T108–T110, T112–T118 · Spec: FR-041, FR-042, FR-043, FR-104 · Const: I, II, X · Plan: research R-2 (priority page, reference quality)
  - Do: `hasPage: true`, `status: "draft"`. `challenges` (≥ 3, specific to manufacturing:
    production planning on spreadsheets, stock and raw-material visibility, purchase delays,
    manual reporting to management). `workflows` MUST include Production management, Inventory,
    Raw materials, Purchasing, Sales, Warehouse, Reporting, and Management dashboards (FR-043),
    each with a one-line description. `solutions: ["erp", "business-dashboards", "custom-software", "automation"]`,
    plus `features`, `benefits`, `projects: ["manufacturing-erp"]`, `cta`, and `seo` (naturally
    covering "manufacturing ERP software", "manufacturing management software", and "inventory
    management software"). Mention the relevant sub-sectors (textile, packaging, automotive parts,
    food, pharmaceuticals, plastic, chemicals, engineering) naturally, without claims of past
    clients.
  - Outcome: The reference-quality industry page.
  - Accept: All 8 workflows are present, and integrity rules 1, 2, 6, 8, and 9 pass.

- [X] T112 [P] [US3] Draft the full Distribution page content in `src/content/industries/distribution.ts`
  - Meta: P1 · Depends on: T032 · Parallel with: T108–T111, T113–T118 · Spec: FR-041, FR-042 · Const: I, II, X
  - Do: As T111, specific to distribution: sales, inventory, multi-warehouse stock, orders,
    customers, reporting, and route and order-to-delivery visibility. Solutions: erp, crm, and
    business-dashboards. Projects: `[]` (fallback to the portfolio).
  - Outcome: Distinct copy.
  - Accept: Integrity rule 9 (distinctness) passes against Manufacturing.

- [X] T113 [P] [US3] Draft the full Real Estate page content in `src/content/industries/real-estate.ts`
  - Meta: P1 · Depends on: T032 · Parallel with: T108–T112, T114–T118 · Spec: FR-041, FR-042 · Const: I, II, X
  - Do: As T111, specific to real estate: leads, properties and inventory of units, sales, site
    visits, bookings, installments and payments, and customers. Solutions: crm, business-dashboards,
    and custom-software. Projects: `["real-estate-crm"]`.
  - Outcome: Distinct copy.
  - Accept: Rule 9 passes, and the project link resolves.

- [X] T114 [P] [US3] Draft the full Construction page content in `src/content/industries/construction.ts`
  - Meta: P1 · Depends on: T032 · Parallel with: T108–T113, T115–T118 · Spec: FR-041, FR-042 · Const: I, II, X
  - Do: As T111, specific to construction: projects, procurement, materials, expenses, site
    progress, and subcontractor coordination. Solutions: custom-software, erp, business-dashboards.
    Projects: `[]`.
  - Outcome: Distinct copy.
  - Accept: Rule 9 passes.

- [X] T115 [P] [US3] Draft the full Logistics page content in `src/content/industries/logistics.ts`
  - Meta: P1 · Depends on: T032 · Parallel with: T108–T114, T116–T118 · Spec: FR-041, FR-042 · Const: I, II, X
  - Do: As T111, specific to logistics: fleet, shipments, drivers, fuel, maintenance, and
    operations visibility. Solutions: custom-software, business-dashboards, automation. Projects:
    `[]`.
  - Outcome: Distinct copy.
  - Accept: Rule 9 passes.

- [X] T116 [P] [US3] Draft the full Travel & Tourism page content in `src/content/industries/travel.ts`
  - Meta: P1 · Depends on: T032 · Parallel with: T108–T115, T117, T118 · Spec: FR-041, FR-042 · Const: I, II, X
  - Do: As T111, specific to travel: customers, leads, packages, bookings, visa processing, and
    payments. Solutions: custom-software, crm. Projects: `["travel-agency-management"]`.
  - Outcome: Distinct copy.
  - Accept: Rule 9 passes, and the project link resolves.

- [X] T117 [P] [US3] Draft the full Healthcare page content in `src/content/industries/healthcare.ts`
  - Meta: P1 · Depends on: T032 · Parallel with: T108–T116, T118 · Spec: FR-041, FR-042 · Const: I, II, X
  - Do: As T111, specific to healthcare business operations: patients, appointments,
    consultations, billing, and business operations. It must make **no** clinical or regulatory
    compliance claims. Solutions: custom-software, crm, business-dashboards. Projects: `[]`.
  - Outcome: Distinct copy.
  - Accept: Rule 9 passes, and the text contains no compliance claims (such as HIPAA).

- [X] T118 [P] [US3] Draft the full Retail page content in `src/content/industries/retail.ts`
  - Meta: P1 · Depends on: T032 · Parallel with: T108–T117 · Spec: FR-041, FR-042 · Const: I, II, X
  - Do: As T111, specific to retail: products, inventory, sales, customers, reporting, and
    multi-branch stock. Solutions: erp, crm, business-dashboards. Projects: `[]`.
  - Outcome: Distinct copy.
  - Accept: Rule 9 passes.

- [X] T119 [US3] Validate the US3 checkpoint using `specs/001-corporate-website/quickstart.md` (V2)
  - Meta: P1 · Depends on: T109–T118 · Parallel with: — · Spec: US3 scenarios 1–5, SC-003 · Const: X, Design Quality Gate · Plan: Implementation Phases (Phase 6 exit)
  - Do: Go from Home → Industries → Manufacturing (at most 2 actions). Review the content areas,
    the related project, and the CTA pre-selection. Compare two industry pages for distinctness.
  - Outcome: US3 is independently verified.
  - Accept: All scenarios pass, and `npm test` (rule 9) passes.

---

## Phase 10: Portfolio (User Story 5, Priority P2)

**Goal**: A decision maker reviews proof of capability, following Problem → Solution → Features →
Business Application with captioned product UI, and clearly sees each project's type.

**Independent Test**: `/portfolio` shows 3 projects with Concept/Demo badges.
`/portfolio/manufacturing-erp` follows the narrative with captioned screenshots and no client
fields or results. An unknown slug returns 404 (quickstart V4).

- [X] T120 [US5] Build ScreenshotGallery in `src/components/portfolio/ScreenshotGallery.tsx`
  - Meta: P1 · Depends on: T020, T027 · Parallel with: T121, T126–T128 · Spec: FR-051, FR-053 · Const: III, VI, X · Plan: Portfolio (ScreenshotGallery), AD-05
  - Do: Props: `screenshots: Screenshot[]`. Each item is a `<figure>` with `next/image`
    (intrinsic dimensions, `sizes="(min-width:1280px) 560px, (min-width:768px) 50vw, 90vw"`, lazy)
    and a `<figcaption>`. Each image is wrapped in a plain `<a href={image.src}>` to open it at
    full size. On mobile, use a horizontal scroll-snap strip **inside its own region**
    (`role="region"`, `aria-label="Screenshots"`, `tabIndex={0}`, `overflow-x-auto`). At `md:`
    and above, use a 2-column grid. There is no lightbox JS.
  - Outcome: A legible, contextual product UI gallery.
  - Accept: Screenshots are legible at 375px. The page body has no horizontal overflow, and the region is keyboard-scrollable.

- [X] T121 [US5] Add the preview-only pending-screenshot asset and guard in `src/assets/portfolio/pending-screenshot.png` and `src/lib/content/projects.ts`
  - Meta: P2 · Depends on: T033 · Parallel with: T120, T126–T128 · Spec: edge case "screenshots unavailable", FR-110 · Const: II · Plan: data-model integrity rules 5–6
  - Do: Create a neutral 1600×1000 PNG made only from token colors, with the text "Screenshot
    pending — preview only". Export `PENDING_SCREENSHOT` and mark it with a flag `isPlaceholder`.
    `projectHasPage()` returns **false** in production if any screenshot is the placeholder.
    Extend integrity rule 6 so that a published project using the placeholder fails the test.
  - Outcome: Portfolio pages can be built and tested before real screenshots arrive (Q-4), and the placeholder can never ship.
  - Accept: In the preview build, drafts show the pending frame. The unit test proves that a published project with the placeholder fails.

- [X] T122 [US5] Build ProjectTemplate in `src/components/templates/ProjectTemplate.tsx`
  - Meta: P1 · Depends on: T120, T060, T068, T070, T049 · Parallel with: T123 · Spec: FR-051, FR-052, FR-054, US5 scenarios 2–4 · Const: II, X · Plan: Portfolio (ProjectTemplate)
  - Do: In order:
    - A header with breadcrumbs Home › Portfolio › {title}, the h1 title, ProjectTypeBadge,
      `industryLabel`, and solution tags as links.
    - "The challenge" (`challenge`), "The solution" (`solution`), "Key features" (modules as a
      FeatureGrid), ScreenshotGallery, and "Business application".
    - "Technologies" (only if present, visually secondary).
    - "Results" **only if `type === "client"` and results exist**.
    - RelatedLinks to the industry and solutions.
    - CtaBanner with the secondary "Discuss Your Business" and `industry` context.
  - Outcome: Narrative case studies.
  - Accept: For concept projects there is no client or results markup (a DOM assertion). The section order matches FR-051.

- [X] T123 [US5] Build the Portfolio index page in `src/app/portfolio/page.tsx`
  - Meta: P1 · Depends on: T060, T068, T033 · Parallel with: T122, T124 · Spec: FR-050, US5 scenario 1 · Const: II, X · Plan: Portfolio (index)
  - Do: PageHero, then a grid of PortfolioCards for `getProjects()` (links when
    `projectHasPage`), then CtaBanner. It includes `<PortfolioFilter>` (T124) above the grid,
    which renders nothing when there are 6 or fewer projects. Metadata is added in T157.
  - Outcome: A portfolio listing.
  - Accept: 3 cards with badges appear, and the full list is present in the server HTML.

- [X] T124 [US5] Build the PortfolioFilter client island in `src/components/portfolio/PortfolioFilter.tsx`
  - Meta: P2 · Depends on: T123 · Parallel with: — · Spec: FR-050, US5 scenario 6 · Const: III · Plan: Portfolio (PortfolioFilter), AD-06
  - Do: `"use client"`. Props: `industries` and `solutions` (option lists) and `count`. It returns
    `null` when `count <= 6`. Otherwise it shows two `<select>` controls (Industry, Solution
    type) and reads and writes the URL hash (`#industry=…&solution=…`). It toggles the `hidden`
    attribute on cards via `data-industry` and `data-solutions` attributes, which PortfolioCard
    renders. It announces the result count in `aria-live="polite"`. There is no data fetching.
  - Outcome: Filtering without harming crawlability.
  - Accept: With a 7-project fixture, the filtering works and the count is announced. With 3 projects nothing renders and no JS chunk loads for it.

- [X] T125 [US5] Create the dynamic project route in `src/app/portfolio/[slug]/page.tsx`
  - Meta: P1 · Depends on: T122, T121 · Parallel with: — · Spec: FR-051, FR-130, edge case "screenshots unavailable" · Const: II, III · Plan: AD-01, contracts/routes-and-seo.md (gate: at least 1 screenshot)
  - Do: `dynamicParams = false`. `generateStaticParams()` returns the slugs where
    `projectHasPage()`. Unknown slugs call `notFound()`. The page renders ProjectTemplate.
    Metadata is added in T161.
  - Outcome: Project pages are generated from data.
  - Accept: `/portfolio/does-not-exist` returns 404, and each visible project with screenshots builds.

- [X] T126 [P] [US5] Draft the full Manufacturing ERP project content in `src/content/projects/manufacturing-erp.ts`
  - Meta: P1 · Depends on: T033, T121 · Parallel with: T120, T122–T125, T127, T128 · Spec: FR-051, FR-052 · Const: II, X · Plan: data-model › Project
  - Do: `type: "concept"`. Write `challenge` (a textile manufacturer's disconnected production,
    inventory, and purchasing data, framed as a representative scenario rather than a named
    client), `solution`, `modules` (the 6 from the spec with descriptions), `businessApplication`
    (centralize operations and management visibility), and `seo`. Set `screenshots` to the
    pending asset with captions per module until U Design supplies real UI (T220). No `client`,
    no `results`.
  - Outcome: Review-ready concept case study.
  - Accept: Integrity rules 3, 5, and 6 behave as designed (it passes as a draft and is blocked from publishing while the placeholder remains).

- [X] T127 [P] [US5] Draft the full Travel Agency Management project content in `src/content/projects/travel-agency-management.ts`
  - Meta: P1 · Depends on: T033, T121 · Parallel with: T120, T122–T126, T128 · Spec: FR-051, FR-052 · Const: II, X
  - Do: As T126, using the 8 spec modules and the purpose "a centralized system for managing
    travel agency operations".
  - Outcome: Review-ready concept case study.
  - Accept: Same as T126.

- [X] T128 [P] [US5] Draft the full Real Estate CRM project content in `src/content/projects/real-estate-crm.ts`
  - Meta: P1 · Depends on: T033, T121 · Parallel with: T120, T122–T127 · Spec: FR-051, FR-052 · Const: II, X
  - Do: As T126, using the 8 spec modules and the purpose "centralize sales and customer management".
  - Outcome: Review-ready concept case study.
  - Accept: Same as T126.

- [X] T129 [US5] Validate the US5 checkpoint using `specs/001-corporate-website/quickstart.md` (V4)
  - Meta: P1 · Depends on: T123–T128 · Parallel with: — · Spec: US5 scenarios 1–6 · Const: II, X · Plan: Implementation Phases (Phase 7 exit)
  - Do: In the preview build, check the list, the badges, all 3 detail pages, the 404, and the
    home FeaturedProjects "View Case Study" links.
  - Outcome: US5 is independently verified.
  - Accept: All scenarios pass. No client or result markup appears on concept projects.

---

## Phase 11: Digital Marketing (User Story 6, Priority P3 story; P2 tasks)

**Goal**: A marketing decision maker understands each marketing service by its business outcome,
sees how marketing connects with software, and requests a consultation.

**Independent Test**: `/digital-marketing` plus `/digital-marketing/meta-ads` present
outcome-based copy with no guarantees, and the CTA pre-selects the service (quickstart V5).

- [X] T130 [US6] Build MarketingServiceTemplate in `src/components/templates/MarketingServiceTemplate.tsx`
  - Meta: P2 · Depends on: T068, T069, T070, T049 · Parallel with: T133–T137 · Spec: FR-008, FR-060, FR-061 · Const: I, II, IX · Plan: Page & Section Architecture (MarketingServiceTemplate)
  - Do: In order:
    - PageHero with breadcrumbs Home › Digital Marketing › {name}, the primary CTA with
      `need=<slug>`, and the secondary "Grow Your Business" → `/digital-marketing`.
    - Problem (ChallengeList), "What we do" (FeatureGrid from `covers` plus `features`), and
      "Outcomes" (BenefitList from `outcomes`, no guarantees).
    - A "Build. Market. Grow." connection block linking to `/solutions`.
    - CtaBanner.
  - Outcome: One marketing page template.
  - Accept: Fixture rendering follows the section order and has one h1.

- [X] T131 [US6] Build the Digital Marketing hub page in `src/app/digital-marketing/page.tsx`
  - Meta: P2 · Depends on: T058, T068, T031 · Parallel with: T132 · Spec: FR-060, FR-061, US6 scenarios 1–3 · Const: I, II · Plan: Page & Section Architecture, AD-02 (marketing slugs note)
  - Do: PageHero ("Don't Just Build Your Business. Grow It." may be reused as the h1), followed by
    ServiceCards for all 7 covered services grouped under their 5 entries (links when
    `hasPage`), a Digital Strategy block (hub-only content from T137), the connection to
    software, and CtaBanner with the secondary "Grow Your Business".
  - Outcome: The marketing overview.
  - Accept: All 7 service names from FR-060 appear, and there is no guarantee wording.

- [X] T132 [US6] Create the dynamic marketing route in `src/app/digital-marketing/[slug]/page.tsx`
  - Meta: P2 · Depends on: T130, T031 · Parallel with: T131 · Spec: FR-060, FR-130 · Const: III, XI · Plan: AD-01, AD-02
  - Do: The same pattern as T101. Metadata is added in T160.
  - Outcome: Marketing pages are generated from data.
  - Accept: The 4 slugs (`social-media`, `meta-ads`, `content`, `lead-generation`) build. `digital-strategy` returns 404 until it has a page.

- [X] T133 [P] [US6] Draft the full Social Media page content in `src/content/marketing/social-media.ts`
  - Meta: P2 · Depends on: T031 · Parallel with: T130–T132, T134–T137 · Spec: FR-060, FR-061, FR-104 · Const: I, II
  - Do: `hasPage: true`, `status: "draft"`. Covers Social Media Marketing and Management.
    Outcome-based copy for B2B brands, with `seo` covering "social media marketing". No guarantees
    or statistics.
  - Outcome: Review-ready copy.
  - Accept: Integrity rules 2, 6, and 8 pass.

- [X] T134 [P] [US6] Draft the full Meta Ads page content in `src/content/marketing/meta-ads.ts`
  - Meta: P2 · Depends on: T031 · Parallel with: T130–T133, T135–T137 · Spec: FR-060, FR-061, FR-104 · Const: I, II
  - Do: As T133. Cover campaign strategy, audience targeting, creative, and performance tracking.
    `seo` covers "Meta Ads management".
  - Outcome: Review-ready copy.
  - Accept: Same as T133.

- [X] T135 [P] [US6] Draft the full Content Creation page content in `src/content/marketing/content.ts`
  - Meta: P2 · Depends on: T031 · Parallel with: T130–T134, T136, T137 · Spec: FR-060, FR-061 · Const: I, II
  - Do: As T133. Cover brand visibility and B2B content formats.
  - Outcome: Review-ready copy.
  - Accept: Same as T133.

- [X] T136 [P] [US6] Draft the full Lead Generation page content in `src/content/marketing/lead-generation.ts`
  - Meta: P2 · Depends on: T031 · Parallel with: T130–T135, T137 · Spec: FR-060, FR-061, FR-104 · Const: I, II
  - Do: As T133. Cover Lead Generation and Performance Marketing, with measurement and optimization
    and no guaranteed lead counts. `seo` covers "lead generation services" and "digital marketing
    services".
  - Outcome: Review-ready copy.
  - Accept: Same as T133.

- [X] T137 [P] [US6] Draft the Digital Strategy hub-only content in `src/content/marketing/digital-strategy.ts`
  - Meta: P3 · Depends on: T031 · Parallel with: T130–T136 · Spec: FR-060 · Const: I, II · Plan: AD-02 (hub only until published)
  - Do: Keep `hasPage: false`. Expand the `summary` and `covers` benefit so the hub block can
    describe strategy (goals, channels, a roadmap connecting marketing to business systems).
  - Outcome: Digital Strategy is represented on the hub.
  - Accept: It renders on the hub and has no route.

- [X] T138 [US6] Validate the US6 checkpoint using `specs/001-corporate-website/quickstart.md` (V5)
  - Meta: P2 · Depends on: T131–T137 · Parallel with: — · Spec: US6 scenarios 1–3 · Const: II · Plan: Implementation Phases (Phase 8 exit)
  - Do: Review the hub and the 4 pages in the preview build, and grep the rendered HTML for
    "guarantee".
  - Outcome: US6 is independently verified.
  - Accept: All scenarios pass, with zero occurrences of guarantee wording.

---

## Phase 12: About & Contact (User Story 7, Priority P3 story; P1–P2 tasks)

**Goal**: A cautious buyer can judge credibility (About) and reach U Design through every channel
that has been provided (Contact). The Privacy Policy, a launch blocker, is added here along with
the MDX setup it needs.

**Independent Test**: The About page covers all FR-070 areas without unverified claims. The
Contact page shows the form plus only the configured channels (quickstart V6).

- [X] T139 [US7] Configure MDX support in `next.config.ts` and `src/mdx-components.tsx`
  - Meta: P1 · Depends on: T004, T019 · Parallel with: T140, T142 · Spec: FR-090, FR-111 · Const: Tech Stack, XI · Plan: AD-08, Dependency Decisions (`@next/mdx` family)
  - Do: Install `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, and `@types/mdx` (exact). Wrap
    the config with `createMDX()` and keep the existing `headers` and `redirects`. With the `src/`
    layout, `mdx-components.tsx` **must** be `src/mdx-components.tsx` (this corrects the plan
    tree, which showed it at the root). It maps `h2`, `h3`, `p`, `a` (internal links use
    `next/link`, external links get `rel`), `ul`, `ol`, `blockquote`, and `img` (via
    `next/image`) to design-system styles inside `.prose-udesign`.
  - Outcome: MDX is available for legal pages and the blog.
  - Accept: Importing a test `.mdx` file renders with styled elements. Build and typecheck pass.

- [X] T140 [P] [US7] Draft the About content in `src/content/about.ts`
  - Meta: P2 · Depends on: T027 · Parallel with: T139, T142 · Spec: FR-070 · Const: I, II · Plan: Page & Section Architecture (About)
  - Do: Sections: who U Design is, what it does (both service categories), approach (business
    first, custom-built around the workflow), software expertise, digital marketing expertise,
    philosophy (**Build. Market. Grow.**), and why businesses work with U Design (reusing the
    `why.ts` themes). Add `foundingStory?` and `team?` fields left **undefined** with the comment
    "CONTENT INPUT REQUIRED (Q-7)". No years, headcounts, client counts, or awards. `status: "draft"`.
  - Outcome: Credible About copy with no invented history.
  - Accept: Integrity rules 6 and 8 pass, and the About copy contains no digits (no years, counts, or statistics).

- [X] T141 [US7] Build the About page in `src/app/about/page.tsx`
  - Meta: P2 · Depends on: T140, T068, T069, T062 · Parallel with: T143 · Spec: FR-070, US7 scenario 1 · Const: I, II · Plan: Page & Section Architecture (About)
  - Do: PageHero, then the About sections (rendering `foundingStory` and `team` only if defined),
    ProcessSteps (compact), and CtaBanner. Metadata is added in T157.
  - Outcome: The About page.
  - Accept: All FR-070 areas are present and the optional sections are absent.

- [X] T142 [P] [US7] Build the ContactDetails block in `src/components/sections/shared/ContactDetails.tsx`
  - Meta: P1 · Depends on: T028, T025 · Parallel with: T139, T140 · Spec: FR-071, FR-072, US7 scenarios 2–3 · Const: II · Plan: Page & Section Architecture (Contact)
  - Do: Render only the provided channels: email (`mailto:`, `data-track="contact_click"`,
    `data-track-channel="email"`), phone (`tel:{e164}` showing `display`), location (text plus an
    optional `mapUrl` link), hours, and socials (icon plus platform name). If none are provided,
    render a single sentence: "Use the form to reach our team." (no invented details).
  - Outcome: Truthful, actionable contact details.
  - Accept: The fixture tests cover all provided, none provided, and a partial set. Links open the mail and phone apps on mobile.

- [X] T143 [US7] Complete the Contact page layout in `src/app/contact/page.tsx`
  - Meta: P1 · Depends on: T081, T142 · Parallel with: T141 · Spec: FR-071, FR-072 · Const: IX, VI · Plan: Page & Section Architecture (Contact), Responsive Strategy (Consultation form)
  - Do: At `lg:` use a two-column layout (form on the left, ContactDetails and the
    `site.responseTime` statement, if present, on the right). Stack them on mobile with the form
    first. Keep `id="consultation"` on the form section.
  - Outcome: The complete Contact page.
  - Accept: No overflow at 320px, and `#consultation` scrolls to the form below the sticky header (`scroll-padding`).

- [X] T144 [US7] Create the Privacy Policy page and link it from the footer in `src/content/legal/privacy-policy.mdx`, `src/app/privacy-policy/page.tsx`, and `src/content/navigation.ts`
  - Meta: P0 · Depends on: T139, T022 · Parallel with: T141–T143 · Spec: FR-088, FR-111 · Const: Security & Data Handling (privacy policy required) · Plan: Page & Section Architecture (Privacy), Open Questions Q-8
  - Do: Draft the MDX from the **actual** data flows only: the consultation form fields, the
    purpose (responding to enquiries), the processors (the email provider and webhook
    destination, named generically until configured), retention by U Design's own systems, no
    storage by the website, no analytics by default (with a section to be completed if analytics
    is enabled), and contact for data requests (the U Design email once provided). Export
    `metadata = { status: "draft" }` and the heading "DRAFT — requires U Design / legal
    approval (Q-8)" while in draft. The page renders the MDX inside `Container size="narrow"`.
    Add `{ label: "Privacy Policy", href: "/privacy-policy" }` to the footer Legal group.
  - Outcome: The legally required page exists in draft.
  - Accept: `/privacy-policy` renders. The footer shows the Legal group. The launch check (T219) fails while the status is draft.

- [X] T145 [US7] Validate the US7 checkpoint using `specs/001-corporate-website/quickstart.md` (V6)
  - Meta: P2 · Depends on: T141, T143, T144 · Parallel with: — · Spec: US7 scenarios 1–3 · Const: II · Plan: Implementation Phases (Phase 9 exit)
  - Do: With an empty profile, check that no contact or social markup appears. Temporarily set a
    test email and phone in a local, uncommitted change and verify the `mailto:` and `tel:`
    links, then revert.
  - Outcome: US7 is independently verified.
  - Accept: The scenarios pass, and `git diff` for `site.ts` is empty afterward.

---

## Phase 13: Blog (User Story 8, Priority P3 story; P2 tasks)

**Goal**: Articles that genuinely help decision makers, with internal links to solutions and
industries, gated until the first post exists.

**Independent Test**: With zero published posts, `/blog` returns 404, there is no Blog link, and
there is no sitemap entry. With one (draft, preview) post, the index, article, and category pages
render with related links (quickstart V7).

- [X] T146 [P] [US8] Create the blog categories in `src/content/blog/categories.ts`
  - Meta: P2 · Depends on: T027 · Parallel with: T148 · Spec: FR-091 · Const: IV · Plan: data-model › BlogCategory
  - Do: 11 categories with slug, name, description, and `seo`: `business-software`, `erp`,
    `crm`, `manufacturing-technology`, `dashboards`, `automation`, `digital-transformation`,
    `digital-marketing`, `meta-ads`, `social-media`, and `lead-generation`.
  - Outcome: The topic taxonomy.
  - Accept: 11 entries, and integrity rule 2 passes for category SEO.

- [X] T147 [US8] Implement the posts index and the full blog repository in `src/content/blog/posts/index.ts` and `src/lib/content/blog.ts`
  - Meta: P2 · Depends on: T038, T139, T146 · Parallel with: T148 · Spec: FR-090, FR-092 · Const: XI · Plan: AD-08
  - Do: `posts/index.ts` statically imports each `*.mdx` module's `metadata` and default export
    into a typed registry (an explicit import list; add a comment "add new posts here"). Replace
    the stub while keeping the signatures: `getPublishedPosts({ category? })` (visible posts,
    newest first), `getPost(slug)`, `getRelatedPosts(post, n = 3)` (shared category or tags, then
    the newest), `getCategoriesWithPosts()`, and `hasBlog()`. The slug must equal the filename,
    which the integrity test checks.
  - Outcome: A CMS-ready blog data layer.
  - Accept: The unit tests with a fixture registry cover ordering, filtering, related posts, and the gate.

- [X] T148 [P] [US8] Create ArticleCard in `src/components/cards/ArticleCard.tsx`
  - Meta: P2 · Depends on: T053, T054, T012 · Parallel with: T146, T147 · Spec: FR-090 · Const: VII · Plan: AD-06 (Cards)
  - Do: Featured image (`next/image` with `sizes`), category badge, title link (stretched), excerpt,
    and `<time dateTime>` published date via `formatDate`.
  - Outcome: Article listing tiles.
  - Accept: One link per card and a correct `<time>` element.

- [X] T149 [US8] Build ArticleTemplate and the MDX blog components in `src/components/templates/ArticleTemplate.tsx` and `src/mdx-components.tsx`
  - Meta: P2 · Depends on: T147, T148, T049, T068, T070 · Parallel with: — · Spec: FR-090 · Const: IV, IX · Plan: Blog (ArticleTemplate), AD-08
  - Do: In order:
    - Breadcrumbs Home › Blog › {title}.
    - A header with the h1 title, the author only when provided, published and updated
      `<time>` elements, and the category link.
    - The featured image, with `priority` because it is above the fold.
    - The MDX body in `Container size="narrow"` with `.prose-udesign`.
    - "Related solutions and industries" (RelatedLinks), "Related articles" (ArticleCards), and
      CtaBanner.
    Add the MDX components `<InternalCta need? industry? />` and `<RelatedSolution slug />` to
    `mdx-components.tsx`.
  - Outcome: The article reading experience.
  - Accept: A fixture post renders all parts. With no author, there is no author markup.

- [X] T150 [US8] Build the gated blog index in `src/app/blog/page.tsx`
  - Meta: P2 · Depends on: T147, T148 · Parallel with: T151, T152 · Spec: FR-090, FR-092 · Const: IV · Plan: AD-08 (gate), contracts/routes-and-seo.md
  - Do: If `!hasBlog()`, call `notFound()`. Otherwise render PageHero, a category nav (links to
    `/blog/category/[slug]` for categories with posts), and ArticleCards newest first. Metadata
    is added in T162.
  - Outcome: The blog listing appears only when there is content.
  - Accept: In the production build with no published posts, `/blog` returns 404.

- [X] T151 [US8] Create the category route in `src/app/blog/category/[category]/page.tsx`
  - Meta: P2 · Depends on: T147, T148 · Parallel with: T150, T152 · Spec: FR-090 · Const: IV · Plan: AD-02 (category pages generated only with at least 1 post)
  - Do: `dynamicParams = false`. `generateStaticParams()` returns `getCategoriesWithPosts()`. The
    page lists that category's posts and calls `notFound()` if the category is unknown.
  - Outcome: Indexable topic pages.
  - Accept: With no posts, no category paths are generated.

- [X] T152 [US8] Create the article route in `src/app/blog/[slug]/page.tsx`
  - Meta: P2 · Depends on: T149 · Parallel with: T150, T151 · Spec: FR-090 · Const: IV · Plan: AD-01, AD-08
  - Do: `dynamicParams = false`, with `generateStaticParams()` from the visible posts. The page
    renders ArticleTemplate with the MDX default export.
  - Outcome: Article pages.
  - Accept: The preview build renders the draft post from T154. An unknown slug returns 404.

- [X] T153 [US8] Verify the Blog link gating in navigation and footer in `src/lib/content/navigation.ts`
  - Meta: P2 · Depends on: T147, T039 · Parallel with: T150–T152 · Spec: FR-092 · Const: IV · Plan: AD-08 (gate)
  - Do: Confirm that `getNavigation()` uses the real `hasBlog()` from T147. Add a unit test: with
    a fixture registry containing 0 published posts there is no Blog link; with 1 there is.
  - Outcome: Navigation reflects blog availability.
  - Accept: The unit test passes.

- [X] T154 [P] [US8] Draft the first blog article in `src/content/blog/posts/signs-your-business-has-outgrown-spreadsheets.mdx`
  - Meta: P3 · Depends on: T147, T149 · Parallel with: T150–T153 · Spec: FR-090, FR-091, FR-104 · Const: I, II, IV · Plan: Content Implementation Rules
  - Do: A genuinely useful article of 1,200 to 1,800 words for operations managers: warning signs,
    the risks of manual processes, what centralized software changes, how to plan the move, and a
    checklist. It contains no statistics without a cited, verifiable source (and omits any
    uncited ones) and no client stories. Metadata: category `digital-transformation`, tags, and
    `relatedSolutions: ["erp", "automation", "business-dashboards"]`,
    `relatedIndustries: ["manufacturing", "distribution"]`, `status: "draft"`, and `seo`. Author
    is left undefined until provided. Include an `<InternalCta need="not-sure" />`.
  - Outcome: The first review-ready article, and a fixture for the blog templates.
  - Accept: It renders in preview, and the integrity rules pass (as a draft).

- [X] T155 [US8] Validate the US8 checkpoint using `specs/001-corporate-website/quickstart.md` (V7)
  - Meta: P2 · Depends on: T150–T154 · Parallel with: — · Spec: US8 scenarios 1–3 · Const: IV · Plan: Implementation Phases (Phase 10 exit)
  - Do: Run the production build without `CONTENT_INCLUDE_DRAFTS` (zero published posts) and
    check the 404, the absent link, and the absent sitemap entry (after T166). Then run the
    preview build with drafts and check the index, article, category page, and related links.
  - Outcome: US8 is independently verified in both states.
  - Accept: Both states behave as specified.

---

## Phase 14: SEO (Cross-cutting)

**Purpose**: Unique metadata, canonical URLs, Open Graph images, the sitemap and robots, accurate
structured data, and internal-link integrity for every indexable page. **Depends on the pages from
Phases 6 to 13.**

- [X] T156 Add the homepage metadata in `src/app/page.tsx`
  - Meta: P1 · Depends on: T097, T041 · Parallel with: T157–T162 · Spec: FR-100, FR-101, FR-104 · Const: IV · Plan: AD-04
  - Do: Use `buildMetadata` with the full custom title "U Design | Custom Software, ERP & Digital
    Marketing for Growing Businesses" (≤ 60 characters; adjust the wording to fit), a unique
    description (70–160 characters) naturally covering custom software, dashboards, automation,
    and digital marketing, and `path: "/"`.
  - Outcome: Home is search-ready.
  - Accept: The HTML has a unique title, description, canonical, and OG tags.

- [X] T157 [P] Add the static and hub page metadata in `src/app/{solutions,industries,digital-marketing,portfolio,about,contact,privacy-policy}/page.tsx`
  - Meta: P1 · Depends on: T100, T109, T131, T123, T141, T143, T144, T041 · Parallel with: T156, T158–T162 · Spec: FR-100, FR-101 · Const: IV · Plan: AD-04, contracts/routes-and-seo.md
  - Do: Each page exports `metadata = buildMetadata({...})` with a unique, descriptive title and
    description written for that page, and its canonical path. The Privacy Policy is
    `noindex: true` while in draft.
  - Outcome: Every static page has unique metadata.
  - Accept: T163's uniqueness test passes.

- [X] T158 [P] Add the dynamic solution metadata in `src/app/solutions/[slug]/page.tsx`
  - Meta: P1 · Depends on: T101, T041 · Parallel with: T156, T157, T159–T162 · Spec: FR-100, FR-101 · Const: IV · Plan: AD-04
  - Do: `generateMetadata({ params })` → `buildMetadata({ ...solution.seo, path: "/solutions/" + slug })`.
    There is no generic fallback: throw during the build if `seo` is missing (the type already
    requires it).
  - Outcome: Per-solution metadata.
  - Accept: Each solution page has its own title and canonical.

- [X] T159 [P] Add the dynamic industry metadata in `src/app/industries/[slug]/page.tsx`
  - Meta: P1 · Depends on: T110, T041 · Parallel with: T156–T158, T160–T162 · Spec: FR-100, FR-101 · Const: IV · Plan: AD-04
  - Do: As T158, using `industry.seo`.
  - Outcome: Per-industry metadata.
  - Accept: Same as T158.

- [X] T160 [P] Add the dynamic marketing metadata in `src/app/digital-marketing/[slug]/page.tsx`
  - Meta: P1 · Depends on: T132, T041 · Parallel with: T156–T159, T161, T162 · Spec: FR-100, FR-101 · Const: IV · Plan: AD-04
  - Do: As T158, using `service.seo`.
  - Outcome: Per-service metadata.
  - Accept: Same as T158.

- [X] T161 [P] Add the portfolio project metadata in `src/app/portfolio/[slug]/page.tsx`
  - Meta: P1 · Depends on: T125, T041 · Parallel with: T156–T160, T162 · Spec: FR-100, FR-101 · Const: IV · Plan: AD-04
  - Do: As T158, using `project.seo`.
  - Outcome: Per-project metadata.
  - Accept: Same as T158.

- [X] T162 [P] Add the blog metadata in `src/app/blog/page.tsx`, `src/app/blog/category/[category]/page.tsx`, and `src/app/blog/[slug]/page.tsx`
  - Meta: P2 · Depends on: T150, T151, T152, T041 · Parallel with: T156–T161 · Spec: FR-100, FR-101 · Const: IV · Plan: AD-04, AD-08
  - Do: The index uses static metadata. The category page uses `category.seo`. The article uses
    `post.seo` with `type: "article"`, `openGraph.publishedTime` and `modifiedTime`, `authors`
    only when provided, and `alternates.canonical` set to `post.canonical ?? the page path`.
  - Outcome: Blog metadata.
  - Accept: The article HTML has `og:type=article` and the correct canonical.

- [X] T163 Add the route registry and the metadata, canonical, and URL tests in `src/lib/content/routes.ts` and `tests/unit/seo-routes.test.ts`
  - Meta: P1 · Depends on: T156–T162 · Parallel with: T164 · Spec: FR-100, SC-009 · Const: IV · Plan: data-model › Repository API (`getAllRoutes`)
  - Do: `getAllRoutes()` returns `{ path, title, description, lastModified?, kind }` for every
    indexable route (static pages plus the visible entries with pages; the blog only if
    `hasBlog()`). The tests check that every title and description is unique site-wide, that
    lengths are in range, that paths match `^/[a-z0-9/-]*$` (SEO-friendly, lowercase, no
    trailing slash except `/`), and that the canonical equals `absoluteUrl(path)`.
  - Outcome: Uniqueness and URL rules are enforced.
  - Accept: The tests pass, and a duplicated title fixture fails.

- [X] T164 [P] Create the default Open Graph image in `src/app/opengraph-image.tsx`
  - Meta: P2 · Depends on: T017, T041 · Parallel with: T163, T165 · Spec: FR-101 · Const: IV, VII · Plan: AD-04 (`next/og`)
  - Do: Use `ImageResponse` from `next/og` at 1200×630: a `green-deep` background, the "U DESIGN"
    wordmark, "Digital Solutions That Help Businesses Grow", and "Build. Market. Grow." in brand
    green. Export `alt`, `size`, and `contentType`.
  - Outcome: A branded share preview.
  - Accept: `/opengraph-image` returns a PNG, and `og:image` is present on the home page.

- [X] T165 Create the per-entry Open Graph images with a shared renderer in `src/lib/seo/og.tsx` and `src/app/{solutions,industries,digital-marketing,portfolio,blog}/[slug]/opengraph-image.tsx`
  - Meta: P2 · Depends on: T164, T101, T110, T125, T132, T152 · Parallel with: T166, T167 · Spec: FR-101, edge case "shared links" · Const: IV · Plan: AD-04
  - Do: `renderOgImage({ eyebrow, title })` holds the shared layout. Each route file reads its
    entry by `params.slug` and renders it. The images are generated statically at build.
  - Outcome: Meaningful previews per page.
  - Accept: Each detail page's `og:image` URL returns a 1200×630 PNG with the page title.

- [X] T166 Generate the XML sitemap in `src/app/sitemap.ts`
  - Meta: P1 · Depends on: T163 · Parallel with: T165, T167 · Spec: FR-102, FR-092, SC-009 · Const: IV · Plan: AD-04, contracts/routes-and-seo.md
  - Do: Map `getAllRoutes()` to `{ url: absoluteUrl(path), lastModified }`. Exclude the
    Privacy Policy while in draft. Include `/blog` and its routes only when `hasBlog()`.
  - Outcome: A complete, current sitemap.
  - Accept: `/sitemap.xml` lists exactly the `getAllRoutes()` paths and contains no draft routes in the production build.

- [X] T167 Configure robots per environment in `src/app/robots.ts`
  - Meta: P1 · Depends on: T041 · Parallel with: T165, T166 · Spec: FR-102 · Const: IV · Plan: AD-04, AD-10
  - Do: When `siteEnv === "production"`: `allow: "/"` and `sitemap: absoluteUrl("/sitemap.xml")`.
    Otherwise: `disallow: "/"`. Add a unit test covering both branches.
  - Outcome: Previews are never indexed.
  - Accept: The unit test passes, and the local build serves a disallow-all robots file.

- [X] T168 Create the JSON-LD builders and the JsonLd component in `src/lib/seo/jsonld.ts`, `src/components/seo/JsonLd.tsx`, and `tests/unit/jsonld.test.ts`
  - Meta: P1 · Depends on: T028, T049, T027 · Parallel with: T163–T167 · Spec: FR-103, FR-110 · Const: II, IV · Plan: AD-13
  - Do: Builders:
    - `organization(site)`: name, url, logo only if present, `sameAs` only if socials exist, and
      `contactPoint` or `address` only when provided.
    - `website()`: no SearchAction.
    - `service(entry)`: provider → Organization `@id`.
    - `breadcrumbList(trail)`: reuses the T049 trail.
    - `blogPosting(post)`: author only when provided.
    - `faqPage(faqs)`: returns `null` when the list is empty.
    **Never** emit `Review`, `AggregateRating`, or `award`. `JsonLd` renders
    `<script type="application/ld+json">` with `JSON.stringify(data).replace(/</g, "\\u003c")`.
    The unit tests assert no empty strings or `undefined` values, no forbidden types, and correct
    escaping.
  - Outcome: Accurate structured data.
  - Accept: The unit tests pass.

- [X] T169 Add the Organization and WebSite JSON-LD in `src/app/layout.tsx` and `src/app/page.tsx`
  - Meta: P1 · Depends on: T168, T097 · Parallel with: T170–T172 · Spec: FR-103 · Const: IV · Plan: AD-13 table
  - Do: The layout renders `JsonLd(organization(site))`, and home renders `JsonLd(website())`.
  - Outcome: Site-level entities.
  - Accept: Parsing JSON-LD on `/` yields exactly 1 Organization and 1 WebSite with no empty fields.

- [X] T170 [P] Add the Service and BreadcrumbList JSON-LD to the solution and marketing templates in `src/components/templates/{SolutionTemplate,MarketingServiceTemplate}.tsx`
  - Meta: P1 · Depends on: T168, T099, T130 · Parallel with: T169, T171, T172 · Spec: FR-103, FR-008 · Const: IV · Plan: AD-13 table
  - Do: Render `service(entry)` and `breadcrumbList(trail)`, plus `faqPage` only if `faqs` exist.
  - Outcome: Rich service markup.
  - Accept: The JSON-LD parses, and its values match the visible text.

- [X] T171 [P] Add the BreadcrumbList JSON-LD to the industry, project, hub, and static pages in `src/components/templates/{IndustryTemplate,ProjectTemplate}.tsx` and `src/app/{solutions,industries,digital-marketing,portfolio,about,contact,privacy-policy}/page.tsx`
  - Meta: P1 · Depends on: T168, T108, T122, T157 · Parallel with: T169, T170, T172 · Spec: FR-103, FR-008 · Const: IV · Plan: contracts/routes-and-seo.md (JSON-LD column)
  - Do: Render `breadcrumbList(trail)` wherever the routes contract lists it (the home page has
    no breadcrumbs).
  - Outcome: Breadcrumb markup that matches the visible trails.
  - Accept: Every route in the contract with a breadcrumb has a matching BreadcrumbList.

- [X] T172 [P] Add the BlogPosting and BreadcrumbList JSON-LD to articles in `src/components/templates/ArticleTemplate.tsx`
  - Meta: P2 · Depends on: T168, T149 · Parallel with: T169–T171 · Spec: FR-103 · Const: IV · Plan: AD-13 table
  - Do: Render `blogPosting(post)` and `breadcrumbList(trail)`.
  - Outcome: Article markup.
  - Accept: The JSON-LD parses, with dates in ISO format and no author when none is provided.

- [X] T173 Enforce the internal-linking rules in `tests/unit/content-integrity.test.ts`
  - Meta: P1 · Depends on: T040, T102–T106, T111–T118, T126–T128 · Parallel with: T174 · Spec: FR-031, FR-041, FR-054, FR-090 · Const: IV (internal linking), X · Plan: contracts/routes-and-seo.md › Internal linking guarantees
  - Do: Add rule 11, **bidirectional relations**. If an industry lists solution X, then X lists
    that industry, and vice versa. Every project's industry lists the project. Every published
    detail page has at least 2 outgoing related links. Fix any gaps in the content files
    (Manufacturing ↔ ERP, Manufacturing → Manufacturing ERP, ERP → Manufacturing, and so on).
  - Outcome: A deliberate link graph with no dead ends.
  - Accept: The rule passes, and the fixture-based failure case fails as expected.

- [X] T174 Audit image alt text and add an alt rule in `tests/unit/content-integrity.test.ts`
  - Meta: P1 · Depends on: T040, T126–T128 · Parallel with: T173 · Spec: FR-100, FR-121 · Const: IV, V · Plan: Accessibility Strategy (Images)
  - Do: Add rule 12: every `StaticImage` in content has a non-empty `alt` of at least 5
    characters that does not start with "image" or "picture", unless it is explicitly marked
    `decorative: true` with `alt: ""`. Review the component-level images (Logo, PortfolioCard,
    ArticleCard) for correct alt usage.
  - Outcome: Meaningful alternative text.
  - Accept: The rule passes, and axe `image-alt` passes (checked in T212).

- [X] T175 [P] Add the Search Console verification support in `src/app/layout.tsx`
  - Meta: P3 · Depends on: T041 · Parallel with: T163–T174 · Spec: SC-009 · Const: IV · Plan: AD-09 (Search Console)
  - Do: When `GOOGLE_SITE_VERIFICATION` is set, add `metadata.verification.google`. Add the variable to `.env.example` (it already exists from T010).
  - Outcome: One-step Search Console setup.
  - Accept: The meta tag appears only when the variable is set.

**Checkpoint**: Every indexable page has unique metadata, a canonical, an OG image, accurate
JSON-LD, and appears in the sitemap. Previews are noindexed.

---

## Phase 15: Performance, Motion & Analytics Readiness (Cross-cutting)

**Purpose**: Meet the Core Web Vitals budgets, add restrained CSS motion, and prepare the
conversion tracking that stays off by default.

- [X] T176 Audit the responsive image sizing, priority, and lazy loading in `src/components/**` (every `next/image` usage)
  - Meta: P1 · Depends on: T060, T120, T148, T056, T043 · Parallel with: T177, T178, T179 · Spec: FR-122, SC-006 · Const: III · Plan: AD-05, AD-12
  - Do: Every `next/image` has a `sizes` value matching its layout slot. Only the first
    above-the-fold raster image on a page has `priority` (or `preload` in the installed Next.js
    version): the article featured image and the project first screenshot are **not** above the
    fold on mobile, so decide per template and document it in a comment. All other images keep
    the default lazy loading. Source screenshots are exported at 2× the largest display size (max
    2400px wide).
  - Outcome: Right-sized image delivery.
  - Accept: Lighthouse reports no "Properly size images" or "Defer offscreen images" failures on the key templates.

- [X] T177 Verify and optimize the hero LCP in `src/components/sections/home/Hero.tsx`
  - Meta: P1 · Depends on: T085, T097 · Parallel with: T176, T178, T179 · Spec: FR-122, SC-006 · Const: III · Plan: AD-05, AD-12 (LCP ≤ 2.5s, target 1.8s)
  - Do: Confirm in Lighthouse and a Chrome performance trace that the LCP element is the H1 text.
    Ensure the hero has no raster images, the DashboardPreview SVGs are inline and small (≤ 15 KB
    total markup), and no animation delays the H1 (entrance motion must not start from
    `opacity: 0` for the H1).
  - Outcome: The fastest possible LCP.
  - Accept: Mobile Lighthouse LCP is ≤ 2.5s (target ≤ 1.8s) on `/`.

- [X] T178 Audit the fonts in `src/app/fonts.ts`
  - Meta: P1 · Depends on: T018 · Parallel with: T176, T177, T179 · Spec: FR-122 · Const: III, VII · Plan: AD-12 (Fonts)
  - Do: Confirm that only Poppins 600 and 700 and one Inter variable file (latin) are generated
    and requested. Remove any unused weights. Confirm that `display: swap` with the
    metric-adjusted fallback produces no measurable CLS.
  - Outcome: Minimal font cost.
  - Accept: The network panel shows at most 3 font files, and font-related CLS is 0.

- [X] T179 Enforce the client-component allowlist with a test in `tests/unit/client-islands.test.ts`
  - Meta: P1 · Depends on: T080, T124, T052 · Parallel with: T176–T178 · Spec: FR-122 · Const: III · Plan: AD-06, Complexity Tracking (four client components)
  - Do: Scan `src/**/*.{ts,tsx}` for a leading `"use client"` directive. Assert that the set
    equals the allowlist `ConsultationForm.tsx`, `PortfolioFilter.tsx`, `TrackClicks.tsx`,
    `AnalyticsScripts.tsx`, `app/error.tsx`, and `app/global-error.tsx` (the framework-required
    boundaries). Any new client file requires a plan update.
  - Outcome: Client JS cannot creep in unnoticed.
  - Accept: The test passes, and adding a stray `"use client"` fails it.

- [X] T180 Configure Lighthouse CI with performance and JS budgets in `lighthouserc.json`, `package.json`, and `.github/workflows/ci.yml`
  - Meta: P1 · Depends on: T015, T097, T101, T110, T125, T143 · Parallel with: T181, T182 · Spec: FR-122, SC-006 · Const: III, Quality Gate 2 · Plan: AD-12 (budgets), Testing Strategy (Performance, JS budget)
  - Do: Install `@lhci/cli` (exact). Use the mobile preset with 3 runs, and collect `/`,
    `/solutions/erp`, `/industries/manufacturing`, `/portfolio/manufacturing-erp`, and `/contact`
    from `npm start` (with `CONTENT_INCLUDE_DRAFTS=true`). Assertions:
    - Performance, Accessibility, Best Practices, and SEO at least 0.9 (SEO is asserted
      separately with the noindex audit ignored in the test environment).
    - `largest-contentful-paint` ≤ 2500, `cumulative-layout-shift` ≤ 0.1, and
      `total-blocking-time` ≤ 200.
    - `resource-summary:script:size` ≤ 130 KB gzip (≤ 160 KB on `/contact`) and
      `resource-summary:stylesheet:size` ≤ 30 KB.
    Add the `lhci` script and a CI step after e2e.
  - Outcome: Automated performance gates.
  - Accept: `npm run lhci` passes locally and in CI.

- [X] T181 Audit layout-shift prevention across the templates in `src/components/**`
  - Meta: P1 · Depends on: T180 · Parallel with: T182 · Spec: FR-122 · Const: III · Plan: AD-12 (CLS measures)
  - Do: Verify the reserved dimensions for DashboardPreview (aspect-ratio), LogoCloud boxes,
    screenshots (intrinsic sizes), the fixed header height, and the form state swap (the success
    panel keeps a minimum height equal to the form). No content is injected above existing
    content after load.
  - Outcome: A stable layout.
  - Accept: CLS is ≤ 0.05 on all key templates in LHCI.

- [X] T182 Audit and optimize the CSS in `src/styles/globals.css`
  - Meta: P2 · Depends on: T180 · Parallel with: T181 · Spec: FR-122 · Const: III, VII · Plan: AD-14
  - Do: Remove unused custom classes. Confirm Tailwind v4 automatic source detection excludes
    `specs/`, `.specify/`, and `tests/` (use `@source not` if needed). Check that no arbitrary
    values exist (`grep -E "\[#|\[[0-9]+px\]" src`). Resolve any findings or document them per
    the plan rule.
  - Outcome: Lean, token-only CSS.
  - Accept: The stylesheet budget passes, and the grep finds no undocumented arbitrary values.

- [X] T183 Implement the CSS motion utilities and apply the section reveals in `src/styles/globals.css` and `src/components/sections/home/*.tsx`
  - Meta: P2 · Depends on: T097, T021 · Parallel with: T184 · Spec: FR-122, edge case "reduced motion" · Const: VIII · Plan: AD-16, AD-12 (motion)
  - Do: Inside `@media (prefers-reduced-motion: no-preference)`:
    - A hero entrance (`.motion-fade-up`: translateY 8px and opacity 0.01 → 1, `duration-slow`)
      applied to the eyebrow, lead, CTAs, and visual. **Not the H1** (see T177).
    - Inside `@supports (animation-timeline: view())`, `.motion-reveal` (a scroll-driven
      fade/translate, `animation-range: entry 0% cover 30%`) applied to section headings and card
      grids on home.
    Content is **never** hidden by default outside these guards. Only `transform` and `opacity`
    animate.
  - Outcome: Subtle, JS-free motion.
  - Accept: Without support or with reduced motion, all content is visible and static. There is no CLS from motion. The e2e motion spec (T214) passes.

- [X] T184 Refine the interaction transitions on interactive primitives in `src/components/ui/{Button,Card}.tsx` and `src/components/navigation/*.tsx`
  - Meta: P2 · Depends on: T023, T053, T044, T046 · Parallel with: T183 · Spec: FR-122 · Const: VIII · Plan: AD-16
  - Do: Use `transition-[transform,box-shadow,opacity]` with `duration-fast` or `duration-base`
    and `ease-standard`. Popover panels get a short fade and scale on open via
    `@starting-style` (inside a no-preference guard). No color-only hover states.
  - Outcome: Polished feedback.
  - Accept: The reduced-motion emulation shows no transitions.

- [X] T185 Create the analytics event catalogue and a no-op `track()` in `src/lib/analytics/events.ts` and `src/lib/analytics/track.ts`
  - Meta: P2 · Depends on: T010 · Parallel with: T176–T184 · Spec: FR-112, SC-012 · Const: IX · Plan: AD-09, contracts/analytics-events.md
  - Do: Define the typed events `consultation_submit`, `cta_click`, `contact_click`,
    `portfolio_view`, and `portfolio_filter` with the property types from the contract. `track()`
    forwards to `window.gtag` (GA4 names: `generate_lead`, `view_item`, and so on) and
    `window.fbq` (Meta names: `Lead`, `Contact`, `ViewContent`) **only if** they exist and
    consent is granted. Otherwise it does nothing. Personal fields are rejected by type.
  - Outcome: Tracking-ready with zero default cost.
  - Accept: The unit test confirms no calls happen when the providers are absent, and that the mapping is correct when mocked.

- [X] T186 Audit the `data-track` attributes on CTAs, contact links, and portfolio links in `src/components/**`
  - Meta: P2 · Depends on: T185, T142, T060, T068 · Parallel with: T187 · Spec: FR-112 · Const: IX · Plan: AD-09 (declarative markup)
  - Do: Every ButtonLink CTA renders `data-track="cta_click"`, `data-track-label`, and
    `data-track-location` (section id). ContactDetails and FormError links render
    `contact_click` with `data-track-channel`. Project detail `<main>` renders
    `data-track-view="portfolio_view"` plus the project attributes.
  - Outcome: Tracking points exist server-side.
  - Accept: A DOM query on the key pages finds attributes on every CTA and contact link.

- [X] T187 Build the TrackClicks and AnalyticsScripts client islands, mounted only when configured, in `src/components/analytics/{TrackClicks,AnalyticsScripts}.tsx` and `src/app/layout.tsx`
  - Meta: P2 · Depends on: T185, T186 · Parallel with: T188 · Spec: FR-112 · Const: III, IX · Plan: AD-09, Complexity Tracking
  - Do: The layout renders both **only if** `gaId` or `metaPixelId` is set. `AnalyticsScripts`
    uses `next/script` with `strategy="afterInteractive"` (GA4 gtag and Meta Pixel base code).
    `TrackClicks` is a single delegated `click` listener on `document` that reads `data-track*`
    and calls `track()`, and it fires `data-track-view` events on mount. **Consent**: if
    `NEXT_PUBLIC_ANALYTICS_CONSENT=required` (add it to `.env.example`), do not load the scripts
    until consent is granted. The consent banner UI is deferred until Q-5 is decided and noted as
    follow-up work.
  - Outcome: Enabling analytics is configuration-only.
  - Accept: With no environment variables, there are no analytics scripts or islands in the HTML or bundles. With `NEXT_PUBLIC_GA_ID=test` set, gtag loads after interaction and a CTA click sends `cta_click` (verified with a mocked `gtag`).

- [X] T188 Fire the `consultation_submit` event from the form success state in `src/components/forms/ConsultationForm.tsx`
  - Meta: P2 · Depends on: T185, T080 · Parallel with: T187 · Spec: FR-112, SC-012 · Const: IX · Plan: contracts/analytics-events.md
  - Do: When the state transitions to `success`, call
    `track("consultation_submit", { industry, need, source_page })` once. Never send personal data.
  - Outcome: Lead conversions are measurable when analytics is enabled.
  - Accept: A unit test with mocked `track` checks that it is called once with no personal data.

- [X] T189 Extend the CSP for third-party scripts only when enabled in `next.config.ts`
  - Meta: P2 · Depends on: T011, T187 · Parallel with: T190 · Spec: FR-112 · Const: Security, III · Plan: AD-19
  - Do: `buildCsp()` appends `https://www.googletagmanager.com` and
    `https://www.google-analytics.com` (script, connect, img) only when `NEXT_PUBLIC_GA_ID` is
    set. It appends `https://connect.facebook.net` and `https://www.facebook.com` only when
    `NEXT_PUBLIC_META_PIXEL_ID` is set. It appends `https://challenges.cloudflare.com` (script,
    frame) only when `TURNSTILE_SITE_KEY` is set.
  - Outcome: Minimal allowed origins.
  - Accept: With no variables, the CSP contains only `'self'` origins, and each variable adds exactly its domains.

- [ ] T190 Add the optional Cloudflare Turnstile integration behind environment variables in `src/components/forms/ConsultationForm.tsx`, `src/lib/forms/spam.ts`, and `src/app/actions/consultation.ts`
  - Meta: P3 · Depends on: T080, T079, T189 · Parallel with: — · Spec: FR-087 · Const: Security · Plan: AD-18 (layer 5)
  - Do: Only when `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are set, render the widget (the
    script loaded only on `/contact`, in managed invisible mode) and verify the token server-side
    (`POST https://challenges.cloudflare.com/turnstile/v0/siteverify`). When the variables are
    unset, there is no code path, script, or bundle impact.
  - Outcome: An escalation option if spam gets through.
  - Accept: With the variables unset, there is no Turnstile network request. With test keys set, the verification passes.

- [ ] T191 Verify the performance checkpoint (`lighthouserc.json` assertions)
  - Meta: P1 · Depends on: T176–T190 · Parallel with: — · Spec: FR-122, SC-006 · Const: III, Quality Gate 2 · Plan: Implementation Phases (Phase 12 exit)
  - Do: Run `npm run build && npm run lhci` and `npm test`. Record the scores for the 5 templates
    in `specs/001-corporate-website/qa/performance.md`.
  - Outcome: The budgets are met.
  - Accept: All assertions pass, and the scores are recorded.

---

## Phase 16: Accessibility & Responsive (Cross-cutting)

**Purpose**: Audit and fix WCAG 2.2 AA issues and responsive layouts across every template.

- [X] T192 Audit the semantic HTML across all templates and fix issues in `src/components/**` and `src/app/**`
  - Meta: P1 · Depends on: T097, T099, T108, T122, T130, T141, T143, T149 · Parallel with: T194, T197 · Spec: FR-121, FR-100 · Const: V, IV · Plan: Accessibility Strategy
  - Do: For each route, check the landmarks, a single h1, headings that never skip, lists for
    list content, `<figure>` for screenshots, `<time>` for dates, `<dl>` for stats and FAQs,
    native buttons and links (no clickable `div`s), and `lang="en"`.
  - Outcome: Correct document structure.
  - Accept: The axe rules `heading-order`, `landmark-*`, `list`, and `region` pass. A manual outline review is recorded in `specs/001-corporate-website/qa/accessibility.md`.

- [X] T193 Audit keyboard navigation and fix issues in `src/components/navigation/*.tsx`, `src/components/forms/ConsultationForm.tsx`, and `src/components/portfolio/*.tsx`
  - Meta: P1 · Depends on: T192 · Parallel with: T195, T196 · Spec: FR-121, SC-007 · Const: V · Plan: Accessibility Strategy (Keyboard)
  - Do: Check that the tab order follows the visual order, that there is no positive
    `tabindex`, that popovers open with Enter or Space and close with Escape with focus
    returning, that the mobile menu is fully operable, that the form error focus and success
    focus work, that the gallery region is scrollable with the arrow keys, and that the skip link
    works.
  - Outcome: A fully keyboard-operable site.
  - Accept: The consultation journey from Home works using the keyboard only (manual, then automated in T213).

- [X] T194 [P] Audit the focus states on all four surfaces in `src/styles/globals.css`
  - Meta: P1 · Depends on: T021, T022 · Parallel with: T192, T197 · Spec: FR-121 · Const: V · Plan: Design System (Focus ring)
  - Do: Check that every interactive element on the white, gray, ink, and deep surfaces shows a
    2px ring with at least 3:1 contrast against the adjacent colors, and that the ring is never
    hidden by `overflow` or the sticky header.
  - Outcome: A visible focus everywhere.
  - Accept: A manual pass is recorded in `qa/accessibility.md`, with zero issues open.

- [ ] T195 Audit the form accessibility in `src/components/forms/*.tsx` and `src/components/ui/{Field,Input,Select,Textarea}.tsx`
  - Meta: P1 · Depends on: T080, T193 · Parallel with: T196 · Spec: FR-080, FR-081, FR-121 · Const: V, IX · Plan: contracts/consultation-action.md › Accessibility contract
  - Do: Verify the visible labels, the required indication in text, the `autocomplete` tokens,
    `aria-invalid` and `aria-describedby`, the error summary links that move focus, the live
    regions for status and counter (not overly chatty), and that the honeypot is unreachable by
    keyboard and screen readers.
  - Outcome: An accessible form.
  - Accept: axe passes in all form states (idle, invalid, failed, success), and the NVDA reading order is correct (recorded in T201).

- [ ] T196 Audit the mobile navigation accessibility in `src/components/navigation/MobileNav.tsx`
  - Meta: P1 · Depends on: T046, T193 · Parallel with: T195 · Spec: FR-003, FR-121 · Const: V, VI · Plan: AD-15
  - Do: The toggle has an accessible name and expanded state (implicit with popover). The close
    button is reachable. The links have 44px targets. The panel content is scrollable on short
    screens (landscape 320×568). Test with VoiceOver on iOS Safari.
  - Outcome: An accessible mobile menu.
  - Accept: All items are reachable with touch, swipe, and keyboard at 320×568 in landscape.

- [X] T197 [P] Audit the color contrast site-wide in `src/styles/globals.css` and `src/components/**`
  - Meta: P1 · Depends on: T026, T192 · Parallel with: T192, T194 · Spec: FR-121 · Const: V · Plan: Design System (Color tokens, forbidden pairings)
  - Do: Run axe `color-contrast` on every route and surface. Grep for forbidden usages:
    `text-brand-green` on light surfaces, and `text-brand-green-dark` on normal-size text.
    Verify the disabled and placeholder text contrast, and that body links use ink text with the
    green underline.
  - Outcome: AA contrast everywhere.
  - Accept: Zero contrast violations, and the grep finds no forbidden pairings.

- [X] T198 Verify the reduced-motion behavior in `src/styles/globals.css`
  - Meta: P1 · Depends on: T183, T184 · Parallel with: T199 · Spec: FR-121, edge case "reduced motion" · Const: V, VIII · Plan: AD-16
  - Do: Emulate `prefers-reduced-motion: reduce` and check every route: there are no
    animations, the popovers appear instantly, and scroll behavior is auto.
  - Outcome: Motion-sensitive users are respected.
  - Accept: The manual pass is recorded, and T214 automates it.

- [ ] T199 Audit the screen-reader content in `src/components/visuals/*.tsx`, `src/components/cards/*.tsx`, and `src/components/ui/Icon.tsx`
  - Meta: P1 · Depends on: T192 · Parallel with: T198 · Spec: FR-121 · Const: V · Plan: Accessibility Strategy
  - Do: Check that the DashboardPreview summary is present and the visual is hidden, that
    decorative icons and arrows are `aria-hidden`, that repeated link texts ("View Case Study",
    "Learn more") include sr-only context, that stretched-link cards announce once, that badges
    are read as text, and that the eyebrow text is not announced as a heading.
  - Outcome: A clear screen-reader experience.
  - Accept: The axe `link-name` and `duplicate-id` checks pass, and the manual NVDA pass (T201) finds no redundant or ambiguous announcements.

- [X] T200 Refine the responsive layouts at all breakpoints in `src/components/**`
  - Meta: P1 · Depends on: T097, T100, T109, T123, T131, T141, T143, T150 · Parallel with: T192–T199 · Spec: FR-120, SC-008, edge case "small screens" · Const: VI · Plan: Responsive Strategy (table)
  - Do: At 320, 375, 768, 1024, 1280, 1440, and 1920 px, check every row of the plan's Responsive
    Strategy table: the header, hero, dashboard visuals, service and industry cards, portfolio,
    process timeline, journey, form, and footer. Fix any overflow (`min-w-0` on grid children,
    `break-words` for long words, and so on) and any awkward wrapping. There must be no
    shrunk-desktop layouts.
  - Outcome: Deliberate layouts on every device class.
  - Accept: `document.documentElement.scrollWidth <= clientWidth` holds at every width on every route (automated in T211). The findings are recorded in `qa/responsive.md`.

- [ ] T201 Run the manual screen-reader pass (NVDA and VoiceOver) and record it in `specs/001-corporate-website/qa/accessibility.md`
  - Meta: P1 · Depends on: T192–T200 · Parallel with: — · Spec: FR-121, SC-007 · Const: V · Plan: Accessibility Strategy (Verification)
  - Do: Test Home, `/industries/manufacturing`, and `/contact` with NVDA and Firefox on Windows,
    and with VoiceOver and Safari on iOS: navigate by landmarks and headings, complete the form
    with an error and then success, and use the mobile menu.
  - Outcome: Verified assistive-technology experience.
  - Accept: No blocking issues remain, and the findings and fixes are logged.

---

## Phase 17: Testing (Cross-cutting)

**Purpose**: Automate the constitution quality gates as e2e, accessibility, SEO, and
performance suites. All specs run against the production build (`npm run build && npm start`,
with `CONTENT_INCLUDE_DRAFTS=true`).

- [X] T202 Create the e2e support: a mock webhook server and global setup in `tests/e2e/support/mock-webhook.ts`, `tests/e2e/global-setup.ts`, and `playwright.config.ts`
  - Meta: P1 · Depends on: T014, T077 · Parallel with: — · Spec: FR-085, FR-086 · Const: Quality Gates · Plan: AD-17
  - Do: The global setup starts a Node `http` server on `127.0.0.1:4010`. `POST /hook` returns
    500 when `lead.company === "FAIL-TEST"` and 200 otherwise, and records the received payloads
    (exposed via `GET /received`). Set the webServer env `LEAD_DELIVERY_PROVIDER=webhook`,
    `LEAD_WEBHOOK_URL=http://127.0.0.1:4010/hook`, and `LEAD_WEBHOOK_SECRET=test`.
  - Outcome: Deterministic delivery success and failure for the e2e tests.
  - Accept: A sanity test posts to the mock and reads it back.

- [X] T203 [P] Write the navigation and mobile menu e2e tests in `tests/e2e/navigation.spec.ts` and `tests/e2e/mobile-menu.spec.ts`
  - Meta: P1 · Depends on: T202, T050 · Parallel with: T204–T216 · Spec: FR-001–FR-003, SC-003 · Const: IX, V · Plan: Testing Strategy (Functional)
  - Do: Desktop: the 7 items are in order, the dropdowns open and close (Escape), and the links
    resolve. Mobile: the menu opens, all items and the CTA are present, Escape closes it, and
    focus returns. The header CTA is visible at every viewport. `/industries/manufacturing` is
    reachable from home in at most 2 clicks.
  - Outcome: The navigation is regression-proof.
  - Accept: Passes on all 3 projects.

- [X] T204 [P] Write the home page e2e tests in `tests/e2e/home.spec.ts`
  - Meta: P1 · Depends on: T202, T097 · Parallel with: T203, T205–T216 · Spec: FR-010–FR-020, US1 scenarios 1–6 · Const: I, II, IX · Plan: quickstart V1 (steps 1–3)
  - Do: Check the hero texts and both CTA hrefs within the first viewport (375×667 and
    1440×900), the section order, and that the gated sections (logos, metrics, testimonials) are
    absent. The "Discuss Your Business Process" link reaches `#consultation`. The concept badges
    are present.
  - Outcome: US1 automated.
  - Accept: Passes.

- [X] T205 [P] Write the consultation form e2e tests in `tests/e2e/consultation-form.spec.ts`
  - Meta: P0 · Depends on: T202, T143 · Parallel with: T203, T204, T206–T216 · Spec: FR-080–FR-088, US2 scenarios 1–7, SC-004, SC-005 · Const: IX · Plan: contracts/consultation-action.md, quickstart V1 (steps 4–8)
  - Do: Cover:
    - Empty submit: field errors plus focus on the first invalid field.
    - Invalid email and phone messages match the contract.
    - Valid submit: the success message, and the mock received exactly one payload with all
      fields and the source page.
    - `FAIL-TEST`: the failure message, the values preserved, and the fallback rendering.
    - Double-click submit: exactly one payload.
    - A **JS-disabled** context (`javaScriptEnabled: false`): a valid submit renders the success
      state from the server.
    - Pre-selection from `/contact?industry=manufacturing&need=erp`, and invalid parameters
      ignored.
    - The budget field is absent while the budgets list is empty.
  - Outcome: US2 automated.
  - Accept: Passes on all projects.

- [X] T206 [P] Write the solutions and industries e2e tests in `tests/e2e/solutions.spec.ts` and `tests/e2e/industries.spec.ts`
  - Meta: P1 · Depends on: T202, T101, T110 · Parallel with: T203–T205, T207–T216 · Spec: FR-030–FR-032, FR-040–FR-043, US3, US4 · Const: I, X · Plan: quickstart V2, V3
  - Do: Hubs: the card counts and ordering (Manufacturing first). Detail pages: the required
    sections exist, the related links resolve, and the CTA hrefs carry the context. The
    Manufacturing workflows include "Raw materials" and "Warehouse". An unknown slug returns 404.
  - Outcome: US3 and US4 automated.
  - Accept: Passes.

- [X] T207 [P] Write the portfolio e2e tests in `tests/e2e/portfolio.spec.ts`
  - Meta: P1 · Depends on: T202, T125 · Parallel with: T203–T206, T208–T216 · Spec: FR-050–FR-054, US5 · Const: II, X · Plan: quickstart V4
  - Do: The list shows 3 cards with "Concept / Demo". The detail section order is Challenge →
    Solution → Key features → Screenshots → Business application. There is no "Results" heading
    or client name on concepts. Captions exist. The filter is absent with 3 projects. An unknown
    slug returns 404.
  - Outcome: US5 automated.
  - Accept: Passes.

- [X] T208 [P] Write the marketing, about, contact, and blog e2e tests in `tests/e2e/{marketing,about,contact,blog}.spec.ts`
  - Meta: P1 · Depends on: T202, T132, T141, T143, T152 · Parallel with: T203–T207, T209–T216 · Spec: FR-060–FR-061, FR-070–FR-072, FR-090–FR-092, US6–US8 · Const: I, II, IV · Plan: quickstart V5–V7
  - Do: Marketing: the 7 services appear on the hub and 4 detail pages build, with no
    "guarantee" text. About: all sections are present. Contact: with an empty profile there is
    no `mailto:`, `tel:`, or social markup. Blog (in the preview build): the index, article, and
    category pages work and the related links resolve. Add a separate `blog-gate` project that
    runs against a build **without** `CONTENT_INCLUDE_DRAFTS` to assert that `/blog` returns 404
    and there is no Blog link.
  - Outcome: US6 to US8 automated.
  - Accept: Passes.

- [X] T209 [P] Write the 404 and error page e2e tests in `tests/e2e/not-found.spec.ts`
  - Meta: P1 · Depends on: T202, T051 · Parallel with: T203–T208, T210–T216 · Spec: FR-007 · Const: IX · Plan: Testing Strategy
  - Do: Unknown paths across the route families return status 404 with the branded page, its
    links, and the CTA, plus `noindex`.
  - Outcome: Error behavior automated.
  - Accept: Passes.

- [X] T210 [P] Write the sitemap-driven link crawl e2e test in `tests/e2e/links.spec.ts`
  - Meta: P1 · Depends on: T202, T166 · Parallel with: T203–T209, T211–T216 · Spec: FR-100, SC-003 · Const: IV · Plan: contracts/routes-and-seo.md › Internal linking guarantees
  - Do: Load `/sitemap.xml` (the preview build lists the draft routes). Visit every URL, collect
    every internal `href`, and assert status 200 or a valid anchor. Assert that every sitemap URL
    is linked from at least one other page (no orphans), and that every page has a path to
    `/contact#consultation` in one click.
  - Outcome: No broken links or orphans.
  - Accept: Passes.

- [X] T211 [P] Write the responsive overflow e2e test in `tests/e2e/responsive.spec.ts`
  - Meta: P1 · Depends on: T202, T200 · Parallel with: T203–T210, T212–T216 · Spec: FR-120, SC-008 · Const: VI · Plan: Testing Strategy (Responsive)
  - Do: For every sitemap route at widths 320, 375, 768, 1280, 1440, and 1920, assert
    `scrollWidth <= clientWidth`, that the header CTA is visible, and that the h1 is visible.
  - Outcome: Responsive regressions are caught.
  - Accept: Passes.

- [X] T212 [P] Write the axe accessibility e2e test in `tests/e2e/a11y.spec.ts`
  - Meta: P0 · Depends on: T202, T201 · Parallel with: T203–T211, T213–T216 · Spec: FR-121, SC-007 · Const: V, Quality Gate 3 · Plan: AD-17
  - Do: Install `@axe-core/playwright` (exact). Run axe with the `wcag2a`, `wcag2aa`,
    `wcag21aa`, and `wcag22aa` tags on every sitemap route at mobile and desktop widths, and on
    the form in its invalid and failed states and with the mobile menu open. Fail on `critical` or
    `serious` violations.
  - Outcome: The accessibility gate is automated.
  - Accept: Passes with zero critical or serious violations.

- [X] T213 [P] Write the keyboard journey e2e test in `tests/e2e/keyboard.spec.ts`
  - Meta: P1 · Depends on: T202, T193 · Parallel with: T203–T212, T214–T216 · Spec: FR-121, SC-007 · Const: V · Plan: Testing Strategy (Accessibility)
  - Do: Using only the keyboard: skip link → header CTA → the form fills and submits
    successfully. The focus indicator is visible at each step (the computed outline width is at
    least 2px).
  - Outcome: The keyboard gate is automated.
  - Accept: Passes.

- [X] T214 [P] Write the reduced-motion e2e test in `tests/e2e/motion.spec.ts`
  - Meta: P2 · Depends on: T202, T198 · Parallel with: T203–T213, T215, T216 · Spec: edge case "reduced motion", FR-121 · Const: VIII · Plan: AD-16
  - Do: With `reducedMotion: "reduce"`, `document.getAnimations()` is empty after load and after
    scrolling on `/`, and all home section content is visible.
  - Outcome: Motion rules are automated.
  - Accept: Passes.

- [X] T215 [P] Write the SEO e2e test in `tests/e2e/seo.spec.ts`
  - Meta: P1 · Depends on: T202, T166, T167, T169–T172 · Parallel with: T203–T214, T216 · Spec: FR-100–FR-103, SC-009 · Const: IV · Plan: contracts/routes-and-seo.md
  - Do: For every sitemap route: a unique `<title>` and description across the site, an absolute
    canonical with no query, exactly one h1, a heading order without skips, the OG
    title/description/image, `og:image` returning 200, JSON-LD that parses and contains no
    `Review` or `AggregateRating`, and the expected `@type` per the routes contract. Robots in
    the test environment is disallow-all with a `noindex` meta tag.
  - Outcome: The SEO gate is automated.
  - Accept: Passes.

- [X] T216 [P] Write the console-error e2e test in `tests/e2e/console.spec.ts`
  - Meta: P1 · Depends on: T202 · Parallel with: T203–T215 · Spec: Quality Gates (no console errors) · Const: Code Quality · Plan: Testing Strategy (Console)
  - Do: Visit every sitemap route and fail on any `console.error` or `console.warn`, and on any
    `pageerror`.
  - Outcome: Clean runtime.
  - Accept: Passes.

- [ ] T217 Run the performance test suite and record the results in `specs/001-corporate-website/qa/performance.md`
  - Meta: P1 · Depends on: T191, T203–T216 · Parallel with: T218 · Spec: FR-122, SC-006 · Const: III · Plan: Testing Strategy (Performance)
  - Do: Run `npm run lhci` after all features are complete. Also record the LCP, INP (via the
    Lighthouse timespan or Web Vitals in the Chrome performance panel on an interaction with the
    mobile menu and form), CLS, total JS, and image bytes per template.
  - Outcome: A performance baseline at feature-complete.
  - Accept: All budgets are met, and INP is ≤ 200ms for the menu toggle and form submit interactions.

- [ ] T218 Finalize the CI pipeline and run the build tests in `.github/workflows/ci.yml`
  - Meta: P0 · Depends on: T180, T203–T216 · Parallel with: T217 · Spec: Quality Gates 1–7 · Const: Development Workflow & Quality Gates · Plan: AD-10, Deployment Strategy (CI)
  - Do: The order is lint → typecheck → unit and integrity → build → e2e (all projects, plus the
    `blog-gate` project) → LHCI. Upload the reports as artifacts. Mark every step required. Run
    the full `npm run check && npm run test:e2e && npm run lhci` locally.
  - Outcome: All gates are automated and green.
  - Accept: The local run exits 0, and a CI run is green (once the remote exists).

---

## Phase 18: Final QA & Launch (Cross-cutting)

**Purpose**: Business inputs, content approval, launch-readiness checks, manual quality gates, and
production configuration. Several tasks here require U Design input or decisions.

- [X] T219 Implement the launch-readiness check in `tests/launch/launch-readiness.test.ts` and `package.json` (script `check:launch`)
  - Meta: P0 · Depends on: T040, T144, T078 · Parallel with: T220 · Spec: FR-110, FR-111, FR-086, Missing Information table · Const: II, Security · Plan: Deployment Strategy (Launch checklist), data-model integrity rule 10
  - Do: A Vitest file run by `check:launch` (`vitest run tests/launch`) with the production
    environment variables. It asserts that:
    - The Privacy Policy is `published`.
    - `site.email` or `site.phone` exists (rule 10).
    - `site.logo` exists (Q-2).
    - `LEAD_DELIVERY_PROVIDER` is not `console` and its required variables are present.
    - `NEXT_PUBLIC_SITE_URL` is an https production domain (Q-9).
    - No published entry references a placeholder asset.
    - Every navigation child and every related link targets a published page.
    - No `// DRAFT` markers remain in published singletons.
    - At least the home page, contact, privacy, and one solution and one industry page are published.
  - Outcome: An objective go or no-go signal.
  - Accept: It fails today with a readable list of blockers, and it passes once T220 to T222 are complete.

- [ ] T220 Integrate the business inputs from U Design into `src/content/site.ts`, `src/content/form-options.ts`, `src/content/client-logos.ts`, `src/assets/**`, `src/content/projects/*.ts`, and `src/content/about.ts`
  - Meta: P0 · Depends on: T028, T037, T034, T126–T128, T140, and U Design input · Parallel with: T219, T221 · Spec: Missing Information table, FR-012, FR-071, FR-080, FR-053 · Const: II · Plan: Open Questions Q-1–Q-9
  - Do: When supplied, add the following (skip any item not supplied; its section stays hidden):
    - The official logo SVG (Q-2) → `site.logo` and the Logo component.
    - Email, phone, location, socials, and the response-time statement (Q-7).
    - Budget ranges and currency (Q-6) → `budgets`.
    - Real screenshots for the 3 projects (Q-4), replacing the pending assets, and the confirmed
      `type` for each project.
    - Approved client logos with permission (`permissionConfirmed: true`), verified testimonials,
      and stats with sources, if any.
    - The About founding story and team, if provided.
    - The Q-1 decision: if rejected, set `--surface-deep-bg` to ink (a one-line change from T017).
    Never fill a gap with invented data.
  - Outcome: The site reflects real business information.
  - Accept: Every change traces to a U Design-provided source, noted in `specs/001-corporate-website/qa/content-inputs.md`.

- [X] T221 Run the content QA (spelling, grammar, tone, and claims) and record it in `specs/001-corporate-website/qa/content-review.md`
  - Meta: P1 · Depends on: T102–T106, T111–T118, T126–T128, T133–T137, T140, T144, T154 · Parallel with: T220 · Spec: FR-104, FR-110, FR-124, SC-010 · Const: I, II · Plan: Content Implementation Rules
  - Do: Review every content file and page for spelling and grammar, business-first ordering
    (Problem → Solution → Benefit → Proof → CTA), B2B tone, no buzzwords, no unsupported claims,
    guarantees, or statistics, natural keyword use (no stuffing), no lorem or placeholder text,
    and the CTA labels. Fix any issues in the content files.
  - Outcome: Launch-quality copy.
  - Accept: The integrity suite passes, and the review log lists each page as "approved for U Design review".

- [X] T222 Obtain U Design approval and publish the approved entries in `src/content/**` (set `status: "published"`)
  - Meta: P0 · Depends on: T221, T220, and U Design sign-off · Parallel with: — · Spec: FR-130, FR-110, SC-010 · Const: II · Plan: research R-2, Content Implementation Rules
  - Do: For each entry and singleton that U Design approves, set `status: "published"` and
    remove the `// DRAFT` markers. Record the approver and date per entry in
    `qa/content-review.md`. Unapproved entries stay drafts; navigation and the sitemap adapt
    automatically.
  - Outcome: Approved content goes live on the next production deploy.
  - Accept: `npm test` and `npm run check:launch` pass for the published set.

- [ ] T223 Run the design QA (Design Quality Gate per page) and record it in `specs/001-corporate-website/qa/design-review.md`
  - Meta: P1 · Depends on: T200, T222 · Parallel with: T224–T226 · Spec: FR-123, SC-011 (proxy) · Const: VII, Design Quality Gate · Plan: Design System
  - Do: For every published page, answer each of the constitution's Design Quality Gate questions:
    premium and corporate, matches branding, clear hierarchy, easy to understand, obvious CTA,
    works on mobile, loads quickly, accessible, SEO-ready, and free of clutter. Check the
    typography scale, spacing rhythm, surface rhythm (no adjacent dark sections), and component
    consistency. Remove any element that does not serve a goal.
  - Outcome: A brand-consistent, premium UI.
  - Accept: Every page is marked "yes" on all questions, or has a fix linked.

- [ ] T224 Run the SEO QA on the Preview deployment and record it in `specs/001-corporate-website/qa/seo-review.md`
  - Meta: P1 · Depends on: T215, T222, T228 · Parallel with: T223, T225, T226 · Spec: FR-100–FR-104, SC-009 · Const: IV · Plan: AD-04, AD-13
  - Do: Validate the JSON-LD on the key templates with the Schema.org validator and Google Rich
    Results Test. Spot-check the metadata, canonicals (production domain), OG previews (share
    debuggers), sitemap contents (published only), and robots behavior per environment.
  - Outcome: Verified search readiness.
  - Accept: Zero structured-data errors, and all checks are logged.

- [ ] T225 Run the performance QA on the deployed Preview (real network) and record it in `specs/001-corporate-website/qa/performance.md`
  - Meta: P1 · Depends on: T217, T228 · Parallel with: T223, T224, T226 · Spec: FR-122, SC-006 · Const: III · Plan: AD-12
  - Do: Run PageSpeed Insights (mobile) against the Preview URLs of the 5 key templates, and check
    the image formats served (AVIF/WebP) and the caching headers.
  - Outcome: Field-like verification.
  - Accept: Mobile scores are at least 90, LCP is ≤ 2.5s, and CLS is ≤ 0.1.

- [ ] T226 Run the final accessibility QA after publishing and record it in `specs/001-corporate-website/qa/accessibility.md`
  - Meta: P1 · Depends on: T212, T222 · Parallel with: T223–T225 · Spec: FR-121, SC-007 · Const: V · Plan: Accessibility Strategy
  - Do: Re-run the axe suite and a short keyboard and screen-reader pass on the published content
    (real logos, contact details, and screenshots now present).
  - Outcome: Accessibility holds with real content.
  - Accept: Zero critical or serious violations, and no blocking issues.

- [ ] T227 Run the technical QA on the production build and record it in `specs/001-corporate-website/qa/technical.md`
  - Meta: P0 · Depends on: T218, T222 · Parallel with: T223–T226 · Spec: Quality Gates 1–7, FR-007 · Const: Quality Gates · Plan: Testing Strategy
  - Do: Run `npm run check`, `npm run test:e2e`, `npm run lhci`, and `npm run check:launch` with
    the production environment variables. Check for broken links, console errors, the 404
    behavior, the security headers (`curl -I`), and that no secrets are present in the client
    bundles (grep `.next/static` for the variable values).
  - Outcome: A technical go.
  - Accept: All commands exit 0, and the grep finds no secrets.

- [ ] T228 Configure Vercel production (environment, domain, WAF rule, Node runtime), following `specs/001-corporate-website/quickstart.md`
  - Meta: P0 · Depends on: T218 and U Design decisions Q-3, Q-9 · Parallel with: T223 · Spec: FR-086, FR-087, FR-102 · Const: Security · Plan: AD-10, AD-18 (WAF), Deployment Strategy
  - Do: Link the repository to Vercel. Set the environment variables per environment (Production:
    real delivery and domain; Preview: a staging inbox or `webhook` to a test endpoint plus
    `CONTENT_INCLUDE_DRAFTS=true`). Set Node 24, add the production domain with HTTPS, and add a
    WAF rate-limit rule for POST requests to `/contact` (for example 10 requests per 10 minutes
    per IP). Confirm that Preview deployments are noindexed.
  - Outcome: Production-ready hosting.
  - Accept: A Preview deployment serves a disallow-all robots file. The production domain serves HTTPS with the security headers.

- [ ] T229 Run the live lead-delivery test and verify email authentication in `specs/001-corporate-website/qa/technical.md`
  - Meta: P0 · Depends on: T228, T220 · Parallel with: — · Spec: FR-086, SC-005 · Const: IX · Plan: Risks (email deliverability), contracts/lead-delivery.md
  - Do: Verify the SPF, DKIM, and DMARC records for the sender domain. Submit 3 test requests on
    Production (with the company name "LAUNCH TEST"). Confirm delivery to the real inbox (not
    spam) and to the webhook destination, and confirm the fallback behavior by temporarily
    breaking the webhook URL in Preview.
  - Outcome: Leads are proven to arrive.
  - Accept: 3 of 3 requests are received with all fields, and the test entries are deleted from the destinations afterward.

- [ ] T230 Complete the post-launch search setup and record it in `specs/001-corporate-website/qa/seo-review.md`
  - Meta: P2 · Depends on: T229, T175 · Parallel with: T231 · Spec: SC-009 · Const: IV · Plan: Deployment Strategy (Launch checklist)
  - Do: Verify the Search Console property (meta tag or DNS), submit the sitemap, request indexing
    for the key pages, and schedule a coverage check 4 weeks after launch (SC-009).
  - Outcome: Discovery is started.
  - Accept: The sitemap status is "Success" in Search Console.

- [ ] T231 Run the moderated user test for SC-001, SC-002, and SC-011 and record it in `specs/001-corporate-website/qa/user-testing.md`
  - Meta: P2 · Depends on: T222 · Parallel with: T230 · Spec: SC-001, SC-002, SC-011 · Const: I · Plan: Requirements Traceability (SC rows)
  - Do: Test with 5 to 8 target-audience participants (owners, operations, and IT or marketing
    managers): a 5-second test on the home page, the five "can you answer" questions within 2
    minutes, and a professionalism and trust rating. Log the results and resulting fixes.
  - Outcome: The comprehension targets are validated.
  - Accept: At least 80% pass the 5-second test, at least 90% answer all five questions, and at least 70% rate the site professional and trustworthy, or follow-up fixes are logged.

**Checkpoint**: 🚀 Launch-ready. All constitution Technical Gates 1 to 7 and the Design Quality
Gate pass, and the launch blockers are cleared.

---

## Dependencies & Execution Order

### Phase dependencies

```text
P1 Foundation ─▶ P2 Design System ─▶ P3 Content/Data ─▶ P4 Global Layout ─▶ P5 Reusable Components
                                                                                   │
                                        ┌──────────────────────────────────────────┘
                                        ▼
                         P6 Forms (US2) ─▶ P7 Homepage (US1)  ══ 🎯 MVP
                                        │
          ┌─────────────────┬───────────┼──────────────┬───────────────┬──────────────┐
          ▼                 ▼           ▼              ▼               ▼              ▼
   P8 Solutions (US4)  P9 Industries  P10 Portfolio  P11 Marketing  P12 About &     (P13 Blog needs
                        (US3)          (US5)          (US6)          Contact (US7)    P12's MDX: T139)
          └─────────────────┴───────────┴──────────────┴───────────────┴──────▶ P13 Blog (US8)
                                                                                    │
                     P14 SEO ─▶ P15 Performance/Motion/Analytics ─▶ P16 A11y & Responsive ─▶ P17 Testing ─▶ P18 Final QA
```

- **Phases 1 to 5 (Setup and Foundational)** are sequential and block all stories.
- **Phase 6 (US2)** must precede Phase 7 (US1), because the home CTAs target the form. Together
  they are the MVP.
- **Phases 8 to 12** can proceed **in parallel** after Phase 7 (or after Phase 5 if staffed):
  they touch different routes, templates, and content files. The only cross-story links are
  content relations, which the repository resolves gracefully when a target is not built yet.
- **Phase 13 (Blog)** depends on T139 (MDX setup in Phase 12) and uses solution and industry
  slugs for related links.
- **Phases 14 to 18** are cross-cutting and run after the pages they touch exist. Individual SEO
  tasks may start as soon as their page exists (for example T158 after T101).

### User story dependencies

| Story | Depends on | Independently testable via |
|---|---|---|
| US2 Consultation | Phases 1–5 | quickstart V1 steps 4–8 (T084) |
| US1 Home | Phases 1–5, US2 (the CTA target) | quickstart V1 steps 1–3 (T098) |
| US4 Solutions | Phases 1–5 (US2 for the CTA target) | quickstart V3 (T107) |
| US3 Industries | Phases 1–5 (US2); links to US4 pages degrade gracefully | quickstart V2 (T119) |
| US5 Portfolio | Phases 1–5 (US2) | quickstart V4 (T129) |
| US6 Marketing | Phases 1–5 (US2) | quickstart V5 (T138) |
| US7 About & Contact | Phases 1–5, US2 (the form) | quickstart V6 (T145) |
| US8 Blog | Phases 1–5, T139 | quickstart V7 (T155) |

### Within each story

The template and route come first; the content drafts are `[P]` and can be written alongside
them; the checkpoint comes last. Content stays `draft` until T222.

---

## Parallel Execution Examples

```text
# Phase 3 (after T029): all summary collections at once
T030 solutions · T031 marketing · T032 industries · T033 projects · T034 proof · T035 home copy · T036 redirects

# Phase 5: independent components
T053 Card · T054 Badge · T055 form controls · T056 LogoCloud · T057 cta helper · T065 DashboardPreview · T066 JourneyDiagram · T067 form states
then T058–T064 cards (after T053/T054), T068–T070 sections

# Phase 6 (US2): server building blocks
T073 spam · T074 rate-limit · T075 delivery types → (T076 email ‖ T077 webhook)

# Phase 7 (US1): all home sections at once (distinct files)
T085 Hero · T086 TrustLogos · T087 Services · T088 Industries · T089 Projects · T090 Journey · T091 Process · T092 Marketing · T093 Why · T094 Metrics · T095 Testimonials · T096 FinalCta

# Phases 8–11: content drafting across stories (all distinct files)
T102–T106 solution copy ‖ T111–T118 industry copy ‖ T126–T128 project copy ‖ T133–T137 marketing copy

# Phase 14: per-route metadata
T157 · T158 · T159 · T160 · T161 · T162

# Phase 17: all e2e specs (after T202)
T203–T216
```

---

## Implementation Strategy

### MVP first (US2 + US1)

1. Phases 1–5: the foundation (T001–T070).
2. Phase 6: the consultation form (T071–T084) → **validate US2**.
3. Phase 7: the home page (T085–T098) → **validate US1**.
4. **MVP release option**: add the Privacy Policy (T139, T144), the minimum SEO (T156, T157 for
   `/contact`, T166, T167, T168, T169), and the launch path (T219–T222 and T227–T229) for the
   home page and contact only. Everything else ships later without restructuring.

### Incremental delivery

After the MVP, add US4 → US3 → US5 (the priority order for acquiring corporate and manufacturing
clients), then US6 → US7 → US8. Each story ships when its checkpoint passes and U Design approves
its content (T222).

### Parallel team strategy

After Phase 7: developer A takes US4 then US3 (they share the template pattern), developer B
takes US5, developer C takes US6 and US7, and a content writer drafts all `[P]` content tasks
concurrently. Phases 14 to 18 run as a joint hardening pass.

---

## Traceability

### Spec functional requirements → tasks

| Requirement | Tasks |
|---|---|
| FR-001 Primary nav + CTA | T039, T044, T045, T046, T047, T050, T203 |
| FR-002 Menus to individual pages | T039, T044, T045, T046 |
| FR-003 Mobile menu | T046, T196, T203 |
| FR-004 CTA on every page / above fold | T047, T068, T085, T099, T108, T122, T130, T204, T210 |
| FR-005 Approved CTA labels | T027, T023, T068, T040 |
| FR-006 Footer | T039, T048 |
| FR-007 404 page | T051, T209 |
| FR-008 Breadcrumbs | T049, T099, T108, T122, T130, T149, T170, T171 |
| FR-010 Hero copy | T035, T085, T204 |
| FR-011 Hero visual | T065, T085, T177 |
| FR-012 Trust logos (real only) | T034, T056, T086, T220 |
| FR-013 Two service groups | T030, T031, T035, T058, T087 |
| FR-014 Industries section | T032, T059, T088 |
| FR-015 Software showcase | T033, T060, T089 |
| FR-016 Spreadsheets journey | T035, T066, T090 |
| FR-017 Six-step process | T035, T062, T091 |
| FR-018 Marketing section | T035, T092 |
| FR-019 Why U Design | T035, T093 |
| FR-020 Closing CTA | T096 |
| FR-030 Solutions hub | T030, T100 |
| FR-031 Solution page content | T099, T101–T106, T173 |
| FR-032 Custom-built positioning | T099, T102–T106 |
| FR-040 Industries overview | T032, T109 |
| FR-041 Industry page content | T108, T110–T118, T173 |
| FR-042 Industry-specific content | T040 (rule 9), T111–T118 |
| FR-043 Manufacturing prominence | T032, T059, T088, T109, T111 |
| FR-050 Portfolio listing + filter | T060, T123, T124 |
| FR-051 Project narrative | T122, T126–T128 |
| FR-052 Concept labelling | T027, T054, T060, T122, T040 |
| FR-053 Screenshots with context | T120, T121, T220 |
| FR-054 Project cross-links + CTA | T070, T122, T173 |
| FR-060 Marketing page(s) | T031, T130–T137 |
| FR-061 No guarantees | T130, T040 (rule 8), T138 |
| FR-070 About | T140, T141 |
| FR-071 Contact details (provided only) | T028, T142, T143, T048 |
| FR-072 Actionable email/phone | T142 |
| FR-080 Form fields | T071, T072, T080, T037 |
| FR-081 Validation | T055, T071, T072, T080, T082 |
| FR-082 Form reachable in one action | T047, T057, T081, T210 |
| FR-083 Pre-selection | T057, T068, T080, T205 |
| FR-084 Success confirmation | T067, T079, T080 |
| FR-085 Failure handling | T067, T079, T080, T205 |
| FR-086 Reliable delivery | T075–T078, T083, T202, T229 |
| FR-087 Spam + duplicates | T073, T074, T190, T228 |
| FR-088 Data-use notice | T080, T144 |
| FR-090 Blog index + article | T147–T152 |
| FR-091 Blog topics | T146, T154 |
| FR-092 Blog gating | T038, T147, T150, T153, T166, T208 |
| FR-100 Unique metadata, headings, URLs | T041, T156–T163, T174, T215 |
| FR-101 Share previews | T041, T164, T165 |
| FR-102 Sitemap, robots, redirects | T036, T166, T167 |
| FR-103 Accurate structured data | T168–T172, T224 |
| FR-104 Commercial-intent topics | T102–T106, T111, T133–T136, T156, T221 |
| FR-110 No fabricated content | T027, T028, T034, T040, T121, T219–T222 |
| FR-111 Privacy Policy | T144, T219 |
| FR-112 Analytics & consent | T185–T189 |
| FR-120 Responsive | T020, T022, T200, T211 |
| FR-121 WCAG 2.2 AA | T021, T026, T192–T199, T201, T212, T213 |
| FR-122 Performance & motion | T176–T184, T191, T217 |
| FR-123 Visual system | T017–T025, T223 |
| FR-124 Copy tone | T040 (rule 8), T221 |
| FR-130 Launch scope (published only) | T029, T039, T166, T222 |

**Edge cases**: missing verified content → T086, T094, T095, T034; concept labelling → T060,
T122; unlisted industry → T037, T109; form failure, slow connection, or duplicates → T079, T080,
T205; spam → T073, T074, T190; international phone → T071, T072; long message → T071, T080;
interactive features fail → T080, T081, T205 (no-JS); small screens → T200, T211; reduced motion
→ T021, T183, T198, T214; unknown or removed URL → T036, T051, T209; shared links → T164, T165;
screenshots unavailable → T121, T125.

**Success criteria**: SC-001, SC-002, SC-011 → T231 · SC-003 → T203, T210 · SC-004 → T084, T205
· SC-005 → T083, T205, T229 · SC-006 → T177, T180, T191, T217, T225 · SC-007 → T201, T212, T213,
T226 · SC-008 → T200, T211 · SC-009 → T163, T166, T215, T230 · SC-010 → T040, T219, T221, T222 ·
SC-012 → T185, T188 · SC-013 → T029, T039, T040.

### Plan architecture decisions → tasks

| Decision | Tasks |
|---|---|
| AD-01 Full SSG | T101, T110, T125, T132, T151, T152, T081 |
| AD-02 Routing / published-only | T029, T039, T101, T110, T125, T132, T151 |
| AD-03 Content + repository | T027–T040, T147 |
| AD-04 SEO architecture | T041, T156–T167, T175 |
| AD-05 Images / coded hero | T065, T085, T120, T121, T176, T177 |
| AD-06 Components / islands | T022–T025, T053–T070, T179 |
| AD-07 Form architecture | T071–T084 |
| AD-08 Blog (MDX) | T139, T146–T155 |
| AD-09 Analytics readiness | T185–T188 |
| AD-10 Deployment / CI | T015, T218, T228 |
| AD-11 Dependency choices | T002, T005, T007, T008, T010, T013, T014, T025, T072, T139, T180, T212 |
| AD-12 Performance budgets | T176–T182, T191, T217 |
| AD-13 JSON-LD | T168–T172 |
| AD-14 Design tokens | T017–T021, T026 |
| AD-15 Popover navigation | T044, T046, T196 |
| AD-16 CSS motion | T021, T183, T184, T198, T214 |
| AD-17 Testing tools | T013, T014, T040, T082, T083, T202–T216 |
| AD-18 Spam / rate limiting | T073, T074, T190, T228 |
| AD-19 Security headers / CSP | T011, T189, T227 |

### Validation summary

- Every spec FR, edge case, and SC maps to at least one task (the tables above).
- Every plan decision AD-01 to AD-19 maps to tasks.
- No task depends on a later task. The phase reordering is explained at the top of this file.
- Undocumented details have been resolved and are stated in the tasks themselves:
  - Draft visibility flag: conventions and T029.
  - Test-only environment overrides: T010 and T014.
  - Render token issued at mount for the static `/contact`: T073, T079, and T080.
  - Error boundaries as a framework-required client exception: T052 and T179.
  - `src/mdx-components.tsx` location: T139.
  - Marketing `covers` refined with a benefit line: T027.
  Contracts and the quickstart have been updated to match.
- No application code has been written in this phase.

---

## Notes

- `[P]` means different files and no dependency on incomplete tasks. `[USn]` maps to the spec
  user stories.
- Tasks that need **U Design input** (T220, T222, T228, T229, T231) are expected to wait. The
  build never blocks on missing inputs because sections hide automatically.
- Commit after each task or logical group, and only when asked to commit.
- Stop at any checkpoint to validate a story independently.
