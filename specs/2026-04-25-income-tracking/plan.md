# Plan — Phase 7: Income Tracking

## 1. Build `/dashboard/income`

**`app/dashboard/income/page.tsx`** (`'use client'`)

### State

```ts
period: 'daily' | 'weekly' | 'monthly' | 'yearly'
year: number          // defaults to current year
month: number         // 0-indexed; defaults to current month
loading: boolean
summary: { daily, weekly, monthly, yearly }
totals: { today, week, month, year }
```

### Data loading (`loadIncome`)

1. Fetch all cuts for the selected year:
   ```ts
   supabase.from('cuts')
     .select('date, price')
     .gte('date', startOfYear)
     .lte('date', endOfYear)
   ```
2. Compute quick totals by filtering the returned array against `startOfToday`, `startOfWeek`, `startOfMonth`, and `endOfMonth`.
3. Group into four Maps (by day `YYYY-MM-DD`, week-start `YYYY-MM-DD`, month `YYYY-MM`, year `YYYY`) and convert to sorted arrays. Usar `lib/dates.ts#toLocalDateStr` para la clave diaria y semanal (extrae partes locales del browser, no UTC).

### UI structure

- Back button → `/dashboard`.
- **Quick-total cards row** (4 cards): Hoy, Esta semana, Este mes, Este año.
- **Filter row**: period `<Select>`, year `<Select>`, month `<Select>` (only when period is `daily`).
- **Breakdown table**: two columns — period label and total. Empty state if no data.

### Date grouping

```ts
import { toLocalDateStr, parseLocalDate } from '@/lib/dates'

// Diario — clave en hora local del browser
const date = toLocalDateStr(new Date(cut.date))

// Semanal — inicio de semana el lunes (lunes a domingo)
const d = new Date(cut.date)
const weekStart = new Date(d)
weekStart.setDate(d.getDate() - (d.getDay() + 6) % 7)
const week = toLocalDateStr(weekStart)

// Mensual y anual — getFullYear/getMonth ya son locales, no necesitan helper
```

Filtrar la tabla diaria y semanal con las claves string directamente (no con `new Date(str)`, que parsea `YYYY-MM-DD` como UTC midnight):

```ts
// Diario
.filter(d => {
  const [y, m] = d.date.split('-').map(Number)
  return (m - 1) === month && y === year
})

// Semanal
.filter(w => parseInt(w.week.split('-')[0]) === year)
```

Para mostrar fechas en la tabla, usar `parseLocalDate` para evitar el parse como UTC midnight:

```ts
parseLocalDate(item.date).toLocaleDateString('es-CO', { ... })
```

### Formatting helpers

```ts
// Intl.NumberFormat con COP/es-CO es inconsistente entre SSR y browser.
// Este formateador manual siempre produce "$ 15.000".
formatCurrency = (v: number): string =>
  '$ ' + Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
```

Month names array in Spanish for display.

## 2. Link from dashboard

- Add "Ver ingresos" link under the monthly revenue metric card in `app/dashboard/page.tsx`.

## 3. Commit

```
feat: implement income page and update dashboard with quick actions
```
