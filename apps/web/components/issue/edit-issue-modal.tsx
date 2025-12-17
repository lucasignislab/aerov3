// apps/web/components/issue/edit-issue-modal.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Loader2, Calendar } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { format } from 'date-fns'

interface EditIssueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  issue: any
  onUpdate: () => void
}

export function EditIssueModal({
  open,
  onOpenChange,
  issue,
  onUpdate,
}: EditIssueModalProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: {},
    stateId: '',
    priority: 'medium',
    estimate: '',
    assigneeId: '',
  })
  const [states, setStates] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    if (open && issue) {
      fetchData()
    }
  }, [open, issue])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch issue details
      const { data: issueDetails } = await supabase
        .from('issues')
        .select(`
          *,
          description:issue_descriptions(content)
        `)
        .eq('id', issue.id)
        .single()

      // Fetch states for this project
      const { data: statesData } = await supabase
        .from('issue_states')
        .select('*')
        .eq('project_id', issue.project_id)
        .order('position')

      setStates(statesData || [])

      // Set form data
      if (issueDetails) {
        setFormData({
          name: issueDetails.name || '',
          description: issueDetails.description?.content || {},
          stateId: issueDetails.state_id || '',
          priority: issueDetails.priority || 'medium',
          estimate: issueDetails.estimate?.toString() || '',
          assigneeId: issueDetails.assignee_id || '',
        })
      }
    } catch (error) {
      console.error('Error fetching issue data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Update issue
      const { error: issueError } = await supabase
        .from('issues')
        .update({
          name: formData.name,
          state_id: formData.stateId,
          priority: formData.priority,
          estimate: formData.estimate ? parseInt(formData.estimate) : null,
          assignee_id: formData.assigneeId || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', issue.id)

      if (issueError) throw issueError

      // Update or create description
      if (Object.keys(formData.description).length > 0) {
        const { error: descError } = await supabase
          .from('issue_descriptions')
          .upsert({
            issue_id: issue.id,
            content: formData.description,
            updated_at: new Date().toISOString(),
          })

        if (descError) throw descError
      }

      toast({
        title: 'Issue updated!',
        description: 'Changes have been saved.',
      })

      onOpenChange(false)
      onUpdate()
      
    } catch (error: any) {
      console.error('Error updating issue:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update issue',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this issue?')) return

    try {
      await supabase
        .from('issues')
        .delete()
        .eq('id', issue.id)

      toast({
        title: 'Issue deleted',
        description: 'The issue has been removed.',
      })

      onOpenChange(false)
      onUpdate()
    } catch (error) {
      console.error('Error deleting issue:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete issue',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Issue</DialogTitle>
            <DialogDescription>
              {issue.project_id?.slice(0, 3)}-{issue.sequence_id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Issue Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-xl font-semibold border-none p-0 focus-visible:ring-0"
                  placeholder="Issue title"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-xs text-gray-500">Status</Label>
                <Select
                  value={formData.stateId}
                  onValueChange={(value) => setFormData({ ...formData, stateId: value })}
                  disabled={saving}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
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

              <div>
                <Label className="text-xs text-gray-500">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  disabled={saving}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-gray-500">Assignee</Label>
                <Select
                  value={formData.assigneeId}
                  onValueChange={(value) => setFormData({ ...formData, assigneeId: value })}
                  disabled={saving}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    <SelectItem value="current">Assign to me</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-gray-500">Estimate</Label>
                <Input
                  type="number"
                  placeholder="Hours"
                  value={formData.estimate}
                  onChange={(e) => setFormData({ ...formData, estimate: e.target.value })}
                  className="h-8"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label>Description</Label>
              <RichTextEditor
                content={formData.description}
                onChange={(content) => setFormData({ ...formData, description: content })}
                placeholder="Add a detailed description..."
                editable={!saving}
              />
            </div>

            {/* Additional Info */}
            <div className="grid gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  Created {format(new Date(issue.created_at), 'MMM d, yyyy')}
                </span>
              </div>
              {issue.updated_at !== issue.created_at && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Updated {format(new Date(issue.updated_at), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
            >
              Delete Issue
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
