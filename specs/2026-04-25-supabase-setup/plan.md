# Plan — Phase 2: Supabase Setup

## 1. Create the Supabase project

- Go to supabase.com and create a new project (free tier).
- Copy the Project URL and anon key from Settings → API.

## 2. Install packages

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 3. Add environment variables

Create `.env.local` at the repo root:

```
NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Add `.env.local` to `.gitignore` if not already present.

## 4. Create client helpers

**`lib/supabase/client.ts`** — browser client used in `'use client'` components:

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**`lib/supabase/server.ts`** — async server client used in Server Components and Route Handlers:

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(),
                 setAll: (cs) => cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  )
}
```

**`lib/supabase/middleware.ts`** — session refresh for the Next.js middleware:

Uses `createServerClient` with `request.cookies` and `supabaseResponse.cookies` to keep the session alive across requests.

## 5. Verify connection

- Import `createClient` in `app/page.tsx` (temporary), call `supabase.from('_test').select()`, and confirm no network errors in the browser console.
- Remove the test code before committing.

## 6. Commit

```
feat: add Supabase client helpers and env variable config
```
