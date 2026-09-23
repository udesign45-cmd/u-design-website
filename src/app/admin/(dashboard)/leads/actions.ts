"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  addLeadNote as addLeadNoteQuery,
  updateLeadStatus as updateLeadStatusQuery,
} from "@/lib/leads/queries";
import type { LeadStatus } from "@/lib/supabase/types";

export async function changeLeadStatus(leadId: string, status: LeadStatus): Promise<void> {
  await updateLeadStatusQuery(leadId, status);
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

export type AddNoteState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; key: number };

export async function addNote(
  leadId: string,
  prev: AddNoteState,
  formData: FormData,
): Promise<AddNoteState> {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { status: "error", message: "Note can't be empty." };
  if (body.length > 4000) return { status: "error", message: "Note is too long." };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Your session expired. Please sign in again." };

  await addLeadNoteQuery(leadId, body, { id: user.id, email: user.email ?? "" });
  revalidatePath(`/admin/leads/${leadId}`);
  const key = prev.status === "success" ? prev.key + 1 : 1;
  return { status: "success", key };
}
