# Contract: Public Routes, Metadata & Structured Data

**Implements**: FR-001 to FR-008, FR-100 to FR-104, constitution IV | **Research**: AD-02, AD-04, AD-13

Every route below is statically generated. "Gate" means the route exists only when the condition
holds.

| Route | H1 source | Metadata | JSON-LD | Breadcrumbs | Gate |
|---|---|---|---|---|---|
| `/` | Hero headline | Static (home) | Organization (layout), WebSite | — | — |
| `/solutions` | Hub heading | Static | BreadcrumbList | Home › Solutions | — |
| `/solutions/[slug]` | `solution.hero.heading` | `solution.seo` | Service, BreadcrumbList, FAQPage (only if `faqs`) | Home › Solutions › {name} | published and `hasPage` |
| `/industries` | Hub heading | Static | BreadcrumbList | Home › Industries | — |
| `/industries/[slug]` | `industry.hero.heading` | `industry.seo` | BreadcrumbList | Home › Industries › {name} | published and `hasPage` |
| `/digital-marketing` | Page heading | Static | Service (umbrella), BreadcrumbList | Home › Digital Marketing | — |
| `/digital-marketing/[slug]` | `service.hero.heading` | `service.seo` | Service, BreadcrumbList | Home › Digital Marketing › {name} | published and `hasPage` |
| `/portfolio` | Page heading | Static | BreadcrumbList | Home › Portfolio | — |
| `/portfolio/[slug]` | `project.title` | `project.seo` | BreadcrumbList | Home › Portfolio › {title} | published and at least 1 screenshot |
| `/about` | Page heading | Static | BreadcrumbList | Home › About | — |
| `/contact` | Page heading | Static | BreadcrumbList | Home › Contact | — |
| `/privacy-policy` | Page heading | Static | BreadcrumbList | Home › Privacy Policy | — |
| `/blog` | Page heading | Static | BreadcrumbList | Home › Blog | at least 1 published post |
| `/blog/category/[category]` | Category name | `category.seo` | BreadcrumbList | Home › Blog › {category} | category has at least 1 post |
| `/blog/[slug]` | `post.title` | `post.seo` (+ `canonical`) | BlogPosting, BreadcrumbList | Home › Blog › {title} | published |
| `/sitemap.xml` | — | — | — | — | Lists all gated routes that exist |
| `/robots.txt` | — | — | — | — | Production: allow all plus the sitemap URL. Other environments: disallow all. |
| any other path | 404 page | `noindex` | — | — | — |

## Metadata guarantees (every indexable route)

- `<title>` is unique and follows the pattern `{page title} | U Design`. The home page uses a full
  custom title.
- `<meta name="description">` is unique.
- `<link rel="canonical">` is an absolute URL on `NEXT_PUBLIC_SITE_URL` with no query string.
- Open Graph: `og:title`, `og:description`, `og:url`, `og:type` (`website` or `article`), and
  `og:image` at 1200×630 (generated per entry). Twitter: `summary_large_image`.
- Exactly one `<h1>`, with heading levels that never skip.
- Non-production deployments: `<meta name="robots" content="noindex, nofollow">`.

## Internal linking guarantees (checked by the e2e link crawl)

- Every published route is reachable from at least one other page (no orphans) and appears in the
  sitemap.
- Industry pages link to their solutions and projects. Solution pages link to their industries
  and projects. Project pages link to their industry, solutions, and `/contact`. Blog posts link
  to their related solutions and industries.
- Every page has a path to `/contact#consultation` within one action (FR-004, SC-003).
