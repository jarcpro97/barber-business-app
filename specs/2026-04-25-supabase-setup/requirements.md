# Requirements — Phase 2: Supabase Setup

## Scope

Connect the Next.js app to a Supabase project so all future phases can use the database, auth, and storage services.

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Supabase plan | Free tier | Sufficient for development and early production |
| Client package | `@supabase/supabase-js` + `@supabase/ssr` | Official packages; `ssr` enables cookie-based sessions in Next.js App Router |
| Client helpers location | `lib/supabase/` | Centralizes the three client variants (browser, server, middleware) |
| Env var exposure | `NEXT_PUBLIC_` prefix for URL and anon key | Both are safe to expose; the anon key is gated by RLS policies |

## Files produced

- `lib/supabase/client.ts` — browser client (`createBrowserClient`)
- `lib/supabase/server.ts` — server client (`createServerClient` with cookie helpers)
- `lib/supabase/middleware.ts` — session refresh helper used by `middleware.ts`

## Environment variables required

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) key |

## Out of scope

- Auth pages and session protection (Phase 3).
- Any database tables (Phase 4+).
