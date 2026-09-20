import Link from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import type { Crumb } from "@/lib/seo/breadcrumbs";

/** Visible breadcrumb trail (spec FR-008). The last item is the current page. */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-small">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-fg-muted">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={crumb.path} className="inline-flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="font-medium text-fg">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link href={crumb.path} className="hover:text-fg hover:underline">
                    {crumb.name}
                  </Link>
                  <Icon name="arrow-right" size={14} className="opacity-60" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
