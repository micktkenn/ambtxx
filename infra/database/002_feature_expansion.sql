-- AMLBT feature expansion tables for frontend/admin/API planning.
-- These are planning migrations and should be reviewed before production use.

create table if not exists order_events (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  event_type text not null,
  actor_type text not null,
  label text not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists order_evidence (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  related_type text not null,
  related_id text not null,
  file_name text not null,
  mime_type text not null,
  size_kb integer not null,
  status text not null default 'uploaded',
  created_at timestamptz default now()
);

create table if not exists kyc_cases (
  id text primary key,
  user_id text not null,
  requested_level integer not null,
  status text not null,
  provider text not null,
  provider_applicant_id text,
  risk_tags jsonb default '[]'::jsonb,
  reviewer text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists user_payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  method_name text not null,
  provider_name text not null,
  account_holder_name text not null,
  account_masked text not null,
  fiat text not null,
  visibility text not null default 'visible',
  verified boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists risk_flags (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_id text not null,
  rule_id text not null,
  severity text not null,
  status text not null default 'open',
  reason text not null,
  assigned_to text,
  created_at timestamptz default now()
);

create table if not exists fee_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  user_id text not null,
  fee_type text not null,
  asset text not null,
  amount numeric(30, 12) not null,
  rate numeric(8, 4) not null,
  payer text not null,
  status text not null,
  tx_hash text,
  created_at timestamptz default now()
);

create table if not exists notification_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null unique,
  channel text not null,
  subject text,
  body text not null,
  variables jsonb default '[]'::jsonb,
  status text not null default 'draft',
  updated_at timestamptz default now()
);

create table if not exists admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id text,
  action text not null,
  target_type text not null,
  target_id text,
  result text not null,
  ip_masked text,
  created_at timestamptz default now()
);
