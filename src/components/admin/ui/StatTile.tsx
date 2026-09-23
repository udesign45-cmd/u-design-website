import type { IconName } from "@/components/ui/Icon";
import { Icon } from "@/components/ui/Icon";

export function StatTile({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string;
  value: string;
  icon: IconName;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-line bg-white p-5">
      <span
        className={`inline-flex size-10 shrink-0 items-center justify-center rounded-lg ${
          accent ? "bg-brand-green text-ink" : "bg-surface-gray text-ink-muted"
        }`}
      >
        <Icon name={icon} size={18} />
      </span>
      <div>
        <p className="font-heading text-2xl font-bold tracking-tight text-ink">{value}</p>
        <p className="text-sm text-ink-muted">{label}</p>
      </div>
    </div>
  );
}
