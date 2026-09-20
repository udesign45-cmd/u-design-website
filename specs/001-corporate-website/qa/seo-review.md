# SEO review

Task T224. The local half is done; the deployment half (validators, share debuggers,
Search Console) needs the Vercel Preview from T228, so the task stays open.

Last local run: 2026-09-20, production build with drafts visible.

## Verified locally (automated, `tests/e2e/sweeps.spec.ts`)

Across all 30 sitemap routes:

| Check | Result |
| --- | --- |
| `<title>` unique site-wide, 10–70 characters | Pass |
| `<meta name="description">` unique, 50–175 characters | Pass |
| Absolute canonical, no query string | Pass |
| Exactly one `h1`; no skipped heading levels | Pass |
| Open Graph title, description and image; `twitter:card` | Pass |
| Every distinct `og:image` returns 200 with an `image/*` type | Pass |
| JSON-LD parses, carries `@type`, and contains no `Review` or `AggregateRating` | Pass |
| `BreadcrumbList` on every page except the home page | Pass |
| Non-production robots: `Disallow: /` plus a `noindex` meta tag | Pass |
| No broken internal links, no orphan pages | Pass |
| Draft-gated build: no draft route in the sitemap and no link to one | Pass (`blog-gate` project) |

Structured data emitted per template, checked against
`contracts/routes-and-seo.md` and confirmed in the served HTML:

| Route | Emitted |
| --- | --- |
| `/` | `Organization` (from the layout), `WebSite` |
| `/solutions/[slug]`, `/digital-marketing`, `/digital-marketing/[slug]` | `Service`, `BreadcrumbList` |
| `/industries/[slug]`, `/portfolio/[slug]`, all hubs, `/contact`, `/about`, legal | `BreadcrumbList` |
| `/blog/[slug]` | `BlogPosting`, `BreadcrumbList` |

`FAQPage` is emitted only where an entry has FAQs. No FAQ content exists yet
(`src/content/faqs.ts` is empty), so no page currently emits it — that matches the contract
rather than contradicting it.

## Issues found and fixed in this pass

1. **Hub pages had no `og:image`.** Next.js does not inherit `app/opengraph-image.tsx` into
   nested routes, so `/solutions`, `/industries`, `/digital-marketing`, `/portfolio`,
   `/about`, `/contact`, `/blog` and the blog category pages shipped without a social image.
   `buildMetadata` now falls back to the site image, and the five dynamic templates pass
   their own generated image explicitly.
2. **Blog category pages had no `BreadcrumbList`.** Added.

## Open items (need the Preview deployment)

- Validate the JSON-LD for each template in the Schema.org validator and Google's Rich
  Results Test.
- Check the Open Graph and Twitter previews in the share debuggers.
- Confirm the canonicals point at the production domain once `NEXT_PUBLIC_SITE_URL` is set.
- Confirm Preview deployments serve `Disallow: /` and Production does not.
- T230: verify the Search Console property, submit the sitemap, request indexing for the key
  pages, and schedule the coverage check four weeks after launch.
