// apps/web/components/workspace/create-workspace-modal.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ensureUserExists } from '@/lib/supabase/helpers'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface CreateWorkspaceModalProps {
  trigger?: React.ReactNode
}

export function CreateWorkspaceModal({ trigger }: CreateWorkspaceModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
  })
  const router = useRouter()
  const supabase = createClient()

  const generateSlug = (name: string) => {
    // Remove acentos
    const withoutAccents = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    
    const slug = withoutAccents
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais exceto hífens
      .replace(/\s+/g, '-')     // Substitui espaços por hífens
      .replace(/-+/g, '-')      // Remove múltiplos hífens consecutivos
      .replace(/^-+/, '')       // Remove hífens do início
      .replace(/-+$/, '')       // Remove hífens do final
      .substring(0, 50)         // Limita o tamanho
      
    console.log('🔤 Slug gerado:', { 
      original: name, 
      withoutAccents, 
      final: slug 
    })
    
    return slug || 'workspace' // Fallback se slug for vazio
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Ensure user exists in database
      const user = await ensureUserExists()
      
      console.log('📋 1. User data:', { user })
      
      if (!user) {
        toast({
          title: 'Error',
          description: 'User not found. Please try logging in again.',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }

      // 2. Create workspace
      console.log('📋 2. Creating workspace with data:', {
        name: formData.name,
        slug: formData.slug,
        owner_id: user.id
      })

      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          name: formData.name,
          slug: formData.slug,
          owner_id: user.id,
        })
        .select()
        .single()

      console.log('📋 3. Workspace response:', { workspace, workspaceError })

      if (workspaceError) throw workspaceError

      // 3. Add user as workspace member
      console.log('📋 4. Adding user as workspace member:', {
        workspace_id: workspace.id,
        member_id: user.id,
        role: 'owner'
      })

      const { error: memberError } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspace.id,
          member_id: user.id,
          role: 'owner',
        })

      console.log('📋 5. Member response:', { memberError })

      if (memberError) throw memberError

      toast({
        title: 'Workspace created!',
        description: `${formData.name} is ready to use.`,
      })

      setOpen(false)
      setFormData({ name: '', description: '', slug: '' })
      
      console.log('🎯 Workspace criado com sucesso!', {
        workspace,
        slug: formData.slug,
        redirectUrl: `/workspace/${formData.slug}`
      })

      // Redirect to the workspace
      router.push(`/workspace/${formData.slug}`)
      router.refresh() // Force refresh to load data
      
    } catch (error: any) {
      console.error('❌ Error creating workspace:', error)
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to create workspace',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Workspace
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
            <DialogDescription>
              A workspace is where you&apos;ll manage your projects and team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Workspace Name *</Label>
              <Input
                id="name"
                placeholder="Acme Inc."
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Workspace URL</Label>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-1">plane-clone.vercel.app/</span>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1"
                  placeholder="acme-inc"
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500">
                This will be your workspace&apos;s unique URL.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="What's this workspace for?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Workspace'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}