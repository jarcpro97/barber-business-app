import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If already logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-svh items-center justify-center">
      <main className="flex w-full max-w-md flex-col items-center gap-8 px-6 py-16 text-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">
            CutMetrics
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your cuts, grow your business.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button asChild size="lg">
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/sign-up">Create account</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
