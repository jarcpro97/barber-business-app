'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Profile {
  id: string
  name: string | null
  shop_name: string | null
  avatar_url: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState('')
  const [shopName, setShopName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data)
        setName(data.name || '')
        setShopName(data.shop_name || '')
      }
      setIsLoading(false)
    }

    loadProfile()
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsSaving(true)
    setMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name,
          shop_name: shopName,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      setMessage({ type: 'success', text: 'Perfil guardado correctamente' })
    } catch (error: unknown) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Error al guardar' 
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-muted/30 p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al panel
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Tu perfil</CardTitle>
            <CardDescription>
              Administra tu informacion de barbero
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave}>
              <FieldGroup>
                <div className="flex justify-center mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <Field>
                  <FieldLabel htmlFor="name">Tu nombre</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Perez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="shop-name">Nombre de tu barberia</FieldLabel>
                  <Input
                    id="shop-name"
                    type="text"
                    placeholder="Barberia El Corte"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                  />
                </Field>

                {message && (
                  <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-destructive'}`}>
                    {message.text}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? <Spinner className="mr-2" /> : null}
                  {isSaving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
