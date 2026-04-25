# Validation — Phase 9: Mobile experience

All checks must pass at **375 × 812 px viewport** (iPhone SE / Chrome DevTools mobile preset) before this phase is merged.

## Checks

### 1. Bottom navigation bar appears on all dashboard routes

- Open `/dashboard`, `/dashboard/clients`, `/dashboard/cuts`, `/dashboard/income`.
- The bar is visible and pinned to the bottom of the screen on all four routes.
- No page content is hidden behind the bar (scroll to the bottom of each list).

### 2. Active tab highlights correctly

- On `/dashboard` → "Inicio" tab is active (primary color).
- On `/dashboard/clients` → "Clientes" tab is active.
- On `/dashboard/clients/new` → "Clientes" tab is still active (prefix match).
- On `/dashboard/cuts` → "Cortes" tab is active.
- On `/dashboard/income` → "Ingresos" tab is active.

### 3. Pull-to-refresh works on list pages

- Open `/dashboard/clients`.
- Add a new client in another tab.
- Pull down from the top of the client list → spinner appears → list reloads and shows the new client.
- Repeat for `/dashboard/cuts` and `/dashboard/income`.

### 4. Loading skeletons appear during navigation

- Simulate slow network (Chrome DevTools → Network → Slow 3G).
- Navigate between dashboard routes.
- Skeleton placeholders appear before content loads — no blank white flash or layout shift.

### 5. iOS zoom does not trigger on input focus

- Open any form on a real iOS device or Safari emulation.
- Tap any `<input>` field.
- The viewport does NOT zoom in. (Confirms font-size ≥ 16 px on all inputs.)

### 6. Form keyboard types are correct

- Open `/dashboard/cuts/new` → tap the price field → numeric / decimal keyboard appears.
- Open `/dashboard/clients/new` → tap the phone field → telephone keyboard appears.
- Open `/auth/login` → tap the email field → email keyboard (with `@` key) appears.

### 7. Touch targets meet 44 × 44 px minimum

- Open Chrome DevTools → Rendering → Show accessibility → check "Layout shift regions" is off.
- Use the Accessibility panel or the "Tap targets" Lighthouse audit.
- No interactive element flags a tap target smaller than 44 × 44 px.

### 8. No hover-only interactions remain

- On a touch device (or DevTools touch emulation), use every interactive element in the app.
- No element requires hover to reveal its action or become operable.

### 9. Spacing looks correct at 375 px

- No text or button is clipped by the screen edge (horizontal overflow visible).
- Card padding is at least 16 px on all sides.
- List rows are tall enough to tap comfortably (at least 56 px).

### 10. Build passes

- `npm run build` exits with code 0 and no TypeScript errors.
