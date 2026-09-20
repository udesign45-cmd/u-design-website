# Content review log

Task T221 (internal review) and T222 (approval record).

**T221** — reviewed by: Claude (implementation), 2026-09-20.
**T222** — approved by: the site owner, 2026-09-21, via the instruction to launch the site
on `udesign45@gmail.com`. All entries listed **Approved** below were switched from
`status: "draft"` to `status: "published"` at that point. The three portfolio case studies
were deliberately **not** published (see below), matching the owner's explicit choice.

**This was not a page-by-page legal or marketing sign-off** — it was a single launch
decision covering the copy this file already marked "Ready". The Privacy Policy and Terms
of Service are flagged below as still needing a real legal review; they are live, but that
review has not happened.

## What was checked on every page

1. Spelling and grammar.
2. Business-first ordering: Problem → Solution → Benefit → Proof → CTA.
3. B2B tone: plain, specific, no hype and no buzzwords (`innovative`, `cutting-edge`,
   `revolutionary`, `world-class`, `synergy`, `best-in-class` are blocked by the integrity
   suite).
4. No invented facts: no statistics, client names, logos, testimonials, awards,
   certifications, partnerships, revenue figures or results.
5. No guarantees or promises of outcomes.
6. Keywords read naturally; no stuffing.
7. No lorem, TODO, TBD or placeholder text (blocked by the integrity suite).
8. CTA labels come from the approved list.

`npm test` runs these as rules 0–12 in `tests/unit/integrity/` — 120 assertions, all passing.

## Findings and fixes in this pass

| # | Finding | Fix |
| --- | --- | --- |
| 1 | Mixed spelling conventions: `organise`/`prioritise` next to `digitalization`/`centralized` | Standardised on Oxford spelling (British vocabulary such as "enquiry" with `-ize` endings) across four industry files |
| 2 | A decorative icon used brand green on a light surface on `/contact` | Changed to `text-brand-green-dark` (see `qa/accessibility.md`) |
| 3 | No statistics, client names or outcome claims found anywhere in `src/content` | None needed |

## Page log

Status key: **Approved** = published 2026-09-21 under the launch decision above.
**Withheld** = intentionally not published. **Live, needs legal review** = published, but
without the specialist review its content deserves.

| Page | Type | Status | Notes |
| --- | --- | --- | --- |
| `/` | Home | Approved | Proof sections (logos, metrics, testimonials) stay hidden until real content exists |
| `/solutions` | Hub | Approved | Five solutions, business-first summaries |
| `/solutions/custom-software` | Detail | Approved | |
| `/solutions/erp` | Detail | Approved | |
| `/solutions/crm` | Detail | Approved | |
| `/solutions/business-dashboards` | Detail | Approved | |
| `/solutions/automation` | Detail | Approved | |
| `/industries` | Hub | Approved | Manufacturing first, as briefed |
| `/industries/manufacturing` | Detail | Approved | Covers the eight briefed workflows |
| `/industries/distribution` | Detail | Approved | |
| `/industries/real-estate` | Detail | Approved | |
| `/industries/construction` | Detail | Approved | |
| `/industries/logistics` | Detail | Approved | |
| `/industries/travel` | Detail | Approved | |
| `/industries/healthcare` | Detail | Approved | |
| `/industries/retail` | Detail | Approved | |
| `/digital-marketing` | Hub | Approved | All seven services; no performance promises |
| `/digital-marketing/social-media` | Detail | Approved | |
| `/digital-marketing/meta-ads` | Detail | Approved | |
| `/digital-marketing/content` | Detail | Approved | |
| `/digital-marketing/lead-generation` | Detail | Approved | |
| `/portfolio` | Hub | Approved | Three concept projects, each badged "Concept / Demo"; hub has no dead links to the withheld case studies |
| `/portfolio/manufacturing-erp` | Case study | **Withheld** | Owner chose to hide case studies rather than publish placeholder screenshots (2026-09-21). Content stays `published` in the data but the page is unreachable while `usesPlaceholder()` is true (Q-4) |
| `/portfolio/travel-agency-management` | Case study | **Withheld** | Same |
| `/portfolio/real-estate-crm` | Case study | **Withheld** | Same |
| `/about` | About | Approved, partial | Founding story, team and history are intentionally absent — never invented (Q-5) |
| `/contact` | Contact | Approved, form-only | Owner chose not to display contact details publicly (2026-09-21); the form is the only channel, delivered by email (Q-7) |
| `/blog` | Hub | Approved | Publishes because one article is published |
| `/blog/signs-your-business-has-outgrown-spreadsheets` | Article | Approved | |
| `/blog/category/digital-transformation` | Category | Approved | |
| `/privacy-policy` | Legal | **Live, needs legal review** | Drafted from the actual data flow; no lawyer has confirmed the controller details, retention or jurisdiction (Q-8) |
| `/terms-of-service` | Legal | **Live, needs legal review** | Same |

## Still required from U Design

- **Legal review of the Privacy Policy and Terms of Service.** They are live without it —
  this is a real compliance gap, not a formality, and should be closed as soon as possible
  after launch.
- The real contact details, official logo (a wordmark stands in for now), and project
  screenshots, to lift the portfolio withholding (T220).
- Optional, and omitted while absent: testimonials, client logos with written permission,
  statistics with sources, budget ranges, and the About founding story.
