-- AMLBT Supabase schema v0.4
-- Run in Supabase SQL Editor.

create extension if not exists pgcrypto;

-- Prototype state snapshots. Used by the v0.4 functional frontend to persist all mock actions.
create table if not exists public.app_state_snapshots (
  id text primary key,
  app text not null check (app in ('web', 'admin')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id text primary key,
  username text not null unique,
  display_name text not null,
  email text,
  country text,
  avatar_initials text,
  kyc_level int not null default 0,
  kyc_status text not null default 'not_started',
  risk_level text not null default 'low',
  status text not null default 'active',
  completed_trades int not null default 0,
  completion_rate numeric not null default 0,
  rating numeric not null default 0,
  average_release_minutes int,
  wallet_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assets (
  symbol text primary key,
  name text not null,
  network text not null,
  contract text not null,
  decimals int not null,
  status text not null default 'active',
  min_trade numeric not null default 0,
  max_trade numeric not null default 0,
  icon text,
  escrow_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.networks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  chain_id int not null unique,
  rpc_provider text,
  explorer_url text,
  escrow_contract text,
  confirmations int not null default 12,
  status text not null default 'active',
  latest_synced_block bigint not null default 0,
  gas_policy text not null default 'user_pays',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_methods (
  id text primary key,
  name text not null,
  type text not null,
  country text not null,
  fiat text not null,
  status text not null default 'active',
  kyc_level int not null default 0,
  risk_level text not null default 'low',
  min_order_amount numeric not null default 0,
  max_order_amount numeric not null default 0,
  instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_payment_methods (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  method_type text not null,
  provider_name text not null,
  account_holder_name text not null,
  account_identifier_masked text not null,
  currency text not null,
  instructions text,
  status text not null default 'active',
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ads (
  id text primary key,
  trader_id text not null references public.profiles(id),
  side text not null check (side in ('buy', 'sell')),
  asset text not null references public.assets(symbol),
  fiat text not null,
  price numeric not null,
  price_type text not null default 'fixed',
  margin_percent numeric,
  available_amount numeric not null,
  min_fiat numeric not null,
  max_fiat numeric not null,
  payment_methods text[] not null default '{}',
  payment_window_minutes int not null default 30,
  terms text,
  requirements jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  ad_id text references public.ads(id),
  side text not null check (side in ('buy', 'sell')),
  buyer_id text not null references public.profiles(id),
  seller_id text not null references public.profiles(id),
  asset text not null references public.assets(symbol),
  asset_amount numeric not null,
  fiat text not null,
  fiat_amount numeric not null,
  price numeric not null,
  status text not null default 'created',
  escrow_status text not null default 'not_funded',
  payment_method text,
  payment_account_name text,
  payment_account_masked text,
  timer_ends_at timestamptz,
  escrow_tx text,
  fee_amount numeric default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_events (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  type text not null,
  label text not null,
  description text,
  actor_type text not null default 'system',
  created_at timestamptz not null default now()
);

create table if not exists public.order_messages (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  sender_id text references public.profiles(id),
  sender_type text not null,
  sender_name text,
  body text not null,
  attachment_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.evidence_files (
  id text primary key,
  owner_id text references public.profiles(id),
  related_type text not null,
  related_id text not null,
  file_name text not null,
  mime_type text not null,
  size_kb int not null default 0,
  storage_path text,
  status text not null default 'uploaded',
  created_at timestamptz not null default now()
);

create table if not exists public.disputes (
  id text primary key,
  order_id text not null references public.orders(id),
  reason text not null,
  status text not null default 'open',
  priority text not null default 'normal',
  amount numeric not null,
  asset text not null,
  buyer_evidence_count int not null default 0,
  seller_evidence_count int not null default 0,
  assigned_moderator text,
  moderator_notes text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fee_rules (
  id text primary key,
  name text not null,
  payer text not null,
  percentage numeric not null,
  min_fee numeric not null default 0,
  max_fee numeric not null default 0,
  asset text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fee_transactions (
  id text primary key,
  order_id text references public.orders(id),
  user_id text references public.profiles(id),
  amount numeric not null,
  asset text not null,
  status text not null default 'pending',
  tx_hash text,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id text primary key,
  user_id text references public.profiles(id),
  type text not null,
  title text not null,
  body text not null,
  channel text not null,
  status text not null default 'sent',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_templates (
  id text primary key,
  key text not null unique,
  channel text not null,
  subject text,
  body text not null,
  variables text[] not null default '{}',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.integrations (
  key text primary key,
  name text not null,
  category text not null,
  status text not null default 'setup_required',
  mode text not null default 'sandbox',
  masked_key text,
  webhook_url text,
  last_success timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.risk_rules (
  id text primary key,
  name text not null,
  trigger text not null,
  severity text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.risk_flags (
  id text primary key,
  target_type text not null,
  target_id text not null,
  severity text not null,
  reason text not null,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.content_items (
  id text primary key,
  title text not null,
  placement text not null,
  body text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id text primary key,
  admin_name text not null,
  action text not null,
  target_type text not null,
  target_id text not null,
  ip_masked text,
  result text not null default 'success',
  created_at timestamptz not null default now()
);

create table if not exists public.system_settings (
  key text primary key,
  label text not null,
  description text,
  value jsonb not null default 'false'::jsonb,
  updated_at timestamptz not null default now()
);

-- Updated-at trigger helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  tbl text;
begin
  foreach tbl in array array['app_state_snapshots','profiles','assets','networks','payment_methods','user_payment_methods','ads','orders','disputes','fee_rules','notification_templates','integrations','risk_rules','content_items','system_settings'] loop
    execute format('drop trigger if exists set_%s_updated_at on public.%I', tbl, tbl);
    execute format('create trigger set_%s_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

-- RLS
alter table public.app_state_snapshots enable row level security;
alter table public.profiles enable row level security;
alter table public.ads enable row level security;
alter table public.orders enable row level security;
alter table public.order_events enable row level security;
alter table public.order_messages enable row level security;
alter table public.evidence_files enable row level security;
alter table public.disputes enable row level security;
alter table public.assets enable row level security;
alter table public.networks enable row level security;
alter table public.payment_methods enable row level security;
alter table public.user_payment_methods enable row level security;
alter table public.fee_rules enable row level security;
alter table public.fee_transactions enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_templates enable row level security;
alter table public.integrations enable row level security;
alter table public.risk_rules enable row level security;
alter table public.risk_flags enable row level security;
alter table public.content_items enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.system_settings enable row level security;

-- Prototype-only policies for browser publishable key access.
-- For production, remove broad anon policies and use authenticated RLS/backend APIs.
drop policy if exists "prototype snapshots read" on public.app_state_snapshots;
drop policy if exists "prototype snapshots write" on public.app_state_snapshots;
create policy "prototype snapshots read" on public.app_state_snapshots for select to anon, authenticated using (true);
create policy "prototype snapshots write" on public.app_state_snapshots for all to anon, authenticated using (true) with check (true);

-- Public read policies for prototype data.
do $$
declare
  tbl text;
begin
  foreach tbl in array array['profiles','ads','orders','order_events','order_messages','evidence_files','disputes','assets','networks','payment_methods','user_payment_methods','fee_rules','fee_transactions','notifications','notification_templates','integrations','risk_rules','risk_flags','content_items','admin_audit_logs','system_settings'] loop
    execute format('drop policy if exists "prototype public read" on public.%I', tbl);
    execute format('create policy "prototype public read" on public.%I for select to anon, authenticated using (true)', tbl);
  end loop;
end $$;

-- Limited write policies for demo operations.
do $$
declare
  tbl text;
begin
  foreach tbl in array array['orders','order_events','order_messages','evidence_files','disputes','ads','admin_audit_logs','risk_flags','notifications','user_payment_methods'] loop
    execute format('drop policy if exists "prototype public write" on public.%I', tbl);
    execute format('create policy "prototype public write" on public.%I for all to anon, authenticated using (true) with check (true)', tbl);
  end loop;
end $$;
