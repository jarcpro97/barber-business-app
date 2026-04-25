# Requirements — Phase 6: Cut Log

## Scope

Allow barbers to log each haircut — date, price, duration, optional notes — and associate it with a client.

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Cut storage | `cuts` table in Supabase | Normalized; enables income queries in Phase 7 |
| Client link | Foreign key `client_id → clients.id` | Optional — a cut can be logged without a client |
| RLS | Cuts filtered by `barber_id = auth.uid()` | Same multi-tenant pattern as clients |
| Currency format | Formateador manual COP: `'$ ' + Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')` | `Intl.NumberFormat` con COP/es-CO es inconsistente entre SSR y browser; el manual siempre produce `$ 15.000` |
| Price input | `type="text"` + `inputMode="numeric"` con `formatCOP()` | Auto-inserta `.` como separador de miles al escribir; guarda entero en DB |
| List order | Descending by `date` | Most recent cuts first |
| Client selector | Combobox de búsqueda en lugar de `<Select>` | En móvil, un dropdown largo de clientes es difícil de usar; el buscador filtra por nombre al escribir |
| Agregar cliente desde el formulario | Botón "Agregar cliente" con flujo `returnTo` | El barbero no debe perder el corte que estaba registrando para agregar un cliente nuevo |

## Database schema

```sql
create table public.cuts (
  id         uuid primary key default gen_random_uuid(),
  barber_id  uuid not null references auth.users(id) on delete cascade,
  client_id  uuid references public.clients(id) on delete set null,
  date       timestamptz not null default now(),
  price      numeric(10,2) not null,
  duration   integer,        -- minutes
  notes      text,
  created_at timestamptz default now()
);
```

## Pages produced

| Route | Purpose |
|---|---|
| `/dashboard/cuts` | Searchable list of all cuts |
| `/dashboard/cuts/new` | Form to log a new cut |
| `/dashboard/cuts/[id]` | Cut detail with edit and delete |

## Client picker (combobox)

El campo "Cliente" en `/dashboard/cuts/new` es un buscador, no un dropdown fijo:

- Input de texto libre con placeholder "Buscar cliente...".
- Al escribir, filtra la lista de clientes del barbero por nombre (client-side, ya que la lista está en memoria).
- Los resultados aparecen en un panel desplegable bajo el input.
- Al seleccionar un cliente el panel se cierra y el nombre queda visible en el input.
- Si la búsqueda no produce resultados, el panel muestra: **"No se encontró — Agregar cliente"**.
- El campo puede dejarse vacío (corte sin cliente asociado).

## Flujo "Agregar cliente desde el formulario"

1. El usuario escribe un nombre que no existe y presiona **"Agregar cliente"**.
2. El navegador va a `/dashboard/clients/new?returnTo=/dashboard/cuts/new`.
3. El formulario de nuevo cliente detecta el parámetro `returnTo`.
4. Al crear el cliente con éxito, redirige a `{returnTo}?clientId={nuevoClienteId}`.
5. El formulario de nuevo corte lee `clientId` de la URL, busca ese cliente en su lista y lo pre-selecciona automáticamente.

## Out of scope

- Income aggregation (Phase 7).
- Chart visualization (Phase 8).
