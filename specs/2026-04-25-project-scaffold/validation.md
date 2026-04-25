# Validation — Phase 1: Project Scaffold

All checks must pass before this branch can be merged to `master`.

## Checks

### 1. Dev server loads
- Run `npm run dev`.
- Open `http://localhost:3000` in the browser.
- The page renders with no console errors or warnings.

### 2. Production build passes
- Run `npm run build`.
- Exits with code 0.
- No TypeScript errors, no Next.js build warnings.

### 3. Tailwind renders
- `app/globals.css` contains the three Tailwind directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`).
- Add a temporary Tailwind class (e.g. `className="bg-red-500"`) to `app/page.tsx`, confirm it applies in the browser, then remove it before committing.

### 4. No lint errors
- Run `npm run lint`.
- Exits with no errors or warnings.

## Merge criteria

All 4 checks pass, the home page is an empty `<main />`, and `node_modules` is not committed.
