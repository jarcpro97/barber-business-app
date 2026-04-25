"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Trash2, Phone, Calendar } from "lucide-react"
import Link from "next/link"

type Client = {
  id: string
  name: string
  phone: string | null
  notes: string | null
  created_at: string
}

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    notes: "",
  })

  useEffect(() => {
    async function loadClient() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", params.id)
        .single()

      if (!error && data) {
        setClient(data)
        setForm({
          name: data.name,
          phone: data.phone || "",
          notes: data.notes || "",
        })
      }
      setLoading(false)
    }

    loadClient()
  }, [params.id])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    if (!form.name.trim()) {
      setError("El nombre es obligatorio")
      setSaving(false)
      return
    }

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from("clients")
      .update({
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        notes: form.notes.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (updateError) {
      setError("Error al actualizar: " + updateError.message)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  async function handleDelete() {
    setDeleting(true)
    const supabase = createClient()
    const { error: deleteError } = await supabase
      .from("clients")
      .delete()
      .eq("id", params.id)

    if (!deleteError) {
      router.push("/dashboard/clients")
    } else {
      setError("Error al eliminar: " + deleteError.message)
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <p className="mb-4 text-lg text-foreground">Cliente no encontrado</p>
        <Link href="/dashboard/clients">
          <Button>Volver a Clientes</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/clients">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Cliente desde {new Date(client.created_at).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente a {client.name} y todos sus datos asociados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Eliminando..." : "Eliminar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>Editar Cliente</CardTitle>
            <CardDescription>
              Actualiza la información de tu cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nombre *</FieldLabel>
                  <Input
                    id="name"
                    placeholder="Juan Pérez"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+52 555 123 4567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="notes">Notas</FieldLabel>
                  <Textarea
                    id="notes"
                    placeholder="Preferencias, tipo de corte favorito, etc."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                  />
                </Field>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                {success && (
                  <p className="text-sm text-green-600">¡Cliente actualizado correctamente!</p>
                )}

                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
