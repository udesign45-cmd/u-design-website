import type { Ref } from "react";
import { AlertIcon } from "@/components/ui/InlineIcons";

type FieldErrorLink = { id: string; label: string; message: string };

type FormErrorProps = {
  title: string;
  message?: string;
  headingRef?: Ref<HTMLHeadingElement>;
  fieldErrors?: FieldErrorLink[];
  fallback?: { email?: string; phone?: { display: string; e164: string } };
};

/**
 * Error state (FR-085): announces the problem, links to invalid fields and
 * offers only the contact channels U Design has provided.
 */
export function FormError({
  title,
  message,
  headingRef,
  fieldErrors = [],
  fallback,
}: FormErrorProps) {
  const hasFallback = Boolean(fallback?.email || fallback?.phone);
  return (
    <div role="alert" className="rounded-card border-2 border-danger bg-white p-5 text-ink">
      <div className="flex items-start gap-3">
        <AlertIcon size={22} className="mt-0.5 shrink-0 text-danger" />
        <div>
          <h3 ref={headingRef} tabIndex={-1} className="text-h4 outline-none">
            {title}
          </h3>
          {message ? <p className="mt-1 text-ink-muted">{message}</p> : null}
          {fieldErrors.length > 0 ? (
            <ul className="mt-3 grid gap-1">
              {fieldErrors.map((e) => (
                <li key={e.id}>
                  <a href={`#${e.id}`} className="text-small font-medium link-inline">
                    {e.label}: {e.message}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          {hasFallback ? (
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-small">
              <span className="text-ink-muted">You can also reach us directly:</span>
              {fallback?.email ? (
                <a
                  href={`mailto:${fallback.email}`}
                  className="font-medium link-inline"
                  data-track="contact_click"
                  data-track-channel="email"
                >
                  {fallback.email}
                </a>
              ) : null}
              {fallback?.phone ? (
                <a
                  href={`tel:${fallback.phone.e164}`}
                  className="font-medium link-inline"
                  data-track="contact_click"
                  data-track-channel="phone"
                >
                  {fallback.phone.display}
                </a>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
