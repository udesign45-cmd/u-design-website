# Contract: Consultation Form Submission

**Implements**: FR-080 to FR-088 | **Research**: AD-07, AD-18 | **Data**: [data-model.md › ConsultationRequest](../data-model.md#consultationrequest-runtime-only-not-stored-by-the-site)

## Interface

A Next.js **Server Action** `submitConsultation(prevState, formData)` in
`src/app/actions/consultation.ts`. It is invoked by `<form action>` in `ConsultationForm`, with
or without JavaScript. The companion action `issueRenderToken(): Promise<string>` returns a
signed render timestamp. The form calls it at mount because the statically generated page
cannot sign a per-visit token at render time.

### Input (`FormData`)

| Name | Required | Notes |
|---|---|---|
| `name`, `company`, `email`, `phone` | Yes | See data-model validation |
| `industry` | Yes | Allowlisted value from `getFormOptions().industries` |
| `need` | Yes | Allowlisted value from `getFormOptions().needs` |
| `budget` | Only if the field is enabled | Allowlisted |
| `message` | No | ≤ 2000 characters |
| `sourcePage` | Yes (hidden) | Same-origin path |
| `submissionId` | Yes (hidden) | UUID |
| `renderedAt` | When JS is available (hidden) | `<epoch-ms>.<hmac>`, fetched at mount from the companion action `issueRenderToken()`, because `/contact` is static. If it is absent (no-JS post), only the minimum-fill check is skipped; the honeypot and rate limit still apply. |
| `website` | Honeypot | Must be empty |

### Output: `ConsultationState`

```ts
type ConsultationState =
  | { status: "idle" }
  | { status: "success"; message: string }                     // message includes responseTime when configured
  | { status: "invalid"; fieldErrors: Partial<Record<FieldName, string>>; values: SafeValues }
  | { status: "failed"; message: string; values: SafeValues; fallback: { email?: string; phone?: string } };
```

- `values` returns the visitor's sanitized input so the form can be re-populated when JS is off.
- Messages are human-readable. Stack traces or provider errors are never returned (spec edge case,
  brief §28).

### Behavior

| Condition | Result | Delivery? |
|---|---|---|
| Honeypot filled, or a present timestamp that is invalid or elapsed < 3s | `success` (generic) | No (logged as spam) |
| Rate limit exceeded | `failed` with "Too many requests, please try again in a few minutes" plus fallback contacts | No |
| `submissionId` seen within 10 min | `success` (idempotent) | No (already delivered) |
| Schema validation fails | `invalid` with per-field messages | No |
| Adapter delivery succeeds | `success` | Yes |
| All configured adapters fail | `failed` with retry message plus fallback contacts | No (error logged server-side with the submissionId and no personal data) |

### Field error messages (examples)

| Field | Message |
|---|---|
| name | "Please enter your name." |
| email | "Please enter a valid email address, e.g. name@company.com." |
| phone | "Please enter a valid phone number, including country code if outside your country." |
| industry | "Please select your industry, or choose Other." |
| need | "Please tell us what you need, or choose Not sure yet." |
| message | "Please keep your message under 2,000 characters." |

### Accessibility contract

- Every control has a visible `<label>`, and required fields are marked in both text and
  `aria-required`.
- Errors: an `aria-invalid` field plus `aria-describedby` pointing to the error text. A summary
  region with `role="alert"` appears at the top on submit, and focus moves to the first invalid
  field.
- Success and failure messages render in a `role="status"` or `role="alert"` region, and focus
  moves to the message heading.
- The submit button shows a pending label ("Sending…") and is `disabled` while pending.

### Pre-selection contract

`/contact?industry=<slug>&need=<slug>&source=<path>#consultation` pre-selects values that are in
the allowlist and ignores anything else.
