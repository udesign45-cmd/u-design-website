import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function Pagination({
  page,
  pageSize,
  total,
  buildHref,
}: {
  page: number;
  pageSize: number;
  total: number;
  buildHref: (page: number) => string;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1 && total <= pageSize) {
    return (
      <p className="text-sm text-ink-muted">
        {total} lead{total === 1 ? "" : "s"}
      </p>
    );
  }

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-ink-muted">
        {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-1">
        <Link
          href={buildHref(Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className={`inline-flex size-8 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors ${
            page <= 1 ? "pointer-events-none opacity-40" : "hover:border-ink/30 hover:text-ink"
          }`}
        >
          <Icon name="chevron-left" size={16} label="Previous page" />
        </Link>
        <p className="px-2 text-sm text-ink">
          {page} / {pageCount}
        </p>
        <Link
          href={buildHref(Math.min(pageCount, page + 1))}
          aria-disabled={page >= pageCount}
          className={`inline-flex size-8 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors ${
            page >= pageCount ? "pointer-events-none opacity-40" : "hover:border-ink/30 hover:text-ink"
          }`}
        >
          <Icon name="chevron-right" size={16} label="Next page" />
        </Link>
      </div>
    </div>
  );
}
