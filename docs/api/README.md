# API Notes

The API app is a NestJS-ready skeleton. It currently exposes mock health, order, and admin endpoints.

Production backend rules:

- Backend validates trade state transitions.
- Frontends do not write sensitive state directly.
- Admin actions are permission checked and audited.
- Private keys are never stored in frontend, backend, or database.
