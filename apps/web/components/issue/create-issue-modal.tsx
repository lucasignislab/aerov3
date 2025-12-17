// apps/web/components/issue/create-issue-modal.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RichTextEditor } from '@/components/editor/rich-text-editor'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface CreateIssueModalProps {
  projectId: string
  states: any[]
  defaultStateId?: string
  trigger?: React.ReactNode
}

export function CreateIssueModal({
  projectId,
  states,
  defaultStateId,
  trigger,
}: CreateIssueModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: {},
    stateId: defaultStateId || '',
    priority: 'medium',
    estimate: '',
    assigneeId: '',
  })
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create issue
      const { data: issue, error } = await supabase
        .from('issues')
        .insert({
          project_id: projectId,
          name: formData.name,
          state_id: formData.stateId || states[0]?.id,
          priority: formData.priority,
          estimate: formData.estimate ? parseInt(formData.estimate) : null,
          assignee_id: formData.assigneeId || null,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error

      // Create description if exists
      if (Object.keys(formData.description).length > 0) {
        await supabase
          .from('issue_descriptions')
          .insert({
            issue_id: issue.id,
            content: formData.description,
          })
      }

      toast({
        title: 'Issue created!',
        description: `${formData.name} has been created.`,
      })

      setOpen(false)
      setFormData({
        name: '',
        description: {},
        stateId: defaultStateId || '',
        priority: 'medium',
        estimate: '',
        assigneeId: '',
      })
      
      // Refresh the page
      router.refresh()
      
    } catch (error: any) {
      console.error('Error creating issue:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create issue',
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
            New Issue
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Issue</DialogTitle>
            <DialogDescription>
              Add a new issue to your project
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Issue Title *</Label>
              <Input
                id="name"
                placeholder="What needs to be done?"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <RichTextEditor
                content={formData.description}
                onChange={(content) => setFormData({ ...formData, description: content })}
                placeholder="Describe the issue in detail..."
                editable={!loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="state">Status</Label>
                <Select
                  value={formData.stateId}
                  onValueChange={(value) => setFormData({ ...formData, stateId: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.id} value={state.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: state.color }}
                          />
                          {state.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="estimate">Estimate (hours)</Label>
                <Input
                  id="estimate"
                  type="number"
                  placeholder="e.g., 4"
                  value={formData.estimate}
                  onChange={(e) => setFormData({ ...formData, estimate: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Select
                  value={formData.assigneeId}
                  onValueChange={(value) => setFormData({ ...formData, assigneeId: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    <SelectItem value="current">Assign to me</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                'Create Issue'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
