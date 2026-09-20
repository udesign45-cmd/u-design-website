/**
 * Consultation form field configuration (contracts/consultation-action.md,
 * data-model.md › ConsultationRequest). Shared by the client form (rendering,
 * native constraints, instant validation) and the server schema (limits and
 * messages), so both sides always agree.
 */

export type FieldName =
  "name" | "company" | "email" | "phone" | "industry" | "need" | "budget" | "message";

export const LIMITS = {
  name: { min: 2, max: 100 },
  company: { min: 2, max: 150 },
  email: { max: 254 },
  phone: { minLength: 7, maxLength: 20, minDigits: 7, maxDigits: 15 },
  message: { max: 2000 },
  sourcePage: { max: 200 },
} as const;

/** Characters allowed in a phone number: +, digits, spaces, -, (, ). */
export const PHONE_PATTERN = "[+0-9 ()\\-]{7,20}";
const PHONE_REGEX = /^[+0-9 ()-]{7,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LABELS: Record<FieldName, string> = {
  name: "Name",
  company: "Company",
  email: "Email",
  phone: "Phone",
  industry: "Industry",
  need: "What do you need?",
  budget: "Budget range",
  message: "Message",
};

export const MESSAGES = {
  name: "Please enter your name.",
  company: "Please enter your company name.",
  email: "Please enter a valid email address, e.g. name@company.com.",
  phone: "Please enter a valid phone number, including country code if outside your country.",
  industry: "Please select your industry, or choose Other.",
  need: "Please tell us what you need, or choose Not sure yet.",
  budget: "Please choose a budget range from the list.",
  message: "Please keep your message under 2,000 characters.",
} as const satisfies Record<FieldName, string>;

export const REQUIRED: Record<FieldName, boolean> = {
  name: true,
  company: true,
  email: true,
  phone: true,
  industry: true,
  need: true,
  budget: false,
  message: false,
};

export const FIELD_ORDER: FieldName[] = [
  "name",
  "company",
  "email",
  "phone",
  "industry",
  "need",
  "budget",
  "message",
];

export type FormValues = Partial<Record<FieldName, string>>;
export type FieldErrors = Partial<Record<FieldName, string>>;

export function countDigits(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

export function isValidPhone(value: string): boolean {
  const digits = countDigits(value);
  return (
    PHONE_REGEX.test(value) && digits >= LIMITS.phone.minDigits && digits <= LIMITS.phone.maxDigits
  );
}

export function isValidEmail(value: string): boolean {
  return value.length <= LIMITS.email.max && EMAIL_REGEX.test(value);
}

type Allowed = { industries: string[]; needs: string[]; budgets: string[] };

/**
 * Instant client-side validation with the same rules and messages as the server.
 * The server schema remains authoritative.
 */
export function validateValues(values: FormValues, allowed: Allowed): FieldErrors {
  const errors: FieldErrors = {};
  const v = (k: FieldName) => (values[k] ?? "").trim();

  if (v("name").length < LIMITS.name.min || v("name").length > LIMITS.name.max)
    errors.name = MESSAGES.name;
  if (v("company").length < LIMITS.company.min || v("company").length > LIMITS.company.max)
    errors.company = MESSAGES.company;
  if (!isValidEmail(v("email"))) errors.email = MESSAGES.email;
  if (!isValidPhone(v("phone"))) errors.phone = MESSAGES.phone;
  if (!allowed.industries.includes(v("industry"))) errors.industry = MESSAGES.industry;
  if (!allowed.needs.includes(v("need"))) errors.need = MESSAGES.need;
  if (v("budget") && !allowed.budgets.includes(v("budget"))) errors.budget = MESSAGES.budget;
  if (v("message").length > LIMITS.message.max) errors.message = MESSAGES.message;
  return errors;
}

/** Form state returned by the Server Action (contracts/consultation-action.md › Output). */
export type ConsultationState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "invalid"; fieldErrors: FieldErrors; values: FormValues }
  | {
      status: "failed";
      message: string;
      values: FormValues;
      fallback: { email?: string; phone?: { display: string; e164: string } };
    };
