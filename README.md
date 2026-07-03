# AMLBT P2P Exchange Monorepo

A development-ready monorepo scaffold for AMLBT, following the product and frontend guides.

## Apps

```text
apps/web     User frontend, Next.js App Router, Vercel-ready
apps/admin   Admin frontend, Next.js App Router, Vercel-ready
apps/api     Backend API skeleton, NestJS-ready for DigitalOcean
```

## Packages

```text
packages/ui           Shared Tailwind UI components
packages/types        Shared domain types
packages/config       Routes, statuses, roles, design tokens
packages/mock-data    Realistic mock data for frontend-first development
packages/api-client   API placeholder functions returning mock data
packages/validation   Zod schema placeholders
packages/trade-engine Shared order/ad/dispute state constants
packages/tsconfig     Shared TypeScript configs
packages/eslint-config Shared ESLint config placeholder
```

## Run locally

```bash
pnpm install
pnpm dev:web      # user app on port 3000
pnpm dev:admin    # admin app on port 3001
pnpm dev:api      # API on port 4000 after backend dependencies install
```

## Deployment model

- `apps/web` → Vercel project for `app.yourdomain.com`
- `apps/admin` → Vercel project for `admin.yourdomain.com`
- `apps/api` → DigitalOcean App Platform or container for `api.yourdomain.com`

## Current state

This is a frontend-first scaffold. It uses mock data and API placeholder functions so screens can be developed now and connected to real backend endpoints later.

## Key UX direction

- Simple, clean, Telegram-like interface
- White background and blue primary color
- Mobile-first user app
- Desktop-first admin console
- Clear escrow, payment, dispute, and security states
- Strong confirmation flows for sensitive actions


## Feature expansion v0.2

This ZIP now includes a richer feature scaffold:

- User onboarding, notifications, ad detail, release flow, dispute flow, limits, and account activity.
- Expanded trade room with chat, evidence, and timeline.
- Admin risk flags, fee transactions, support tickets, content pages, integration detail screens, roles, audit logs, and system settings.
- Additional shared UI components, validation schemas, trade-engine transitions, mock entities, API client functions, backend controllers, and SQL planning migration.

See:

```text
docs/product/FEATURE_EXPANSION_V0_2.md
docs/frontend/PAGE_STATUS_V0_2.md
docs/api/ENDPOINT_MAP_V0_2.md
```


## v0.3 functional prototype upgrade

This repository now includes browser-side functional mock flows for nearly every documented user and admin screen:

- Auth/register/login with 2FA challenge
- Onboarding
- Marketplace filters and order creation
- Ads create/publish/pause/resume/delete
- Orders, trade room, chat, proof upload, mark paid, release crypto, disputes
- Wallet connect/disconnect/switch network
- Settings, KYC, security, sessions, payment methods, notifications, Telegram, limits
- Admin users, KYC, orders, disputes, ads, fees, assets, networks, integrations, content, risk, roles, system settings, audit logs, support

State is stored in local storage for prototype use and can be reset from each functional page.
See `docs/product/FUNCTIONAL_PROTOTYPE_V0_3.md`.

## v0.4 — Supabase real database mode

This version adds a Supabase-backed persistence layer while keeping local mock mode as a fallback.

### New environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
NEXT_PUBLIC_AMLBT_USE_SUPABASE=true
```

### Setup

1. Create a Supabase project.
2. Open Supabase SQL Editor.
3. Run `infra/supabase/001_schema.sql`.
4. Run `infra/supabase/002_seed.sql`.
5. Add the env vars above to both Vercel projects or local `.env.local` files.
6. Restart the apps.
7. Use the app normally. Actions now persist automatically; there is no `/database` page in v0.5.

### What persists now

All functional prototype state can persist to Supabase through `public.app_state_snapshots`. This means actions like login, create order, mark paid, release crypto, open dispute, freeze user, approve KYC, toggle assets, test integrations, publish content, and resolve risk flags are saved to the database when Supabase is configured.

The schema also includes normalized production-ready tables for profiles, ads, orders, chat messages, evidence, disputes, assets, networks, fees, notifications, integrations, risk, content, system settings, and admin audit logs.

### Security note

The open RLS policies for `app_state_snapshots` are for prototype/demo only because this mode uses browser-side publishable keys. Production should move sensitive writes behind `apps/api`, use Supabase Auth, and replace broad prototype RLS policies with user/admin-scoped policies.


## v0.5 dynamic action layer

This version removes the separate `/database` routes from both apps. Users and admins should not need to click a reset/database page during normal product use.

Instead, interaction data is saved automatically:

- Web/user actions are recorded through `recordUserActivity()`.
- Admin actions are recorded through `recordAdminActivity()` and `admin_audit_logs`.
- Key P2P actions have normalized Supabase helpers in `packages/supabase/src/actions.ts`.
- The prototype still falls back to local mock storage when Supabase env vars are missing.

Run the new migration before testing database-backed action logging:

```bash
supabase db push
```

Or paste this file into Supabase SQL Editor:

```text
infra/supabase/003_dynamic_action_layer.sql
```

Standard Supabase CLI files are now included under:

```text
supabase/
  config.toml
  migrations/
  seed.sql
```
