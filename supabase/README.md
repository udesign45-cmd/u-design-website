# Lead Management: Supabase setup

The dashboard lives at `/admin` and needs a Supabase project. Nothing here runs automatically — do these steps once.

## 1. Create a project

Create a project at [supabase.com](https://supabase.com). Note its **Project URL**, **anon public key**, and **service_role key** (Project Settings → API).

## 2. Run the migration

Open the SQL editor in the Supabase dashboard and run `migrations/0001_leads.sql` from this folder. It creates the `leads` and `lead_notes` tables, indexes, and RLS policies.

## 3. Set environment variables

Add to `.env.local` (and to your Vercel project's environment variables for production):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security — it's read only on the server (the public consultation form's save step) and must never reach the browser or a client component.

## 4. Create your admin login(s)

There's no public sign-up. In the Supabase dashboard: **Authentication → Users → Add user**, and create one user per person who should have dashboard access (email + password). Every authenticated user can see every lead — this is a single-team tool, not multi-tenant.

## 5. Verify

- Visit `/admin/login` and sign in.
- Submit the public consultation form (`/contact`) — the lead should appear at `/admin/leads` within a few seconds.
- Visiting `/plans`, picking a service and a tier, then "Get Started" pre-fills that service and tier; it shows up on the lead's detail page as Service / Selected plan.

## Notes

- Email delivery/webhook delivery (`LEAD_DELIVERY_PROVIDER`) and the dashboard save are independent — a lead is saved to the dashboard even if email/webhook delivery is unconfigured or fails, and vice versa.
- If Supabase isn't configured, `/admin/*` redirects to `/admin/login` with a banner saying so, rather than the public site breaking.
