-- AMLBT Supabase dynamic action layer v0.5
-- Adds automatic event persistence for UI actions so user/admin interactions are stored as data.

create table if not exists public.activity_events (
  id text primary key,
  app text not null check (app in ('web', 'admin')),
  actor_type text not null check (actor_type in ('user', 'admin', 'system')),
  actor_id text,
  actor_name text,
  action text not null,
  target_type text not null default 'ui',
  target_id text not null default 'prototype',
  tone text not null default 'success',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_events_app_created_idx on public.activity_events(app, created_at desc);
create index if not exists activity_events_target_idx on public.activity_events(target_type, target_id);
create index if not exists activity_events_actor_idx on public.activity_events(actor_type, actor_id);

-- Prototype-friendly policies. Tighten these before production.
alter table public.activity_events enable row level security;

drop policy if exists "prototype read activity events" on public.activity_events;
create policy "prototype read activity events" on public.activity_events
  for select using (true);

drop policy if exists "prototype insert activity events" on public.activity_events;
create policy "prototype insert activity events" on public.activity_events
  for insert with check (true);

-- Make demo tables usable with the publishable key in prototype mode.
-- Production should replace this with authenticated user/admin policies and backend action endpoints.
alter table public.ads enable row level security;
drop policy if exists "prototype insert ads" on public.ads;
create policy "prototype insert ads" on public.ads for insert with check (true);

alter table public.ads enable row level security;
drop policy if exists "prototype update ads" on public.ads;
create policy "prototype update ads" on public.ads for update using (true) with check (true);

alter table public.orders enable row level security;
drop policy if exists "prototype insert orders" on public.orders;
create policy "prototype insert orders" on public.orders for insert with check (true);

alter table public.orders enable row level security;
drop policy if exists "prototype update orders" on public.orders;
create policy "prototype update orders" on public.orders for update using (true) with check (true);

alter table public.order_events enable row level security;
drop policy if exists "prototype insert order events" on public.order_events;
create policy "prototype insert order events" on public.order_events for insert with check (true);

alter table public.order_messages enable row level security;
drop policy if exists "prototype insert order messages" on public.order_messages;
create policy "prototype insert order messages" on public.order_messages for insert with check (true);

alter table public.disputes enable row level security;
drop policy if exists "prototype insert disputes" on public.disputes;
create policy "prototype insert disputes" on public.disputes for insert with check (true);

alter table public.disputes enable row level security;
drop policy if exists "prototype update disputes" on public.disputes;
create policy "prototype update disputes" on public.disputes for update using (true) with check (true);

alter table public.notifications enable row level security;
drop policy if exists "prototype insert notifications" on public.notifications;
create policy "prototype insert notifications" on public.notifications for insert with check (true);

alter table public.profiles enable row level security;
drop policy if exists "prototype update profiles" on public.profiles;
create policy "prototype update profiles" on public.profiles for update using (true) with check (true);

alter table public.admin_audit_logs enable row level security;
drop policy if exists "prototype insert audit logs" on public.admin_audit_logs;
create policy "prototype insert audit logs" on public.admin_audit_logs for insert with check (true);

