# API Endpoint Map v0.2

## User APIs

```text
POST /auth/login
POST /auth/register
POST /auth/verify-2fa
GET  /users/profile
GET  /users/sessions
GET  /users/payment-methods
GET  /ads
POST /ads/create
POST /ads/:id/action
GET  /orders
GET  /orders/:id
POST /orders/:id/mark-paid
POST /orders/:id/release/prepare
POST /orders/:id/dispute
GET  /wallet/balances
POST /wallet/signature-challenge
GET  /notifications
GET  /content/banners
```

## Admin APIs

```text
GET  /admin/users
GET  /admin/kyc
POST /admin/kyc/:id/action
GET  /admin/disputes
POST /admin/disputes/:id/action
GET  /admin/risk/flags
POST /admin/risk/flags/:id/action
GET  /admin/fees/transactions
GET  /admin/audit-logs
GET  /integrations/status
POST /integrations/:id/test
```

All sensitive actions should create audit logs and require role permissions.
