<!--
Sync Impact Report
- Version change: 1.0.0 → 2.0.0
  - MAJOR: the principle set was restructured and renumbered (5 → 11), and several principles
    were redefined (brand system, conversion, accessibility). Plan Constitution Checks that
    reference v1.0.0 principle numbers no longer map one to one.
- Modified principles:
  - I. Performance & SEO First → III. Performance by Architecture + IV. SEO-First Architecture
  - II. Mobile-First Responsive Design → VI. Intentional Responsive Design
  - III. Accessibility (WCAG 2.2 AA) → V. Accessibility (WCAG 2.2 AA) (adds brand-color
    contrast rules)
  - IV. Brand Consistency Through Design Tokens → VII. Premium U Design System (adds approved
    palette, typography, and aesthetic requirements)
  - V. Conversion-Focused Content → IX. Conversion-Focused Journeys (adds the fixed primary CTA
    "Get Free Consultation" and the approved secondary CTAs)
- Added principles:
  - I. Business-First B2B Positioning
  - II. Content Integrity (NON-NEGOTIABLE)
  - VIII. Purposeful, Lightweight Motion
  - X. Proof Through Portfolio & Industry Depth
  - XI. Scalable, Content-Driven Architecture
- Added sections: Brand Identity Reference (inside Technology & Quality Standards),
  Development Decision Rule, Design Quality Gate
- Removed sections: none (all v1.0.0 rules retained or strengthened)
- Dependent templates (read constitution at runtime; not modified by this command):
  - .specify/templates/plan-template.md: Constitution Check must now cover Principles I–XI
  - .specify/templates/spec-template.md: no change required
  - .specify/templates/tasks-template.md: no change required
