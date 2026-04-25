"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function NewClientForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    notes: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!form.name.trim()) {
      setError("El nombre es obligatorio")
      setLoading(false)
      return
    }

    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError("Debes iniciar sesión")
      setLoading(false)
      return
    }

    const { data: newClient, error: insertError } = await supabase
      .from("clients")
      .insert({
        barber_id: user.id,
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        notes: form.notes.trim() || null,
      })
      .select("id")
      .single()

    if (insertError) {
      setError("Error al crear el cliente: " + insertError.message)
      setLoading(false)
      return
    }

    const returnTo = searchParams.get("returnTo")
    if (returnTo && newClient) {
      router.push(`${returnTo}?clientId=${newClient.id}`)
    } else {
      router.push("/dashboard/clients")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Link href="/dashboard/clients">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nuevo Cliente</h1>
            <p className="text-sm text-muted-foreground">Agrega un nuevo cliente a tu lista</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
            <CardDescription>
              Ingresa los datos de tu nuevo cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
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

                <div className="flex gap-3">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Guardando..." : "Guardar Cliente"}
                  </Button>
                  <Link href={searchParams.get("returnTo") ?? "/dashboard/clients"}>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function NewClientPage() {
  return (
    <Suspense>
      <NewClientForm />
    </Suspense>
  )
}
