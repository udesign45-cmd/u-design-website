import Link from "@/components/ui/AppLink";
import { Card, stretchedLink } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import type { Industry } from "@/types/content";
import { cx } from "@/lib/utils/cx";

type IndustryCardProps = {
  industry: Industry;
  href?: string;
  feature?: boolean;
  headingLevel?: 2 | 3;
};

/**
 * Industry tile. The `feature` variant (Manufacturing) spans two columns from
 * md; standard tiles keep icon and title on one row for a compact mobile layout.
 */
export function IndustryCard({
  industry,
  href,
  feature = false,
  headingLevel = 3,
}: IndustryCardProps) {
  const Heading = `h${headingLevel}` as const;
  const title = href ? (
    <Link href={href} className={stretchedLink}>
      {industry.name}
    </Link>
  ) : (
    industry.name
  );

  return (
    <Card
      variant={href ? "link" : "default"}
      className={cx("h-full", feature && "md:col-span-2 md:row-span-2")}
    >
      {feature ? (
        <>
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex size-14 items-center justify-center rounded-control bg-brand-green text-ink">
              <Icon name={industry.icon} size={28} />
            </span>
            <span className="rounded-pill bg-green-deep px-3 py-1 text-small font-medium text-white">
              Priority focus
            </span>
          </div>
          <Heading className="mt-5 text-h3">{title}</Heading>
          <p className="mt-3 text-lead text-ink-muted">{industry.summary}</p>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-control bg-surface-gray text-ink">
            <Icon name={industry.icon} size={20} />
          </span>
          <Heading className="text-h4">{title}</Heading>
        </div>
      )}
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${industry.name} workflows`}>
        {industry.shortWorkflows.map((w) => (
          <li
            key={w}
            className="rounded-pill bg-surface-gray px-2.5 py-0.5 text-small text-ink-muted"
          >
            {w}
          </li>
        ))}
      </ul>
      {feature && industry.hasPage ? (
        <div className="mt-auto pt-8">
          <p className="text-small font-semibold text-ink">What we typically connect</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {industry.features.slice(0, 6).map((f) => (
              <li key={f.title} className="flex items-start gap-2 text-small text-ink">
                <Icon name="check" size={16} className="mt-0.5 shrink-0 text-brand-green-dark" />
                {f.title}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {href ? (
        <span
          aria-hidden="true"
          className={cx(
            "hidden items-center gap-1 text-small font-semibold sm:inline-flex",
            feature ? "pt-6" : "mt-auto pt-5",
          )}
        >
          Learn more <Icon name="arrow-right" size={16} className="text-brand-green-dark" />
        </span>
      ) : null}
    </Card>
  );
}
