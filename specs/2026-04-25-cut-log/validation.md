# Validation — Phase 6: Cut Log

All checks must pass before this branch can be merged.

## Checks

### 1. Log a cut

- Navigate to `/dashboard/cuts/new`.
- Select a client, set a price and duration, and submit.
- Redirected to `/dashboard/cuts` and the new cut appears at the top of the list.

### 2. Log a cut without a client

- Submit `/dashboard/cuts/new` with no client selected.
- Cut is saved and displayed as "Cliente no especificado".

### 3. Search

- With multiple cuts, type part of a client name or date into the search input.
- List filters in real time.

### 4. View detail

- Click a cut card → navigated to `/dashboard/cuts/[id]`.
- All fields (date, price, duration, notes, client name) are displayed correctly.

### 5. Edit a cut

- Update the price on the detail page and save.
- The updated value persists after page reload.

### 6. Delete a cut

- Delete a cut from the detail page and confirm.
- Redirected to the list; the cut no longer appears.

### 7. Currency formatting

- Prices are displayed in COP format using `es-CO` locale (e.g., `$ 15.000` for 15 000 COP).

### 8. Price input auto-format

- En `/dashboard/cuts/new`, al escribir `15000` el campo muestra `15.000` en tiempo real.
- Al abrir `/dashboard/cuts/[id]`, el campo precio aparece ya formateado (e.g., `15.000`).
- El valor guardado en la DB es un entero sin puntos.

### 8. Build passes

- `npm run build` exits with code 0 and no TypeScript errors.
