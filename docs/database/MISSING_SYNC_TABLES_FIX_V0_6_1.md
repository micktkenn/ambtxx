# AMLBT v0.6.1 — Missing Sync Tables Fix

This patch fixes Supabase schema-cache warnings like:

```text
user_sessions: Could not find the table 'public.user_sessions' in the schema cache
user_security_settings: Could not find the table 'public.user_security_settings' in the schema cache
support_tickets: Could not find the table 'public.support_tickets' in the schema cache
```

## Why it happens

The v0.6 UI sync layer writes sessions, security settings, notification settings, and support tickets to Supabase. If your database only has the earlier schema, those tables are missing.

## Fix

Run this SQL in Supabase Dashboard → SQL Editor:

```text
infra/supabase/005_missing_sync_tables_fix.sql
```

or use the standard CLI migration:

```text
supabase/migrations/202607030005_missing_sync_tables_fix.sql
```

The SQL is idempotent, so it is safe to run more than once.

## After running

Refresh your app. The sync warnings should disappear. If the warning still appears immediately after running SQL, wait a few seconds and refresh because Supabase/PostgREST may need to reload the schema cache.

## Production note

The included RLS policies are prototype/demo policies for publishable-key frontend testing. Before production, replace them with authenticated user-scoped policies or move sensitive writes through the backend API.
