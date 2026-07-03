# Security Notes

Sensitive actions require step-up verification:

- Release crypto: TOTP + wallet signature
- Refund escrow: TOTP + wallet signature or contract rule
- New device login: 2FA
- Disable 2FA: stronger verification + cooldown
- Admin dispute resolution: permission check + audit log

Telegram, email, or SMS should not be the only verification method for fund movement.
