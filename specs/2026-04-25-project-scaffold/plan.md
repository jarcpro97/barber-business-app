# Plan — Phase 1: Project Scaffold

## 1. Generate the Next.js app

- Run `npx create-next-app@latest` inside the repo root with these flags:
  - TypeScript: yes
  - Tailwind CSS: yes
  - App Router: yes
  - ESLint: yes
  - `src/` directory: no
  - Import alias: no (keep defaults)

## 2. Clean up boilerplate

- Remove default content from `app/page.tsx` — replace with an empty `<main />`.
- Remove unused styles from `app/globals.css` (keep only Tailwind directives).
- Delete `public/` sample images (`next.svg`, `vercel.svg`).

## 3. Verify dev server

- Run `npm run dev` and confirm the home page loads at `http://localhost:3000` with no console errors.

## 4. Verify production build

- Run `npm run build` and confirm it completes with zero TypeScript or Next.js errors.

## 5. Commit scaffold

- Stage all generated files (excluding `node_modules`).
- Commit with message: `feat: Next.js App Router scaffold with TypeScript and Tailwind`.
