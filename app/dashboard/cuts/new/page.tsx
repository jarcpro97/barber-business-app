'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { ArrowLeft, Scissors, Plus } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { toLocalDateStr, toLocalTimeStr } from '@/lib/dates'

type Client = {
  id: string
  name: string
}

function formatCOP(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  return parseInt(digits, 10).toLocaleString('es-CO')
}

function NewCutForm() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const now = new Date()
    setDate(toLocalDateStr(now))
    setTime(toLocalTimeStr(now))

    async function fetchClients() {
      const { data } = await supabase
        .from('clients')
        .select('id, name')
        .order('name')

      const list = data || []
      setClients(list)

      const preselect = searchParams.get('clientId')
      if (preselect) {
        const found = list.find(c => c.id === preselect)
        if (found) {
          setSelectedClient(found)
          setSearch(found.name)
        }
      }
    }

    fetchClients()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!price) {
      setError('El precio es requerido')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Debes iniciar sesión')
      setLoading(false)
      return
    }

    const dateTime = new Date(`${date}T${time}`)

    const { error: insertError } = await supabase
      .from('cuts')
      .insert({
        barber_id: user.id,
        client_id: selectedClient?.id || null,
        date: dateTime.toISOString(),
        price: parseInt(price.replace(/\./g, ''), 10),
        duration: duration ? parseInt(duration) : null,
        notes: notes || null,
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard/cuts')
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/dashboard/cuts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Registrar Corte</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Scissors className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Nuevo corte</CardTitle>
                <CardDescription>Registra los detalles del corte</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Cliente (opcional)</FieldLabel>
                  <div className="relative" ref={pickerRef}>
                    <Input
                      placeholder="Buscar cliente..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value)
                        setSelectedClient(null)
                        setOpen(true)
                      }}
                      onFocus={() => setOpen(true)}
                      autoComplete="off"
                    />
                    {open && (
                      <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
                        {filtered.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent"
                            onClick={() => {
                              setSelectedClient(c)
                              setSearch(c.name)
                              setOpen(false)
                            }}
                          >
                            {c.name}
                          </button>
                        ))}
                        {filtered.length > 0 && <div className="border-t" />}
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-primary"
                          onClick={() =>
                            router.push('/dashboard/clients/new?returnTo=/dashboard/cuts/new')
                          }
                        >
                          <Plus className="h-4 w-4" />
                          {search ? `Agregar "${search}"` : 'Agregar cliente'}
                        </button>
                      </div>
                    )}
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Fecha</FieldLabel>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Hora</FieldLabel>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Precio (COP)</FieldLabel>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="10.000"
                      value={price}
                      onChange={(e) => setPrice(formatCOP(e.target.value))}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Duración (min)</FieldLabel>
                    <Input
                      type="number"
                      min="0"
                      placeholder="30"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel>Notas (opcional)</FieldLabel>
                  <Textarea
                    placeholder="Detalles del corte..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </Field>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Spinner className="mr-2" /> : null}
                  {loading ? 'Guardando...' : 'Registrar corte'}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default function NewCutPage() {
  return (
    <Suspense>
      <NewCutForm />
    </Suspense>
  )
}
