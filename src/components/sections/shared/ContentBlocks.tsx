import type { ReactNode } from "react";
import { Section, type Surface } from "@/components/layout/Section";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { TitledText } from "@/types/content";
import { cx } from "@/lib/utils/cx";

type BlockProps = {
  id: string;
  heading: string;
  intro?: string;
  eyebrow?: string;
  surface?: Surface;
};

/** Numbered business problems (FR-031, FR-041). */
export function ChallengeList({
  id,
  heading,
  intro,
  eyebrow,
  items,
  surface = "white",
}: BlockProps & { items: TitledText[] }) {
  return (
    <Section surface={surface} id={id} labelledBy={`${id}-heading`}>
      <SectionHeading
        id={`${id}-heading`}
        level={2}
        title={heading}
        intro={intro}
        eyebrow={eyebrow}
      />
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.title}
            className="flex gap-4 rounded-card border border-line bg-white p-6 text-ink"
          >
            <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-control bg-surface-gray">
              <Icon name="circle-alert" size={18} className="text-ink" />
            </span>
            <div>
              <h3 className="text-h4">{item.title}</h3>
              <p className="mt-1.5 text-ink-muted">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Feature grid (1 → 2 → 3 columns). */
export function FeatureGrid({
  id,
  heading,
  intro,
  eyebrow,
  items,
  surface = "gray",
  icon = "check",
}: BlockProps & { items: TitledText[]; icon?: IconName }) {
  return (
    <Section surface={surface} id={id} labelledBy={`${id}-heading`}>
      <SectionHeading
        id={`${id}-heading`}
        level={2}
        title={heading}
        intro={intro}
        eyebrow={eyebrow}
      />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.title}
            className="rounded-card border border-line bg-white p-6 text-ink shadow-card"
          >
            <span className="inline-flex size-9 items-center justify-center rounded-control bg-brand-green text-ink">
              <Icon name={icon} size={18} />
            </span>
            <h3 className="mt-4 text-h4">{item.title}</h3>
            <p className="mt-1.5 text-ink-muted">{item.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Business benefits with emphasis markers. */
export function BenefitList({
  id,
  heading,
  intro,
  eyebrow,
  items,
  surface = "white",
}: BlockProps & { items: TitledText[] }) {
  return (
    <Section surface={surface} id={id} labelledBy={`${id}-heading`}>
      <div className="grid gap-10 lg:grid-cols-3">
        <SectionHeading
          id={`${id}-heading`}
          level={2}
          title={heading}
          intro={intro}
          eyebrow={eyebrow}
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
          {items.map((item) => (
            <li key={item.title} className="border-l-2 border-brand-green-dark pl-5">
              <h3 className="text-h4">{item.title}</h3>
              <p className="mt-1.5 text-fg-muted">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/** Industry workflows (FR-041, FR-043). */
export function WorkflowList({
  id,
  heading,
  intro,
  eyebrow,
  items,
  surface = "ink",
}: BlockProps & { items: { name: string; description: string }[] }) {
  return (
    <Section surface={surface} id={id} labelledBy={`${id}-heading`}>
      <SectionHeading
        id={`${id}-heading`}
        level={2}
        title={heading}
        intro={intro}
        eyebrow={eyebrow}
      />
      <ol className="mt-10 grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <li
            key={item.name}
            className="flex gap-4 rounded-card border border-white/10 bg-white/5 p-5"
          >
            <span className="font-heading text-h4 font-bold text-brand-green" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-h4">{item.name}</h3>
              <p className="mt-1 text-fg-muted">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** Prose block (e.g. "How it helps"). */
export function ProseBlock({
  id,
  heading,
  eyebrow,
  body,
  surface = "white",
  aside,
}: BlockProps & { body: string[]; aside?: ReactNode }) {
  return (
    <Section surface={surface} id={id} labelledBy={`${id}-heading`}>
      <div className={cx("grid gap-10", Boolean(aside) && "lg:grid-cols-2 lg:items-center")}>
        <div>
          <SectionHeading id={`${id}-heading`} level={2} title={heading} eyebrow={eyebrow} />
          <div className="mt-6 grid max-w-prose gap-4 text-lead text-fg-muted">
            {body.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </div>
        {aside}
      </div>
    </Section>
  );
}
