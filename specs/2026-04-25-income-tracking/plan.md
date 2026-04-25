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
3. Group into four Maps (by day `YYYY-MM-DD`, week-start `YYYY-MM-DD`, month `YYYY-MM`, year `YYYY`) and convert to sorted arrays.

### UI structure

- Back button → `/dashboard`.
- **Quick-total cards row** (4 cards): Hoy, Esta semana, Este mes, Este año.
- **Filter row**: period `<Select>`, year `<Select>`, month `<Select>` (only when period is `daily`).
- **Breakdown table**: two columns — period label and total. Empty state if no data.

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
