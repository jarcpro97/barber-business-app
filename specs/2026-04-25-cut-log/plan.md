# Plan — Phase 6: Cut Log

## 1. Create the `cuts` table

```sql
create table public.cuts (
  id         uuid primary key default gen_random_uuid(),
  barber_id  uuid not null references auth.users(id) on delete cascade,
  client_id  uuid references public.clients(id) on delete set null,
  date       timestamptz not null default now(),
  price      numeric(10,2) not null,
  duration   integer,
  notes      text,
  created_at timestamptz default now()
);

alter table public.cuts enable row level security;

create policy "Barbers manage own cuts"
  on public.cuts for all
  using (auth.uid() = barber_id)
  with check (auth.uid() = barber_id);
```

## 2. Build `/dashboard/cuts` (list page)

- Fetches cuts with a join: `select(..., client:clients(id, name))` ordered by `date` descending.
- Search input filters by client name or formatted date string.
- Each row shows client name, formatted date, price (COP), and duration.
- Links to the detail page per cut.
- Empty state with CTA to register the first cut.

## 3. Build `/dashboard/cuts/new`

- Fields: date/time picker (defaults to now), price (required), duration (minutes, optional), client selector (dropdown of the barber's clients), notes.
- Price input uses `type="text"` + `inputMode="numeric"` y un helper `formatCOP(raw)` que strip non-digits y aplica `toLocaleString('es-CO')` para auto-insertar `.` al escribir (ej. `10000` → `10.000`). Placeholder: `10.000`.
- Al guardar: `parseInt(price.replace(/\./g, ''), 10)` para enviar entero a la DB.
- On submit: inserts into `cuts` with `barber_id = user.id`.
- On success: redirects to `/dashboard/cuts`.

## 4. Build `/dashboard/cuts/[id]`

- Loads the cut with the client join.
- Displays all fields.
- Edit mode for all fields; price cargado desde DB con `formatCOP(String(Math.round(price)))` para mostrarlo formateado (ej. `15.000`).
- Delete button with confirmation; redirects to the list on confirm.

## 5. Link from dashboard

- Add a "Registrar Corte" quick-action button and a cuts count metric card in `app/dashboard/page.tsx`.

## 6. Commit

```
feat: implement cut management system
```
