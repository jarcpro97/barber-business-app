# Plan — Phase 5: Client List

## 1. Create the `clients` table

```sql
create table public.clients (
  id         uuid primary key default gen_random_uuid(),
  barber_id  uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  phone      text,
  notes      text,
  created_at timestamptz default now()
);

alter table public.clients enable row level security;

create policy "Barbers manage own clients"
  on public.clients for all
  using (auth.uid() = barber_id)
  with check (auth.uid() = barber_id);
```

## 2. Build `/dashboard/clients` (list page)

- Fetches all clients for the authenticated user ordered by name.
- Search input filters the list client-side by name or phone.
- Each row links to `/dashboard/clients/[id]`.
- Empty state with a CTA to add the first client.

## 3. Build `/dashboard/clients/new`

- Form fields: name (required), phone, notes.
- On submit: inserts into `clients` with `barber_id = user.id`.
- On success: redirects to `/dashboard/clients`.

## 4. Build `/dashboard/clients/[id]`

- Loads the client row by `id`.
- Displays name, phone, notes, and creation date.
- Edit mode: inline form to update name, phone, and notes.
- Delete button with confirmation dialog; on confirm calls `.delete()` and redirects to the list.

## 5. Link from dashboard

- Add a "Clientes" card and quick-action button in `app/dashboard/page.tsx`.

## 6. Commit

```
feat: implement client management system
```
