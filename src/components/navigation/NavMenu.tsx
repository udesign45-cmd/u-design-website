import type { NavLink } from "@/types/content";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";

type NavMenuProps = {
  id: string;
  label: string;
  href: string;
  items: NavLink[];
};

/**
 * Desktop dropdown using the native Popover API (plan AD-15): Escape and
 * outside-click close it with no JavaScript. The hub link always works, even
 * where popovers are unsupported. Menu links are plain anchors so a navigation
 * always closes the panel.
 */
export function NavMenu({ id, label, href, items }: NavMenuProps) {
  if (items.length === 0) {
    return (
      <a href={href} className="nav-link">
        {label}
      </a>
    );
  }
  return (
    <div className="flex items-center">
      <a href={href} className="nav-link pr-1">
        {label}
      </a>
      <button
        type="button"
        popoverTarget={id}
        aria-label={`${label} menu`}
        className="inline-flex size-9 items-center justify-center rounded-control text-fg-muted transition-colors duration-150 hover:bg-ink/5 hover:text-fg"
      >
        <Icon name="chevron-down" size={16} />
      </button>
      <div
        id={id}
        popover="auto"
        className="fixed inset-x-0 top-(--header-height) bottom-auto nav-panel nav-dropdown w-full border-b border-line surface-white shadow-raised"
      >
        <Container className="py-8">
          <p className="mb-4 eyebrow">{label}</p>
          <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="flex min-h-11 items-center gap-2 rounded-control px-3 py-2 font-medium hover:bg-surface-gray"
                >
                  <Icon name="arrow-right" size={16} className="text-accent" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={href} className="mt-6 inline-block text-small font-semibold link-inline">
            View all {label.toLowerCase()}
          </a>
        </Container>
      </div>
    </div>
  );
}
