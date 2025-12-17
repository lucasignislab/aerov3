// apps/web/components/kanban/kanban-column.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreVertical, Plus } from 'lucide-react'
import { SortableKanbanIssue } from './sortable-kanban-issue'
import { CreateIssueModal } from '../issue/create-issue-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface KanbanColumnProps {
  id: string
  state: any
  issues: any[]
  projectId: string
  onIssueUpdate: () => void
}

export function KanbanColumn({ id, state, issues, projectId, onIssueUpdate }: KanbanColumnProps) {
  const [isAddingIssue, setIsAddingIssue] = useState(false)
  const supabase = createClient()

  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  const handleDrop = async (issueId: string) => {
    try {
      await supabase
        .from('issues')
        .update({ state_id: state.id })
        .eq('id', issueId)

      onIssueUpdate()
    } catch (error) {
      console.error('Error updating issue state:', error)
    }
  }

  const getGroupColor = (group: string) => {
    switch (group) {
      case 'backlog': return 'bg-gray-100 text-gray-800'
      case 'unstarted': return 'bg-blue-100 text-blue-800'
      case 'started': return 'bg-amber-100 text-amber-800'
      case 'completed': return 'bg-emerald-100 text-emerald-800'
      case 'cancelled': return 'bg-rose-100 text-rose-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="w-80 flex-shrink-0">
      <Card className={`h-full ${isOver ? 'ring-2 ring-blue-500 ring-inset' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: state.color }}
              />
              <CardTitle className="text-sm font-semibold">
                {state.name}
              </CardTitle>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {issues.length}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <CreateIssueModal
                projectId={projectId}
                states={[state]}
                defaultStateId={state.id}
                trigger={
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                }
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Rename Column</DropdownMenuItem>
                  <DropdownMenuItem>Change Color</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Delete Column
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getGroupColor(state.group)}`}>
              {state.group}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div
            ref={setNodeRef}
            className="space-y-3 min-h-[200px]"
          >
            <SortableContext
              items={issues.map(i => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {issues.map((issue) => (
                <SortableKanbanIssue
                  key={issue.id}
                  id={issue.id}
                  issue={issue}
                  onUpdate={onIssueUpdate}
                />
              ))}
            </SortableContext>
            
            {issues.length === 0 && (
              <div className={`text-center py-8 border-2 border-dashed rounded-lg ${
                isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                <p className={`text-sm ${
                  isOver ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {isOver ? 'Drop here!' : 'Drop issues here'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
