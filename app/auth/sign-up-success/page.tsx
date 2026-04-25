import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Revisa tu correo</CardTitle>
            <CardDescription>
              Te hemos enviado un enlace de confirmacion
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Haz clic en el enlace de tu correo para confirmar tu cuenta y
              comenzar a usar CutMetrics. Una vez confirmado, puedes{' '}
              <Link
                href="/auth/login"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                iniciar sesion
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
