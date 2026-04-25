# Validation — Phase 6: Cut Log

All checks must pass before this branch can be merged.

## Checks

### 1. Log a cut with the client picker

- Navigate to `/dashboard/cuts/new`.
- Click the "Buscar cliente..." input — the panel opens showing all clients.
- Type part of a client name — the list filters in real time.
- Select a client — the panel closes and the client name appears in the input.
- Set a price and duration, and submit.
- Redirected to `/dashboard/cuts` and the new cut appears at the top of the list with the selected client's name.

### 2. Log a cut without a client

- Submit `/dashboard/cuts/new` with the client input empty.
- Cut is saved and displayed as "Cliente no especificado".

### 3. Add a new client from the cut form

- On `/dashboard/cuts/new`, type a name that does not exist → panel shows "Agregar '{name}'".
- Click "Agregar '{name}'" → navigated to `/dashboard/clients/new?returnTo=/dashboard/cuts/new`.
- Complete the client form and save.
- Redirected back to `/dashboard/cuts/new` with the new client already pre-selected in the picker.
- Submit the cut — it is saved with the newly created client.

### 4. Close picker on outside click

- Open the client picker panel, then click anywhere outside it.
- The panel closes without selecting a client.

### 5. Search cuts list

- With multiple cuts, type part of a client name or date into the search input.
- List filters in real time.

### 6. View detail

- Click a cut card → navigated to `/dashboard/cuts/[id]`.
- All fields (date, price, duration, notes, client name) are displayed correctly.

### 7. Edit a cut

- Update the price on the detail page and save.
- The updated value persists after page reload.

### 8. Delete a cut

- Delete a cut from the detail page and confirm.
- Redirected to the list; the cut no longer appears.

### 9. Currency formatting

- Prices are displayed in COP format using `es-CO` locale (e.g., `$ 15.000` for 15 000 COP).

### 10. Price input auto-format

- En `/dashboard/cuts/new`, al escribir `15000` el campo muestra `15.000` en tiempo real.
- Al abrir `/dashboard/cuts/[id]`, el campo precio aparece ya formateado (e.g., `15.000`).
- El valor guardado en la DB es un entero sin puntos.

### 11. Build passes

- `npm run build` exits with code 0 and no TypeScript errors.
