# Research & Architecture Decisions: U Design Corporate Website

**Feature**: `001-corporate-website` | **Date**: 2026-09-19 | **Plan**: [plan.md](./plan.md)

Each decision uses the format **Decision → Reason → Alternatives considered → Why chosen**.
Decisions AD-01 to AD-12 answer the twelve architecture questions in the planning brief. Decisions
AD-13 onward cover supporting choices. Section R resolves the spec's open clarifications.

Environment verified on 2026-09-19: Node.js v24.19.0 and npm 11.17.0 are installed locally.

---

## AD-01 Rendering strategy

- **Decision**: Every page is statically generated at build time (SSG) with React Server
  Components. Dynamic routes use `generateStaticParams` with `dynamicParams = false`, so unknown
  slugs return the 404 page. The only server runtime code is the consultation Server Action.
  There is no ISR at launch because content changes arrive through deploys.
- **Reason**: Constitution Principle III (server or static by default, LCP ≤ 2.5s) and Principle
  IV (crawlable server-rendered content). Static HTML served from the Vercel edge CDN gives the
  best time to first byte and needs no runtime data source.
- **Alternatives considered**: (a) SSR per request: slower TTFB and cost, with no benefit
  because the content is static. (b) ISR: useful once a CMS exists, but unnecessary with
  file-based content. (c) Client-rendered SPA sections: fail SEO and performance.
- **Why chosen**: This is the simplest model that meets every performance and SEO requirement.
  ISR or on-demand revalidation can be added later without changing components (see AD-03 CMS
  path).

## AD-02 Routing structure

- **Decision**: Use App Router file-based routing with one dynamic template per content type:

  | Route | Source | Notes |
  |---|---|---|
  | `/` | Home content | |
  | `/solutions`, `/solutions/[slug]` | `solutions` collection | Initial slugs: `custom-software`, `erp`, `crm`, `business-dashboards`, `automation` |
  | `/industries`, `/industries/[slug]` | `industries` collection | Initial slugs: `manufacturing`, `distribution`, `real-estate`, `construction`, `logistics`, `travel`, `healthcare`, `retail` |
  | `/digital-marketing`, `/digital-marketing/[slug]` | `marketingServices` collection | Initial pages: `social-media`, `meta-ads`, `content`, `lead-generation`. Services without their own page appear on the hub only. |
  | `/portfolio`, `/portfolio/[slug]` | `projects` collection | |
  | `/blog`, `/blog/[slug]`, `/blog/category/[category]` | MDX posts and categories | Generated only when at least one published post exists (FR-092) |
  | `/about`, `/contact`, `/privacy-policy` | Page content | `/contact` hosts the consultation form |
  | `not-found`, `error`, `global-error` | App Router conventions | |

  A route segment is generated **only for published entries** (`status: "published"` and
  `hasPage: true`). Drafts stay out of routes, navigation, the sitemap, and internal links in
  production.
- **Reason**: This matches the brief's URL structure and FR-100 (clean, descriptive URLs).
  Constitution Principle XI requires collection pages to be generated from data. The brief says
  not to create routes that no content supports.
- **Alternatives considered**: (a) One hand-written folder per industry or solution: duplicated
  markup, which Principle XI forbids. (b) A generic catch-all `[...slug]`: loses per-type
  templates and type safety. (c) Query-string filtering for blog categories: not indexable.
- **Why chosen**: Each content type has its own template and clean URLs. Adding a page means
  adding a data entry and nothing else.
- **Note on marketing slugs**: `social-media` covers Social Media Marketing and Social Media
  Management. `lead-generation` covers Lead Generation and Performance Marketing. Digital
  Strategy appears on the hub and becomes `/digital-marketing/digital-strategy` when its content
  is published. This updates the spec assumption of a single Digital Marketing page, following
  the planning brief.

## AD-03 Content architecture

