# Plan — Phase 8: Dashboard

## 1. Build `app/dashboard/page.tsx` as a Server Component

### Auth + redirect

```ts
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/auth/login')
```

### Parallel data fetching

El servidor corre en UTC. Todos los límites de fecha se calculan en hora Colombia (America/Bogota, UTC-5) usando helpers de `lib/dates.ts`:

```ts
import { toColombiaDateStr, colombiaMidnight } from '@/lib/dates'

const todayStr = toColombiaDateStr(new Date())           // "YYYY-MM-DD" en Colombia
const today = colombiaMidnight(todayStr)                 // medianoche Colombia como UTC Date
const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

const [todayYear, todayMonth] = todayStr.split('-').map(Number)
const firstDayOfMonth = colombiaMidnight(`${todayYear}-${String(todayMonth).padStart(2,'0')}-01`)
const daysInMonth = new Date(todayYear, todayMonth, 0).getDate()
const lastDayOfMonth = new Date(`${todayYear}-${String(todayMonth).padStart(2,'0')}-${String(daysInMonth).padStart(2,'0')}T23:59:59-05:00`)

const thirtyDaysAgo = colombiaMidnight(toColombiaDateStr(new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000)))
const ninetyDaysAgo = colombiaMidnight(toColombiaDateStr(new Date(today.getTime() - 89 * 24 * 60 * 60 * 1000)))
```

Las queries a Supabase usan `.toISOString()` sobre estos `Date` (ya correctamente anclados a medianoche Colombia en UTC).

### Compute chart data (server-side)

Build an array of 30 entries — one per day — with explicit zero-fill for days with no cuts. Agrupar por día Colombia, no por día UTC:

```ts
import { toColombiaDateStr } from '@/lib/dates'

const chartData = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000)
  const key = toColombiaDateStr(d)
  const label = new Intl.DateTimeFormat('es-CO', {
    timeZone: 'America/Bogota',
    day: '2-digit', month: '2-digit',
  }).format(d)
  const total = recentCuts
    ?.filter(c => toColombiaDateStr(new Date(c.date)) === key)
    .reduce((sum, c) => sum + Number(c.price), 0) || 0
  return { day: label, total }
})
```

> **No usar** `d.toISOString().split('T')[0]` ni `c.date.startsWith(key)` — comparan en UTC y agrupan cortes de tarde/noche bajo el día siguiente.

### Compute top clients (server-side)

From `recentCuts` of the last 90 days, group by `client_id`, count, sort descending, take top 3:

```ts
// Fetch separately with 90-day window for top clients
const topClients = Object.values(
  last90DayCuts.reduce((acc, cut) => {
    if (!cut.client) return acc
    const id = cut.client.id
    acc[id] ??= { name: cut.client.name, count: 0 }
    acc[id].count++
    return acc
  }, {} as Record<string, { name: string; count: number }>)
).sort((a, b) => b.count - a.count).slice(0, 3)
```

### Server Action for sign-out

```ts
async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}
```

### Layout

```
Header
  ├── Title + greeting
  └── [Perfil button] [Cerrar sesión form]

Quick actions (2-column grid)
  ├── [Registrar Corte] → /dashboard/cuts/new
  └── [Agregar Cliente] → /dashboard/clients/new

Metrics (4-column grid)
  ├── Cortes de hoy → /dashboard/cuts
  ├── Ingresos del mes → /dashboard/income
  ├── Total de clientes → /dashboard/clients
  └── Reportes → /dashboard/income

2-column grid (chart + top clients)
  ├── <RevenueChart data={chartData} />   ← client component
  └── Top 3 clients card

Quick navigation (4-column grid of outline buttons)
```

## 2. Create `components/dashboard/revenue-chart.tsx`

`'use client'` component that receives `data: { day: string; total: number }[]` as a prop.

Uses `BarChart` from Recharts via the project's existing `components/ui/chart.tsx` shadcn wrapper:

```tsx
'use client'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
  total: { label: 'Ingresos', color: 'hsl(var(--primary))' },
}

export function RevenueChart({ data }: { data: { day: string; total: number }[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }}
          tickFormatter={(v) => `$${v}`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
```

## 3. Commit

```
feat: add revenue chart and top clients to dashboard
```
