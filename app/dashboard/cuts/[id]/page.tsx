'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { ArrowLeft, Scissors, Trash2 } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { toLocalDateStr, toLocalTimeStr } from '@/lib/dates'

type Client = {
  id: string
  name: string
}

type Cut = {
  id: string
  date: string
  price: number
  duration: number | null
  notes: string | null
  client_id: string | null
}

function formatCOP(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  return parseInt(digits, 10).toLocaleString('es-CO')
}

export default function CutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [cut, setCut] = useState<Cut | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [clientId, setClientId] = useState<string>('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const [cutResult, clientsResult] = await Promise.all([
        supabase.from('cuts').select('*').eq('id', id).single(),
        supabase.from('clients').select('id, name').order('name')
      ])

      if (cutResult.data) {
        const cutData = cutResult.data
        setCut(cutData)
        setClientId(cutData.client_id || '')
        const cutDate = new Date(cutData.date)
        setDate(toLocalDateStr(cutDate))
        setTime(toLocalTimeStr(cutDate))
        setPrice(formatCOP(String(Math.round(cutData.price))))
        setDuration(cutData.duration?.toString() || '')
        setNotes(cutData.notes || '')
      }

      setClients(clientsResult.data || [])
      setLoading(false)
    }

    fetchData()
  }, [id, supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (!price) {
      setError('El precio es requerido')
      setSaving(false)
      return
    }

    const dateTime = new Date(`${date}T${time}`)

    const { error: updateError } = await supabase
      .from('cuts')
      .update({
        client_id: clientId || null,
        date: dateTime.toISOString(),
        price: parseInt(price.replace(/\./g, ''), 10),
        duration: duration ? parseInt(duration) : null,
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    router.push('/dashboard/cuts')
  }

  async function handleDelete() {
    setDeleting(true)
    
    const { error: deleteError } = await supabase
      .from('cuts')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      setDeleting(false)
      return
    }

    router.push('/dashboard/cuts')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando corte...</p>
      </div>
    )
  }

  if (!cut) {
    return (
      <main className="min-h-screen bg-background p-4 md:p-8">
        <div className="mx-auto max-w-md text-center">
          <h1 className="mb-4 text-2xl font-bold">Corte no encontrado</h1>
          <Link href="/dashboard/cuts">
            <Button>Volver a cortes</Button>
          </Link>
        </div>
      </main>
    )
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
          <h1 className="text-2xl font-bold">Editar Corte</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Scissors className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Detalles del corte</CardTitle>
                  <CardDescription>Actualiza la informacion</CardDescription>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar corte</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta accion no se puede deshacer. El corte sera eliminado permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleting ? 'Eliminando...' : 'Eliminar'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
                      inputMode="numeric"
                      placeholder="10.000"
                      value={price}
                      onChange={(e) => setPrice(formatCOP(e.target.value))}
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

                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? <Spinner className="mr-2" /> : null}
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