- **Decision**: File-based, type-safe content in `src/content/`, read only through a
  **repository layer** in `src/lib/content/`, for example `getIndustries()`,
  `getIndustry(slug)`, `getRelatedProjects(ref)`, `getPublishedPosts()`.
  - Structured entities (solutions, marketing services, industries, projects, testimonials,
    stats, client logos, site profile, navigation, form options, home copy) are TypeScript
    modules typed with shared interfaces (`src/types/content.ts`) and checked with `satisfies`.
  - Long-form content (blog posts, Privacy Policy) is MDX. Each post exports a typed `metadata`
    object.
  - Cross-references use **slugs**, never object copies. The repository resolves relations and
    filters out unpublished targets.
  - Build-time integrity tests (AD-17) validate references, uniqueness, and Principle II rules.
- **Reason**: The brief asks for a simple, type-safe, CMS-ready approach with no CMS at launch.
  The spec lists what must be configurable. Principle XI requires content to be separate from
  presentation.
- **Alternatives considered**: (a) A headless CMS now (Sanity, Contentful, Payload): adds cost,
  a dependency, and preview complexity, and the spec does not require non-technical editing at
  launch. (b) JSON or YAML files: no type checking or autocompletion, and relations are
  error-prone. (c) Contentlayer: unmaintained. (d) Markdown for everything: structured fields
  such as features, workflows, and relations fit poorly in prose.
- **Why chosen**: Type errors fail the build, relations are validated, and components never
  import content files directly. **CMS migration path**: re-implement the repository functions
  against a CMS API while keeping their return types, and switch rendering to ISR. Components
  and routes stay unchanged.

## AD-04 SEO architecture

- **Decision**:
  - `src/lib/seo/metadata.ts` provides `buildMetadata({ title, description, path, image?,
    noindex? })`. It returns the Next.js `Metadata` object with the canonical URL (from
    `metadataBase` = `NEXT_PUBLIC_SITE_URL`), Open Graph, and Twitter card fields.
  - The root layout sets the site-wide defaults and the title template `%s | U Design`.
  - Every static page exports its own `metadata`. Every dynamic route implements
    `generateMetadata` from the entry's own `seo` fields. There is no generic fallback
    description, and the content integrity test fails if any published page lacks a unique
    title or description.
  - Per-entry Open Graph images are generated at build time with `opengraph-image.tsx` and
    `next/og` (built into Next.js), using brand colors and the page title.
  - `app/sitemap.ts` and `app/robots.ts` are generated from the repository, published entries
    only. Non-production deployments (`VERCEL_ENV !== "production"`) return `noindex` and
    disallow everything in `robots`.
  - Redirects are declared in `src/content/redirects.ts` and applied through
    `next.config.ts` `redirects()`.
  - Structured data is covered in AD-13.
- **Reason**: FR-100 to FR-104 and Constitution Principle IV. The brief says not to generate
  generic metadata for all pages.
- **Alternatives considered**: `next-seo` (redundant with the App Router Metadata API); static
  OG images per page (manual work and easy to forget).
- **Why chosen**: Built-in APIs, zero dependencies, and uniqueness enforced by tests.

## AD-05 Image strategy

- **Decision**:
  - All raster images use `next/image` with **static imports** from `src/assets/`, which gives
    intrinsic width and height (no CLS) and automatic blur placeholders. Next.js serves AVIF and
    WebP through the Vercel image optimizer (`images.formats: ["image/avif", "image/webp"]`).
  - `sizes` is set per layout slot, for example
    `(min-width: 1280px) 560px, (min-width: 768px) 50vw, 100vw`.
  - **Hero visual**: a coded `DashboardPreview` composition (semantic HTML, CSS, and inline
    SVG charts) instead of a large raster image. Its LCP element is therefore the H1 text, and it
    stays sharp at any density. All numbers inside the mock use neutral illustrative labels and
    are marked `aria-hidden` with an accessible summary (Principle II: the mock must not read as
    a claim).
  - Portfolio screenshots are real interface captures, exported at 2× the largest display size,
    with captions. Below-the-fold images lazy-load, which is the `next/image` default.
  - Only the first above-the-fold raster image on a page is marked high-priority (`priority`, or
    `preload` depending on the installed Next.js version).
  - Client logos are SVG where available, rendered monochrome for visual consistency.
  - Missing images: a content entry without a required screenshot is not publishable
    (integrity test). `next/image` failures fall back to a neutral captioned placeholder frame
    at the same aspect ratio.
