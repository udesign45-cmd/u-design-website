"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { consultationHref } from "@/lib/cta";
import { buildPlanTiers, type PlannableService } from "@/lib/content/plans";
import { cx } from "@/lib/utils/cx";

type PlanExplorerProps = {
  services: PlannableService[];
};

/** Pick a service, then compare its Basic / Standard / Premium scope (no client-side fetch). */
export function PlanExplorer({ services }: PlanExplorerProps) {
  const [selectedSlug, setSelectedSlug] = useState(services[0]?.slug ?? "");
  const selected = services.find((s) => s.slug === selectedSlug) ?? services[0];

  if (!selected) return null;
  const tiers = buildPlanTiers(selected);

  return (
    <div>
      <div role="group" aria-label="Choose a service" className="flex flex-wrap gap-2">
        {services.map((service) => {
          const active = service.slug === selected.slug;
          return (
            <button
              key={service.slug}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedSlug(service.slug)}
              className={cx(
                "inline-flex items-center gap-2 rounded-control border px-4 py-2 text-body font-medium transition-colors",
                active
                  ? "border-brand-green-dark bg-brand-green text-ink"
                  : "border-line text-fg-muted hover:border-fg/35 hover:text-fg",
              )}
            >
              <Icon name={service.icon} size={18} />
              {service.name}
            </button>
          );
        })}
      </div>

      <p className="mt-8 max-w-2xl text-lead text-fg-muted">{selected.summary}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.tier} variant="feature" className="flex flex-col">
            <p className="eyebrow">{tier.label}</p>
            <p className="mt-2 text-ink-muted">{tier.description}</p>
            <ul className="mt-6 flex-1 space-y-3">
              {tier.included.map((item) => (
                <li key={item.title} className="flex items-start gap-2">
                  <Icon
                    name="circle-check"
                    size={18}
                    className="mt-0.5 shrink-0 text-brand-green-dark"
                  />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
            <ButtonLink
              href={consultationHref({ need: selected.slug, source: "/plans" })}
              variant="secondary"
              size="lg"
              className="mt-8 w-full"
              track={{ event: "cta_click", label: "Get Started", location: `plans-${tier.tier}` }}
            >
              Get Started
            </ButtonLink>
          </Card>
        ))}
      </div>
    </div>
  );
}
