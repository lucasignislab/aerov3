import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Settings, Users, FolderKanban } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user's workspaces
  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('*')
    .eq('owner_id', user.id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FolderKanban className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold">Plane Clone</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user.email?.split('@')[0]}!</h2>
          <p className="text-gray-600">Manage your projects and tasks efficiently</p>
        </div>

        {/* Workspaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Create New Workspace Card */}
          <Card className="border-dashed border-2 hover:border-blue-500 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center h-48">
              <div className="rounded-full bg-blue-100 p-3 mb-4">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Create Workspace</h3>
              <p className="text-sm text-gray-500 text-center">
                Start a new workspace for your team or personal projects
              </p>
            </CardContent>
          </Card>

          {/* Existing Workspaces */}
          {workspaces?.map((workspace) => (
            <Card key={workspace.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {workspace.name}
                  <span className="text-xs font-normal px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Owner
                  </span>
                </CardTitle>
                <CardDescription>ID: {workspace.slug}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">1 member</span>
                  </div>
                  <Button size="sm">Open</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-gray-500">Active Projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-gray-500">Open Issues</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-gray-500">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-gray-500">Overdue</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions across workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-400">
              <FolderKanban className="h-12 w-12 mx-auto mb-4" />
              <p>No activity yet. Create your first workspace to get started!</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
