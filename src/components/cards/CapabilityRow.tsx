import Link from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";

export type CapabilityRowData = { name: string; benefit: string; href?: string };

/**
 * One row of a numbered editorial capability list — a divided list with a
 * large index numeral, not a card grid. Used anywhere a set of solutions or
 * services needs listing without repeating the same icon-card shape N times
 * (spec FR-013 and the home/hub pages that share this content).
 */
export function CapabilityRow({
  index,
  name,
  benefit,
  href,
}: CapabilityRowData & { index: number }) {
  return (
    <li className="group grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-1 border-t border-line py-5 transition-colors first:border-t-0 first:pt-0 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:py-6">
      <span aria-hidden="true" className="editorial-index-sm tabular-nums">
        {String(index).padStart(2, "0")}
      </span>
      <div>
        <h4 className="text-h4">
          {href ? (
            <Link
              href={href}
              className="text-ink transition-colors hover:text-brand-green-dark focus-visible:text-brand-green-dark"
            >
              {name}
            </Link>
          ) : (
            name
          )}
        </h4>
        <p className="mt-1 text-ink-muted">{benefit}</p>
      </div>
      {href ? (
        <Icon
          name="arrow-right"
          size={18}
          className="col-start-2 mt-1 text-brand-green-dark transition-transform duration-200 group-hover:translate-x-1 sm:col-start-3 sm:mt-0"
        />
      ) : null}
    </li>
  );
}
