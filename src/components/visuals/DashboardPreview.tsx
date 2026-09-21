import Image, { type StaticImageData } from "next/image";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cx } from "@/lib/utils/cx";

/**
 * Coded product illustrations for the services section (plan AD-05): HTML/CSS/SVG
 * only, no raster images for the software side, fixed aspect ratio (no CLS).
 * Values are neutral illustrations — no growth percentages, currency or claims
 * (constitution II).
 */

const sidebar: { label: string; icon: IconName; active?: boolean }[] = [
  { label: "Dashboard", icon: "layout-dashboard", active: true },
  { label: "Production", icon: "factory" },
  { label: "Inventory", icon: "boxes" },
  { label: "Sales", icon: "chart-column" },
  { label: "CRM", icon: "users" },
  { label: "Marketing", icon: "megaphone" },
];

const kpis = [
  { label: "Production", value: "1,240 m", chip: "On schedule" },
  { label: "Inventory", value: "312 items", chip: "3 to reorder" },
  { label: "Open orders", value: "48", chip: "12 to ship" },
];

const bars = [46, 62, 55, 71, 64, 82, 76, 90];

function KpiTile({ label, value, chip }: (typeof kpis)[number]) {
  return (
    <div className="rounded-control border border-line bg-white p-2.5">
      <p className="text-micro text-ink-muted">{label}</p>
      <p className="mt-0.5 font-heading text-body font-bold text-ink">{value}</p>
      <p className="mt-1.5 hidden items-center gap-1 rounded-pill bg-surface-gray px-1.5 py-0.5 text-micro text-ink lg:inline-flex">
        <span className="size-1.5 rounded-pill bg-brand-green-dark" />
        {chip}
      </p>
    </div>
  );
}

function OutputChart() {
  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-control border border-line bg-white p-3">
      <div className="flex items-center justify-between">
        <p className="text-micro font-semibold text-ink">Production output</p>
        <p className="text-micro text-ink-muted">This week</p>
      </div>
      <svg
        viewBox="0 0 320 110"
        className="mt-2 h-full min-h-0 w-full flex-1"
        preserveAspectRatio="none"
      >
        {[20, 50, 80].map((y) => (
          <line key={y} x1="0" x2="320" y1={y} y2={y} className="stroke-line" strokeWidth="1" />
        ))}
        {bars.map((h, i) => (
          <rect
            key={i}
            x={8 + i * 39}
            y={110 - h}
            width="24"
            height={h}
            rx="4"
            className={i === bars.length - 1 ? "fill-brand-green" : "fill-brand-green-dark/85"}
          />
        ))}
      </svg>
    </div>
  );
}

