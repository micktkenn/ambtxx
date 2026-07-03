alter table public.orders
add column if not exists platform_fee numeric default 0,
add column if not exists fee_asset text default 'USDT';