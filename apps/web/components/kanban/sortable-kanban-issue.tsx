// apps/web/components/kanban/sortable-kanban-issue.tsx
'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { KanbanIssue } from './kanban-issue'

interface SortableKanbanIssueProps {
  id: string
  issue: any
  onUpdate: () => void
}

export function SortableKanbanIssue({ id, issue, onUpdate }: SortableKanbanIssueProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <KanbanIssue
        issue={issue}
        onUpdate={onUpdate}
      />
    </div>
  )
}
