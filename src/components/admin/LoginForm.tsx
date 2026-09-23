"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/admin/actions";

const INITIAL: LoginState = { status: "idle" };

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white " +
  "placeholder:text-white/30 outline-none transition-colors focus:border-brand-green " +
  "focus:bg-white/[0.07]";

export function LoginForm({ next, configError }: { next?: string; configError?: boolean }) {
  const [state, formAction, isPending] = useActionState(signIn, INITIAL);

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#141414] p-8 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.6)]">
      <div className="mb-8 flex items-center gap-2.5">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-green text-sm font-bold text-ink">
          U
        </span>
        <div>
          <p className="text-sm font-semibold text-white">U Design</p>
          <p className="text-xs text-white/45">Lead Management</p>
        </div>
      </div>

      {configError ? (
        <p className="mb-5 rounded-lg border border-admin-status-lost/25 bg-admin-status-lost/10 px-3 py-2.5 text-sm text-admin-status-lost">
          Supabase isn&apos;t configured yet. Set the environment variables and redeploy.
        </p>
      ) : null}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next ?? "/admin/leads"} />
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-white/60">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-white/60">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={inputClasses}
          />
        </div>
        {state.status === "error" ? (
          <p role="alert" className="text-sm text-admin-status-lost">
            {state.message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-brand-green px-4 py-2.5 text-sm font-semibold text-ink transition-[filter,opacity] hover:brightness-95 disabled:opacity-60"
        >
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
