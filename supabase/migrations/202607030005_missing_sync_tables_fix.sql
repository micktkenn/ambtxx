-- AMLBT Supabase v0.6.1 missing sync tables fix
-- Run this if the UI shows warnings like:
-- user_sessions: Could not find the table 'public.user_sessions' in the schema cache
-- user_security_settings: Could not find the table 'public.user_security_settings' in the schema cache
-- support_tickets: Could not find the table 'public.support_tickets' in the schema cache

create extension if not exists pgcrypto;

-- Make this patch safe even if the older initial schema function was not applied.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.support_tickets (
  id text primary key,
  user_id text references public.profiles(id) on delete set null,
  subject text not null,
  category text not null default 'support',
  status text not null default 'open',
  priority text not null default 'normal',
  message text,
  assigned_to text,
  last_reply_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_tickets_user_idx on public.support_tickets(user_id, created_at desc);
create index if not exists support_tickets_status_idx on public.support_tickets(status, priority, created_at desc);

drop trigger if exists set_support_tickets_updated_at on public.support_tickets;
create trigger set_support_tickets_updated_at
before update on public.support_tickets
for each row execute function public.set_updated_at();

create table if not exists public.user_sessions (
  id text primary key,
  user_id text references public.profiles(id) on delete cascade,
  device text not null,
  browser text,
  location_approx text,
  ip_masked text,
  current boolean not null default false,
  trusted boolean not null default false,
  revoked boolean not null default false,
  last_active_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists user_sessions_user_idx on public.user_sessions(user_id, last_active_at desc);
create index if not exists user_sessions_current_idx on public.user_sessions(user_id, current) where current = true;

create table if not exists public.user_security_settings (
  user_id text primary key references public.profiles(id) on delete cascade,
  security_score int not null default 0,
  password_updated_at timestamptz,
  totp_enabled boolean not null default false,
  passkey_enabled boolean not null default false,
  email_otp_enabled boolean not null default true,
  sms_otp_enabled boolean not null default false,
  telegram_linked boolean not null default false,
  backup_codes_remaining int not null default 0,
  anti_phishing_code text,
  sensitive_action_method text not null default 'totp_wallet_signature',
  updated_at timestamptz not null default now()
);

drop trigger if exists set_user_security_settings_updated_at on public.user_security_settings;
create trigger set_user_security_settings_updated_at
before update on public.user_security_settings
for each row execute function public.set_updated_at();

-- This table is also used by the v0.6 sync layer in some settings flows.
create table if not exists public.user_notification_settings (
  user_id text primary key references public.profiles(id) on delete cascade,
  order_in_app boolean not null default true,
  order_email boolean not null default true,
  order_telegram boolean not null default true,
  chat_in_app boolean not null default true,
  chat_telegram boolean not null default true,
  security_email boolean not null default true,
  security_telegram boolean not null default true,
  marketing_email boolean not null default false,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_user_notification_settings_updated_at on public.user_notification_settings;
create trigger set_user_notification_settings_updated_at
before update on public.user_notification_settings
for each row execute function public.set_updated_at();

-- Prototype/demo RLS so frontend publishable-key mode can read/write these tables.
-- Replace with authenticated user-scoped policies or backend action endpoints before production.
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'support_tickets',
    'user_sessions',
    'user_security_settings',
    'user_notification_settings'
  ] loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('drop policy if exists "prototype v061 read" on public.%I', tbl);
    execute format('drop policy if exists "prototype v061 insert" on public.%I', tbl);
    execute format('drop policy if exists "prototype v061 update" on public.%I', tbl);
    execute format('drop policy if exists "prototype v061 delete" on public.%I', tbl);
    execute format('create policy "prototype v061 read" on public.%I for select to anon, authenticated using (true)', tbl);
    execute format('create policy "prototype v061 insert" on public.%I for insert to anon, authenticated with check (true)', tbl);
    execute format('create policy "prototype v061 update" on public.%I for update to anon, authenticated using (true) with check (true)', tbl);
    execute format('create policy "prototype v061 delete" on public.%I for delete to anon, authenticated using (true)', tbl);
  end loop;
end $$;

-- Force PostgREST/Supabase API schema cache refresh.
notify pgrst, 'reload schema';
