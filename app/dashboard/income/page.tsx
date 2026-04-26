"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, TrendingUp, Calendar, DollarSign } from "lucide-react"
import { toLocalDateStr, parseLocalDate } from "@/lib/dates"

type IncomeSummary = {
  daily: { date: string; total: number }[]
  weekly: { week: string; total: number }[]
  monthly: { month: string; total: number }[]
  yearly: { year: string; total: number }[]
}

export default function IncomePage() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly")
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<IncomeSummary>({
    daily: [],
    weekly: [],
    monthly: [],
    yearly: []
  })
  const [totals, setTotals] = useState({
    today: 0,
    week: 0,
    month: 0,
    year: 0
  })

  useEffect(() => {
    loadIncome()
  }, [year, month])

  async function loadIncome() {
    setLoading(true)
    const supabase = createClient()

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(startOfToday)
    startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() + 6) % 7)
    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59)
    const startOfYear = new Date(year, 0, 1)
    const endOfYear = new Date(year, 11, 31, 23, 59, 59)

    // Obtener todos los cortes del año seleccionado
    const { data: cuts } = await supabase
      .from("cuts")
      .select("date, price")
      .gte("date", startOfYear.toISOString())
      .lte("date", endOfYear.toISOString())
      .order("date", { ascending: true })

    if (cuts) {
      // Calcular totales
      const todayTotal = cuts
        .filter(c => new Date(c.date) >= startOfToday)
        .reduce((sum, c) => sum + Number(c.price), 0)

      const weekTotal = cuts
        .filter(c => new Date(c.date) >= startOfWeek)
        .reduce((sum, c) => sum + Number(c.price), 0)

      const monthTotal = cuts
        .filter(c => {
          const d = new Date(c.date)
          return d >= startOfMonth && d <= endOfMonth
        })
        .reduce((sum, c) => sum + Number(c.price), 0)

      const yearTotal = cuts.reduce((sum, c) => sum + Number(c.price), 0)

      setTotals({ today: todayTotal, week: weekTotal, month: monthTotal, year: yearTotal })

      // Agrupar por dia
      const dailyMap = new Map<string, number>()
      cuts.forEach(cut => {
        const date = toLocalDateStr(new Date(cut.date))
        dailyMap.set(date, (dailyMap.get(date) || 0) + Number(cut.price))
      })
      const daily = Array.from(dailyMap.entries()).map(([date, total]) => ({ date, total }))

      // Agrupar por semana
      const weeklyMap = new Map<string, number>()
      cuts.forEach(cut => {
        const d = new Date(cut.date)
        const weekStart = new Date(d)
        weekStart.setDate(d.getDate() - (d.getDay() + 6) % 7)
        const week = toLocalDateStr(weekStart)
        weeklyMap.set(week, (weeklyMap.get(week) || 0) + Number(cut.price))
      })
      const weekly = Array.from(weeklyMap.entries()).map(([week, total]) => ({ week, total }))

      // Agrupar por mes
      const monthlyMap = new Map<string, number>()
      cuts.forEach(cut => {
        const d = new Date(cut.date)
        const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        monthlyMap.set(month, (monthlyMap.get(month) || 0) + Number(cut.price))
      })
      const monthly = Array.from(monthlyMap.entries()).map(([month, total]) => ({ month, total }))

      // Agrupar por año
      const yearlyMap = new Map<string, number>()
      cuts.forEach(cut => {
        const year = new Date(cut.date).getFullYear().toString()
        yearlyMap.set(year, (yearlyMap.get(year) || 0) + Number(cut.price))
      })
      const yearly = Array.from(yearlyMap.entries()).map(([year, total]) => ({ year, total }))

      setSummary({ daily, weekly, monthly, yearly })
    }

    setLoading(false)
  }

  const formatCurrency = (value: number): string =>
    '$ ' + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-svh bg-muted/30 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al panel
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Ingresos</h1>
          <p className="text-muted-foreground">
            Resumen de tus ingresos por periodo
          </p>
        </header>

        {/* Totales rapidos */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Hoy</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totals.today)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Esta semana</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totals.week)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Este mes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totals.month)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Este año</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totals.year)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtrar por periodo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Periodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diario</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>

              <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(y => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {period === "daily" && (
                <Select value={month.toString()} onValueChange={(v) => setMonth(parseInt(v))}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((name, i) => (
                      <SelectItem key={i} value={i.toString()}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabla de resultados */}
        <Card>
          <CardHeader>
            <CardTitle>
              {period === "daily" && "Ingresos diarios"}
              {period === "weekly" && "Ingresos semanales"}
              {period === "monthly" && "Ingresos mensuales"}
              {period === "yearly" && "Ingresos anuales"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Cargando...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-3 text-left font-medium text-muted-foreground">Periodo</th>
                      <th className="pb-3 text-right font-medium text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {period === "daily" && summary.daily
                      .filter(d => {
                        const [y, m] = d.date.split('-').map(Number)
                        return (m - 1) === month && y === year
                      })
                      .map((item, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-3">
                            {parseLocalDate(item.date).toLocaleDateString("es-CO", {
                              weekday: "long",
                              day: "numeric",
                              month: "long"
                            })}
                          </td>
                          <td className="py-3 text-right font-medium">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}

                    {period === "weekly" && summary.weekly
                      .filter(w => parseInt(w.week.split('-')[0]) === year)
                      .map((item, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-3">
                            Semana del {parseLocalDate(item.week).toLocaleDateString("es-CO", {
                              day: "numeric",
                              month: "long"
                            })}
                          </td>
                          <td className="py-3 text-right font-medium">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}

                    {period === "monthly" && summary.monthly
                      .filter(m => m.month.startsWith(year.toString()))
                      .map((item, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-3">
                            {monthNames[parseInt(item.month.split("-")[1]) - 1]} {item.month.split("-")[0]}
                          </td>
                          <td className="py-3 text-right font-medium">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}

                    {period === "yearly" && summary.yearly.map((item, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-3">{item.year}</td>
                        <td className="py-3 text-right font-medium">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}

                    {((period === "daily" && summary.daily.filter(d => {
                      const [y, m] = d.date.split('-').map(Number)
                      return (m - 1) === month && y === year
                    }).length === 0) ||
                      (period === "weekly" && summary.weekly.filter(w => parseInt(w.week.split('-')[0]) === year).length === 0) ||
                      (period === "monthly" && summary.monthly.filter(m => m.month.startsWith(year.toString())).length === 0) ||
                      (period === "yearly" && summary.yearly.length === 0)) && (
                      <tr>
                        <td colSpan={2} className="py-8 text-center text-muted-foreground">
                          No hay datos para este periodo
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
