# Contract: Analytics Events

**Implements**: FR-112, spec SC-012 | **Research**: AD-09

Analytics is **off by default**. When `NEXT_PUBLIC_GA_ID` and/or `NEXT_PUBLIC_META_PIXEL_ID` is
set, and consent is granted where required, events are forwarded to each configured provider.
Otherwise `track()` is a no-op.

## Event catalogue (`src/lib/analytics/events.ts`)

| Event | Trigger | Properties | GA4 mapping | Meta mapping |
|---|---|---|---|---|
| `consultation_submit` | Server Action returns `success` (client-side, after state change) | `industry`, `need`, `source_page` | `generate_lead` | `Lead` |
| `cta_click` | Click on an element with `data-track="cta_click"` | `label` (CtaLabel), `location` (section id), `page` | `cta_click` | — |
| `contact_click` | Click on a `mailto:`, `tel:`, or social link | `channel` (`email` \| `phone` \| social platform), `page` | `contact_click` | `Contact` |
| `portfolio_view` | Project detail page view | `project`, `type` (concept/client), `industry` | `view_item` | `ViewContent` |
| `portfolio_filter` | PortfolioFilter change | `industry?`, `solution?` | `portfolio_filter` | — |

Rules:

- No personal data (name, email, phone, message) is ever included in an event.
- Declarative markup: server components render `data-track` and `data-track-*` attributes. A
  single delegated listener handles clicks, so no component needs to become a client component
  for tracking.
- Scripts load with `afterInteractive` or `lazyOnload` and never block rendering.
