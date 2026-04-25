# Requirements — Phase 3: Authentication

## Scope

Add email/password sign-up and login flows, and protect all `/dashboard` routes so only authenticated users can access them.

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Auth method | Email + password | Simplest flow for solo barbers; no third-party OAuth needed |
| Session protection | Next.js middleware (`middleware.ts`) | Intercepts every request before rendering; redirects unauthenticated users to `/auth/login` |
| Sign-up confirmation | Email confirmation link | Supabase default; prevents fake registrations |
| Post-login redirect | `/dashboard` | Natural entry point after authentication |
| Post-signup redirect | `/auth/sign-up-success` | Tells the user to check their email before logging in |

## Pages produced

| Route | Purpose |
|---|---|
| `/auth/login` | Email + password login form |
| `/auth/sign-up` | Registration form (name, shop name, email, password) |
| `/auth/sign-up-success` | Confirmation prompt after registration |
| `/auth/callback` | Handles the email confirmation redirect from Supabase |
| `/auth/error` | Generic auth error page |

## Auth guard

`middleware.ts` calls `updateSession` from `lib/supabase/middleware.ts` on every request. If the path starts with `/dashboard` and there is no active user session, the middleware redirects to `/auth/login`.

## Out of scope

- OAuth providers (Google, GitHub, etc.).
- Password reset flow.
- Profile creation (handled in Phase 4 via a Supabase DB trigger).
