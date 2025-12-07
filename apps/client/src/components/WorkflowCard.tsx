import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { formatDistanceToNow } from "date-fns"
import { useNavigate } from "react-router-dom"
import { Trash2 } from "lucide-react"
import axios from "axios"
import { BACKEND_URL } from "../lib/config"
import { useState } from "react"

interface Workflow {
  id: string
  name: string
  updated_at: string
  created_at: string
  enabled: boolean
}

interface WorkflowCardsProps {
  workflows: Workflow[]
  onWorkflowDeleted?: (workflowId: string) => void
}

export function WorkflowCards({ workflows, onWorkflowDeleted }: WorkflowCardsProps) {
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const formatCreated = (dateString: string) => {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const handleDeleteWorkflow = async (workflowId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this workflow? This action cannot be undone.')) {
      return;
    }

    setDeletingId(workflowId);
    
    try {
      await axios.delete(`${BACKEND_URL}/workflows/${workflowId}`);
      onWorkflowDeleted?.(workflowId);
    } catch (error) {
      console.error('Error deleting workflow:', error);
      alert('Failed to delete workflow. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }


  if(workflows.length === 0){
    return (
      <div className="h-[600px] w-full flex justify-center items-center">
        <div className="font-kode font-bold text-xl">No Workflows Yet! Create Now!</div>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-4 max-w-7xl">
      {workflows.map((workflow) => (
        <Card key={workflow.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={()=>navigate(`/workflows/${workflow.id}`)}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full ${workflow.enabled ? "bg-green-500" : "bg-gray-400"}`} />
                <h3 className="font-semibold text-foreground truncate">{workflow.name}</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  Updated {formatLastUpdated(workflow.updated_at)} | Created {formatCreated(workflow.created_at)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => handleDeleteWorkflow(workflow.id, e)}
                  disabled={deletingId === workflow.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}