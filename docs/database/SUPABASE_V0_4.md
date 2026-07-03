# Supabase Database Integration v0.4

This version adds Supabase-backed real data support using:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## What changed

- New shared package: `@amlbt/supabase`
- Supabase browser client using `@supabase/ssr`
- Environment validation helpers
- Snapshot persistence for the full functional prototype state
- Normalized Supabase schema for the AMLBT domain
- Seed SQL for users, ads, orders, messages, disputes, assets, networks, fees, integrations, risk, content, and system settings
- Legacy `/database` page in both user and admin apps. This was removed in v0.5.
- Functional flows now save to Supabase when env vars are configured, and fallback to localStorage when they are not

## Why snapshots plus normalized tables?

The v0.3 prototype already had dozens of interactive buttons and flows. Rewriting every action to normalized tables immediately would slow development. v0.4 keeps every screen functional by saving the app state to `app_state_snapshots`, while also creating the normalized tables needed for the real production backend.

This gives two paths:

1. **Immediate real persistence:** all current prototype buttons and flows persist in Supabase.
2. **Production path:** gradually replace snapshot writes with typed repository calls to normalized tables.

## Setup

1. Create a Supabase project.
2. Go to SQL Editor.
3. Run `infra/supabase/001_schema.sql`.
4. Run `infra/supabase/002_seed.sql`.
5. Add env vars to Vercel or `.env.local`.
6. Restart apps.
7. In v0.5, use the app normally and inspect Supabase tables directly. The `/database` route was removed.

## Security warning

The `app_state_snapshots` table has open demo policies so a browser publishable key can write during prototype development. Do not use these open policies for production. Production should use one of these options:

- Supabase Auth with user-scoped RLS policies.
- Backend-only writes through `apps/api`.
- Admin writes only through protected admin API routes.

Never put a Supabase secret key or service-role key in `apps/web` or `apps/admin`.
