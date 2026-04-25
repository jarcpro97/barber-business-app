# Requirements — Phase 9: Mobile experience

## Scope

Audit and improve every page so the app feels native on a 375 px mobile screen.
This phase touches layout, navigation, forms, and perceived performance — no new data features.

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Bottom nav | Fixed `<nav>` in `app/dashboard/layout.tsx` | Single place; all dashboard routes inherit it automatically |
| Active state | `usePathname()` in a `'use client'` wrapper | Server layout cannot read the current URL |
| Pull-to-refresh | Client component with `touchstart`/`touchmove`/`touchend` events calling `router.refresh()` | No third-party library; works with Next.js App Router cache invalidation |
| Loading skeletons | `loading.tsx` files per route segment + `<Skeleton>` from shadcn/ui | Zero-config suspense boundary; consistent with existing shadcn setup |
| iOS zoom prevention | `font-size: 16px` minimum on all `<input>` and `<textarea>` via Tailwind `text-base` | iOS Safari zooms in when focus target font-size < 16 px |
| Touch targets | `min-h-[44px] min-w-[44px]` on all interactive elements via Tailwind | Apple HIG and WCAG 2.5.5 minimum tap target size |
| Hover-only interactions | Replace with `active:` / `focus-visible:` Tailwind variants | Hover does not fire reliably on touch screens |

## Bottom navigation bar

A full-width fixed bar pinned to the bottom of the viewport, always visible inside `/dashboard/**`.

| Tab | Icon | Route |
|---|---|---|
| Inicio | Home | `/dashboard` |
| Clientes | Users | `/dashboard/clients` |
| Cortes | Scissors | `/dashboard/cuts` |
| Ingresos | BarChart2 | `/dashboard/income` |

- Active tab: primary color icon + label, `font-semibold`.
- Inactive tab: muted icon + label.
- Tab area: `min-h-[56px]`, icons `24px`, labels `text-xs`.
- The dashboard layout adds `pb-20` to the main content area so content is never hidden under the bar.

## Touch targets

Every `<button>`, `<a>`, and form control must meet `min-height: 44px` and `min-width: 44px`.
Small icon-only buttons (e.g. delete, edit) gain invisible padding via `p-3` or a wrapping `<span>` to reach the minimum without changing visual size.

## Form keyboard optimization

| Field | `type` / `inputMode` | Extra attribute |
|---|---|---|
| Client name | `text` | `autoCapitalize="words"` |
| Phone | `tel` | — |
| Price (COP) | `text` + `inputMode="decimal"` | `pattern="[0-9]*"` |
| Notes / textarea | `text` | `autoComplete="off"` |
| Email (auth) | `email` | `autoComplete="email"` |
| Password (auth) | `password` | `autoComplete="current-password"` |

All `<input>` and `<textarea>` elements use `text-base` (16 px) or larger to prevent iOS auto-zoom on focus.

## Pull-to-refresh

Client component `<PullToRefresh>` wraps the scrollable content of list pages:

- Trigger: user drags down ≥ 60 px from scroll position 0.
- Visual: a spinner appears at the top during the refresh.
- Action: calls `router.refresh()` to revalidate the Server Component data.
- Applied to: `/dashboard/clients`, `/dashboard/cuts`, `/dashboard/income`.

## Loading skeletons

Each route segment gets a `loading.tsx` that mirrors the page layout using `<Skeleton>` blocks:

| Route | Skeleton elements |
|---|---|
| `/dashboard` | 4 metric cards + chart placeholder + 3 client rows |
| `/dashboard/clients` | Table header + 5 row placeholders |
| `/dashboard/cuts` | Table header + 5 row placeholders |
| `/dashboard/income` | Summary cards + filter bar + table rows |

## Spacing and typography audit

- Minimum body font size: `text-sm` (14 px) for secondary text, `text-base` (16 px) for primary text and inputs.
- Card padding: `p-4` minimum; no `p-2` on main content cards.
- List row height: `min-h-[56px]` so rows are easy to tap.
- Horizontal page padding: `px-4` on all pages (already `container` but confirmed at narrow widths).

## Out of scope

- Offline support / service workers (future phase).
- Push notifications.
- Native app packaging (PWA manifest already added in scaffold).
