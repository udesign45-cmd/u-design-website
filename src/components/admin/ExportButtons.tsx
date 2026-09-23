import { Icon } from "@/components/ui/Icon";

export function ExportButtons({ queryString }: { queryString: string }) {
  const suffix = queryString ? `&${queryString}` : "";
  return (
    <div className="flex items-center gap-2">
      <a
        href={`/admin/leads/export?format=csv${suffix}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-ink/30"
      >
        <Icon name="download" size={15} />
        CSV
      </a>
      <a
        href={`/admin/leads/export?format=xlsx${suffix}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-ink/30"
      >
        <Icon name="file-spreadsheet" size={15} />
        Excel
      </a>
    </div>
  );
}
