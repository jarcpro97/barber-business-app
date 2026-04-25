'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Plus, Scissors, Search, Calendar } from 'lucide-react'

type Cut = {
  id: string
  date: string
  price: number
  duration: number | null
  notes: string | null
  client: {
    id: string
    name: string
  } | null
}

export default function CutsPage() {
  const [cuts, setCuts] = useState<Cut[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function fetchCuts() {
      const { data } = await supabase
        .from('cuts')
        .select(`
          id,
          date,
          price,
          duration,
          notes,
          client:clients(id, name)
        `)
        .order('date', { ascending: false })

      setCuts(data || [])
      setLoading(false)
    }

    fetchCuts()
  }, [supabase])

  const filteredCuts = cuts.filter(cut => {
    const searchLower = search.toLowerCase()
    const clientName = cut.client?.name?.toLowerCase() || ''
    const dateStr = new Date(cut.date).toLocaleDateString('es-ES')
    return clientName.includes(searchLower) || dateStr.includes(search)
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando cortes...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Mis Cortes</h1>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente o fecha..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Link href="/dashboard/cuts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Registrar corte
            </Button>
          </Link>
        </div>

        {filteredCuts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Scissors className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-2 text-lg font-medium">No hay cortes registrados</p>
              <p className="mb-4 text-sm text-muted-foreground">
                {search ? 'No se encontraron cortes con esa busqueda' : 'Registra tu primer corte para comenzar'}
              </p>
              {!search && (
                <Link href="/dashboard/cuts/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar corte
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredCuts.map((cut) => (
              <Link key={cut.id} href={`/dashboard/cuts/${cut.id}`}>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Scissors className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {cut.client?.name || 'Cliente no especificado'}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(cut.date)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{formatPrice(cut.price)}</p>
                      {cut.duration && (
                        <p className="text-sm text-muted-foreground">{cut.duration} min</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {filteredCuts.length > 0 && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {filteredCuts.length} {filteredCuts.length === 1 ? 'corte' : 'cortes'} encontrados
          </div>
        )}
      </div>
    </main>
  )
}
