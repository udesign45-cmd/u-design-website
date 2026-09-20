"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { issueRenderToken, submitConsultation } from "@/app/actions/consultation";
import { track } from "@/lib/analytics/track";
import { Button } from "@/components/ui/Button";
import { describedBy, Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  FIELD_ORDER,
  LABELS,
  LIMITS,
  PHONE_PATTERN,
  REQUIRED,
  validateValues,
  type ConsultationState,
  type FieldErrors,
  type FieldName,
  type FormValues,
} from "@/lib/forms/fields";
import type { FormOptions } from "@/types/content";
import { FormError } from "./FormError";
import { FormSuccess } from "./FormSuccess";

type ConsultationFormProps = {
  options: FormOptions;
  fallback: { email?: string; phone?: { display: string; e164: string } };
  /** Omitted while the Privacy Policy is unpublished, so the note never links to a 404. */
  privacyHref?: string;
};

const INITIAL: ConsultationState = { status: "idle" };
const fieldId = (name: FieldName) => `consultation-${name}`;

const noopSubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Consultation form (contracts/consultation-action.md). Progressive
 * enhancement: without JavaScript it posts natively to the Server Action; with
 * JavaScript it validates instantly and submits in a transition (no form reset,
 * so the visitor's input is never lost).
 */
export function ConsultationForm({ options, fallback, privacyHref }: ConsultationFormProps) {
  const [state, formAction, isPending] = useActionState(submitConsultation, INITIAL);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [messageLength, setMessageLength] = useState(0);
  const [showFormAgain, setShowFormAgain] = useState(false);
  const hydrated = useHydrated();

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLHeadingElement>(null);

  const allowed = {
    industries: options.industries.map((o) => o.value),
    needs: options.needs.map((o) => o.value),
    budgets: options.budgets.map((o) => o.value),
  };
  const showBudget = options.budgets.length > 0;
  const values: FormValues =
    state.status === "invalid" || state.status === "failed" ? state.values : {};
  const errors: FieldErrors =
    Object.keys(clientErrors).length > 0
      ? clientErrors
      : state.status === "invalid"
        ? state.fieldErrors
        : {};

  // Hidden fields and pre-selection are written imperatively so server and client HTML match.
  function primeHiddenFields(form: HTMLFormElement) {
    const set = (name: string, value: string) => {
      const el = form.elements.namedItem(name);
      if (el instanceof HTMLInputElement) el.value = value;
    };
    set("submissionId", crypto.randomUUID());
    issueRenderToken()
      .then((token) => set("renderedAt", token))
      .catch(() => undefined);
  }

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    primeHiddenFields(form);

    const params = new URLSearchParams(window.location.search);
    const preselect = (name: "industry" | "need", list: string[]) => {
      const value = params.get(name);
      const el = form.elements.namedItem(name);
      if (value && list.includes(value) && el instanceof HTMLSelectElement && !el.value)
        el.value = value;
    };
    preselect("industry", allowed.industries);
    preselect("need", allowed.needs);

    const source = params.get("source");
    let sourcePage = "/contact";
    if (source && source.startsWith("/") && !source.startsWith("//"))
      sourcePage = source.slice(0, 200);
    else if (document.referrer) {
      try {
        const ref = new URL(document.referrer);
        if (ref.origin === window.location.origin) sourcePage = ref.pathname.slice(0, 200);
      } catch {
        /* ignore malformed referrer */
      }
    }
    const sourceInput = form.elements.namedItem("sourcePage");
    if (sourceInput instanceof HTMLInputElement) sourceInput.value = sourcePage;
    // Run once on mount; option lists are static for the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Move focus to the outcome so it is announced (accessibility contract).
  const lastSubmission = useRef<{ industry: string; need: string; source: string } | null>(null);

  useEffect(() => {
    if (state.status === "success") {
      successRef.current?.focus();
      // Conversion event (contracts/analytics-events.md); no personal data.
      if (lastSubmission.current) {
        track("consultation_submit", {
          industry: lastSubmission.current.industry,
          need: lastSubmission.current.need,
          source_page: lastSubmission.current.source,
        });
        lastSubmission.current = null;
      }
    }
    if (state.status === "failed") errorRef.current?.focus();
    if (state.status === "invalid") {
      const first = FIELD_ORDER.find((name) => state.fieldErrors[name]);
      if (first) document.getElementById(fieldId(first))?.focus();
    }
  }, [state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const current = Object.fromEntries(
      FIELD_ORDER.map((k) => [k, String(data.get(k) ?? "")]),
    ) as FormValues;
    const found = validateValues(current, allowed);
    setClientErrors(found);
    const first = FIELD_ORDER.find((name) => found[name]);
    if (first) {
      document.getElementById(fieldId(first))?.focus();
      return;
    }
    setShowFormAgain(false);
    lastSubmission.current = {
      industry: String(data.get("industry") ?? ""),
      need: String(data.get("need") ?? ""),
      source: String(data.get("sourcePage") ?? ""),
    };
    startTransition(() => formAction(data));
  }

  function sendAnother() {
    setShowFormAgain(true);
    setClientErrors({});
    setMessageLength(0);
    // Wait for the form to re-render before resetting and re-priming it.
    requestAnimationFrame(() => {
      const form = formRef.current;
      if (!form) return;
      form.reset();
      primeHiddenFields(form);
      document.getElementById(fieldId("name"))?.focus();
    });
  }

  if (state.status === "success" && !showFormAgain) {
    return (
      <FormSuccess
        headingRef={successRef}
        message={state.message}
        action={
          <Button variant="secondary" onClick={sendAnother}>
            Send another request
          </Button>
        }
      />
    );
  }

  const errorList = FIELD_ORDER.filter((n) => errors[n]).map((n) => ({
    id: fieldId(n),
    label: LABELS[n],
    message: errors[n] as string,
  }));

  const counterNotice =
    messageLength >= LIMITS.message.max
      ? "Character limit reached."
      : messageLength >= 1800
        ? "Approaching the character limit."
        : "";

  const common = (name: FieldName) => {
    const error = errors[name];
    return {
      id: fieldId(name),
      name,
      required: REQUIRED[name],
      "aria-required": REQUIRED[name] || undefined,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": describedBy(fieldId(name), { error }),
      defaultValue: values[name] ?? "",
    } as const;
  };

  return (
    <div className="grid gap-6">
      {state.status === "failed" ? (
        <FormError
          headingRef={errorRef}
          title="Your request was not sent"
          message={state.message}
          fallback={{ ...fallback, ...state.fallback }}
        />
      ) : null}
      {errorList.length > 0 ? (
        <FormError title="Please check the highlighted fields" fieldErrors={errorList} />
      ) : null}

      <form
        ref={formRef}
        id="consultation-form"
        action={formAction}
        onSubmit={handleSubmit}
        noValidate={hydrated}
        className="grid gap-5 md:grid-cols-2"
        aria-describedby="consultation-privacy"
      >
        <Field id={fieldId("name")} label={LABELS.name} required error={errors.name}>
          <Input
            {...common("name")}
            type="text"
            autoComplete="name"
            minLength={LIMITS.name.min}
            maxLength={LIMITS.name.max}
          />
        </Field>

        <Field id={fieldId("company")} label={LABELS.company} required error={errors.company}>
          <Input
            {...common("company")}
            type="text"
            autoComplete="organization"
            minLength={LIMITS.company.min}
            maxLength={LIMITS.company.max}
          />
        </Field>

        <Field id={fieldId("email")} label={LABELS.email} required error={errors.email}>
          <Input
            {...common("email")}
            type="email"
            autoComplete="email"
            maxLength={LIMITS.email.max}
            inputMode="email"
          />
        </Field>

        <Field
          id={fieldId("phone")}
          label={LABELS.phone}
          required
          error={errors.phone}
          hint="Please include your country code."
        >
          <Input
            {...common("phone")}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            pattern={PHONE_PATTERN}
            maxLength={LIMITS.phone.maxLength}
            aria-describedby={describedBy(fieldId("phone"), {
              error: errors.phone,
              hint: "Please include your country code.",
            })}
          />
        </Field>

        <Field id={fieldId("industry")} label={LABELS.industry} required error={errors.industry}>
          <Select {...common("industry")}>
            <option value="" disabled>
              Select your industry
            </option>
            {options.industries.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field id={fieldId("need")} label={LABELS.need} required error={errors.need}>
          <Select {...common("need")}>
            <option value="" disabled>
              Select a service
            </option>
            <optgroup label="Business Software & Digital Solutions">
              {options.needs
                .filter((o) => o.group === "software")
                .map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Digital Marketing & Growth">
              {options.needs
                .filter((o) => o.group === "marketing")
                .map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
            </optgroup>
            {options.needs
              .filter((o) => o.group === "other")
              .map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
          </Select>
        </Field>

        {showBudget ? (
          <Field
            id={fieldId("budget")}
            label={LABELS.budget}
            error={errors.budget}
            className="md:col-span-2"
          >
            <Select {...common("budget")}>
              <option value="">Prefer not to say</option>
              {options.budgets.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}

        <Field
          id={fieldId("message")}
          label={LABELS.message}
          error={errors.message}
          className="md:col-span-2"
        >
          <Textarea
            {...common("message")}
            rows={5}
            maxLength={LIMITS.message.max}
            placeholder="Tell us briefly about your business and what you would like to improve."
            onChange={(e) => setMessageLength(e.currentTarget.value.length)}
          />
          <p className="mt-1.5 text-small text-ink-muted" aria-hidden="true">
            {hydrated
              ? `${messageLength} / ${LIMITS.message.max} characters`
              : `Up to ${LIMITS.message.max} characters`}
          </p>
          <p className="sr-only" aria-live="polite">
            {counterNotice}
          </p>
        </Field>

        {/* Hidden fields: set on mount (see primeHiddenFields). They carry no React value
            props on purpose: React re-applies defaultValue to hidden inputs on every
            re-render, which would wipe the values written imperatively. The server
            defaults an empty sourcePage to /contact. */}
        <input type="hidden" name="submissionId" />
        <input type="hidden" name="renderedAt" />
        <input type="hidden" name="sourcePage" />
        {/* Honeypot (spam layer 1): invisible to people and assistive technology */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="consultation-website">Website</label>
          <input
            id="consultation-website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
          <p id="consultation-privacy" className="max-w-md text-small text-ink-muted">
            We use your details only to respond to your enquiry.
            {privacyHref ? (
              <>
                {" "}
                See our{" "}
                <a href={privacyHref} className="link-inline">
                  Privacy Policy
                </a>
                .
              </>
            ) : null}
          </p>
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            aria-disabled={isPending}
            className="md:min-w-56"
          >
            {isPending ? "Sending…" : "Get Free Consultation"}
          </Button>
        </div>
      </form>
    </div>
  );
}
