# AMLBT v0.6 — Automatic Supabase Remote Updates

This version removes the need for a visible `/database` page or reset database buttons.

When the app is configured with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
NEXT_PUBLIC_AMLBT_USE_SUPABASE=true
```

user/admin interactions automatically write to Supabase.

## What changed

New files:

```text
packages/supabase/src/remote-action-engine.ts
packages/supabase/src/web-remote-actions.ts
packages/supabase/src/admin-remote-actions.ts
packages/supabase/src/state-table-sync.ts
infra/supabase/004_auto_trigger_remote_actions.sql
supabase/migrations/202607030004_auto_trigger_remote_actions.sql
```

## How remote updates happen

There are now two automatic persistence paths.

### 1. Action outbox for every button/action

Any button that calls `log()`, `recordUserActivity()`, or `recordAdminActivity()` writes to:

```text
action_outbox
activity_events
admin_audit_logs, for admin actions
```

This means even generic UI actions are stored remotely.

### 2. State-to-table sync for real product tables

After user/admin state changes, the app automatically syncs important arrays into real Supabase tables.

User app syncs:

```text
ads
orders
order_events
order_messages
evidence_files
disputes
user_payment_methods
notifications
user_sessions
user_security_settings
support_tickets
```

Admin app syncs:

```text
profiles
ads
orders
disputes
kyc_cases
fee_rules
assets
networks
payment_methods
integrations
notification_templates
content_items
risk_rules
risk_flags
admin_audit_logs
support_tickets
system_settings
```

## Important files

### `remote-action-engine.ts`

Generic engine for insert/update/upsert/delete/activity actions.

### `web-remote-actions.ts`

Concrete user action functions, for example:

```ts
persistAdCreateRemote()
persistOrderCreateRemote()
persistOrderStatusRemote()
persistOrderMessageRemote()
persistEvidenceRemote()
persistDisputeOpenRemote()
persistPaymentMethodRemote()
persistSupportTicketRemote()
```

### `admin-remote-actions.ts`

Concrete admin action functions, for example:

```ts
persistAdminUserStatusRemote()
persistAdminKycDecisionRemote()
persistAdminDisputeDecisionRemote()
persistAdminAdStatusRemote()
persistAdminFeeRuleRemote()
persistAdminConfigStatusRemote()
persistAdminRiskFlagRemote()
persistAdminSystemSettingRemote()
persistAdminSupportTicketRemote()
```

### `state-table-sync.ts`

Auto-syncs frontend state into Supabase tables after any UI interaction.

This is the file that makes the prototype dynamic without asking the user to click database/reset controls.

## Setup

Run the new SQL migration after v0.4/v0.5 setup:

```text
infra/supabase/004_auto_trigger_remote_actions.sql
```

Or, if using Supabase CLI:

```bash
supabase db push
```

## Production note

The included RLS policies are prototype-friendly because this stage uses publishable frontend keys.

Before production:

- Move high-risk actions through `apps/api`.
- Restrict RLS by authenticated user.
- Keep service-role keys only on backend/Edge Functions.
- Never allow admin fund movement directly from frontend.
