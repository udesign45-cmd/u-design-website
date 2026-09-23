import type { ReactNode } from "react";
import { signOut } from "@/app/admin/actions";
import { AdminSidebar } from "./AdminSidebar";
import { Icon } from "@/components/ui/Icon";

export function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-white lg:flex-row">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="hidden items-center justify-between border-b border-line bg-white px-8 py-4 lg:flex">
          <div />
          <div className="flex items-center gap-4">
            <p className="text-sm text-ink-muted">{userEmail}</p>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-ink/30"
              >
                <Icon name="log-out" size={15} />
                Sign out
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 bg-surface-gray px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
        <div className="border-t border-line bg-white px-4 py-3 lg:hidden">
          <form action={signOut} className="flex items-center justify-between">
            <p className="text-sm text-ink-muted">{userEmail}</p>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink"
            >
              <Icon name="log-out" size={15} />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
