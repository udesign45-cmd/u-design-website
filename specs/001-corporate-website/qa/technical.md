# Technical QA

Task T227. This records the pre-launch run on the local production build. The task itself
stays open until the production configuration (T228) and the content approval (T222) exist,
because some of its checks can only run against the deployed site.

Last run: 2026-09-20 — Next.js 16.3.5, React 19.3.0, TypeScript 6.0.3, Node 24.

## Commands

| Command | Result |
| --- | --- |
| `npm run check` (lint → typecheck → unit/integrity → build) | Exit 0 |
| `npm run test:e2e` (4 projects, 139 tests) | 132 passed, 7 skipped, 0 failed |
| `node scripts/lighthouse-local.mjs` (3 runs per route, both throttling methods) | Performance 81–95, Accessibility 96–100, Best Practices 100, SEO 100. Budgets: see `qa/performance.md` |
| `npm run lhci` | **Not run on Windows.** Lighthouse CI's Chrome launcher fails to delete its temp profile (EPERM). CI runs it on Linux; locally use the script above |
| `npm run check:launch` | **Fails with 7 blockers** — as designed, see below |

The 7 skipped e2e tests are project-scoped (desktop-only tests skipped on the mobile
projects and vice versa), not silent failures.

## Launch blockers reported by `npm run check:launch`

1. The Privacy Policy is still `draft` (Q-8).
2. No contact channel: `site.email` and `site.phone` are both empty (Q-7).
3. No official logo (Q-2).
4. `LEAD_DELIVERY_PROVIDER` is `console`, and `FORM_SIGNING_SECRET` is unset.
5. `NEXT_PUBLIC_SITE_URL` is not an https production domain (Q-9).
6. No solution, industry or legal page is published (every content entry is still `draft`).
7. `// DRAFT` markers remain in three content files (`home.ts`, `about.ts`,
   `digitalization.ts`).

Two checks already pass: nothing links to an unpublished page, and no published page uses a
placeholder asset.

Each clears as T220, T222 and T228 are completed. The gate is deliberately not part of CI —
it is expected to fail until launch day.

## Security checks

| Check | Result |
| --- | --- |
| `X-Content-Type-Options: nosniff` | Present |
| `Referrer-Policy: strict-origin-when-cross-origin` | Present |
| `X-Frame-Options: DENY` | Present |
| `Permissions-Policy: camera=(), microphone=(), geolocation=()` | Present |
| `Content-Security-Policy` | Present: `default-src 'self'`, no `unsafe-eval` in production, third-party origins added only when the matching feature is configured |
| `Strict-Transport-Security` | Added in this pass; emitted in production builds only (browsers ignore it over http) |
| `X-Powered-By` | Removed (`poweredByHeader: false`) |
| Secrets in the client bundle | `grep` over `.next/static` for `FORM_SIGNING_SECRET`, `LEAD_WEBHOOK_SECRET`, `EMAIL_API_KEY` and their values: **no matches** |
| Server-only modules | `server-only` guards the env and delivery modules, so importing them from a client component fails the build |

## Runtime checks

- 404: unknown paths in every route family return HTTP 404 with the branded page and a
  `noindex` robots tag (automated in `tests/e2e/pages.spec.ts`).
- Console: no errors or warnings on any route (automated).
- Internal links: no broken links, no orphan pages, every page one click from the
  consultation form (automated).
- Draft gating: a production build without `CONTENT_INCLUDE_DRAFTS` publishes no draft route
  and links to none (automated in the `blog-gate` project against a second build).

## Still to do after deployment (T227 completion)

- Re-run everything against the Preview and Production URLs.
- `curl -I` the production domain to confirm HTTPS and the headers arrive through Vercel.
- Confirm the Vercel WAF rate-limit rule on `POST /contact`.
- Run `npm run check:launch` with the production environment variables and get a pass.
