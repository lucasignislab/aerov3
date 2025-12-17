// apps/web/components/kanban/kanban-issue.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreVertical, Clock, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { EditIssueModal } from '../issue/edit-issue-modal'

interface KanbanIssueProps {
  issue: any
  onUpdate: () => void
}

export function KanbanIssue({ issue, onUpdate }: KanbanIssueProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const supabase = createClient()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-blue-500'
      case 'low': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this issue?')) return

    try {
      await supabase
        .from('issues')
        .delete()
        .eq('id', issue.id)

      onUpdate()
    } catch (error) {
      console.error('Error deleting issue:', error)
    }
  }

  const priorityColor = getPriorityColor(issue.priority)

  return (
    <>
      <Card
        className="p-3 cursor-move hover:shadow-md transition-shadow bg-white"
        onClick={() => setIsEditModalOpen(true)}
      >
        <div className="space-y-2">
          {/* Issue Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">
                {issue.name}
              </h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {issue.description_id ? 'Rich content...' : 'No description'}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Issue Metadata */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${priorityColor}`} />
              <span className="text-gray-600">
                {issue.priority || 'No priority'}
              </span>
            </div>
            <span className="font-mono text-gray-500">
              {issue.project_id?.slice(0, 3)}-{issue.sequence_id}
            </span>
          </div>

          {/* Issue Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-2">
              {issue.assignee ? (
                <div className="flex items-center space-x-1">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-xs">
                    {issue.assignee.display_name?.charAt(0) || issue.assignee.email?.charAt(0)}
                  </div>
                  <span className="text-xs text-gray-600 truncate max-w-[60px]">
                    {issue.assignee.display_name || issue.assignee.email?.split('@')[0]}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-gray-400">
                  <User className="h-3 w-3" />
                  <span className="text-xs">Unassigned</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {issue.target_date && (
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">
                    {format(new Date(issue.target_date), 'MMM d')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <EditIssueModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        issue={issue}
        onUpdate={onUpdate}
      />
    </>
  )
}