- **Reason**: Principle III (LCP, CLS, modern formats) and spec FR-011 and FR-053.
- **Alternatives considered**: (a) A hero video background: heavy and harms LCP, rejected by
  the brief. (b) A large hero PNG: slower LCP and blurry on high-DPI screens. (c) An external
  image CDN: unnecessary on Vercel.
- **Why chosen**: The fastest possible LCP (text), zero layout shift, and crisp product visuals.

## AD-06 Component architecture

- **Decision**: Use a layered component system. Server Components are the default, and client
  components are limited to named islands.

  | Layer | Folder | Examples | Client? |
  |---|---|---|---|
  | UI primitives | `components/ui` | Button, ButtonLink, Card, Badge, SectionHeading, Input, Select, Textarea, Field, LogoCloud, Icon | No |
  | Layout | `components/layout` | Header, Footer, Container, Section, Breadcrumbs, SkipLink | No |
  | Navigation | `components/navigation` | DesktopNav, NavMenu (dropdown), MobileNav | Native Popover API, no JS (AD-15) |
  | Cards | `components/cards` | ServiceCard, IndustryCard, PortfolioCard, CaseStudyCard, TestimonialCard, StatCard, ProcessStep, ArticleCard | No |
  | Shared sections | `components/sections/shared` | CtaBanner, FeatureGrid, ChallengeList, WorkflowList, BenefitList, RelatedProjects, RelatedLinks | No |
  | Home sections | `components/sections/home` | Hero, TrustLogos, ServicesOverview, IndustriesGrid, FeaturedProjects, DigitalizationJourney, ProcessSteps, MarketingOverview, WhyUDesign, CredibilityMetrics, Testimonials, FinalCta | No |
  | Page templates | `components/templates` | SolutionTemplate, IndustryTemplate, MarketingServiceTemplate, ProjectTemplate, ArticleTemplate | No |
  | Visuals | `components/visuals` | DashboardPreview, JourneyDiagram | No |
  | Portfolio | `components/portfolio` | ProjectTypeBadge, ScreenshotGallery, **PortfolioFilter** | Filter only |
  | Forms | `components/forms` | **ConsultationForm**, FormSuccess, FormError, FormField | Form only |
  | SEO | `components/seo` | JsonLd | No |
  | Analytics | `components/analytics` | **AnalyticsScripts**, **TrackClicks** | Only when configured |

  The planned client islands are ConsultationForm, PortfolioFilter, TrackClicks, and
  AnalyticsScripts, and the last two render nothing until analytics is configured.
  - Page files in `app/` stay thin: fetch from the repository, build metadata, and render a
    template.
  - Section components receive typed props, never raw content imports.
  - The brief's **ContactForm** is not a separate component. The Contact page renders
    `ConsultationForm` (spec FR-071) so there is one form and one validation path. A **Modal**
    is not planned: the CTA links to `/contact#consultation` (one action, works without JS,
    FR-082).
  - **Variants over one-offs**: Button (`primary` | `secondary` | `ghost`, `onDark` flag),
    Section (`surface: white | gray | black | deep-green`), Card (`default` | `feature` |
    `link`).
- **Reason**: Principles VII and XI, and the brief's instruction against giant components,
  duplication, and excessive client components.
- **Alternatives considered**: (a) A UI kit (shadcn/ui, Radix, MUI): Radix primitives add client
  JS for things native HTML covers, and MUI conflicts with Tailwind and the bundle budget.
  shadcn-style copy-in components are acceptable in principle, but the needed set is small.
  (b) Atomic design folders (atoms, molecules): naming that adds friction without benefit.
- **Why chosen**: A small, owned component set with minimal client JS.

## AD-07 Form architecture

