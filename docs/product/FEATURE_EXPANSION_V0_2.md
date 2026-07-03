# AMLBT Feature Expansion v0.2

This update expands the monorepo from a basic scaffold into a richer development starting point.

## Added user-facing features

- Onboarding checklist.
- Notification center.
- Ad detail page.
- Release crypto step-up flow.
- Open dispute flow.
- Settings limits page.
- Account activity and sessions page.
- Richer trade room with events, evidence, and chat panel.
- More realistic payment methods, sessions, security settings, and KYC levels.

## Added admin features

- Risk flags queue.
- Fee transactions page.
- Content pages management.
- Support ticket queue.
- Integration detail pages for KYC, Telegram, email, SMS, and blockchain.
- Richer audit logs.
- Admin roles with permissions.
- System settings / feature flags.

## Added shared system features

- More complete shared types.
- More mock data entities.
- More API client placeholder functions.
- Trade-engine state transition helper.
- Zod validation schemas.
- Shared UI components for select, textarea, tabs, empty/loading states, confirmation dialog, timeline, chat panel, and feature cards.

## Added backend/API planning

- Controller skeletons for auth, users, ads, disputes, KYC, wallets, fees, notifications, risk, content, integrations, and audit.
- Additional SQL planning migration for order events, evidence, KYC cases, user payment methods, risk flags, fee transactions, notification templates, and audit logs.

## Next recommended features

1. Add real route-level forms with React Hook Form.
2. Add Zustand mock store for frontend interactions.
3. Add TanStack Query provider and replace direct server calls.
4. Add real API DTOs and guards in NestJS.
5. Add Prisma or Drizzle schema.
6. Add automated tests for trade state transitions.
7. Add Storybook or Ladle for shared UI components.
