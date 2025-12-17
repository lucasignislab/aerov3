// apps/web/app/workspace/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreateProjectModal } from '@/components/project/create-project-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Settings, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface WorkspacePageProps {
  params: {
    slug: string
  }
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { slug } = params
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

  if (!workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-2">Workspace not found</h2>
            <p className="text-gray-600 mb-4">The workspace you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get workspace projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('workspace_id', workspace.id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">{workspace.name}</h1>
                <p className="text-sm text-gray-500">Workspace • {projects?.length || 0} projects</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Users className="mr-2 h-4 w-4" />
                Members
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Projects Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Projects</h2>
            <p className="text-gray-600">Manage your projects and tasks</p>
          </div>
          <CreateProjectModal workspaceId={workspace.id} />
        </div>

        {/* Projects Grid */}
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/workspace/${workspace.slug}/project/${project.id}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-2xl">{project.icon || '📋'}</div>
                      <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {project.identifier}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
                      <span>0 issues</span>
                      <span>Created by You</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first project to start managing issues
              </p>
              <CreateProjectModal workspaceId={workspace.id} />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
