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

### Campos

- Fecha / hora (defaults a ahora en hora local), precio (requerido), duración en minutos (opcional), notas (opcional).
- **Client picker** (ver más abajo) en lugar del `<Select>` anterior.
- Price input: `type="text"` + `inputMode="numeric"`, helper `formatCOP(raw)`. Placeholder: `10.000`.
- Al guardar: `parseInt(price.replace(/\./g, ''), 10)` para enviar entero a la DB.
- Al enviar con éxito: redirige a `/dashboard/cuts`.

### Inicialización de fecha y hora

Usar helpers de `lib/dates.ts` para que el default refleje la hora local del browser, no UTC:

```ts
import { toLocalDateStr, toLocalTimeStr } from '@/lib/dates'

const now = new Date()
setDate(toLocalDateStr(now))   // YYYY-MM-DD en hora local
setTime(toLocalTimeStr(now))   // HH:MM en hora local
```

> **No usar** `now.toISOString().split('T')[0]` — devuelve la fecha en UTC, que puede ser un día distinto al local.

### Guardar la fecha

Construir el datetime combinando los campos del form (hora local) y convertir a UTC ISO para Supabase:

```ts
const dateTime = new Date(`${date}T${time}`)  // interpretado como hora local
date: dateTime.toISOString()                   // guardado como UTC en Supabase
```

### Leer `clientId` de la URL

Al montar el componente, leer `searchParams.get('clientId')`. Si existe, buscarlo en la lista de clientes y pre-seleccionarlo en el combobox.

```ts
// En el useEffect que carga clientes:
const preselect = searchParams.get('clientId')
if (preselect) {
  const found = data.find(c => c.id === preselect)
  if (found) {
    setSelectedClient(found)
    setSearch(found.name)
  }
}
```

### Client picker (combobox)

Estado local: `search` (texto del input), `selectedClient` (objeto `{ id, name } | null`), `open` (panel visible).

```tsx
<div className="relative">
  <Input
    placeholder="Buscar cliente..."
    value={search}
    onChange={(e) => { setSearch(e.target.value); setSelectedClient(null); setOpen(true) }}
    onFocus={() => setOpen(true)}
    autoComplete="off"
  />

  {open && (
    <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
      {filtered.map(c => (
        <button key={c.id} type="button"
          className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent"
          onClick={() => { setSelectedClient(c); setSearch(c.name); setOpen(false) }}>
          {c.name}
        </button>
      ))}
      {filtered.length === 0 && (
        <button type="button"
          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-primary"
          onClick={() => router.push(`/dashboard/clients/new?returnTo=/dashboard/cuts/new`)}>
          <Plus className="h-4 w-4" />
          Agregar "{search || 'cliente'}"
        </button>
      )}
    </div>
  )}
</div>
```

`filtered` = `clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))`.

Cerrar el panel al hacer clic fuera: `useEffect` con listener `mousedown` en `document` que llama `setOpen(false)` si el clic está fuera del contenedor ref.

## 3b. Actualizar `/dashboard/clients/new`

Leer el parámetro `returnTo` de la URL. Si existe, después del insert exitoso redirigir a `${returnTo}?clientId=${nuevoId}` en lugar de `/dashboard/clients`.

```ts
const returnTo = searchParams.get('returnTo')
// ...tras insert exitoso:
if (returnTo) {
  router.push(`${returnTo}?clientId=${data[0].id}`)
} else {
  router.push('/dashboard/clients')
}
```

El formulario debe hacer `select('id')` al insertar para obtener el ID del nuevo cliente:

```ts
const { data, error } = await supabase
  .from('clients')
  .insert({ ... })
  .select('id')
  .single()
```

## 4. Build `/dashboard/cuts/[id]`

- Loads the cut with the client join.
- Displays all fields.
- Edit mode for all fields; price cargado desde DB con `formatCOP(String(Math.round(price)))` para mostrarlo formateado (ej. `15.000`).
- Delete button with confirmation; redirects to the list on confirm.

### Cargar fecha y hora del corte existente

Usar helpers de `lib/dates.ts` para extraer partes locales del timestamp UTC que devuelve Supabase:

```ts
import { toLocalDateStr, toLocalTimeStr } from '@/lib/dates'

const cutDate = new Date(cutData.date)
setDate(toLocalDateStr(cutDate))   // fecha en hora local
setTime(toLocalTimeStr(cutDate))   // hora en hora local
```

> **No usar** `cutDate.toISOString().split('T')[0]` — da la fecha en UTC, que puede diferir de la local para cortes registrados en la tarde/noche.

## 5. Link from dashboard

- Add a "Registrar Corte" quick-action button and a cuts count metric card in `app/dashboard/page.tsx`.

## 6. Commit

```
feat: implement cut management system
```
