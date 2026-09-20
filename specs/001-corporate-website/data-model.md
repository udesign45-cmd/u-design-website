# Data Model: U Design Corporate Website

**Feature**: `001-corporate-website` | **Date**: 2026-09-19 | **Plan**: [plan.md](./plan.md)

All content is file-based and typed (research AD-03). Types live in `src/types/content.ts`. Data
lives in `src/content/`. Pages and components read data only through the repository
(`src/lib/content/`). Field notation: `?` means optional, and `Slug` is a lowercase kebab-case
string that is unique within its collection.

## Shared types

| Type | Definition | Notes |
|---|---|---|
| `Slug` | `string` matching `^[a-z0-9]+(-[a-z0-9]+)*$` | Used in URLs and cross-references |
| `Status` | `"draft" \| "published"` | Only `published` entries render in production |
| `Seo` | `{ title: string; description: string; ogImage?: StaticImage }` | Title 30–60 characters, description 70–160 characters, both unique across the site (integrity test) |
| `CtaLabel` | `"Get Free Consultation" \| "View Our Solutions" \| "View Case Study" \| "Discuss Your Business" \| "Discuss Your Business Process" \| "Grow Your Business"` | Enforces constitution IX and FR-005 at compile time |
| `Cta` | `{ label: CtaLabel; href: string; variant: "primary" \| "secondary"; track?: string }` | `href` is an internal path or `/contact?...#consultation` |
| `StaticImage` | A static image import (width, height, and blur data are automatic) plus `alt: string` | `alt` is required. Use `""` only for decorative images. |
| `Screenshot` | `{ image: StaticImage; caption: string; module?: string }` | A caption is mandatory (FR-053) |
| `IconName` | A union of the approved icon names | Keeps the icon set consistent |
| `RichText` | `string[]` (paragraphs) | Short structured copy. Long-form content uses MDX. |

## Entities

### SiteProfile (`src/content/site.ts`), singleton

| Field | Type | Rules |
|---|---|---|
| `name` | `"U Design"` | Fixed |
| `tagline` | `"Build. Market. Grow."` | Fixed |
| `positioning` | `string` | "Digital Solutions That Help Businesses Grow" |
| `url` | from `NEXT_PUBLIC_SITE_URL` | Absolute and canonical |
| `logo` | `StaticImage` | **Content input required** |
| `email?` | `string` | Omitted until provided. Never invented. |
| `phone?` | `{ display: string; e164: string }` | Omitted until provided |
| `location?` | `{ city?: string; country?: string; address?: string; mapUrl?: string }` | Omitted until provided |
| `socials` | `{ platform: "linkedin" \| "facebook" \| "instagram" \| "x" \| "youtube"; url: string }[]` | May be empty |
| `responseTime?` | `string` | e.g., "within one business day". If absent, a generic confirmation is shown. |
| `hours?` | `string` | Optional |

**Validation**: `email` or `phone` is required before launch (spec Missing Information table). The
integrity test warns in development and **fails in a production build** if both are missing.

### Solution (`src/content/solutions/*.ts`), collection

| Field | Type | Rules |
|---|---|---|
| `slug` | `Slug` | Initial slugs: `custom-software`, `erp`, `crm`, `business-dashboards`, `automation` |
| `name` | `string` | e.g., "ERP Systems" |
| `category` | `"software"` | Separates it from marketing services |
| `summary` | `string` | A one-line business benefit (hub and cards), ≤ 140 characters |
| `icon` | `IconName` | |
| `status` / `hasPage` | `Status` / `boolean` | `hasPage` must be `true` to generate `/solutions/[slug]` |
| `hero` | `{ heading: string; intro: string }` | H1 plus intro |
| `problem` | `{ heading: string; points: string[] }` | The business problem (FR-031) |
| `approach` | `RichText` | How the solution helps, framed as custom-built (FR-032) |
| `features` | `{ title: string; description: string; icon?: IconName }[]` | 4 or more |
| `benefits` | `{ title: string; description: string }[]` | 3 or more, business outcomes |
| `useCases` | `string[]` | |
| `industries` | `Slug[]` → Industry | Resolved; unpublished targets filtered out |
| `projects` | `Slug[]` → Project | Optional; section hidden if the list resolves empty |
| `faqs?` | `Faq[]` | Only if real FAQ content exists (enables FAQPage JSON-LD) |
| `cta` | `Cta` | Defaults to the primary consultation CTA with `need=<slug>` |
| `seo` | `Seo` | |
| `order` | `number` | Display order |