- **Decision**:
  - `ConsultationForm` is a client component using React 19 `useActionState` with a
    **Server Action** (`src/app/actions/consultation.ts`). `<form action={...}>` works
    **without JavaScript** (progressive enhancement) and posts to the same action.
  - **Client validation**: native HTML constraints (`required`, `type="email"`,
    `type="tel"`, `maxLength`, `pattern`) produced from one field configuration
    (`src/content/form-options.ts` and `src/lib/forms/fields.ts`). There is no client
    validation library, so no extra client JS.
  - **Server validation**: a Zod schema in a `server-only` module
    (`src/lib/forms/consultation-schema.ts`). It trims, normalizes, and length-limits every
    field, allowlists the select values, and returns field-level errors.
  - **Response states**: `idle | submitting | success | error(field) | error(delivery)`. Field
    errors are rendered with `aria-describedby`, and focus moves to the first invalid field. On
    a delivery error the form keeps the entered data and shows fallback contact details from the
    site profile (FR-085).
  - **Spam**: a honeypot field, a minimum fill time checked with a signed render timestamp,
    and a best-effort per-IP rate limit. The Vercel WAF rate-limit rule is the platform-level
    control, and Cloudflare Turnstile is an optional flag (AD-18).
  - **Duplicates**: the submit button is disabled while pending, and a client-generated
    `submissionId` (`crypto.randomUUID()`) is de-duplicated server-side within a short window.
  - **Pre-selection**: CTAs link to `/contact?industry=<slug>&need=<slug>#consultation`. The
    form reads `window.location.search` after hydration, so `/contact` stays fully static and
    does not need a Suspense boundary for `useSearchParams`. The source page comes from the
    `source` query parameter or a same-origin `document.referrer`.
  - **Delivery**: a provider-agnostic `LeadDeliveryAdapter` selected by environment variable
    (see R-1 and [contracts/lead-delivery.md](./contracts/lead-delivery.md)).
- **Reason**: FR-080 to FR-088, Principle IX (validate on client and server, never lose a
  lead), Principle III (minimal client JS), and the security requirements.
- **Alternatives considered**: (a) A route handler plus `fetch`: requires JS, so no progressive
  enhancement. (b) react-hook-form plus Zod on the client: about 25 KB+ of extra client JS for
  eight fields. (c) Third-party form services (Formspree, Typeform embeds): lose brand control,
  add third-party scripts, and send data through another processor. (d) A modal form: needs JS
  and adds focus-trap complexity.
- **Why chosen**: It works without JS, validates on the server, adds no client validation
  library, and the delivery provider can be swapped.

## AD-08 Blog architecture

- **Decision**: MDX posts in `src/content/blog/posts/<slug>.mdx`, compiled at build with
  `@next/mdx`. Each post exports `metadata` (title, slug, excerpt, featured image, author,
  published and updated dates, category, tags, SEO title and description, canonical override,
  related solutions and industries, status). A generated index module (`posts/index.ts`) lists
  the slugs, and the repository imports metadata only for listings.
  - Routes: `/blog`, `/blog/[slug]`, and `/blog/category/[category]` (static, indexable).
  - Related articles use shared category or tags, falling back to the newest posts.
  - `mdx-components.tsx` maps headings, links, images, and callouts to design-system
    components, including an `<InternalCta>` block and `<RelatedSolution slug>` for internal
    linking.
  - **Gate**: when there are zero published posts, blog routes are not generated, the Blog link
    is hidden from navigation and footer, and `/blog` is excluded from the sitemap (FR-092).
- **Reason**: The brief's field list, spec FR-090 to FR-092, and Principle IV.
- **Alternatives considered**: (a) `next-mdx-remote` or `content-collections`: more flexible
  frontmatter, but extra dependencies. (b) A CMS for the blog only: the brief says not to add a
  CMS just because there is a blog. (c) Plain Markdown with remark: cannot embed design-system
  components.
- **Why chosen**: The official Next.js integration, type-safe metadata, and components inside
  articles. For CMS migration, the repository `getPost()` can later return CMS rich text
  rendered by the same `ArticleTemplate`.

## AD-09 Analytics readiness

- **Decision**: No analytics or tracking scripts ship by default.
  - `src/lib/analytics/events.ts` defines a typed event catalogue:
    `consultation_submit`, `cta_click`, `contact_click`, `portfolio_view`,
    `portfolio_filter` (see [contracts/analytics-events.md](./contracts/analytics-events.md)).
  - `track(event, props)` is a no-op unless a provider is configured through `NEXT_PUBLIC_GA_ID`
    and/or `NEXT_PUBLIC_META_PIXEL_ID`.
  - CTAs and contact links carry `data-track="cta_click"` and `data-track-*` attributes that
    are rendered server-side. A single delegated listener (`TrackClicks`, about 1 KB) is mounted
    **only when analytics is configured**, so no per-component client code is needed.
  - Scripts load with `next/script` `strategy="afterInteractive"` or `lazyOnload`, gated behind
    a consent banner where the law requires it (FR-112).
  - Google Search Console needs only a verification meta tag or DNS record. This is set through
    `metadata.verification` from environment variables.
