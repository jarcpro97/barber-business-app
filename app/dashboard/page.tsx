import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { User, Scissors, DollarSign, Users, Plus, TrendingUp } from 'lucide-react'

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: clientCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  // Cortes de hoy
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const { count: todayCutsCount } = await supabase
    .from('cuts')
    .select('*', { count: 'exact', head: true })
    .gte('date', today.toISOString())
    .lt('date', tomorrow.toISOString())

  // Ingresos del mes
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59)

  const { data: monthCuts } = await supabase
    .from('cuts')
    .select('price')
    .gte('date', firstDayOfMonth.toISOString())
    .lte('date', lastDayOfMonth.toISOString())

  const monthIncome = monthCuts?.reduce((sum, cut) => sum + Number(cut.price), 0) || 0

  return (
    <div className="min-h-svh bg-muted/30 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel</h1>
            <p className="text-muted-foreground">
              Bienvenido, {profile?.name || user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </Link>
            </Button>
            <form action={signOut}>
              <Button variant="ghost" type="submit">
                Cerrar sesion
              </Button>
            </form>
          </div>
        </header>

        {/* Acciones rapidas */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Button size="lg" className="h-auto py-6" asChild>
            <Link href="/dashboard/cuts/new" className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/20">
                <Scissors className="h-6 w-6" />
              </div>
              <div className="text-center">
                <span className="text-lg font-semibold">Registrar Corte</span>
                <p className="text-sm text-primary-foreground/80">Agrega un nuevo corte</p>
              </div>
            </Link>
          </Button>

          <Button size="lg" variant="secondary" className="h-auto py-6" asChild>
            <Link href="/dashboard/clients/new" className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-foreground/10">
                <Plus className="h-6 w-6" />
              </div>
              <div className="text-center">
                <span className="text-lg font-semibold">Agregar Cliente</span>
                <p className="text-sm text-muted-foreground">Registra un nuevo cliente</p>
              </div>
            </Link>
          </Button>
        </div>

        {/* Metricas */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cortes de hoy
              </CardTitle>
              <Scissors className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{todayCutsCount || 0}</p>
              <Link href="/dashboard/cuts" className="text-sm text-primary hover:underline">
                Ver todos los cortes
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ingresos del mes
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monthIncome)}
              </p>
              <Link href="/dashboard/income" className="text-sm text-primary hover:underline">
                Ver ingresos
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de clientes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{clientCount || 0}</p>
              <Link href="/dashboard/clients" className="text-sm text-primary hover:underline">
                Ver clientes
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reportes
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium text-muted-foreground">Analiza tu negocio</p>
              <Link href="/dashboard/income" className="text-sm text-primary hover:underline">
                Ver reportes
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Navegacion rapida */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Navegacion rapida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/cuts">
                  <Scissors className="mr-2 h-4 w-4" />
                  Historial de cortes
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/clients">
                  <Users className="mr-2 h-4 w-4" />
                  Lista de clientes
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/income">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Ingresos
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Mi perfil
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
