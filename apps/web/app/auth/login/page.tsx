// apps/web/app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Github, Mail, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  // apps/web/app/auth/login/page.tsx
  'use client'

  import { useState } from 'react'
  import { useRouter } from 'next/navigation'
  import { createClient } from '@/lib/supabase/client'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
  import { Label } from '@/components/ui/label'
  import { Github, Mail, Loader2 } from 'lucide-react'
  import { toast } from '@/components/ui/use-toast'

  export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleEmailLogin = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          })
          return
        }

        if (data.user) {
          toast({
            title: 'Success',
            description: 'Logged in successfully!',
          })
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Login error:', error)
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    const handleGithubLogin = async () => {
      setIsLoading(true)
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error
      } catch (error) {
        console.error('OAuth error:', error)
        toast({
          title: 'Error',
          description: 'Failed to login with GitHub',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    const handleSignUp = async () => {
      setIsLoading(true)
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error

        toast({
          title: 'Check your email',
          description: 'We sent you a confirmation link',
        })
      } catch (error) {
        console.error('Signup error:', error)
        toast({
          title: 'Error',
          description: 'Failed to sign up',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Plane Clone</CardTitle>
            <CardDescription>
              Enter your credentials to access your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleGithubLogin}
                disabled={isLoading}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>

            <div className="mt-6 text-center space-y-2">
              <Button 
                variant="link" 
                onClick={handleSignUp}
                disabled={isLoading}
              >
                Don't have an account? Sign up
              </Button>
              <p className="text-xs text-gray-500">
                For testing, use: test@example.com / password
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Plane Clone</CardTitle>
          <CardDescription>
            Enter your credentials to access your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button 
              variant="outline" 
              type="button" 
              onClick={handleGithubLogin}
              disabled={isLoading}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          <div className="mt-6 text-center space-y-2">
            <Button 
              variant="link" 
              onClick={handleSignUp}
              disabled={isLoading}
            >
              Don't have an account? Sign up
            </Button>
            <p className="text-xs text-gray-500">
              For testing, use: test@example.com / password
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}