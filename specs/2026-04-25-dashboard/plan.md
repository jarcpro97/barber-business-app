# Plan — Phase 8: Dashboard

## 1. Build `app/dashboard/page.tsx` as a Server Component

### Auth + redirect

```ts
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/auth/login')
```

### Parallel data fetching

```ts
const thirtyDaysAgo = new Date(today); thirtyDaysAgo.setDate(today.getDate() - 29)
const ninetyDaysAgo = new Date(today); ninetyDaysAgo.setDate(today.getDate() - 89)

const [{ data: profile }, { count: clientCount }, { count: todayCutsCount }, { data: monthCuts }, { data: recentCuts }] =
  await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('cuts').select('*', { count: 'exact', head: true })
      .gte('date', today).lt('date', tomorrow),
    supabase.from('cuts').select('price')
      .gte('date', firstDayOfMonth).lte('date', lastDayOfMonth),
    supabase.from('cuts').select('date, price, client:clients(id, name)')
      .gte('date', thirtyDaysAgo.toISOString())
      .order('date', { ascending: true }),
  ])

const monthIncome = monthCuts?.reduce((sum, c) => sum + Number(c.price), 0) || 0
```

### Compute chart data (server-side)

Build an array of 30 entries — one per day — with explicit zero-fill for days with no cuts:

```ts
const chartData = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(thirtyDaysAgo)
  d.setDate(d.getDate() + i)
  const key = d.toISOString().split('T')[0]
  const label = d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' })
  const total = recentCuts
    ?.filter(c => c.date.startsWith(key))
    .reduce((sum, c) => sum + Number(c.price), 0) || 0
  return { day: label, total }
})
```

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
