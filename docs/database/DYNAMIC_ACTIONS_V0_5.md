# AMLBT v0.5 — Dynamic Supabase Action Layer

This version removes the `/database` pages from both apps and removes reset-state controls from the user/admin flow shells.

The application now treats user/admin interactions as normal product data:

- User button clicks create activity events.
- Admin button clicks create activity events and audit-log records.
- Important P2P actions have Supabase helpers for normalized writes:
  - create ad
  - create order
  - mark order paid
  - release/refund/dispute order
  - send order chat message
  - open dispute
  - create notification
  - update user/profile status

## New files

```text
packages/supabase/src/actions.ts
packages/supabase/src/realtime.ts
infra/supabase/003_dynamic_action_layer.sql
supabase/config.toml
supabase/migrations/202607030001_initial_schema.sql
supabase/migrations/202607030003_dynamic_action_layer.sql
supabase/seed.sql
```

## Runtime behavior

When Supabase env vars are configured:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
NEXT_PUBLIC_AMLBT_USE_SUPABASE=true
```

then every flow action automatically persists to Supabase.

When Supabase env vars are missing, the app still works through local mock storage.

## Apply the new migration

```bash
supabase db push
```

Or paste this file into Supabase SQL Editor:

```text
infra/supabase/003_dynamic_action_layer.sql
```

## Production warning

The v0.5 RLS policies are intentionally prototype-friendly. For production:

- move sensitive actions through `apps/api`
- require Supabase Auth sessions
- restrict rows by authenticated user
- use granular admin roles
- never expose service-role keys in frontend apps
