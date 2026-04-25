# Plan — Phase 9: Mobile experience

## 1. Bottom navigation bar

### `components/dashboard/bottom-nav.tsx`

`'use client'` component that reads the current pathname to set the active tab.

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Scissors, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Inicio',    href: '/dashboard',         icon: Home },
  { label: 'Clientes',  href: '/dashboard/clients',  icon: Users },
  { label: 'Cortes',    href: '/dashboard/cuts',     icon: Scissors },
  { label: 'Ingresos',  href: '/dashboard/income',   icon: BarChart2 },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
      <ul className="flex h-14 items-stretch">
        {tabs.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <li key={href} className="flex flex-1">
              <Link
                href={href}
                className={cn(
                  'flex flex-1 flex-col items-center justify-center gap-0.5 text-xs min-h-[44px]',
                  active ? 'text-primary font-semibold' : 'text-muted-foreground'
                )}
              >
                <Icon size={22} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
```

### Update `app/dashboard/layout.tsx`

- Import and render `<BottomNav />`.
- Add `pb-20` to `<main>` so content clears the nav bar.

```tsx
import { BottomNav } from '@/components/dashboard/bottom-nav'

export default function DashboardLayout({ children }) {
  return (
    <>
      <main className="pb-20">{children}</main>
      <BottomNav />
    </>
  )
}
```

## 2. Pull-to-refresh component

### `components/ui/pull-to-refresh.tsx`

```tsx
'use client'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

const THRESHOLD = 60

export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const startY = useRef(0)
  const [pulling, setPulling] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  function onTouchStart(e: React.TouchEvent) {
    if (window.scrollY === 0) startY.current = e.touches[0].clientY
  }

  function onTouchMove(e: React.TouchEvent) {
    const delta = e.touches[0].clientY - startY.current
    if (delta > THRESHOLD && window.scrollY === 0) setPulling(true)
  }

  async function onTouchEnd() {
    if (!pulling) return
    setPulling(false)
    setRefreshing(true)
    router.refresh()
    await new Promise(r => setTimeout(r, 800))
    setRefreshing(false)
  }

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      {(pulling || refreshing) && (
        <div className="flex justify-center py-3">
          <Loader2 className="animate-spin text-muted-foreground" size={20} />
        </div>
      )}
      {children}
    </div>
  )
}
```

Wrap the list body in `/dashboard/clients/page.tsx`, `/dashboard/cuts/page.tsx`, and `/dashboard/income/page.tsx`.

## 3. Loading skeletons

Create `loading.tsx` in each route segment using `<Skeleton>` from `components/ui/skeleton`.

### `app/dashboard/loading.tsx`
```tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
      <Skeleton className="h-48 rounded-xl" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
      </div>
    </div>
  )
}
```

### `app/dashboard/clients/loading.tsx`
```tsx
export default function Loading() {
  return (
    <div className="p-4 space-y-2">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
    </div>
  )
}
```

Repeat the same pattern for `cuts/loading.tsx` and `income/loading.tsx`.

## 4. Form keyboard attributes

Patch each form file to add the correct `type`, `inputMode`, and `autoCapitalize` attributes:

| File | Field | Change |
|---|---|---|
| `app/dashboard/clients/new/page.tsx` | name | add `autoCapitalize="words"` |
| `app/dashboard/clients/new/page.tsx` | phone | change `type` to `"tel"` |
| `app/dashboard/cuts/new/page.tsx` | price | keep `type="text"`, add `inputMode="decimal"` |
| `app/auth/login/page.tsx` | email | add `autoComplete="email"` |
| `app/auth/login/page.tsx` | password | add `autoComplete="current-password"` |
| `app/auth/signup/page.tsx` | password (new) | add `autoComplete="new-password"` |

Ensure all `<input>` elements have `className` that includes `text-base` (font-size 16 px minimum).

## 5. Touch target audit

Search for `<button` and `<Link` elements that lack `min-h-[44px]` or have only icon content.

Common fixes:
- Shadcn `<Button size="icon">` → add `className="min-h-[44px] min-w-[44px]"`.
- Table action buttons (edit / delete) → wrap icon in `<button className="p-3">`.
- Navigation links in headers → ensure `py-3` gives enough tap area.

## 6. Spacing audit on narrow viewport

Test each page at 375 px width. Fix any of these:
- `p-2` on cards → bump to `p-4`.
- List rows shorter than `min-h-[56px]` → add `min-h-[56px]`.
- Text smaller than `text-sm` for body content → bump to `text-sm`.

## 7. Commit

```
feat: improve mobile experience — bottom nav, pull-to-refresh, skeletons, form keyboards
```
