# Requirements — Phase 5: Client List

## Scope

Allow barbers to add, list, search, view, edit, and delete their clients.

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Client storage | `clients` table in Supabase | Relational link to cuts in Phase 6 |
| RLS | Each barber sees only their own clients (`barber_id = auth.uid()`) | Multi-tenant isolation |
| Search | Client-side filter on name and phone | Avoids extra DB round-trips for small lists |
| Detail page | `/dashboard/clients/[id]` | Shows client info + edit/delete actions |

## Database schema

```sql
create table public.clients (
  id         uuid primary key default gen_random_uuid(),
  barber_id  uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  phone      text,
  notes      text,
  created_at timestamptz default now()
);
```

## Pages produced

| Route | Purpose |
|---|---|
| `/dashboard/clients` | Searchable list of all clients |
| `/dashboard/clients/new` | Form to add a new client |
| `/dashboard/clients/[id]` | Client detail with edit and delete |

## Out of scope

- Client visit history on the detail page (depends on cuts from Phase 6).
- Pagination (not needed at small scale).