- **Reason**: The brief (no tracking by default, ready for GA, Meta Pixel, and conversions),
  Principle IX, and Principle III.
- **Alternatives considered**: (a) Adding GA now: unnecessary third-party JS and consent
  obligations. (b) Vercel Analytics: privacy-friendly and light, and a good first option once
  approved, but still a decision for U Design. (c) Tag Manager: heavy and hard to govern.
- **Why chosen**: Zero cost until needed, and enabling analytics later changes only environment
  variables and one component.

## AD-10 Deployment approach

- **Decision**: Deploy on Vercel from a Git repository. Pull requests get Preview deployments
  (noindex); `main` goes to Production. Environment variables are configured per environment in
  Vercel (see [quickstart.md](./quickstart.md)). A custom domain uses HTTPS and HSTS. A CI
  workflow (GitHub Actions) runs lint, typecheck, unit tests, build, Playwright end-to-end tests
  with axe checks, and Lighthouse CI against the built site. The workflow gates merges
  (constitution Technical Gates 1 to 7).
- **Reason**: The brief requires a Vercel-ready setup, and the constitution quality gates must be
  automated.
- **Alternatives considered**: Netlify, Cloudflare Pages, or a VPS with Node. All work, but
  Vercel runs Next.js features (image optimization, Server Actions, OG images) natively with no
  adapter.
- **Why chosen**: The least configuration and first-class Next.js support. The code stays
  portable because it avoids Vercel-only APIs apart from optional WAF configuration.

## AD-11 Dependency choices

