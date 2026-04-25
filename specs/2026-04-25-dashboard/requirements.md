# Requirements — Phase 8: Dashboard

## Scope

Build the main dashboard page (`/dashboard`) that gives the barber an at-a-glance view of their business, fast access to the most common actions, a top-clients ranking, and a daily revenue bar chart.

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Rendering | Server Component + one `'use client'` chart component | Metrics fetched server-side; Recharts requires the DOM so the chart is isolated in a client component |
| Chart library | Recharts via the existing `components/ui/chart.tsx` (shadcn wrapper) | Already installed; no new dependency |
| Chart data | Last 30 days of daily revenue totals | Enough history to show a trend without overcrowding the bars |
| Top clients | Top 3 by total number of cuts | Simple and meaningful for a barber; no extra aggregation table needed |
| Sign-out | Server Action | Keeps auth logic on the server; no API route needed |
| Metrics queries | Parallel Supabase queries in the Server Component | Single page load, no client round-trips |
| Quick actions | Two large buttons (Register Cut, Add Client) | Most frequent operations for a barber |

## Metrics displayed

| Metric | Source |
|---|---|
| Cortes de hoy | Count of `cuts` where `date` is within today's UTC range |
| Ingresos del mes | Sum of `cuts.price` for the current calendar month |
| Total de clientes | Count of all `clients` rows |
| Reportes (link) | Static card linking to `/dashboard/income` |

## Top clients

A ranked list of the 3 clients with the most cuts logged. Each entry shows the client's name and cut count. Links to `/dashboard/clients`.

Query approach: fetch `cuts` with the `client` join for the last 90 days, group by `client_id` client-side, sort descending, take top 3.

## Daily revenue bar chart

A bar chart showing total income per day for the **last 30 days**.

- X axis: day label (`dd/MM`).
- Y axis: income in MXN.
- Days with no cuts render as $0 bars (explicit zero fill).
- Implemented in `components/dashboard/revenue-chart.tsx` as a `'use client'` component using `BarChart` from Recharts via `components/ui/chart.tsx`.
- Data is computed in the Server Component and passed as a prop.

## Quick actions

Two large call-to-action buttons:
1. **Registrar Corte** → `/dashboard/cuts/new`
2. **Agregar Cliente** → `/dashboard/clients/new`

## Quick navigation

A row of four outline buttons:
- Historial de cortes → `/dashboard/cuts`
- Lista de clientes → `/dashboard/clients`
- Ingresos → `/dashboard/income`
- Mi perfil → `/dashboard/profile`

## Header

- Greeting: "Bienvenido, {profile.name || user.email}".
- Profile button (icon + label) → `/dashboard/profile`.
- Sign-out button (Server Action).

## Out of scope

- Printable / exportable reports (Phase 9).
- Public barber profile page (Phase 10).
