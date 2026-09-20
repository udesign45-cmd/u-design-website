import { Logo } from "@/components/layout/Logo";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getNavigation } from "@/lib/content";

/**
 * Full-screen mobile menu using the native Popover API (plan AD-15): no JS,
 * Escape closes it and focus returns to the toggle.
 */
export function MobileNav() {
  const { primary, cta } = getNavigation();
  return (
    <div className="lg:hidden">
      <button
        type="button"
        popoverTarget="mobile-nav"
        aria-label="Open menu"
        className="inline-flex size-11 items-center justify-center rounded-control text-fg hover:bg-ink/5"
      >
        <Icon name="menu" size={24} />
      </button>
      <div
        id="mobile-nav"
        popover="auto"
        className="fixed inset-0 nav-panel h-dvh w-full max-w-none overflow-y-auto surface-white"
      >
        <div className="flex min-h-full flex-col">
          <div className="flex h-(--header-height) items-center justify-between border-b border-line px-4">
            <Logo />
            <button
              type="button"
              popoverTarget="mobile-nav"
              popoverTargetAction="hide"
              aria-label="Close menu"
              className="inline-flex size-11 items-center justify-center rounded-control hover:bg-ink/5"
            >
              <Icon name="x" size={24} />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 px-4 py-4">
            <ul className="divide-y divide-line">
              {primary.map((item) => (
                <li key={item.href} className="py-1">
                  <a
                    href={item.href}
                    className="flex min-h-12 items-center font-heading text-h4 font-semibold"
                  >
                    {item.label}
                  </a>
                  {item.children && item.children.length > 0 ? (
                    <ul className="mb-3 grid gap-0.5 pl-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <a
                            href={child.href}
                            className="flex min-h-11 items-center rounded-control px-2 text-fg-muted hover:bg-surface-gray hover:text-fg"
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
          <div className="sticky bottom-0 border-t border-line bg-white p-4">
            <a
              href={cta.href}
              className={buttonClasses("primary", "lg", "w-full")}
              data-track="cta_click"
              data-track-label={cta.label}
              data-track-location="mobile-nav"
            >
              {cta.label}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
