import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-destructive">Error de autenticacion</CardTitle>
          <CardDescription>
            Algo salio mal durante la autenticacion. Por favor intenta de nuevo.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link href="/auth/login">Volver al inicio de sesion</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