- Deferred TODOs: none
- Note: contrast ratios for brand colors were calculated for this amendment
  (#00D84A on white 1.92:1, #008A2E on white 4.49:1, #00D84A on #0B0B0B 10.24:1) and are
  encoded in Principle V.
-->

# U Design Constitution

**Build. Market. Grow.**

U Design helps businesses digitalize their operations and grow through custom software, business
dashboards, automation, and digital marketing. This constitution defines the non-negotiable
principles, standards, and quality requirements for the U Design website. Every specification,
plan, task, and implementation decision MUST follow it.

## Core Principles

### I. Business-First B2B Positioning

The website MUST position U Design as a professional digital business solutions partner, not a
freelancer portfolio, generic agency, or generic software house.

- Content MUST be written for business decision makers (CEOs, business owners, directors,
  operations, IT, factory, and marketing managers), not primarily for developers.
- Business value MUST come before technical detail. When a technical capability is mentioned,
  its business benefit MUST be stated (e.g., "Fast, scalable business software designed around
  your workflow" rather than "Next.js and PostgreSQL powered application"). Technical detail is
  permitted in project and technical sections.
- Software services MUST include Custom Software Development, ERP Systems, CRM Solutions,
  Business Dashboards, Workflow Automation, and Business Process Digitalization, positioned as
  software built around the client's actual workflow. U Design MUST NOT be presented as selling
  generic ready-made software unless a spec explicitly says so.
- Digital marketing services MUST include Social Media Marketing, Social Media Management,
  Content Creation, Meta Ads, Lead Generation, Performance Marketing, and Digital Strategy.
- Software and marketing MUST read as two connected capabilities under one brand, supporting
  **Build. Market. Grow.**
- Corporate and industrial clients MUST be prioritized, with manufacturing given the strongest
  representation. Target industries: Textile Manufacturing, Packaging, Automotive Parts, Food
  Manufacturing, Pharmaceuticals, Plastic Manufacturing, Chemicals, Engineering, Distribution,
  Construction, Logistics, Real Estate, Travel, Healthcare, and Retail.
- Within a few seconds on the home page, a visitor MUST be able to understand what U Design
  does, what problems it solves, who it works with, which software and marketing services it
  offers, why it is relevant to their business, and how to request a consultation.

**Rationale**: The site's audience is corporate buyers who judge credibility quickly. Messaging
aimed at developers, or a freelancer tone, loses them.

### II. Content Integrity (NON-NEGOTIABLE)

The website MUST NOT fabricate claims.

- Client testimonials, client results, revenue numbers, awards, certifications, statistics,
  partnerships, case study results, and client logos MUST NOT be invented.
- Information that has not been provided or verified MUST be shown as a clearly marked,
  editable placeholder or omitted. Placeholders MUST NOT ship to production as if they were
  real.
- Structured data MUST represent only information visible on the site. Fake reviews, ratings,
  awards, organizations, or claims MUST NOT be added for SEO.
- Every marketing claim MUST be supportable.

**Rationale**: Trust is U Design's main selling point to B2B buyers. One fabricated claim
undermines the brand and can breach search engine policies and consumer protection law.

### III. Performance by Architecture

Performance is a first-class architectural requirement, not a final optimization step.

- Pages MUST score 90 or higher in Lighthouse (mobile) for Performance, Accessibility, Best
  Practices, and SEO.
- Core Web Vitals at the 75th percentile: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- Pages MUST be server-rendered or statically generated by default. Client components
  (`"use client"`) MUST be limited to interactive leaves and justified in the plan.
- Images MUST be optimized, served in modern formats, and given explicit dimensions (via
  `next/image`). Fonts MUST be self-hosted and subset (via `next/font`) and limited to the
  weights actually used.
- Third-party scripts and new dependencies MUST be minimal and justified. A lightweight native
  or CSS solution MUST be preferred over a heavy library when it is sufficient.
- Visual effects MUST NOT noticeably degrade load time or responsiveness.

**Rationale**: Slow pages lose decision makers and search ranking before content can persuade.

### IV. SEO-First Architecture

SEO MUST be considered during architecture, content creation, component development, and page
creation.

- Every indexable page MUST have a unique title, unique meta description, canonical URL,
  logical heading hierarchy with exactly one `<h1>`, semantic HTML, a descriptive URL,
  optimized images with meaningful alt text, internal links, and Open Graph and social sharing
  metadata.
- The site MUST provide an XML sitemap, `robots.txt`, clean URLs, crawlable server-rendered
  content, breadcrumbs where useful, structured data where appropriate (subject to
  Principle II), and redirects when URLs change.
- The URL and data architecture MUST scale for services, industries, portfolio, case studies,
  and blog articles, with metadata generated from content data rather than hand-written per
  page.
- Content MUST be written naturally for users first. Keyword stuffing is prohibited.

**Rationale**: Organic search is a primary acquisition channel for B2B services, and SEO
retrofitted late is expensive and incomplete.

### V. Accessibility (WCAG 2.2 AA)

The site MUST conform to WCAG 2.2 Level AA.

- Use semantic HTML, a logical heading structure, native buttons and links, keyboard operability
  for all functionality, and visible focus states.
- Forms MUST have visible, associated labels and descriptive errors that are announced to
  assistive technologies.
- ARIA MUST be used only when native semantics are insufficient.
- Color MUST NOT be the only way important information is communicated.
- Motion MUST respect `prefers-reduced-motion` (see Principle VIII).
- Contrast MUST be at least 4.5:1 for normal text and 3:1 for large text and UI components. For
  the brand palette this means:
  - Primary Green `#00D84A` MUST NOT be used for text or essential icons on white or light
    gray (1.92:1). It MAY be used as a background with black text (10.24:1), as an accent, or
    for text on black.
  - Dark Green `#008A2E` measures 4.49:1 on white and 4.38:1 against black. It MUST be used
    only for large text (≥ 24px, or ≥ 18.66px bold), UI elements, or backgrounds. Normal-size
    body text MUST NOT be set on or in Dark Green.
- Automated checks (axe or Lighthouse) MUST report zero critical or serious violations.

**Rationale**: Accessibility widens the audience, reduces legal risk, and reinforces the
professional quality the brand promises.

### VI. Intentional Responsive Design

The site MUST be designed intentionally for desktop, laptop, tablet, and mobile. Mobile is not
an afterthought, and desktop layouts MUST NOT simply be shrunk.

- Navigation, hero, dashboard mockups, cards, tables, forms, CTAs, and portfolio sections MUST
  have deliberate mobile layouts.
- Styles MUST be authored mobile-first with Tailwind min-width breakpoints.
- There MUST be no horizontal overflow from 320px to 1920px wide. Wide content such as tables
  and dashboards MUST be restructured, or scroll inside its own contained region.
- Tap targets MUST be at least 44×44 CSS px, and body text at least 16px on mobile.
- Each feature MUST be verified at 375px, 768px, 1280px, and 1440px widths.

**Rationale**: Decision makers often first see the site on a phone, and a broken mobile layout
signals low capability.

### VII. Premium U Design System

The site MUST have a premium corporate SaaS and technology aesthetic: modern, clean, minimal,
confident, and B2B-focused. It MUST NOT look like a template or a generic agency site.

- Every major design decision MUST support at least one goal: build trust, explain the service
  clearly, demonstrate capability, or generate qualified leads. Elements that serve none of
  these MUST be removed.
- **Color**: Only the approved palette (see Brand Identity Reference) MAY be used for brand
  styling. Green MUST be used strategically, not in every section. Hierarchy MUST come from
  alternating white, light gray, dark green, and black sections. New colors are allowed only
  for a documented functional need (e.g., error or warning states).
- **Typography**: Poppins for headings and Inter for body and UI text. A single, consistent
  type scale MUST be used, with at most three weights per family. Headings are bold and strong;
  body text is clean and comfortable to read.
- **Design tokens**: Colors, type scale, spacing, radii, and shadows MUST be defined once as
  Tailwind theme tokens and referenced by name. Arbitrary one-off values MUST NOT be used unless
  the exception is documented in the plan.
- **Shared components**: Buttons, cards, inputs, section layouts, navigation, and CTA patterns
  MUST be shared components. One-off variants MUST NOT be created when an existing component
  or variant fits. New pages MUST visually belong to the same system.

**Rationale**: A digital solutions company's own website is its first proof of quality, and a
consistent system is what makes a site feel premium rather than assembled.

### VIII. Purposeful, Lightweight Motion

Animation MUST be subtle and purposeful, used only to improve hierarchy, feedback, navigation,
product presentation, or engagement.

- CSS transitions and animations MUST be preferred. Heavy JavaScript animation libraries MUST
  NOT be used unless the plan justifies them.
- The following are prohibited: excessive or constant movement, distracting effects, loading
  screens or intros, and animation that delays access to content.
- All non-essential motion MUST be disabled or reduced under `prefers-reduced-motion`.
- Animations MUST NOT cause layout shift and MUST use compositor-friendly properties
  (`transform`, `opacity`).

**Rationale**: Restrained motion reads as premium. Heavy motion hurts performance,
accessibility, and focus.

### IX. Conversion-Focused Journeys

The website is a business acquisition tool, and user journeys MUST be simple and logical.

- The primary CTA is **Get Free Consultation**. Its wording MUST be used consistently and it
  MUST NOT be renamed per page.
- Approved secondary CTAs: **View Our Solutions**, **View Case Study**, **Discuss Your
  Business**, and **Grow Your Business**. New CTA wording requires a plan justification.
- Every page MUST offer a path to the primary CTA. The home, service, and industry pages MUST
  show it above the fold. A section MUST NOT present more than one primary and one secondary
  CTA.
- CTAs MUST be visible without being intrusive. Auto-opening pop-ups, exit-intent modals, and
  CTAs that obscure content are prohibited.
- Navigation MUST stay shallow and predictable. Unnecessary interactions MUST be avoided.
- Consultation forms MUST collect only essential fields, validate on both client and server,
  show clear success and error states, include spam protection, and deliver every submission
  reliably without silent loss.
- Conversion events MUST be trackable through privacy-respecting analytics, with consent where
  the law requires it.

**Rationale**: Consistent, focused CTAs convert better than competing ones, and a lost lead is
lost revenue.

### X. Proof Through Portfolio & Industry Depth

Capability MUST be demonstrated, not just claimed.

- Portfolio items MUST follow **Problem → Solution → Features → Business Application**.
- Software projects MUST show actual interface screenshots or high-quality product UI, each
  with explanatory context. Screenshots MUST NOT appear without context.
- Priority portfolio categories: Manufacturing ERP, Travel Agency Management, Real Estate CRM,
  Inventory Management, Business Dashboards, and Custom Business Software.
- Industry pages MUST NOT be generic copies of one another. Each MUST cover industry challenges,
  relevant workflows, suitable software solutions, relevant features, business benefits,
  related projects, and a consultation CTA.
- Manufacturing content MUST address its core workflows: production, inventory, purchase,
  sales, quality, warehouse, and reporting.
- All portfolio and industry content is subject to Principle II.

**Rationale**: B2B buyers trust partners who show that they understand their industry's
workflows.

### XI. Scalable, Content-Driven Architecture

The architecture MUST make it easy to add services, industries, case studies, blog posts,
landing pages, marketing campaigns, and software demos.

- Content and data (services, industries, portfolio, case studies, posts, CTAs, SEO metadata)
  MUST be kept in typed content sources separate from presentation. Adding a new entry MUST NOT
  require editing layout components.
- The codebase MUST keep layout, navigation, sections, UI primitives, forms, cards, portfolio
  components, industry components, SEO utilities, and content/data in separate modules.
- Giant page components and duplicated UI logic are prohibited. Pages MUST compose shared
  sections.
- Collection pages (services, industries, portfolio, blog) MUST be generated from content data
  through dynamic routes, not duplicated by hand.

**Rationale**: The site will grow with the business. Hard-coded content makes every addition
slow and error-prone.

## Technology & Quality Standards

### Brand Identity Reference

- **Company**: U Design
- **Tagline**: Build. Market. Grow.
- **Palette** (the only approved brand colors):
  - Primary Green `#00D84A`
  - Dark Green `#008A2E`
  - Black `#0B0B0B`
  - White `#FFFFFF`
  - Light Gray `#F7F8FA`
- **Typefaces**: Poppins (headings) and Inter (body and UI)

### Technology Stack

- **Framework**: Next.js (App Router), React Server Components by default, and TypeScript in
  strict mode.
- **Styling**: Tailwind CSS configured with U Design tokens. No additional CSS or UI
  frameworks unless the plan justifies them.
- **Content**: Typed content modules or files (e.g., TypeScript data, MDX), selected in the plan,
  that satisfy Principle XI.
- Technology MUST NOT be chosen for trendiness. It MUST be justified by the Development
  Decision Rule.

### Code Quality

- Code MUST be clean, modular, typed, readable, and scalable. Simple solutions MUST be
  preferred over speculative abstraction.
- `any` is prohibited unless an inline comment documents why.
- Unused code or imports, console errors or warnings, and temporary debugging code MUST NOT be
  merged.
- ESLint and Prettier MUST pass, and TypeScript MUST compile with zero errors.
- Dependencies MUST be minimal. Each new runtime dependency MUST be justified in the plan by
  its value relative to its size.

### Security & Data Handling

- Secrets and API keys MUST live in server-side environment variables and MUST NOT be exposed
  in client-side code or committed to the repository.
- Forms and API integrations MUST validate and sanitize input on the server and handle data
  securely.
- Only personal information that is necessary for the stated purpose MAY be collected. A
  privacy policy MUST describe what is collected and why.

## Development Workflow & Quality Gates

Features follow the Spec Kit flow: specify → plan → tasks → implement. Each plan MUST include a
Constitution Check confirming compliance with Principles I–XI, or recording a justified
exception in Complexity Tracking.

### Development Decision Rule

When several implementation options exist, choose the one with the best balance of, in priority
order:

1. User experience
2. Performance
3. Accessibility
4. SEO
5. Maintainability
6. Scalability
7. Visual quality

When requirements conflict, business clarity, performance, accessibility, SEO, maintainability,
and user experience MUST take precedence over decorative complexity.

### Technical Gates (required before merge)

1. `lint`, `typecheck`, and `build` succeed with zero errors.
2. Lighthouse (mobile) meets the Principle III thresholds on affected pages.
3. Automated accessibility checks report zero critical or serious violations (Principle V).
4. No horizontal overflow at 320px, 375px, 768px, 1280px, or 1440px (Principle VI).
5. Every affected indexable page has complete metadata and is included in the sitemap
   (Principle IV).
6. Forms are tested end to end for submission, validation, error handling, and delivery
   (Principle IX).
7. No unverified claims or unmarked placeholders ship to production (Principle II).

### Design Quality Gate (required before a page is complete)

A page is complete only if every answer is yes:

- Does it look premium and corporate?
- Does it match U Design branding (palette, typography, components)?
- Is the visual hierarchy clear?
- Is the content easy to understand for a business decision maker?
- Is the primary CTA obvious?
- Does it work well on mobile?
- Does it load quickly?
- Is it accessible?
- Is it SEO-ready?
- Is it free of unnecessary visual clutter?

Any element that does not improve the user experience or the business objective MUST be removed.

### Final Standard

The finished website MUST feel like a serious, established B2B technology and digital growth
company, and MUST communicate: *We understand businesses. We build practical digital systems. We
help businesses grow. We can become a long-term digital partner.*

## Governance

This constitution supersedes all other project practices and conventions. In a conflict, the
constitution prevails until it is formally amended.

- **Amendments**: Proposed changes MUST be documented with rationale, reviewed, and applied
  through `/speckit-constitution`, including an updated Sync Impact Report.
- **Versioning**: Semantic versioning applies. MAJOR for removing, redefining, or renumbering
  principles, MINOR for adding a principle or materially expanding guidance, PATCH for
  clarifications and wording.
- **Compliance**: Every spec, plan, task list, and review MUST verify compliance. Deviations
  MUST be justified in the plan's Complexity Tracking section, or the work MUST be simplified to
  comply. Non-negotiable principles (Principle II) MUST NOT be waived.

**Version**: 2.0.0 | **Ratified**: 2026-09-19 | **Last Amended**: 2026-09-19
