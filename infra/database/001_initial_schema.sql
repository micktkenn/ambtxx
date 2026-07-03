-- Initial database planning migration. Expand when backend starts.
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  email text unique,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  buyer_id uuid,
  seller_id uuid,
  asset text not null,
  asset_amount numeric not null,
  fiat text not null,
  fiat_amount numeric not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid,
  action text not null,
  target_type text not null,
  target_id text not null,
  created_at timestamptz not null default now()
);