### MarketingService (`src/content/marketing/*.ts`), collection

The shape is the same as **Solution** with `category: "marketing"`, plus:

| Field | Type | Rules |
|---|---|---|
| `covers` | `string[]` | Service names covered, e.g., `social-media` covers Social Media Marketing and Social Media Management |
| `outcomes` | `string[]` | Business outcomes (reach, visibility, leads, presence, growth). No guarantees (FR-061). |

Initial entries: `social-media`, `meta-ads`, `content`, `lead-generation` (all with
`hasPage: true`), and `digital-strategy` (hub only until content is ready). Performance Marketing
is covered by `lead-generation`.

### Industry (`src/content/industries/*.ts`), collection

| Field | Type | Rules |
|---|---|---|
| `slug` | `Slug` | `manufacturing`, `distribution`, `real-estate`, `construction`, `logistics`, `travel`, `healthcare`, `retail` |
| `name` | `string` | e.g., "Travel & Tourism" |
| `shortWorkflows` | `string[]` | Keywords for cards, e.g., Production, Inventory, Purchasing… (FR-040) |
| `summary` | `string` | For cards and the overview |
| `icon` | `IconName` | |
| `priority` | `number` | Manufacturing = 1 (FR-043) |
| `status` / `hasPage` | `Status` / `boolean` | |
| `hero` | `{ heading: string; intro: string }` | |
| `challenges` | `{ title: string; description: string }[]` | 3 or more, industry-specific (FR-042) |
| `workflows` | `{ name: string; description: string }[]` | Manufacturing must include production, inventory, raw materials, purchasing, sales, warehouse, reporting, and management dashboards (FR-043) |
| `solutions` | `Slug[]` → Solution | |
| `features` | `{ title: string; description: string }[]` | |
| `benefits` | `{ title: string; description: string }[]` | |
| `projects` | `Slug[]` → Project | Hidden or linked to `/portfolio` when the list is empty (US3 scenario 4) |
| `cta` | `Cta` | `industry=<slug>` pre-selection |
| `seo` | `Seo` | |

**Integrity rule**: pairwise text similarity between the `challenges` and `features` of any two
industries must be below a threshold. This catches "same text with the name swapped" (FR-042).

### Project (`src/content/projects/*.ts`), collection

| Field | Type | Rules |
|---|---|---|
| `slug` | `Slug` | Initial slugs: `manufacturing-erp`, `travel-agency-management`, `real-estate-crm` |
| `title` | `string` | |
| `type` | `"concept" \| "client"` | **Default `concept`** until confirmed (research R-3) |
| `industry` | `Slug` → Industry | Primary industry |
| `industryLabel?` | `string` | Sub-industry, e.g., "Textile Manufacturing" |
| `solutionTypes` | `Slug[]` → Solution | Used for filtering (FR-050) |
| `summary` | `string` | Card text |
| `challenge` | `RichText` | Problem |
| `solution` | `RichText` | Solution |
| `modules` | `{ name: string; description: string }[]` | Features, e.g., Executive Dashboard, Production… |
| `businessApplication` | `RichText` | |
| `screenshots` | `Screenshot[]` | **At least 1 required to publish** (spec edge case) |
| `cover` | `StaticImage` | Card preview |
| `technologies?` | `string[]` | Optional, shown in a secondary position |
| `client?` | `{ name: string; logo?: StaticImage; permissionConfirmed: true }` | **Allowed only when `type = "client"`** |
| `results?` | `{ label: string; value: string; verifiedBy: string; verifiedOn: string }[]` | **Allowed only when `type = "client"`.** Each result needs verification metadata. |
| `featured` | `boolean` | Home showcase (FR-015) |
| `status` | `Status` | |
| `seo` | `Seo` | |

The type is a **discriminated union** on `type`, so `client` and `results` cannot exist on a
concept project at compile time (FR-052, Principle II).

