# Quickstart & Validation Guide: U Design Corporate Website

**Feature**: `001-corporate-website` | **Plan**: [plan.md](./plan.md)

This guide explains how to run the project and how to prove each user story works end to end. The
commands refer to scripts defined during Phase 1 of the plan.

## Prerequisites

- Node.js 24 LTS (verified locally: v24.19.0). Node 22 LTS is the minimum.
- npm 11 or later (verified locally: 11.17.0)
- Playwright browsers: `npx playwright install --with-deps chromium webkit`
- For end-to-end form delivery: an email API key and/or a webhook URL. Development works with
  the `console` adapter.

## Environment variables (`.env.example`)

| Variable | Scope | Required | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public | Yes | Canonical origin, e.g. `https://www.udesign.example` (replace with the real domain) |
| `LEAD_DELIVERY_PROVIDER` | server | Yes | `console` \| `email` \| `webhook` \| `email+webhook` |
| `LEAD_EMAIL_TO` / `LEAD_EMAIL_FROM` | server | If email | Recipient(s) and verified sender |
| `RESEND_API_KEY` | server secret | If email | Email API key |
| `LEAD_WEBHOOK_URL` / `LEAD_WEBHOOK_SECRET` | server secret | If webhook | Target and HMAC secret |
| `FORM_SIGNING_SECRET` | server secret | Yes | Signs the form render timestamp |
| `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | public / secret | Optional | Enables Turnstile |
| `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_META_PIXEL_ID` | public | Optional | Enables analytics |
| `GOOGLE_SITE_VERIFICATION` | server | Optional | Search Console verification meta tag |
| `NEXT_PUBLIC_ANALYTICS_CONSENT` | public | Optional | `required` delays analytics until consent (Q-5) |
| `CONTENT_INCLUDE_DRAFTS` | server | Preview/test only | `true` renders draft content (e2e, Preview). Never set in Production. |
| `FORM_MIN_FILL_MS` | server | Optional | Minimum form fill time (default 3000); e2e sets 0 |
| `FORM_RATE_LIMIT_MAX` | server | Optional | Submissions per IP per 10 min per instance (default 5); e2e raises it |

Secrets are never prefixed `NEXT_PUBLIC_`, and `.env*.local` is git-ignored.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local development at http://localhost:3000 |
| `npm run build` / `npm start` | Production build and serve |
| `npm run lint` | ESLint (flat config) with zero warnings allowed |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` / `format:check` | Prettier |
| `npm test` | Vitest (unit tests and the content integrity suite) |
| `npm run test:e2e` | Playwright end-to-end and axe accessibility tests against the production build |
| `npm run lhci` | Lighthouse CI against the production build |
| `npm run check` | lint, typecheck, test, build, e2e (the local version of the CI gate) |

## Validation scenarios

Run `npm run build && npm start` first. Each scenario maps to a spec user story and its acceptance
scenarios.

### V1: Home page and consultation (US1, US2 · P1 MVP)

1. Open `/` at 375px and 1440px widths. **Expect**: "BUILD. MARKET. GROW." eyebrow, the H1
   "Digital Solutions That Help Businesses Grow", the supporting text, and "Get Free
   Consultation" plus "View Our Solutions" all visible without scrolling. No horizontal scroll.
2. Scroll the page. **Expect** sections in this order: Hero, Services, Industries, Featured
   Projects, Spreadsheets journey, How We Work, Digital Marketing, Why U Design, Final CTA. The
   Trust, Metrics, and Testimonials sections are **absent** while their data is empty or
   unverified.
3. Click "Discuss Your Business Process". **Expect** to arrive at `/contact#consultation`.
4. Submit the form empty. **Expect** field-level errors, focus on "Name", and a summary alert.
5. Submit valid data with `LEAD_DELIVERY_PROVIDER=console`. **Expect** a success message and a
   redacted server log line.
6. Set the adapter to fail (webhook URL pointing to a 500 mock). **Expect** a failure message,
   the values preserved, and fallback contacts shown.
7. Disable JavaScript and submit valid data. **Expect** the server-rendered success state.
8. Double-click submit. **Expect** a single delivery.

Automated by `tests/e2e/home.spec.ts` and `tests/e2e/consultation-form.spec.ts`.

### V2: Industry discovery (US3)

Open `/industries`, then `/industries/manufacturing`. **Expect** the challenges, workflows
(including raw materials and warehouse), solutions, features, benefits, related Manufacturing ERP
project (labeled Concept/Demo), and a CTA linking to `/contact?industry=manufacturing…`. The form
pre-selects Manufacturing. Automated by `tests/e2e/industries.spec.ts`.

### V3: Solutions (US4)

Open `/solutions` and then `/solutions/erp`. **Expect** a business-first layout, links to the
related industries, and a CTA that pre-selects need = ERP. Automated by
`tests/e2e/solutions.spec.ts`.

### V4: Portfolio (US5)

Open `/portfolio`. **Expect** 3 projects, each with a Concept/Demo badge. Open
`/portfolio/manufacturing-erp`. **Expect** Problem → Solution → Features → Business Application,
captioned screenshots, and no client name or results. `/portfolio/does-not-exist` returns the
branded 404. Automated by `tests/e2e/portfolio.spec.ts`.

### V5: Digital marketing (US6)

Open `/digital-marketing` and `/digital-marketing/meta-ads`. **Expect** outcome-based copy and no
"guaranteed" wording (also enforced by the integrity test).

### V6: About and Contact (US7)

Open `/contact`. **Expect** the form plus only the contact details that are configured. With an
email configured, the `mailto:` link works. With no socials configured, no social icons appear.

### V7: Blog (US8)

With no published posts: `/blog` returns 404, there is no Blog link in the navigation or footer,
and `/blog` is absent from `sitemap.xml`. After adding one published MDX post: the index, the
article page, and the category page all render, and the related links resolve.

### V8: Quality gates (constitution)

| Check | Command | Pass condition |
|---|---|---|
| Lint, types, and build | `npm run check` | Zero errors or warnings |
| Accessibility | `npm run test:e2e` (axe project) | Zero critical or serious violations on every route |
| Keyboard | `tests/e2e/keyboard.spec.ts` | The whole consultation journey works by keyboard, with a visible focus ring |
| Responsive | `tests/e2e/responsive.spec.ts` | `scrollWidth ≤ clientWidth` at 320/375/768/1280/1440/1920 on every route |
| SEO | `tests/e2e/seo.spec.ts` | Unique title and description, canonical, one H1, valid JSON-LD, every route in the sitemap |
| Performance | `npm run lhci` | Mobile scores ≥ 0.9 in all categories; LCP ≤ 2.5s; CLS ≤ 0.1 |
| JS budget | Build output check | ≤ 130 KB gzip first-load JS on content routes; ≤ 160 KB on `/contact` |
| Content integrity | `npm test` | All data-model integrity rules pass |
| Reduced motion | `tests/e2e/motion.spec.ts` (`reducedMotion: "reduce"`) | No running animations |
| Preview noindex | Deploy a preview | `robots.txt` disallows everything and the `noindex` meta tag is present |
