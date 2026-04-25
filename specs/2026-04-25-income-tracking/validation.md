# Validation — Phase 7: Income Tracking

All checks must pass before this branch can be merged.

## Checks

### 1. Quick totals reflect real data

- Log a cut dated today.
- Navigate to `/dashboard/income`.
- "Hoy" card shows the cut's price.
- "Esta semana" and "Este mes" cards also reflect the amount.

### 2. Period switching

- Switch the period selector between Daily, Weekly, Monthly, and Yearly.
- The breakdown table updates to show rows grouped by the correct period.
- No console errors on any switch.

### 3. Year filter

- Change the year to a year with no cuts → table shows "No hay datos para este periodo".
- Change back to the current year → data reappears.

### 4. Month filter (daily view)

- Select "Diario" period and choose a different month.
- The table shows only cuts from that month.

### 5. Empty state

- On a fresh account with no cuts, all totals show `$ 0` and the table shows the empty state message.

### 6. Currency format

- Todos los valores monetarios se muestran en formato COP manual (e.g., `$ 15.000` para 15 000 COP).
- El símbolo es siempre `$` (nunca `COP`) y el separador de miles es `.` sin decimales.

### 7. Build passes

- `npm run build` exits with code 0 and no TypeScript errors.
