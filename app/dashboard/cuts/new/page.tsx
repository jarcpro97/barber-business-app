'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { ArrowLeft, Scissors } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

type Client = {
  id: string
  name: string
}

export default function NewCutPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [clientId, setClientId] = useState<string>('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Set default date and time to now
    const now = new Date()
    setDate(now.toISOString().split('T')[0])
    setTime(now.toTimeString().slice(0, 5))

    async function fetchClients() {
      const { data } = await supabase
        .from('clients')
        .select('id, name')
        .order('name')

      setClients(data || [])
    }

    fetchClients()
  }, [supabase])

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
      setError('Debes iniciar sesion')
      setLoading(false)
      return
    }

    const dateTime = new Date(`${date}T${time}`)

    const { error: insertError } = await supabase
      .from('cuts')
      .insert({
        barber_id: user.id,
        client_id: clientId || null,
        date: dateTime.toISOString(),
        price: parseFloat(price),
        duration: duration ? parseInt(duration) : null,
        notes: notes || null
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
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {clients.length === 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      <Link href="/dashboard/clients/new" className="text-primary underline">
                        Agregar cliente
                      </Link>
                    </p>
                  )}
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
                    <FieldLabel>Precio (MXN)</FieldLabel>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="150.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Duracion (min)</FieldLabel>
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
