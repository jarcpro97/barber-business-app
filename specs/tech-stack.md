# Tech Stack

## Core

| Layer | Choice | Reason |
|---|---|---|
| Language | TypeScript | End-to-end type safety across server and client |
| Framework | Next.js (App Router) | Full-stack in one repo: SSR pages, API routes, and React UI |
| Runtime | Node.js | Stable, well-supported, familiar ecosystem |
| UI | React + Tailwind CSS | Component model + utility CSS for fast, consistent styling |
| Backend | Supabase | PostgreSQL database + Auth + Storage, free tier, zero-config |
| DB client | `@supabase/supabase-js` | Official typed client, works in Server and Client Components |

## Deployment

| Target | Tool |
|---|---|
| Primary | Vercel (zero-config Next.js deploy) |
| Backend | Supabase cloud (free tier, hosted PostgreSQL) |

## Conventions

- App Router (`app/` directory) with Server Components by default.
- Client Components only where interactivity requires it (`"use client"`).
- Supabase Auth handles sessions; use the server-side client in Server Components and Route Handlers.
- Database schema managed via Supabase dashboard migrations or SQL files committed to `supabase/migrations/`.
