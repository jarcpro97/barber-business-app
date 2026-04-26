# Validation — Phase 8: Dashboard

All checks must pass before this branch can be merged.

## Checks

### 1. Metrics are accurate

- Log one cut dated today for $200 assigned to a client.
- Load `/dashboard`.
- "Cortes de hoy" shows 1.
- "Ingresos del mes" shows $200.00.
- "Total de clientes" reflects the actual client count.

### 1b. Metrics use Colombia time, not UTC

- Log a cut at **8:00 pm** hora Colombia (20:00 COT = 01:00 UTC next day).
- Load `/dashboard` the same Colombia calendar day.
- "Cortes de hoy" shows the cut (not 0).
- The bar chart shows the amount under today's Colombia date, not tomorrow's.

### 2. Revenue bar chart renders

- The chart appears on the dashboard showing the last 30 days.
- The bar for today reflects the $200 cut logged above.
- Days with no cuts render as $0 bars (no gaps in the X axis).
- Hovering a bar shows a tooltip with the day label and formatted amount.

### 3. Top clients card renders

- Log 3+ cuts for the same client within the last 90 days.
- The client appears at the top of the top-clients list with the correct cut count.
- With no cuts, the card shows an empty state (no crash).

### 4. Quick actions navigate correctly

- Click "Registrar Corte" → lands on `/dashboard/cuts/new`.
- Click "Agregar Cliente" → lands on `/dashboard/clients/new`.

### 5. Quick navigation buttons work

- All four outline buttons in the quick navigation row link to their correct routes.

### 6. Greeting shows profile name

- Profile has a name set → header shows "Bienvenido, {name}".
- Profile has no name → header falls back to the user's email.

### 7. Sign-out works

- Click "Cerrar sesión" → redirected to `/auth/login`.
- Navigating back to `/dashboard` → redirected to `/auth/login` again.

### 8. No unauthenticated access

- Visiting `/dashboard` without a session redirects to `/auth/login`.

### 9. Build passes

- `npm run build` exits with code 0 and no TypeScript errors.
