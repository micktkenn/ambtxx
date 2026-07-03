-- AMLBT Supabase auto-trigger remote action layer v0.6
-- This adds tables and prototype RLS needed for automatic remote updates from UI interactions.

create extension if not exists pgcrypto;

create table if not exists public.action_outbox (
  id text primary key,
  app text not null check (app in ('web', 'admin')),
  action_key text not null,
  actor_type text not null check (actor_type in ('user', 'admin', 'system')),
  actor_id text,
  actor_name text,
  operation text not null,
  table_name text,
  target_type text not null default 'ui',
  target_id text not null default 'prototype',
  status text not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists action_outbox_app_created_idx on public.action_outbox(app, created_at desc);
create index if not exists action_outbox_target_idx on public.action_outbox(target_type, target_id);
create index if not exists action_outbox_status_idx on public.action_outbox(status, created_at desc);

create table if not exists public.kyc_cases (
  id text primary key,
  user_id text references public.profiles(id),
  requested_level int not null default 1,
  status text not null default 'pending',
  provider text,
  provider_applicant_id text,
  document_type text,
  country text,
  risk_tags text[] not null default '{}',
  reviewer text,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id text primary key,
  user_id text references public.profiles(id),
  subject text not null,
  category text not null default 'support',
  status text not null default 'open',
  priority text not null default 'normal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_sessions (
  id text primary key,
  user_id text references public.profiles(id),
  device text not null,
  browser text,
  location_approx text,
  ip_masked text,
  current boolean not null default false,
  last_active_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.user_security_settings (
  user_id text primary key references public.profiles(id),
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

create table if not exists public.user_notification_settings (
  user_id text primary key references public.profiles(id),
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

alter table public.content_items add column if not exists type text default 'content';
alter table public.risk_flags add column if not exists rule_id text;
alter table public.risk_flags add column if not exists assigned_to text;

-- Keep updated_at current on new tables.
do $$
declare
  tbl text;
begin
  foreach tbl in array array['kyc_cases','support_tickets','user_security_settings','user_notification_settings'] loop
    execute format('drop trigger if exists set_%s_updated_at on public.%I', tbl, tbl);
    execute format('create trigger set_%s_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

-- Prototype/demo RLS. Replace with authenticated policies or backend action endpoints before production.
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'action_outbox',
    'activity_events',
    'profiles',
    'assets',
    'networks',
    'payment_methods',
    'user_payment_methods',
    'ads',
    'orders',
    'order_events',
    'order_messages',
    'evidence_files',
    'disputes',
    'fee_rules',
    'fee_transactions',
    'notifications',
    'notification_templates',
    'integrations',
    'risk_rules',
    'risk_flags',
    'content_items',
    'admin_audit_logs',
    'system_settings',
    'kyc_cases',
    'support_tickets',
    'user_sessions',
    'user_security_settings',
    'user_notification_settings'
  ] loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('drop policy if exists "prototype v06 read" on public.%I', tbl);
    execute format('drop policy if exists "prototype v06 insert" on public.%I', tbl);
    execute format('drop policy if exists "prototype v06 update" on public.%I', tbl);
    execute format('drop policy if exists "prototype v06 delete" on public.%I', tbl);
    execute format('create policy "prototype v06 read" on public.%I for select to anon, authenticated using (true)', tbl);
    execute format('create policy "prototype v06 insert" on public.%I for insert to anon, authenticated with check (true)', tbl);
    execute format('create policy "prototype v06 update" on public.%I for update to anon, authenticated using (true) with check (true)', tbl);
    execute format('create policy "prototype v06 delete" on public.%I for delete to anon, authenticated using (true)', tbl);
  end loop;
end $$;
