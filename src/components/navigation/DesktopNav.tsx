import { getNavigation } from "@/lib/content";
import { NavMenu } from "./NavMenu";

/** Primary navigation for large screens (spec FR-001, FR-002). */
export function DesktopNav() {
  const { primary } = getNavigation();
  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-0.5">
        {primary.map((item) => (
          <li key={item.href}>
            {item.children ? (
              <NavMenu
                id={`menu-${item.href.replace(/\//g, "") || "home"}`}
                label={item.label}
                href={item.href}
                items={item.children}
              />
            ) : (
              <a href={item.href} className="nav-link">
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