### Testimonial (`src/content/testimonials.ts`), collection

| Field | Type | Rules |
|---|---|---|
| `quote` | `string` | Verbatim and approved |
| `name`, `role`, `company` | `string` | |
| `photo?` | `StaticImage` | |
| `projectSlug?` | `Slug` | |
| `verified` | `boolean` | **Rendered only when `true`** |
| `approvedOn` | ISO date | |

The home Testimonials section renders only if at least one verified testimonial exists. The list
is empty at launch.

### Stat (`src/content/stats.ts`), collection

| Field | Type | Rules |
|---|---|---|
| `value` | `string` | e.g., "25+" |
| `label` | `string` | |
| `source` | `string` | Internal evidence reference, **required** |
| `verified` | `boolean` | Rendered only when `true` |

The home "Credibility / Metrics" section renders only if at least 3 verified stats exist. The list
is empty at launch.

### ClientLogo (`src/content/client-logos.ts`), collection

`{ company: string; logo: StaticImage; url?: string; permissionConfirmed: boolean }`. The trust
section renders only entries with `permissionConfirmed: true` and hides itself when there are none
(FR-012).

### BlogPost (`src/content/blog/posts/<slug>.mdx`), collection

Each post exports `metadata`:

| Field | Type | Rules |
|---|---|---|
| `title`, `slug`, `excerpt` | `string` | The slug must match the filename |
| `featuredImage` | `StaticImage` | |
| `author?` | `{ name: string; role?: string }` | Shown only when provided |
| `publishedAt`, `updatedAt?` | ISO date | |
| `category` | `Slug` → BlogCategory | |
| `tags` | `string[]` | |
| `relatedSolutions`, `relatedIndustries` | `Slug[]` | Internal linking (FR-090) |
| `seo` | `Seo` | |
| `canonical?` | absolute URL | Only for syndicated content |
| `status` | `Status` | |

**BlogCategory** (`src/content/blog/categories.ts`): `{ slug, name, description, seo }`. The
initial set covers the FR-091 topics: business-software, erp, crm, manufacturing-technology,
dashboards, automation, digital-transformation, digital-marketing, meta-ads, social-media, and
lead-generation. A category page is generated only if it has at least one published post.

### ConsultationRequest (runtime only; not stored by the site)

| Field | Type | Validation (server, Zod) | Client (native) |
|---|---|---|---|
| `name` | `string` | Required, trimmed, 2–100 characters | `required`, `maxLength=100`, `autocomplete="name"` |
| `company` | `string` | Required, 2–150 characters | `required`, `autocomplete="organization"` |
| `email` | `string` | Required, valid email, ≤ 254 characters, lowercased | `type="email"`, `autocomplete="email"` |
| `phone` | `string` | Required, 7–20 characters of `+`, digits, spaces, `-`, `(`, `)`, with 7–15 digits | `type="tel"`, `autocomplete="tel"`, `pattern` |
| `industry` | `Slug \| "other"` | Must be in `formOptions.industries` | `<select required>` |
| `need` | `string` | Must be in `formOptions.needs` (solutions, marketing services, `not-sure`) | `<select required>` |
| `budget?` | `string` | Must be in `formOptions.budgets` if the field is enabled | `<select>`. **Field omitted when `budgets` is empty** (content input required) |
| `message?` | `string` | ≤ 2000 characters, control characters stripped | `maxLength=2000` with a visible counter |
| `consent` | notice only | The privacy notice and link are displayed. No checkbox unless legal review requires one. | |
| `sourcePage` | `string` | Same-origin path, ≤ 200 characters | Hidden input |
| `submissionId` | UUID | Required, de-duplicated within 10 minutes | Hidden input set on hydrate. Without JS, the server generates one. |
| `renderedAt` | signed timestamp | If present: HMAC valid and at least 3s elapsed. If absent (no-JS): the time check is skipped. | Hidden input set at mount from `issueRenderToken()` (the page is static) |
| `website` | honeypot | Must be empty | Hidden, `tabindex=-1`, `autocomplete="off"` |
| `submittedAt` | ISO datetime | Set by the server | — |

**State transitions** (form UI):

