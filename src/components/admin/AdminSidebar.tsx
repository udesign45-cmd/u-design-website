"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

const NAV = [
  { href: "/admin/leads", label: "Leads", icon: "list-checks" as const },
  { href: "/admin/analytics", label: "Analytics", icon: "chart-column" as const },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-brand-green text-ink"
                : "text-white/60 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-admin-line bg-admin-bg px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand-green text-sm font-bold text-ink">
            U
          </span>
          <p className="text-sm font-semibold text-white">Lead Management</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="inline-flex size-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10"
        >
          <Icon name={open ? "chevron-left" : "sliders-horizontal"} size={20} />
        </button>
      </div>
      {open ? (
        <div className="border-b border-admin-line bg-admin-bg px-4 pb-4 lg:hidden">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      ) : null}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-admin-line bg-admin-bg px-4 py-6 lg:flex">
        <div className="mb-8 flex items-center gap-2.5 px-2">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-green text-sm font-bold text-ink">
            U
          </span>
          <div>
            <p className="text-sm font-semibold text-white">U Design</p>
            <p className="text-xs text-white/45">Lead Management</p>
          </div>
        </div>
        <NavLinks />
      </aside>
    </>
  );
}
