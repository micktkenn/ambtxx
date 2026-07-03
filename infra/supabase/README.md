# AMLBT Supabase Setup

This folder adds a real Supabase database option to the functional prototype.

## Environment variables

Set these in both `apps/web/.env.local` and `apps/admin/.env.local`, or at the monorepo root if your dev setup loads root env files:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
NEXT_PUBLIC_AMLBT_USE_SUPABASE=true
```

Supabase's current Next.js guidance uses `@supabase/ssr` and public `NEXT_PUBLIC_SUPABASE_URL` plus `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for browser/client access. Do not put service-role or secret keys into either frontend app.

## Setup order

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `001_schema.sql`.
4. Run `002_seed.sql`.
5. Run `003_dynamic_action_layer.sql`.
6. Restart the Next.js apps.
7. Use the app normally; user/admin actions persist automatically and can be inspected in Supabase tables such as `activity_events`, `orders`, `ads`, `order_messages`, `disputes`, and `admin_audit_logs`.

## How v0.5 works

v0.5 includes three levels of database support:

1. **Functional prototype persistence** through `app_state_snapshots`. This stores the entire functional demo state as JSON so all buttons and flows persist to Supabase without rewriting every screen.
2. **Dynamic activity events** through `activity_events`, so every user/admin action can be stored without a database reset screen.
3. **Normalized production-ready tables** for profiles, ads, orders, messages, disputes, assets, networks, fees, notifications, risk, integrations, content, and audit logs.

The prototype snapshot table is useful for demoing. The normalized tables are the path toward the real backend/API architecture.

## Security note

The included open RLS policies for `app_state_snapshots` are for prototype/demo only because the user requested browser-side connection using publishable keys only. Production should use Supabase Auth and authenticated RLS policies, or route all writes through the backend API.
