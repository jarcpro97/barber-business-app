# Validation — Phase 2: Supabase Setup

All checks must pass before this branch can be merged.

## Checks

### 1. Packages installed

- `node_modules/@supabase/supabase-js` and `node_modules/@supabase/ssr` exist.
- Both appear in `package.json` under `dependencies`.

### 2. Environment variables present

- `.env.local` exists at the repo root and contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` with non-empty values.
- `.env.local` is listed in `.gitignore`.

### 3. Client helpers exist

- `lib/supabase/client.ts` exports a `createClient` function.
- `lib/supabase/server.ts` exports an async `createClient` function.
- `lib/supabase/middleware.ts` exports an `updateSession` function.

### 4. Build passes

- `npm run build` exits with code 0 and no TypeScript errors.

### 5. Network connection (manual)

- Opening the app in the browser and checking the network tab shows a successful request to the Supabase URL with a 200 response (or 400/406 if the table does not exist — both confirm connectivity).
