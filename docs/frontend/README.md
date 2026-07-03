# Frontend Notes

This monorepo implements the frontend-first direction:

- User app and admin app as separate Next.js apps.
- Shared UI components in `packages/ui`.
- Mock data in `packages/mock-data`.
- API placeholder functions in `packages/api-client`.
- Mobile-first user layouts and desktop admin layouts.

Next frontend tasks:

1. Add real form validation with `@amlbt/validation`.
2. Add Zustand store for mock auth/session state.
3. Add TanStack Query when backend endpoints exist.
4. Add real modals/drawers for sensitive actions.
5. Add PWA icons.
