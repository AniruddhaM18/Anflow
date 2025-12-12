import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "../lib/config";
import { useState, useEffect } from "react";

interface Workflow {
  id: string;
  name: string;
  updated_at: string;
  created_at: string;
  enabled: boolean;
}

interface WorkflowCardsProps {
  workflows: Workflow[];
  /**
   * Optional callback so parent can update its state if it wants to.
   * Called after a successful delete with the deleted workflow id.
   */
  onWorkflowDeleted?: (workflowId: string) => void;
}

export function WorkflowCards({
  workflows,
  onWorkflowDeleted,
}: WorkflowCardsProps) {
  const navigate = useNavigate();

  // Local copy so UI updates immediately after delete
  const [localWorkflows, setLocalWorkflows] = useState<Workflow[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Keep local copy in-sync when parent changes `workflows`
  useEffect(() => {
    setLocalWorkflows(workflows ?? []);
  }, [workflows]);

  const formatLastUpdated = (dateString: string) =>
    formatDistanceToNow(new Date(dateString), { addSuffix: true });

  const formatCreated = (dateString: string) =>
    formatDistanceToNow(new Date(dateString), { addSuffix: true });


  const handleDeleteWorkflow = async (
    workflowId: string,
    event: React.MouseEvent
  ) => {
    // avoid navigating when clicking delete
    event.stopPropagation();

    if (
      !confirm(
        "Are you sure you want to delete this workflow? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(workflowId);

    try {
      // Correct endpoint: /api/workflow/:id
     await axios.delete(`${BACKEND_URL}/api/workflow/${workflowId}`, {
  withCredentials: true,
});

      // remove from local UI immediately
      setLocalWorkflows((prev) => prev.filter((w) => w.id !== workflowId));

      // notify parent if it wants to handle removal too
      onWorkflowDeleted?.(workflowId);
    } catch (error) {
      console.error("Error deleting workflow:", error);
      // Try to surface a friendly error message
      const msg =
        (error as any)?.response?.data?.message ||
        "Failed to delete workflow. Please try again.";
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  if (!localWorkflows || localWorkflows.length === 0) {
    return (
      <div className="h-[600px] w-full flex justify-center items-center">
        <div className="font-kode font-bold text-xl">No Workflows Yet! Create Now!</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-7xl">
      {localWorkflows.map((workflow) => (
        <Card
          key={workflow.id}
          className="hover:shadow-md transition-shadow cursor-pointer bg-slate-300/15 font-vietnam"
          onClick={() => navigate(`/workflows/${workflow.id}`)}
          aria-label={`Workflow ${workflow.name}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {/* Left */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={`w-3 h-3 rounded-2xl ${
                    workflow.enabled ? "bg-emeraldGreen" : "bg-gray-500"
                  }`}
                  aria-hidden
                />
                <h3 className="font-semibold text-foreground truncate">
                  {workflow.name}
                </h3>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  Updated {formatLastUpdated(workflow.updated_at)} | Created{" "}
                  {formatCreated(workflow.created_at)}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-violetPurple hover:text-purple-700 hover:bg-violetPurple/10"
                  onClick={(e) => handleDeleteWorkflow(workflow.id, e)}
                  disabled={deletingId === workflow.id}
                  aria-label={`Delete ${workflow.name}`}
                >
                  {deletingId === workflow.id ? (
                    <span className="text-[10px]">...</span>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
