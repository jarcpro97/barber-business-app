# Roadmap

Phases are intentionally small and shippable. Each phase produces working, committed code.

## Phase 1 — Project scaffold
- Initialize Next.js (App Router) with TypeScript and Tailwind CSS.
- Confirm `npm run dev` serves a blank home page.

## Phase 2 — Supabase setup
- Create Supabase project (free tier).
- Add `@supabase/supabase-js` and `@supabase/ssr` packages.
- Configure environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

## Phase 3 — Authentication
- Enable Supabase Auth (email + password).
- Sign-up and login pages.
- Protect all `/dashboard` routes behind a session check using Supabase middleware.

## Phase 4 — Barber profile
- `profiles` table in Supabase (name, shop name, avatar URL).
- Profile page with edit form saved via a Route Handler.
- Avatar upload to Supabase Storage.

## Phase 5 — Client list
- `clients` table (name, phone, notes, barber relation).
- Page to add, list, and view a client's detail.

## Phase 6 — Cut log
- `cuts` table (date, price, duration, client relation).
- Form to log a cut and associate it with a client.
- Currency: COP (Colombian Peso) using `es-CO` locale.

## Phase 7 — Income tracking
- Income summary queries: totals by day, month, year.
- Simple income page with a date filter.

## Phase 8 — Dashboard
- Home dashboard with key metrics: today's cuts, monthly revenue, top clients.
- Chart component (daily revenue bar chart).

## Phase 9 — Reports
- Printable / exportable monthly income report (CSV or PDF).

## Phase 10 — Brand & social
- Shareable public barber profile page (read-only, no auth).
- Social media links on the profile.
- Basic growth tips section (static content to start).

## Phase 11 — Marketing landing page
- Public home page (`/`) targeting new barbers.
- Hero, features, and call-to-action to sign up.

## Phase 12 — Production deploy
- Configure Vercel project with Supabase environment variables.
- Smoke-test all flows in production.
