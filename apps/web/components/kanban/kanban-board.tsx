// apps/web/components/kanban/kanban-board.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter } from 'lucide-react'
import { KanbanColumn } from './kanban-column'
import { CreateIssueModal } from '../issue/create-issue-modal'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

interface KanbanBoardProps {
  projectId: string
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [states, setStates] = useState<any[]>([])
  const [issues, setIssues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const supabase = createClient()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    fetchData()
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('issues_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'issues' }, 
        () => fetchData()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId])

  const fetchData = async () => {
    try {
      // Fetch issue states
      const { data: statesData } = await supabase
        .from('issue_states')
        .select('*')
        .eq('project_id', projectId)
        .order('position')

      // Fetch issues
      const { data: issuesData } = await supabase
        .from('issues')
        .select(`
          *,
          assignee:users(id, email, display_name, avatar_url),
          state:issue_states(*)
        `)
        .eq('project_id', projectId)
        .order('sort_order')

      setStates(statesData || [])
      setIssues(issuesData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    setActiveId(null)
    
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the issue being dragged
    const issue = issues.find(i => i.id === activeId)
    if (!issue) return

    // Check if dropping on a state column
    const targetState = states.find(s => s.id === overId)
    
    if (targetState && issue.state_id !== targetState.id) {
      // Optimistically update UI
      setIssues(prev => prev.map(i => 
        i.id === activeId 
          ? { ...i, state_id: targetState.id, state: targetState }
          : i
      ))

      try {
        await supabase
          .from('issues')
          .update({ state_id: targetState.id })
          .eq('id', activeId)
      } catch (error) {
        console.error('Error updating issue state:', error)
        // Revert on error
        fetchData()
      }
    }
  }

  const filteredIssues = issues.filter(issue =>
    issue.name.toLowerCase().includes(search.toLowerCase()) ||
    issue.description?.toLowerCase().includes(search.toLowerCase())
  )

  const activeIssue = activeId ? issues.find(i => i.id === activeId) : null

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading board...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Kanban Board</h2>
          <p className="text-gray-600">Drag and drop issues between columns</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search issues..."
              className="pl-9 w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <CreateIssueModal projectId={projectId} states={states} />
        </div>
      </div>

      {/* Kanban Board with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4 min-w-max">
            <SortableContext
              items={states.map(s => s.id)}
              strategy={horizontalListSortingStrategy}
            >
              {states.map((state) => {
                const columnIssues = filteredIssues.filter(
                  issue => issue.state_id === state.id
                )
                
                return (
                  <KanbanColumn
                    key={state.id}
                    id={state.id}
                    state={state}
                    issues={columnIssues}
                    projectId={projectId}
                    onIssueUpdate={fetchData}
                  />
                )
              })}
            </SortableContext>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeIssue ? (
            <Card className="p-3 shadow-lg rotate-3 opacity-90 w-72">
              <div className="font-medium text-sm">{activeIssue.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {activeIssue.priority || 'No priority'}
              </div>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issues.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {issues.filter(i => i.state?.group === 'started').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {issues.filter(i => i.state?.group === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
