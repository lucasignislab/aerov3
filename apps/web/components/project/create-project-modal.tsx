// apps/web/components/project/create-project-modal.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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

interface CreateProjectModalProps {
  workspaceId: string
  userId: string
  workspaceSlug?: string
}

export function CreateProjectModal({ workspaceId, userId, workspaceSlug }: CreateProjectModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    identifier: '',
    icon: '📋',
  })
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          workspace_id: workspaceId,
          name: formData.name,
          description: formData.description,
          identifier: formData.identifier.toUpperCase(),
          icon: formData.icon,
          created_by: userId,
        })
        .select()
        .single()

      if (projectError) throw projectError

      // Create default issue states for this project
      const states = [
        { name: 'Backlog', color: '#94a3b8', position: 0, state_group: 'backlog' },
        { name: 'Todo', color: '#3b82f6', position: 1, state_group: 'unstarted' },
        { name: 'In Progress', color: '#f59e0b', position: 2, state_group: 'started' },
        { name: 'Done', color: '#10b981', position: 3, state_group: 'completed' },
      ]

      for (const state of states) {
        await supabase.from('issue_states').insert({
          name: state.name,
          color: state.color,
          position: state.position,
          state_group: state.state_group,
          project_id: project.id,
        })
      }

      toast({
        title: 'Project created!',
        description: `${formData.name} is ready to use.`,
      })

      setOpen(false)
      setFormData({ name: '', description: '', identifier: '', icon: '📋' })
      
      // Redirect to project or refresh
      if (workspaceSlug) {
        router.push(`/workspace/${workspaceSlug}/project/${project.id}`)
      } else {
        router.refresh()
      }
      
    } catch (error: any) {
      console.error('Error creating project:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create project',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              A project contains issues, cycles, and modules.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="Website Redesign"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="identifier">Project ID *</Label>
              <Input
                id="identifier"
                placeholder="WEB"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value.toUpperCase() })}
                maxLength={5}
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                Unique identifier for your project (max 5 characters)
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-16 text-center"
                  maxLength={2}
                  disabled={loading}
                />
                <span className="text-sm text-gray-500">Emoji or short text</span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Project goals and description"
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
                'Create Project'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
