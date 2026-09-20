import type { ReactNode } from "react";
import { AlertIcon } from "./InlineIcons";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

export const hintId = (id: string) => `${id}-hint`;
export const errorId = (id: string) => `${id}-error`;

/** Label, required marker, hint and error for one control (contracts/consultation-action.md). */
export function Field({ id, label, required, hint, error, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block font-medium text-ink">
        {label}
        {required ? (
          <span className="ml-1 text-small font-normal text-ink-muted">(required)</span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={hintId(id)} className="mt-1.5 text-small text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId(id)}
          className="mt-1.5 flex items-start gap-1.5 text-small font-medium text-danger"
        >
          <AlertIcon size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

/** Shared control styling: 44px minimum, 3:1 border, visible focus. */
export const controlClasses =
  "block w-full min-h-11 rounded-control border border-control-border bg-white px-3.5 py-2.5 text-body text-ink " +
  "placeholder:text-ink-muted transition-[border-color,box-shadow] duration-150 " +
  "focus:border-ink focus:outline-2 focus:outline-offset-1 focus:outline-brand-green-dark " +
  "aria-invalid:border-danger aria-invalid:focus:outline-danger";

export function describedBy(
  id: string,
  { hint, error }: { hint?: string; error?: string },
): string | undefined {
  const ids = [error ? errorId(id) : hint ? hintId(id) : null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}
