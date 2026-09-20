import { Icon, type IconName } from "@/components/ui/Icon";
import { cx } from "@/lib/utils/cx";

type Stage = { title: string; description: string; icon: IconName };

/**
 * Manual → Centralized → Real-time journey (spec FR-016). An ordered list with
 * decorative arrows: vertical on mobile, horizontal from lg.
 */
export function JourneyDiagram({ stages }: { stages: readonly Stage[] }) {
  return (
    <ol className="grid gap-4 lg:grid-cols-3 lg:gap-6">
      {stages.map((stage, index) => {
        const last = index === stages.length - 1;
        return (
          <li key={stage.title} className="relative">
            <div
              className={cx(
                "h-full rounded-card border p-6",
                last ? "border-brand-green bg-brand-green text-ink" : "border-white/15 bg-white/5",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cx(
                    "inline-flex size-11 items-center justify-center rounded-control",
                    last ? "bg-ink text-brand-green" : "bg-white/10 text-brand-green",
                  )}
                >
                  <Icon name={stage.icon} size={22} />
                </span>
                <span
                  className={cx("text-small font-semibold", last ? "text-ink" : "text-fg-muted")}
                >
                  <span className="sr-only">Stage </span>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className={cx("mt-5 text-h4", last && "text-ink")}>{stage.title}</h3>
              <p className={cx("mt-2", last ? "text-ink" : "text-fg-muted")}>{stage.description}</p>
            </div>
            {last ? null : (
              <span
                aria-hidden="true"
                className="absolute -bottom-4 left-1/2 z-10 inline-flex size-8 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-pill bg-brand-green text-ink lg:top-1/2 lg:-right-7 lg:bottom-auto lg:left-auto lg:translate-x-0 lg:-translate-y-1/2"
              >
                <Icon name="arrow-down" size={16} className="lg:-rotate-90" />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