function MainWindow() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-panel bg-white shadow-panel">
      <div className="flex h-9 shrink-0 items-center gap-1.5 border-b border-line bg-surface-gray px-4">
        <span className="size-2.5 rounded-pill bg-line" />
        <span className="size-2.5 rounded-pill bg-line" />
        <span className="size-2.5 rounded-pill bg-line" />
        <span className="ml-3 text-micro font-medium text-ink-muted">Operations overview</span>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="hidden w-1/4 shrink-0 flex-col gap-1 bg-green-deep p-3 lg:flex">
          <span className="mb-2 inline-flex size-7 items-center justify-center rounded-control bg-brand-green text-micro font-bold text-ink">
            U
          </span>
          {sidebar.map((item) => (
            <span
              key={item.label}
              className={cx(
                "flex items-center gap-2 rounded-control px-2 py-1.5 text-micro",
                item.active ? "bg-white/15 font-semibold text-white" : "text-white/70",
              )}
            >
              <Icon name={item.icon} size={13} />
              {item.label}
            </span>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5 bg-surface-gray p-3.5">
          <div className="grid grid-cols-3 gap-2">
            {kpis.map((k) => (
              <KpiTile key={k.label} {...k} />
            ))}
          </div>
          <OutputChart />
        </div>
      </div>
    </div>
  );
}

function PipelineCard() {
  const stages = [
    { label: "New leads", width: "w-full", tone: "bg-brand-green/35" },
    { label: "Follow-ups", width: "w-3/4", tone: "bg-brand-green/60" },
    { label: "Proposals", width: "w-1/2", tone: "bg-brand-green-dark/80" },
    { label: "Won", width: "w-1/3", tone: "bg-brand-green" },
  ];
  return (
    <div className="rounded-card border border-line bg-white p-4 shadow-raised">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-6 items-center justify-center rounded-control bg-surface-gray text-ink">
          <Icon name="users" size={13} />
        </span>
        <p className="text-micro font-semibold text-ink">Sales pipeline</p>
      </div>
      <div className="mt-3 grid gap-2">
        {stages.map((s) => (
          <div key={s.label}>
            <p className="text-micro text-ink-muted">{s.label}</p>
            <div className="mt-0.5 h-2 rounded-pill bg-surface-gray">
              <div className={cx("h-2 rounded-pill", s.width, s.tone)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkflowCard() {
  const steps = ["Request submitted", "Manager approval", "Synced to ERP"];
  return (
    <div className="rounded-card border border-line bg-white p-4 shadow-raised">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-6 items-center justify-center rounded-control bg-surface-gray text-ink">
          <Icon name="workflow" size={13} />
        </span>
        <p className="text-micro font-semibold text-ink">Workflow automation</p>
      </div>
      <div className="mt-3 grid gap-2">
        {steps.map((s) => (
          <div key={s} className="flex items-center gap-2 text-micro text-ink-muted">
            <Icon name="circle-check" size={14} className="shrink-0 text-brand-green-dark" />
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function CampaignCard() {
  return (
    <div className="rounded-card surface-ink p-4 shadow-raised">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-6 items-center justify-center rounded-control bg-brand-green text-ink">
          <Icon name="megaphone" size={13} />
        </span>
        <p className="text-micro font-semibold text-white">Campaign reach</p>
      </div>
      <svg viewBox="0 0 200 70" className="mt-3 h-16 w-full" preserveAspectRatio="none">
        <path
          d="M0 60 L25 52 L50 55 L75 40 L100 44 L125 30 L150 26 L175 16 L200 10 L200 70 L0 70 Z"
          className="fill-brand-green/20"
        />
        <path
          d="M0 60 L25 52 L50 55 L75 40 L100 44 L125 30 L150 26 L175 16 L200 10"
          fill="none"
          className="stroke-brand-green"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {["Meta Ads", "LinkedIn", "Content"].map((c) => (
          <span
            key={c}
            className="rounded-pill border border-white/20 px-2 py-0.5 text-micro text-white/80"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function ContentCalendarCard() {
  const days = ["Mon", "Wed", "Fri"];
  return (
    <div className="rounded-card border border-line bg-white p-4 shadow-raised">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-6 items-center justify-center rounded-control bg-surface-gray text-ink">
          <Icon name="pen-line" size={13} />
        </span>
        <p className="text-micro font-semibold text-ink">Content calendar</p>
      </div>
      <div className="mt-3 grid gap-2">
        {days.map((d) => (
          <div key={d} className="flex items-center gap-2">
            <span className="w-7 shrink-0 text-micro text-ink-muted">{d}</span>
            <span className="h-2 flex-1 rounded-pill bg-surface-gray" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Software capability: a coded operations dashboard with CRM pipeline and workflow chips. */
export function SoftwareShowcase({ className }: { className?: string }) {
  return (
    <figure className={cx("relative", className)}>
      <div aria-hidden="true" className="relative aspect-4/3 w-full select-none lg:aspect-5/4">
        <div className="absolute inset-0 lg:inset-auto lg:top-0 lg:right-0 lg:h-4/5 lg:w-11/12">
          <MainWindow />
        </div>
        <div className="absolute bottom-0 left-0 hidden w-1/3 lg:block">
          <WorkflowCard />
        </div>
        <div className="absolute right-0 bottom-0 hidden w-5/12 lg:block">
          <PipelineCard />
        </div>
      </div>
      <figcaption className="sr-only">
        Illustration of a business operations dashboard with a CRM pipeline and a workflow
        automation summary.
      </figcaption>
    </figure>
  );
}

/** Marketing capability: real analytics photography with campaign and content-calendar chips. */
export function MarketingShowcase({
  image,
  className,
}: {
  image: StaticImageData;
  className?: string;
}) {
  return (
    <figure className={cx("relative", className)}>
      <div aria-hidden="true" className="relative aspect-4/3 w-full select-none lg:aspect-5/4">
        <div className="absolute inset-0 overflow-hidden rounded-panel shadow-panel lg:inset-auto lg:top-0 lg:right-0 lg:h-4/5 lg:w-11/12">
          <div className="media-frame size-full">
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 hidden w-1/3 lg:block">
          <CampaignCard />
        </div>
        <div className="absolute right-0 bottom-0 hidden w-5/12 lg:block">
          <ContentCalendarCard />
        </div>
      </div>
      <figcaption className="sr-only">
        Illustration of marketing analytics, campaign reach and a content calendar.
      </figcaption>
    </figure>
  );
}
