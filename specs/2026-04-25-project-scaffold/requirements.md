# Requirements — Phase 1: Project Scaffold

## Scope

Set up the base Next.js project that all future phases will build on. No features, no content — just a clean, working foundation.

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Scaffolding method | `create-next-app` | Official CLI pre-configures App Router, TypeScript, and Tailwind correctly |
| App Router | Yes | Aligns with `specs/tech-stack.md`; required for Server Components and Route Handlers |
| Home page content | Empty `<main />` | Avoids boilerplate that will conflict with the Phase 11 marketing landing page |
| `src/` directory | No | Flatter structure; `app/` at the root is the Next.js convention |

## Out of scope

- Any Supabase configuration (Phase 2).
- Authentication (Phase 3).
- Any UI content or components beyond the empty home page.

## Context

This phase exists solely to give every future phase a stable, buildable base. The stack is defined in `specs/tech-stack.md`: Next.js App Router + TypeScript + Tailwind CSS, deployed to Vercel.
