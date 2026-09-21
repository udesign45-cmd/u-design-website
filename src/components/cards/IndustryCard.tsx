import Image from "next/image";
import Link from "@/components/ui/AppLink";
import { stretchedLink } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import type { Industry } from "@/types/content";
import { industryImages } from "@/lib/content/images";
import { cx } from "@/lib/utils/cx";

type IndustryCardProps = {
  industry: Industry;
  href?: string;
  feature?: boolean;
  headingLevel?: 2 | 3;
};

/**
 * Industry tile. The `feature` variant (Manufacturing) is a full-bleed photo
 * with the copy overlaid, editorially distinct from the photo-topped grid of
 * the remaining industries — two compositions, not one card repeated eight
 * times.
 */
export function IndustryCard({
  industry,
  href,
  feature = false,
  headingLevel = 3,
}: IndustryCardProps) {
  const Heading = `h${headingLevel}` as const;
  const image = industryImages[industry.slug];
  const title = href ? (
    <Link href={href} className={stretchedLink}>
      {industry.name}
    </Link>
  ) : (
    industry.name
  );

  if (feature) {
    return (
      <div className="media-frame surface-ink relative flex h-full min-h-[26rem] flex-col justify-end overflow-hidden rounded-card border border-green-deep shadow-card lg:min-h-[30rem]">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        ) : null}
        <div aria-hidden="true" className="media-scrim" />
        <div className="relative p-7 lg:p-9">
          <div className="flex items-start justify-between gap-4">
            <span className="rounded-pill bg-brand-green px-3 py-1 text-small font-semibold text-ink">
              Priority focus
            </span>
          </div>
          <Heading className="mt-5 text-h2">{title}</Heading>
          <p className="mt-3 max-w-md text-lead text-fg-muted">{industry.summary}</p>
          {industry.hasPage ? (
            <ul className="mt-6 grid max-w-lg gap-2 sm:grid-cols-2">
              {industry.features.slice(0, 6).map((f) => (
                <li key={f.title} className="flex items-start gap-2 text-small text-white/90">
                  <Icon name="check" size={16} className="mt-0.5 shrink-0 text-brand-green" />
                  {f.title}
                </li>
              ))}
            </ul>
          ) : null}
          {href ? (
            <span
              aria-hidden="true"
              className="mt-7 hidden items-center gap-1 text-small font-semibold text-white sm:inline-flex"
            >
              Learn more <Icon name="arrow-right" size={16} className="text-brand-green" />
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cx(
        "media-frame group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card",
        href &&
          "transition-[transform,box-shadow] duration-250 ease-standard focus-within:shadow-raised hover:-translate-y-0.5 hover:shadow-raised",
      )}
    >
      <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Heading className="text-h4">{title}</Heading>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${industry.name} workflows`}>
          {industry.shortWorkflows.slice(0, 3).map((w) => (
            <li
              key={w}
              className="rounded-pill bg-surface-gray px-2.5 py-0.5 text-small text-ink-muted"
            >
              {w}
            </li>
          ))}
        </ul>
        {href ? (
          <span
            aria-hidden="true"
            className="mt-auto hidden items-center gap-1 pt-5 text-small font-semibold sm:inline-flex"
          >
            Learn more <Icon name="arrow-right" size={16} className="text-brand-green-dark" />
          </span>
        ) : null}
      </div>
    </div>
  );
}
