# AMLBT Functional Prototype v0.3

This version turns the monorepo from a static scaffold into an end-to-end functional mock application.

The app is still frontend/mock-data based. No real backend, database, wallet provider, KYC provider, Telegram bot, or escrow contract is connected yet. The goal is to let developers and stakeholders click every major flow from the documentation and see state changes immediately.

## What became functional

### User app

- Login and registration with mock 2FA/new-device challenge.
- Onboarding checklist with email, wallet, 2FA, KYC, payment method, and Telegram steps.
- Dashboard quick actions with mutable wallet, notifications, and order state.
- Marketplace filters and create-order action.
- Ad creation wizard with preview, save draft, and publish.
- My ads with pause, resume, and delete.
- Orders list with mark-paid and cancel actions.
- Trade room with:
  - mark paid
  - upload proof
  - send chat message
  - timeline event creation
  - release flow link
  - dispute flow link
- Sensitive release flow with warning, mock 2FA, and wallet-signature action.
- Open dispute flow with reason, description, and evidence.
- Wallet connect/disconnect, copy address, switch network, balances.
- Profile page with reputation, active ads, report, and block actions.
- Settings pages with editable profile, verification, security toggles, sessions, payment methods, notifications, Telegram, privacy, limits, and activity.
- Disputes list/detail with review, evidence, and escalation actions.
- Support ticket creation.
- Notification center with mark read/unread and test notification.

### Admin app

- Admin login with 2FA challenge.
- Dashboard priority queue and system actions.
- Users management with search, restrict, freeze, and detail page actions.
- KYC management with approve, reject, request more information.
- Orders management with flag, assign, and escalate actions.
- Dispute management with release to buyer, refund seller, request evidence, and escalate.
- Ads moderation with suspend, restore, and flag actions.
- Fee rule management and fee transaction table.
- Assets, networks, payment methods, integrations, notifications, content, risk, roles, system settings, audit logs, and support ticket actions.
- Admin actions write mock audit log entries.

## Mock state

The functional layer stores state in browser local storage:

```text
amlbt-web-state-v3
amlbt-admin-state-v3
```

Each functional page has a reset button to restore the seed mock data.

## Important development note

The functional state layer is intentionally temporary. It proves the UX and route coverage before backend integration.

When backend APIs are ready, replace local state mutations with calls such as:

```ts
markOrderAsPaid(orderId)
releaseOrder(orderId, payload)
openDispute(orderId, payload)
approveKyc(caseId, payload)
freezeUser(userId, payload)
resolveDispute(disputeId, payload)
```

The UI should not need a redesign when those API calls replace the mock local-state actions.
