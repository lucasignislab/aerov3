// apps/web/app/workspace/[slug]/project/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Settings, List, Calendar, GitBranch, BarChart } from 'lucide-react'
import Link from 'next/link'

interface ProjectPageProps {
  params: {
    slug: string
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug, id } = params
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Get workspace
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!workspace) notFound()

  // Get project
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (!project) notFound()

  // Verify project belongs to workspace
  if (project.workspace_id !== workspace.id) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/workspace/${workspace.slug}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {workspace.name}
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{project.icon || '📋'}</span>
                  <h1 className="text-2xl font-bold">{project.name}</h1>
                  <span className="text-sm font-mono px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {project.identifier}
                  </span>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <Tabs defaultValue="board" className="w-full">
        {/* Navigation Tabs */}
        <div className="border-b bg-white">
          <div className="container mx-auto px-4">
            <TabsList className="h-12">
              <TabsTrigger value="board" className="h-10 gap-2">
                <div className="h-4 w-4 rounded-sm bg-blue-500" />
                Board
              </TabsTrigger>
              <TabsTrigger value="list" className="h-10 gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="calendar" className="h-10 gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="cycles" className="h-10 gap-2">
                <GitBranch className="h-4 w-4" />
                Cycles
              </TabsTrigger>
              <TabsTrigger value="analytics" className="h-10 gap-2">
                <BarChart className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <TabsContent value="board" className="mt-0">
            <KanbanBoard projectId={project.id} />
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <List className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">List View</h3>
                  <p className="text-gray-600">Coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Calendar View</h3>
                  <p className="text-gray-600">Coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cycles" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <GitBranch className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Cycles</h3>
                  <p className="text-gray-600">Coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                  <p className="text-gray-600">Coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </main>
      </Tabs>
    </div>
  )
}
