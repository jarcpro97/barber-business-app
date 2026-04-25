# Requirements — Phase 7: Income Tracking

## Scope

Give barbers a clear view of their earnings aggregated by day, week, month, and year, with quick-total cards and a filterable breakdown table.

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Data source | `cuts` table (date + price columns) | No separate income table needed; cuts are the source of truth |
| Aggregation | Client-side (JavaScript grouping) | Avoids Supabase RPC/functions; dataset per barber is small |
| Periods | Daily, weekly, monthly, yearly | Covers all common reporting needs |
| Filters | Year picker always visible; month picker shown for daily view | Narrows the dataset to a manageable range |
| Currency | Formateador manual COP: `'$ ' + Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')` | `Intl.NumberFormat` es inconsistente entre SSR (Node.js ICU parcial) y el browser; el formateador manual siempre produce `$ 15.000` |

## Quick totals

Four summary cards always visible:

| Card | Calculation |
|---|---|
| Hoy | Sum of cuts with `date >= start of today` |
| Esta semana | Sum of cuts with `date >= start of current week (Sunday)` |
| Este mes | Sum of cuts in the selected year/month |
| Este año | Sum of all cuts in the selected year |

## Breakdown table

Rows depend on the selected period:
- **Daily** — one row per day in the selected month/year.
- **Weekly** — one row per week-start date in the selected year.
- **Monthly** — one row per month in the selected year.
- **Yearly** — one row per year present in the data.

## Page produced

| Route | Purpose |
|---|---|
| `/dashboard/income` | Quick totals + period filter + breakdown table |

## Out of scope

- CSV / PDF export (Phase 9).
- Chart visualization (Phase 8).
