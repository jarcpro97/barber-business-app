# Plan — Phase 3: Authentication

## 1. Enable Email Auth in Supabase

- In the Supabase dashboard go to Authentication → Providers → Email and confirm it is enabled.
- Set the Site URL and Redirect URLs to include `http://localhost:3000` for local development.

## 2. Create auth pages

**`app/auth/login/page.tsx`** (`'use client'`)
- Form fields: email, password.
- Calls `supabase.auth.signInWithPassword({ email, password })`.
- On success redirects to `/dashboard` via `useRouter`.
- Displays inline error on failure.

**`app/auth/sign-up/page.tsx`** (`'use client'`)
- Form fields: name, shop name, email, password, confirm password.
- Client-side validation: passwords match and are at least 6 characters.
- Calls `supabase.auth.signUp({ email, password, options: { data: { name, shop_name } } })`.
- On success redirects to `/auth/sign-up-success`.

**`app/auth/sign-up-success/page.tsx`**
- Static page telling the user to check their email for a confirmation link.

**`app/auth/callback/route.ts`**
- Route Handler that exchanges the `code` query param for a session using `supabase.auth.exchangeCodeForSession(code)`.
- Redirects to `/dashboard` on success, `/auth/error` on failure.

**`app/auth/error/page.tsx`**
- Simple error message page for failed auth callbacks.

## 3. Add middleware guard

**`middleware.ts`**
- Calls `updateSession(request)` from `lib/supabase/middleware.ts`.
- `updateSession` redirects any unauthenticated request to `/dashboard/**` to `/auth/login`.

## 4. Verify flows

- Register a new account → confirm email → login → land on `/dashboard`.
- Visit `/dashboard` without a session → confirm redirect to `/auth/login`.

## 5. Commit

```
feat: add authentication — login, sign-up, and middleware guard
```
