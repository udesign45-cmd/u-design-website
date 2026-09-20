# Contract: Lead Delivery Adapters

**Implements**: FR-086 (no silent loss), constitution IX | **Research**: AD-07, R-1

## Adapter interface

```ts
interface LeadDeliveryAdapter {
  name: "email" | "webhook" | "console";
  deliver(lead: Lead): Promise<{ ok: true } | { ok: false; reason: string }>;
}

type Lead = {
  id: string;            // submissionId
  submittedAt: string;   // ISO 8601
  sourcePage: string;
  name: string; company: string; email: string; phone: string;
  industry: { value: string; label: string };
  need: { value: string; label: string };
  budget?: { value: string; label: string };
  message?: string;
};
```

`src/lib/forms/delivery/index.ts` builds the active adapter list from `LEAD_DELIVERY_PROVIDER`:

| Value | Adapters | Success rule |
|---|---|---|
| `email` | email | email ok |
| `webhook` | webhook | webhook ok |
| `email+webhook` (**recommended**) | both, in parallel | at least one ok. If one fails, the error is logged for follow-up. |
| `console` | console | Always ok. **Rejected at startup when `VERCEL_ENV=production`.** |

If the configuration is missing or invalid, a production build fails with a clear message, so
the site cannot launch with a broken form.

## Email adapter

- HTTP email API called with `fetch`. The Resend-compatible endpoint is the default (`POST
  https://api.resend.com/emails`, `Authorization: Bearer ${RESEND_API_KEY}`).
- Env: `LEAD_EMAIL_TO` (comma-separated), `LEAD_EMAIL_FROM` (a verified sender domain),
  `RESEND_API_KEY`.
- Subject: `New consultation request — {company} ({industry.label})`
- `Reply-To`: the visitor's email.
- Body: plain text plus simple HTML, listing every field and the source page. All values are
  HTML-escaped.
- Timeout 8s, one retry on a 5xx or network error.

## Webhook adapter

- `POST ${LEAD_WEBHOOK_URL}` with `Content-Type: application/json` and body
  `{ "event": "consultation.created", "lead": Lead }`.
- Signature header `X-UDesign-Signature: sha256=<hex HMAC of raw body with LEAD_WEBHOOK_SECRET>`.
- Compatible with Zapier, Make, a Google Apps Script web app (writing to Sheets), or a CRM
  inbound endpoint.
- Timeout 8s, one retry on a 5xx or network error. A 2xx response counts as success.

## Console adapter

Logs a redacted summary (id, industry, need) for local development only.

## Privacy

- The site stores no leads. Personal data exists only in transit and at the configured
  destinations.
- Server logs never include the name, email, phone, or message. Only `id`, the adapter result,
  and the reason are logged.
