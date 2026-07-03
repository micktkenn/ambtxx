# AMLBT v0.7 Visual Refresh

This version preserves the v0.6/v0.6.1 Supabase remote action layer and applies a new UI direction based on the supplied reference screens.

## Preserved

- Supabase snapshot persistence
- Remote action engine
- Auto table sync
- User/admin action logging
- Missing sync table migration fixes
- Mock fallback when Supabase env vars are not configured
- Existing app/admin/backend/shared package structure

## New visual direction

- White card-based application canvas
- AMLBT blue top navigation
- Desktop top nav instead of dense left app navigation
- Mobile bottom nav styled like a native app
- Wallet left rail with summary and quick actions
- Larger blue wallet portfolio card
- Polished asset table and mobile asset cards
- Market table/card hybrid like the reference
- Trade-room/order-detail screen with escrow status, payment details, chat, and timeline
- Create sell ad page with live summary panel
- Verification/security page with progress cards and preferred sensitive-action method
- Payment methods page with desktop table and mobile cards
- Add funds / receive crypto page
- Send funds page with safety confirmation and step-up security

## New routes

```text
/wallet/add-funds
/wallet/send
```

## Main modified files

```text
apps/web/components/layout/AppShell.tsx
apps/web/components/functional/UserFlows.tsx
apps/web/components/functional/WalletExtraFlows.tsx
apps/web/components/PageHeader.tsx
apps/web/app/page.tsx
apps/web/app/globals.css
apps/web/app/wallet/add-funds/page.tsx
apps/web/app/wallet/send/page.tsx
```

## Supabase behavior

No database route or reset button was reintroduced. User actions still save automatically through the existing remote action system when Supabase env vars are configured. If Supabase is not configured, the UI keeps using local mock storage.

