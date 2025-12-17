// Adicione no topo do arquivo (imports):
import { CreateWorkspaceModal } from '@/components/workspace/create-workspace-modal'

// Substitua o Card "Create New Workspace" por:
<CreateWorkspaceModal
  trigger={
    <Card className="border-dashed border-2 hover:border-blue-500 transition-colors cursor-pointer hover:bg-blue-50/50">
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
  }
/>