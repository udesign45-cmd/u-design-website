"use client";

import { useActionState, useEffect, useRef } from "react";
import { addNote, type AddNoteState } from "@/app/admin/(dashboard)/leads/actions";
import type { LeadNoteRow } from "@/lib/supabase/types";

const INITIAL: AddNoteState = { status: "idle" };

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function NotesPanel({ leadId, notes }: { leadId: string; notes: LeadNoteRow[] }) {
  const boundAddNote = addNote.bind(null, leadId);
  const [state, formAction, isPending] = useActionState(boundAddNote, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <h2 className="text-sm font-semibold text-ink">Notes</h2>

      <form ref={formRef} action={formAction} className="mt-4 space-y-2">
        <textarea
          name="body"
          rows={3}
          required
          placeholder="Add a note about this lead…"
          className="w-full resize-none rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand-green-dark"
        />
        {state.status === "error" ? (
          <p role="alert" className="text-xs text-admin-status-lost">
            {state.message}
          </p>
        ) : null}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? "Adding…" : "Add note"}
          </button>
        </div>
      </form>

      <ul className="mt-5 space-y-4 border-t border-line pt-4">
        {notes.length === 0 ? (
          <p className="text-sm text-ink-muted">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <li key={note.id} className="text-sm">
              <p className="whitespace-pre-wrap text-ink">{note.body}</p>
              <p className="mt-1 text-xs text-ink-muted">
                {note.author_email ?? "Unknown"} · {formatDateTime(note.created_at)}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
