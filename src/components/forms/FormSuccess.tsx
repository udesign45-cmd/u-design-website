import type { ReactNode, Ref } from "react";
import { CheckIcon } from "@/components/ui/InlineIcons";

type FormSuccessProps = {
  title?: string;
  message: string;
  headingRef?: Ref<HTMLHeadingElement>;
  action?: ReactNode;
};

/** Success state (FR-084). The heading is focusable so focus can move to it. */
export function FormSuccess({
  title = "Request received",
  message,
  headingRef,
  action,
}: FormSuccessProps) {
  return (
    <div
      role="status"
      className="rounded-card border border-brand-green-dark bg-white p-8 text-ink"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-pill bg-brand-green text-ink">
        <CheckIcon size={24} />
      </span>
      <h3 ref={headingRef} tabIndex={-1} className="mt-5 text-h3 outline-none">
        {title}
      </h3>
      <p className="mt-2 text-lead text-ink-muted">{message}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
