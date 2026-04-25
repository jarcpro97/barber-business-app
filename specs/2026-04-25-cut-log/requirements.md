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

## Out of scope

- Income aggregation (Phase 7).
- Chart visualization (Phase 8).
