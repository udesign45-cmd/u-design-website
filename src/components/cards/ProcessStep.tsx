import { cx } from "@/lib/utils/cx";

type Step = { number: string; title: string; description: string };

export function ProcessStep({ step, compact = false }: { step: Step; compact?: boolean }) {
  return (
    <li className="relative flex gap-5 xl:flex-col xl:gap-4">
      <span
        aria-hidden="true"
        className={cx(
          "relative z-10 inline-flex shrink-0 items-center justify-center rounded-pill border-2 border-brand-green bg-white font-heading font-bold text-ink",
          compact ? "size-11 text-small" : "size-14 text-h4",
        )}
      >
        {step.number}
      </span>
      <div className="pb-8 md:pb-0">
        <h3 className="text-h4">
          <span className="sr-only">Step {step.number}: </span>
          {step.title}
        </h3>
        <p className="mt-1.5 text-fg-muted">{step.description}</p>
      </div>
    </li>
  );
}

/**
 * Six-step process: vertical rail on mobile, 2 × 3 grid on tablet, one row on
 * wide screens (plan: Responsive Strategy › Process timeline).
 */
export function ProcessSteps({
  steps,
  compact = false,
}: {
  steps: readonly Step[];
  compact?: boolean;
}) {
  return (
    <ol
      className={cx(
        "relative grid md:grid-cols-2 md:gap-x-10 md:gap-y-10 xl:grid-cols-6 xl:gap-6",
        "before:absolute before:top-2 before:bottom-10 before:w-0.5 before:bg-line md:before:hidden",
        !compact &&
          "xl:after:absolute xl:after:top-7 xl:after:right-12 xl:after:left-7 xl:after:h-0.5 xl:after:bg-line",
        compact ? "before:left-5" : "before:left-6.5",
      )}
    >
      {steps.map((step) => (
        <ProcessStep key={step.number} step={step} compact={compact} />
      ))}
    </ol>
  );
}
