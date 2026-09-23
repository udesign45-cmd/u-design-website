-- U Design Lead Management: leads + lead_notes, with RLS.
--
-- Access model:
--   - Public website visitors never touch this table directly. The consultation
--     Server Action writes with the SERVICE ROLE key, which bypasses RLS entirely.
--   - The admin dashboard reads/writes as an authenticated Supabase Auth user
--     (created manually in the Supabase dashboard — there is no public sign-up).
--     Every authenticated user is treated as an admin; there is a single team,
--     not a multi-tenant system.
--   - RLS is enabled with no policy for the `anon` role, so anonymous access is
--     denied by default on both tables.
--
-- Run this once in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz not null default now(),

  -- Contact
  name text not null,
  company text not null,
  email text not null,
  phone text not null,

  -- What they asked about
  industry text,
  industry_label text,
  service text,               -- solution/marketing-service slug ("need" on the public form)
  service_label text,
  plan text,                  -- "basic" | "standard" | "premium", set from /plans
  budget text,
  budget_label text,
  message text,

  -- Attribution
  source_page text not null default '/contact',

  -- Pipeline
  status text not null default 'new'
    constraint leads_status_check
    check (status in ('new', 'contacted', 'follow_up', 'converted', 'lost'))
);

comment on table public.leads is 'Consultation requests captured from the public website.';
comment on column public.leads.plan is 'Selected pricing tier from /plans, if the lead arrived that way.';

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_service_idx on public.leads (service);
create index if not exists leads_plan_idx on public.leads (plan);
create index if not exists leads_search_idx on public.leads
  using gin (
    to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(company, '') || ' ' ||
      coalesce(email, '') || ' ' || coalesce(phone, ''))
  );

create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null,
  author_email text
);

comment on table public.lead_notes is 'Free-text notes an admin adds while working a lead.';

create index if not exists lead_notes_lead_id_idx on public.lead_notes (lead_id, created_at);

-- updated_at maintenance -----------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row
  execute function public.set_updated_at();

-- Row Level Security ----------------------------------------------------------

alter table public.leads enable row level security;
alter table public.lead_notes enable row level security;

-- No policy exists for the anon role on either table, so anonymous access is
-- denied by default. Public form submissions use the service role key, which
-- bypasses RLS, so no anon INSERT policy is needed or granted.

create policy "Authenticated users can read leads"
  on public.leads for select
  to authenticated
  using (true);

create policy "Authenticated users can update leads"
  on public.leads for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can read notes"
  on public.lead_notes for select
  to authenticated
  using (true);

create policy "Authenticated users can add notes"
  on public.lead_notes for insert
  to authenticated
  with check (true);
