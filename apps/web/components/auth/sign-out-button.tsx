"use client"

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out',
      })
      router.push('/auth/login')
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      })
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start">
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  )
}

export default SignOutButton