```text
idle ──submit──▶ submitting ──valid+delivered──▶ success (confirmation, form hidden, "send another" link)
                     │
                     ├──invalid──▶ fieldErrors (values kept, focus first error) ──submit──▶ submitting
                     ├──delivery failed──▶ deliveryError (values kept, retry + fallback contacts) ──submit──▶ submitting
                     └──spam detected──▶ success (silent; nothing delivered)
```

### FormOptions (`src/content/form-options.ts`), singleton

`{ industries: {value, label}[]; needs: {value, label, group: "software" | "marketing"}[];
budgets: {value, label}[] }`. Industries and needs are **derived** from the Industry, Solution,
and MarketingService collections plus `other` and `not-sure`, so they never drift. `budgets` is
empty until U Design supplies ranges and currency.

### Navigation and Footer (`src/content/navigation.ts`), singletons

- `primary`: Home, Solutions (menu → published solutions), Industries (menu → published
  industries, Manufacturing first), Digital Marketing (menu → published marketing pages),
  Portfolio, About, Contact. Menu children are **derived from the repository**.
- `cta`: the fixed "Get Free Consultation" CTA.
- `footer`: column groups (Solutions, Industries, Company, Legal), contact block from
  SiteProfile, social links, and a Blog link only when posts exist.

### Page copy singletons

`home.ts` (hero, section headings and intros), `digitalization.ts` (pain points and the three
journey stages), `process.ts` (six steps: number, title, description), `why.ts` (four themes),
`about.ts` (sections per FR-070), and `legal/privacy-policy.mdx`.

### Redirect (`src/content/redirects.ts`)

`{ source: string; destination: string; permanent: boolean }[]`. The list is empty at launch.

## Relationship map

```text
Industry ⇄ Solution           (Industry.solutions, Solution.industries — both directions validated)
Industry ← Project.industry   (Industry.projects must list only projects whose industry matches or is related)
Solution ← Project.solutionTypes
BlogPost → Solution, Industry, BlogCategory
Testimonial → Project (optional)
FormOptions ← derived from Industry + Solution + MarketingService
Navigation ← derived from published Solution / Industry / MarketingService
Sitemap ← all published entries with pages
```

## Repository API (`src/lib/content/`)

The contract between content and UI, and the seam for a future CMS. All functions are
synchronous at launch and return **only published** entries in production.

| Function | Returns |
|---|---|
| `getSite()` | `SiteProfile` |
| `getSolutions()` / `getSolution(slug)` | `Solution[]` / `Solution \| undefined` |
| `getMarketingServices()` / `getMarketingService(slug)` | … |
| `getIndustries()` / `getIndustry(slug)` | Sorted by `priority` |
| `getProjects(filter?)` / `getProject(slug)` / `getFeaturedProjects()` | |
| `getRelated<T>(slugs, collection)` | Resolved, published-only |
| `getVerifiedTestimonials()` / `getVerifiedStats()` / `getApprovedLogos()` | Possibly empty |
| `getPublishedPosts({ category? })` / `getPost(slug)` / `getRelatedPosts(post)` | |
| `getFormOptions()` / `getNavigation()` / `getRedirects()` | |
| `getAllRoutes()` | Used by the sitemap and link tests |

## Integrity rules (enforced by `tests/unit/content-integrity.test.ts`)

1. Every slug reference resolves to an existing entry. References to drafts are allowed in
   development but filtered out at render.
2. SEO titles and descriptions are unique across all published pages and within the length
   limits.
3. Concept projects have no `client` or `results` fields. Every `results` item has
   `verifiedBy` and `verifiedOn`.
4. Only `verified` testimonials and stats and `permissionConfirmed` logos are rendered.
5. Published projects have at least 1 screenshot with a caption.
6. No published string contains `TODO`, `TBD`, `PLACEHOLDER`, `lorem`, or `example.com`.
7. CTA labels come from the approved set (also enforced by type).
8. Published copy avoids the banned-buzzword list ("innovative", "cutting-edge",
   "revolutionary", "best-in-class", "guaranteed") unless it is explicitly allowlisted.
9. Industry content is distinct (similarity threshold rule).
10. A production build requires at least one contact channel (`email` or `phone`).