See the full table in [plan.md › Dependency Decisions](./plan.md#dependency-decisions). In
summary: runtime dependencies are limited to `next`, `react`, `react-dom`, `zod` (server-only),
the `@next/mdx` family, and optionally `lucide-react` (rendered server-side as inline SVG, so
zero client JS). Everything else is a dev dependency (TypeScript, Tailwind, ESLint, Prettier,
Vitest, Playwright, axe, Lighthouse CI). Explicitly rejected: animation libraries, UI kits,
form libraries, CSS-in-JS, state managers, `clsx`/`tailwind-merge` (replaced by a 5-line `cx`
helper), `next-seo`, and date libraries (native `Intl.DateTimeFormat` is used instead).

## AD-12 Performance strategy

- **Decision**: Performance is designed in, not tuned at the end.

  | Metric | Budget (mobile, 75th percentile) | Design measures |
  |---|---|---|
  | LCP | ≤ 2.5s (target ≤ 1.8s) | Static HTML from the CDN; hero LCP element is the H1 text; coded hero visual; `next/font` self-hosted with `display: swap` and metric-adjusted fallback; no render-blocking third parties |
  | INP | ≤ 200ms | Four small client islands; no hydration of section content; CSS-only animation |
  | CLS | ≤ 0.1 | Static image imports with intrinsic sizes; reserved aspect ratios for visuals and logos; font metric fallbacks; no late-injected banners (the consent banner is a fixed overlay, not in the layout flow) |
  | First-load JS | ≤ 130 KB gzip per content route; ≤ 160 KB on `/contact` | Enforced by the build output check in CI |
  | Lighthouse (mobile) | ≥ 90 in all four categories | Lighthouse CI assertions |

  - Fonts: Inter (variable, latin subset) for body text; Poppins weights 600 and 700 only for
    headings (Principle VII allows at most three weights per family).
  - Animation: CSS transitions, plus scroll-driven animations (`animation-timeline: view()`)
    inside `@supports` and `prefers-reduced-motion: no-preference`. Content is **never hidden by
    default**, so browsers without support, or visitors without JS, see everything (AD-16).
- **Reason**: Constitution Principle III and spec SC-006.
- **Alternatives considered**: Framer Motion or GSAP for reveals (30 to 60 KB and they hide
  content until hydration); IntersectionObserver reveal islands (JS and a risk of hidden
  content).
- **Why chosen**: The fastest achievable result, with nothing important depending on JS.

---

## AD-13 Structured data (JSON-LD)

- **Decision**: A `JsonLd` server component serializes typed builder output, escaping `<` as
  `<` to prevent script injection. Builders live in `src/lib/seo/jsonld.ts`.

  | Schema | Where | Source |
  |---|---|---|
  | `Organization` | Root layout | Site profile: name, url, logo, and `sameAs` social links. `contactPoint` and `address` are included **only when provided**. |
  | `WebSite` | Home | Name and url. No `SearchAction`, because there is no site search. |
  | `Service` | Solution and marketing pages | Name, description, provider → Organization, `areaServed` only if provided |
  | `BreadcrumbList` | All detail pages | Breadcrumb trail (same data as the visible breadcrumbs) |
  | `Article` / `BlogPosting` | Blog posts | Post metadata; `author` only when provided |
  | `FAQPage` | Only on pages with visible FAQ content | `faqs` collection (none at launch) |
  | `LocalBusiness` | Not used at launch | Only if a verified physical address is provided and shown |

  No `Review`, `AggregateRating`, or `award` fields are ever generated (FR-103, Principle II).
- **Why chosen**: Accurate and minimal markup avoids penalties. Builders are unit-tested so they
  never emit empty or invented fields.

## AD-14 Design token implementation

- **Decision**: Tailwind CSS v4 with CSS-first configuration. Tokens are defined once in
  `src/styles/globals.css` under `@theme`, which generates utilities such as `bg-brand-green` and
  `text-ink`. Semantic tokens map the palette to roles. Full token table: [plan.md › Design
  System](./plan.md#design-system).
- **Why chosen**: One source of truth, no JS config, and arbitrary values banned by lint and
  review (Principle VII).

## AD-15 Navigation interaction

- **Decision**: The mobile menu and desktop dropdowns use the native **Popover API**
  (`popover` attribute plus `popovertarget` button). This provides built-in Escape-to-close,
  light dismiss, top-layer rendering, and an implicit `aria-expanded` state. Every dropdown
  trigger is also a link to its hub page (`/solutions`, `/industries`), so navigation works even
  where popovers are unsupported. Focus returns to the trigger on close, which is native
  behavior.
- **Alternatives considered**: A React state menu (client JS and hand-built accessibility), or
  `<details>` (awkward semantics for navigation).
- **Why chosen**: No JavaScript and accessible defaults. Popover is Baseline in all current major
  browsers.

## AD-16 Motion

- **Decision**: CSS only. Use tokens for durations (150/250/400ms) and easing. Effects are
  limited to hover and focus transitions, an entrance fade/translate for hero elements, and
  scroll-driven section reveals as progressive enhancement. Everything is wrapped in
  `@media (prefers-reduced-motion: no-preference)`. Only `transform` and `opacity` are animated.
- **Why chosen**: Constitution Principle VIII, with zero JS.

## AD-17 Testing tools

- **Decision**:
  - **Vitest** for unit and integration tests: the Zod schema, delivery adapters (mocked
    fetch), JSON-LD builders, metadata builder, and the **content integrity suite**. The suite
    covers relation resolution, unique SEO fields, concept projects having no client or result
    fields, only verified testimonials and logos being rendered, required screenshots, no
    `TODO`/`PLACEHOLDER`/`lorem` in published content, CTA labels from the approved set, and a
    banned-buzzword check.
  - **Playwright** for end-to-end tests: navigation, mobile menu, form (success, validation,
    delivery failure through a mocked adapter, no-JS submission), portfolio filter, 404,
    breakpoints (320/375/768/1280/1440/1920, asserting no horizontal overflow), keyboard-only
    consultation journey, and SEO assertions (title, description, canonical, a single H1,
    JSON-LD parse).
  - **@axe-core/playwright** on every route. A test fails on critical or serious violations.
  - **Lighthouse CI** (`@lhci/cli`) with mobile assertions of ≥ 0.9 on key templates.
- **Why chosen**: These tools map one-to-one to the constitution quality gates.

## AD-18 Spam protection and rate limiting

- **Decision**: Use layers.
  1. A honeypot field, visually hidden and `aria-hidden`, with `tabindex=-1`.
  2. A minimum fill time of 3s using an HMAC-signed render timestamp (`FORM_SIGNING_SECRET`).
  3. A best-effort per-IP in-memory limit of 5 per 10 minutes per instance.
  4. A **Vercel WAF rate-limit rule** on POSTs to `/contact`, the authoritative limit
     configured in the Vercel dashboard.
  5. Optional **Cloudflare Turnstile**, enabled by setting `TURNSTILE_SITE_KEY` and
     `TURNSTILE_SECRET_KEY`, and used only if spam gets through layers 1 to 4.

  Requests flagged as spam receive a generic success response, which gives bots no signal, and
  are not delivered.
- **Alternatives considered**: Upstash Redis rate limiting (extra service and dependency),
  reCAPTCHA (heavy third-party script, privacy cost, friction).
- **Why chosen**: No friction for genuine visitors (spec edge case), no dependencies, and the
  option to escalate.

## AD-19 Security headers

- **Decision**: `next.config.ts` `headers()` sets `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`,
  `Permissions-Policy` (camera, microphone, and geolocation disabled), and a
  **Content-Security-Policy** with `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`,
  `form-action 'self'`, `frame-ancestors 'none'`, and `img-src 'self' data: blob:`.
  `script-src 'self' 'unsafe-inline'` is required because nonce-based CSP forces dynamic
  rendering, which is incompatible with AD-01. Analytics and Turnstile domains are appended only
  when enabled. Vercel supplies HSTS on custom domains.
- **Why chosen**: Strong protection that stays compatible with static rendering. The trade-off
  is recorded in plan Complexity Tracking.

---

## R. Resolution of spec clarifications

The spec left three `[NEEDS CLARIFICATION]` markers. The planning brief supplies enough
direction to resolve each **at the architecture level**. The remaining business inputs are
configuration or content, not design blockers.

| # | Spec item | Resolution | Remaining business input |
|---|---|---|---|
| R-1 | FR-086: lead delivery destination | A provider-agnostic `LeadDeliveryAdapter` selected by `LEAD_DELIVERY_PROVIDER`: `email` (HTTP email API; Resend-compatible by default, called with `fetch`, no SDK), `webhook` (signed JSON POST to any URL, which covers CRMs, Google Sheets through Apps Script, Zapier, and Make), `email+webhook` (both; success if at least one succeeds, and an alert if one fails), and `console` (development only). The default recommendation is `email+webhook` for redundancy. | The recipient inbox address, email provider account, and optional webhook target. These are set as environment variables. |
| R-2 | FR-130: launch scope for detail pages | Routes are generated from **published** content entries. All 8 industry, 5 solution, and 4 marketing pages are supported. A page goes live when its entry reaches `status: "published"` and passes the integrity checks. Navigation, footer, sitemap, and cross-links adapt automatically. | Which pages' copy is written first. The recommended priority is Manufacturing, ERP, and Custom Software, then the others. |
| R-3 | Showcase projects: concept or client | The `Project.type` field (`"concept"` or `"client"`) drives the badge, hides client fields, and blocks results for concepts. This is enforced by the type system and the integrity tests. **Default until confirmed: all three are `concept`**, which is the safe choice under Principle II. | U Design confirms the status of each project and supplies client permission for any client project. |

The spec has been updated to reference these resolutions.

## Open items (not blocking planning)

1. **Hero surface color**: the brief asks for a "dark green hero", but the constitution forbids
   normal-size body text on `#008A2E` (4.49:1). The proposal is a **Deep Green `#003D1A`**
   surface token (white text 12.48:1, bright green 6.49:1), with `#008A2E` and `#00D84A` used as
   accents. This needs U Design's approval (Complexity Tracking in the plan).
2. Content inputs from the spec's "Missing Information" table: logos, contact details, social
   links, response time, budget ranges and currency, About content, screenshots, Privacy Policy,
   logo files, and blog articles.
3. Analytics provider and consent approach, to be decided when analytics is enabled.
