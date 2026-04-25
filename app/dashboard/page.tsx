import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { User, Scissors, DollarSign, Users } from 'lucide-react'

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
        <header className="mb-8 flex items-center justify-between">
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

        <div className="grid gap-6 md:grid-cols-3">
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
                Ver cortes
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
              <Link href="/dashboard/cuts/new" className="text-sm text-primary hover:underline">
                Registrar corte
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
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Empezando</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Tu panel esta listo. Proximos pasos:
            </p>
            <ul className="mt-4 list-inside list-disc text-muted-foreground">
              <li>
                <Link href="/dashboard/profile" className="text-primary underline underline-offset-4 hover:text-primary/80">
                  Configura tu perfil de barbero
                </Link>
              </li>
              <li>
                <Link href="/dashboard/clients" className="text-primary underline underline-offset-4 hover:text-primary/80">
                  Agrega y administra clientes
                </Link>
              </li>
              <li>
                <Link href="/dashboard/cuts" className="text-primary underline underline-offset-4 hover:text-primary/80">
                  Registra cortes y rastrea ingresos
                </Link>
              </li>
              <li>Consulta reportes y estadisticas</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
