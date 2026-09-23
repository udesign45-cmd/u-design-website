/** Mirrors supabase/migrations/0001_leads.sql. Keep in sync by hand (no live project to codegen from). */

export type LeadStatus = "new" | "contacted" | "follow_up" | "converted" | "lost";
export type PlanTier = "basic" | "standard" | "premium";

export type LeadRow = {
  id: string;
  created_at: string;
  updated_at: string;
  submitted_at: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string | null;
  industry_label: string | null;
  service: string | null;
  service_label: string | null;
  plan: PlanTier | null;
  budget: string | null;
  budget_label: string | null;
  message: string | null;
  source_page: string;
  status: LeadStatus;
};

export type LeadInsert = Omit<LeadRow, "id" | "created_at" | "updated_at" | "status"> & {
  id?: string;
  status?: LeadStatus;
};

export type LeadNoteRow = {
  id: string;
  lead_id: string;
  body: string;
  created_at: string;
  created_by: string | null;
  author_email: string | null;
};

export type LeadNoteInsert = Omit<LeadNoteRow, "id" | "created_at">;

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: Partial<LeadRow>;
        Relationships: [];
      };
      lead_notes: {
        Row: LeadNoteRow;
        Insert: LeadNoteInsert;
        Update: Partial<LeadNoteRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
