import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  Panel,
  MiniMap,
  type Node,
  type Edge,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import SlideToggle from "../components/ToggleSlider";
import { FlaskConical, Loader2, Plus, Copy, SquarePower, Play } from "lucide-react";
import { TriggerCard, type Trigger } from "../components/TriggerCard";
import { ActionCard } from "../components/ActionCard";
import { ActionNode, TriggerNode } from "../components/CustomNodes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../components/ui/sheet";
import axios from "axios";
import { toast } from "sonner";
import { BACKEND_URL } from "../lib/config";
// --- Credential System ---
import { useCredentials } from "../components/credentials/useCredentials";
import { CredentialSelector } from "../components/credentials/CredentialSelector";
import { CredentialDialog } from "../components/credentials/CredentialDialog";

// Node type registry
const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

// Static trigger list 
const STATIC_TRIGGERS: Trigger[] = [
  {
    id: "manual-trigger",
    name: "Manual Trigger",
    type: "manual-trigger",
    description: "Start the workflow manually",
  },
  {
    id: "webhook-trigger",
    name: "Webhook Trigger",
    type: "webhook-trigger",
    description: "Start the workflow via HTTP webhook",
  },
];

export const FlowPage = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [enable, setEnable] = useState(false);

  const [workflowName, setWorkflowName] = useState("");
  const [savedWorkflowName, setSavedWorkflowName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<Node, Edge> | null>(null);
  const [pendingViewport, setPendingViewport] = useState<any>(null);

  // Node execution statuses
  const [nodeStatuses, setNodeStatuses] = useState<
    Record<string, "IDLE" | "RUNNING" | "SUCCESS" | "FAILED">
  >({});
  const [isExecuting, setIsExecuting] = useState(false);

  const decorateNodesWithStatus = useCallback(() => {
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        data: { ...(n.data as any), __status: nodeStatuses[n.id] || "IDLE" },
      }))
    );
  }, [nodeStatuses]);

  useEffect(() => {
    decorateNodesWithStatus();
  }, [nodeStatuses, decorateNodesWithStatus]);

  // Node config dialog
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [formData, setFormData] = useState<any>({});

  const updateForm = (k: string, v: any) =>
    setFormData((prev:any) => ({ ...prev, [k]: v }));

  // NEW Credential hook
  const {
    credentials,
    isCredDialogOpen,
    setIsCredDialogOpen,
    creatingCred,

    credPlatform,
    credTitle,
    setCredTitle,
    setCredData,
    openCreateCredentialDialog,
    handleCreateCredential,
  } = useCredentials();

  // Save flow
  const saveFlow = useCallback(() => rfInstance?.toObject(), [rfInstance]);

  // Picker modal
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<"trigger" | "action">("trigger");

  const openPicker = (mode: "trigger" | "action") => {
    setPickerMode(mode);
    setIsPickerOpen(true);
  };

  // ReactFlow handlers
  const onNodesChange = useCallback(
    (chs:any) => setNodes((nds) => applyNodeChanges(chs, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (chs:any) => setEdges((eds) => applyEdgeChanges(chs, eds)),
    []
  );
  const onConnect = useCallback(
    (params:any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Node click
  const onNodeClick = useCallback((_:any, node:any) => {
    setSelectedNode(node);
    setFormData((node.data as any)?.config || {});
    setIsConfigOpen(true);
  }, []);

  // Save config
  const handleSaveNodeConfig = () => {
    if (!selectedNode) return;

    setNodes((prev) =>
      prev.map((n) =>
        n.id === selectedNode.id
          ? { ...n, data: { ...(n.data as any), config: formData } }
          : n
      )
    );

    setIsConfigOpen(false);
    setSelectedNode(null);
  };

  // Load workflow
  useEffect(() => {
    const fetchWorkflow = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const res = await axios.get(`${BACKEND_URL}/api/workflow/${id}`, {
          withCredentials: true,
        });

        if (!res.data.success) return toast.error(res.data.message);

        const wf = res.data.workflow;

        setWorkflowName(wf.title || "");
        setSavedWorkflowName(wf.title || "");
        setEnable(wf.isEnabled ?? false);

        if (wf.flow) {
          setNodes(wf.flow.nodes || []);
          setEdges(wf.flow.edges || []);
          setPendingViewport(wf.flow.viewport || null);
        }
      } catch {
        toast.error("Failed to fetch workflow");
      }

      setLoading(false);
    };

    fetchWorkflow();
  }, [id]);

  // Save workflow to backend
  const handleSaveWorkflow = async () => {
    setSaving(true);
    const flow = saveFlow();

    try {
      if (id) {
        const res = await axios.put(
          `${BACKEND_URL}/api/workflow/${id}`,
          {
            title: workflowName,
            isEnabled: enable,
            nodes,
            edges,
            flow,
          },
          { withCredentials: true }
        );

        if (!res.data.success) return toast.error(res.data.message);

        toast.success(res.data.message);
        setSavedWorkflowName(workflowName);
      } else {
        const res = await axios.post(
          `${BACKEND_URL}/api/workflow/create`,
          {
            title: workflowName,
            isEnabled: enable,
            nodes,
            edges,
            flow,
          },
          { withCredentials: true }
        );

        if (!res.data.success) return toast.error(res.data.message);

        toast.success(res.data.message);
        setSavedWorkflowName(workflowName);
        navigate(`/workflows/${res.data.workflow.id}`);
      }
    } catch {
      toast.error("Failed to save workflow");
    }
    setSaving(false);
  };

  // Add trigger node
  const handleSelectTrigger = (trigger: Trigger) => {
    const newId = `t-${Date.now()}`;

    setNodes((prev) => [
      ...prev,
      {
        id: newId,
        type: "trigger",
        position: { x: 0, y: 0 },
        data: { label: trigger.name, type: trigger.type },
      },
    ]);

    setIsPickerOpen(false);
  };

  // Add action node
  const handleSelectAction = (action:any) => {
    const newId = `a-${Date.now()}`;

    setNodes((prev) => [
      ...prev,
      {
        id: newId,
        type: "action",
        position: { x: 150, y: prev.length * 40 },
        data: { label: action.name, type: action.type },
      },
    ]);

    setIsPickerOpen(false);
  };

  // Execute workflow
  const getTriggerType = () => {
    const triggerNode = nodes.find((n) => n.type === "trigger");
    return (triggerNode?.data as any)?.type;
  };

  const handleExecuteWorkflow = async () => {
    if (!id) {
      toast.error("Save the workflow before executing");
      return;
    }

    const triggerType = getTriggerType();

    if (triggerType === "webhook-trigger") {
      const webhookUrl = `${BACKEND_URL}/api/webhook/${id}`;
      console.log("Webhook listening at:", webhookUrl);

      const es = new EventSource(`${BACKEND_URL}/api/v1/execute/stream`, {
        withCredentials: true,
      });

      es.onmessage = (ev) => {
        const evt = JSON.parse(ev.data);
        setNodeStatuses((prev) => ({
          ...prev,
          [evt.nodeId]: evt.status,
        }));
      };

      toast.success("Webhook armed! Waiting...");
      return;
    }

    if (triggerType === "manual-trigger") {
      setIsExecuting(true);

      try {
        const res = await axios.post(
          `${BACKEND_URL}/api/execute/run`,
          { workflowId: id },
          { withCredentials: true }
        );

        const data = res.data;
        if (!data.success) {
          toast.error(data.message);
          setIsExecuting(false);
          return;
        }

        const statuses: Record<string, any> = {};
        nodes.forEach((n) => (statuses[n.id] = "IDLE"));
        setNodeStatuses(statuses);

        const es = new EventSource(`${BACKEND_URL}/api/v1/execute/stream`, {
          withCredentials: true as any,
        });

        es.onmessage = (ev) => {
          try {
            const evt = JSON.parse(ev.data);
            if (evt.executionId !== data.executionId) return;

            setNodeStatuses((prev) => ({
              ...prev,
              [evt.nodeId]: evt.status,
            }));
          } catch {}
        };

        es.onerror = () => {
          es.close();
          setIsExecuting(false);
        };
      } catch {
        toast.error("Failed to execute workflow");
        setIsExecuting(false);
      }
      setIsExecuting(false);
      return;
    }

    toast.error("No valid trigger found in this workflow");
  };

  // Node form renderer
  const nodeFormRenderers = {
    trigger: {
      "manual-trigger": () => (
        <Button
          className="bg-corporateBlue hover:bg-corporateBlue/95"
          onClick={handleExecuteWorkflow}
          disabled={isExecuting}
        >
          {isExecuting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FlaskConical />}
          Execute Workflow
        </Button>
      ),

      "webhook-trigger": () => {
        const url = id ? `${BACKEND_URL}/api/webhook/${id}` : "";

        return (
          <div className="flex flex-col gap-3">
            <Label>Webhook URL</Label>
            <div className="flex gap-2">
              <Input value={url} readOnly />
              <Button
                className="bg-corporateBlue"
                onClick={() =>
                  navigator.clipboard.writeText(url).then(() => toast.success("Copied"))
                }
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>
        );
      },
    },

    action: {
      telegram: (fd:any, update:any) => (
        <div className="flex flex-col gap-3">
          <Label>Credential</Label>

          <CredentialSelector
            platform="telegram"
            credentials={credentials}
            value={fd.credential}
            onAdd={() => openCreateCredentialDialog("telegram")}
            onChange={(v) => update("credential", v)}
          />

          <Label>Chat ID</Label>
          <Input
            value={fd.chatId || ""}
            onChange={(e) => update("chatId", e.target.value)}
          />

          <Label>Message</Label>
          <Input
            value={fd.message || ""}
            onChange={(e) => update("message", e.target.value)}
          />
        </div>
      ),

      resend: (fd:any, update:any) => (
        <div className="flex flex-col gap-3">
          <Label>Credential</Label>

          <CredentialSelector
            platform="resend"
            credentials={credentials}
            value={fd.credential}
            onAdd={() => openCreateCredentialDialog("resend")}
            onChange={(v) => update("credential", v)}
          />

          <Label>To</Label>
          <Input
            value={fd.to || ""}
            onChange={(e) => update("to", e.target.value)}
          />

          <Label>Subject</Label>
          <Input
            value={fd.subject || ""}
            onChange={(e) => update("subject", e.target.value)}
          />

          <Label>Body</Label>
          <Input
            value={fd.body || ""}
            onChange={(e) => update("body", e.target.value)}
          />
        </div>
      ),
    },
  };

  const renderNodeForm = () => {
    if (!selectedNode) return null;

    const nodeKind = selectedNode.type as string;
    const nodeType = (selectedNode.data as any)?.type;
    const renderer = (nodeFormRenderers as Record<string, Record<string, any>>)[nodeKind]?.[nodeType];

    return renderer ? renderer(formData, updateForm) : <div>No config</div>;
  };

  // compute safety flag for dialog (avoid using unknown in includes)
  const nodeTypeValue = (selectedNode?.data as any)?.type;
  const isTrigger = typeof nodeTypeValue === "string" && ["manual-trigger", "webhook-trigger"].includes(nodeTypeValue);

  // Loading screen
  if (loading) {
    return (
      <div className="m-16 mx-auto max-w-7xl w-full flex items-center justify-center h-[850px]">
        <Loader2 className="animate-spin text-corporateBlue" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden pt-14">
      {/* HEADER */}
      <div className="flex h-16 items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="font-vietnam font-medium text-neutral-700 ml-2">Workflow</div>

          <Input
            placeholder="workflow name"
            className="font-vietnam border-zinc-200 border-2"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
          />

          {/* SAVED NAME TAG */}
          {savedWorkflowName && (
            <span className="text-neutral-700 font-vietnam text-lg">
              ({savedWorkflowName})
            </span>
          )}
        </div>

        <div className="flex items-center gap-5">
          <div className="flex gap-2 items-center font-vietnam">
            Enabled: <SlideToggle enabled={enable} setEnable={setEnable} />
            <span className="text-sm opacity-70">{enable ? "On" : "Off"}</span>
          </div>

          <Button
            className="bg-corporateBlue font-vietnam hover:bg-corporateBlue/85 mr-2"
            onClick={handleSaveWorkflow}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>

      {/* FLOW CANVAS */}
      <div className="flex-1 w-full bg-neutral-100">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          onInit={(instance) => {
            setRfInstance(instance);
            if (pendingViewport) instance.setViewport(pendingViewport);
          }}
        >
          <Panel position="bottom-center">
            <Button
              className="bg-corporateBlue font-vietnam rounded-sm hover:bg-corporateBlue/90"
              onClick={handleExecuteWorkflow}
              disabled={isExecuting}
            >
              {isExecuting ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <Play />
              )}
              Execute
            </Button>
          </Panel>

          <Panel position="top-right">
            <Button
              className="border border-2 bg-neutral-100 border-blue-400 h-10 w-10"
              variant="ghost"
              onClick={() => openPicker(nodes.length === 0 ? "trigger" : "action")}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </Panel>

          <MiniMap />
          <Background />
          <Controls orientation="horizontal" />
        </ReactFlow>
      </div>

      {/* PICKER SHEET */}
      <Sheet open={isPickerOpen} onOpenChange={setIsPickerOpen}>
        <SheetContent className="bg-gradient-to-b from-zinc-300 to-slate-300">
          {pickerMode === "trigger" ? (
            <>
              <SheetHeader className="mt-10">
                <SheetTitle className="flex font-vietnam text-xl ml-2">
                  <SquarePower className="bg-zinc-300 border-2 border-zinc-100 mr-2 rounded-md p-1 size-8" />
                  Select a trigger
                </SheetTitle>
                <SheetDescription className="font-vietnam text-neutral-600 ml-3">
                  A trigger starts your workflow
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-5 mx-5 mt-4">
                {STATIC_TRIGGERS.map((t) => (
                  <TriggerCard key={t.id} trigger={t} onSelect={handleSelectTrigger} />
                ))}
              </div>
            </>
          ) : (
            <>
              <SheetHeader className="mt-10">
                <SheetTitle className="font-vietnam">What happens next?</SheetTitle>
                <SheetDescription className="font-vietnam">
                  Add an action step
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-3 mx-5 mt-4">
                {[
                  { id: "telegram", name: "Telegram", type: "telegram" },
                  { id: "resend", name: "Resend", type: "resend" },
                ].map((app) => (
                  <ActionCard key={app.id} action={app} onSelect={handleSelectAction} />
                ))}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* NODE CONFIG DIALOG */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="font-vietnam">
          <DialogHeader>
            <DialogTitle>{String((selectedNode?.data as any)?.label ?? "Node")} Settings</DialogTitle>
            <DialogDescription>Configure this node</DialogDescription>
          </DialogHeader>

          <div className="mt-2">{renderNodeForm()}</div>

          {/* only show Save/Cancel when NOT a trigger's default UI */}
          {!(selectedNode?.type === "trigger" && isTrigger) && (
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsConfigOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-corporateBlue hover:bg-corporateBlue/95" onClick={handleSaveNodeConfig}>
                Save
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* CREDENTIAL DIALOG */}
      <CredentialDialog
        isOpen={isCredDialogOpen}
        onOpenChange={setIsCredDialogOpen}
        platform={credPlatform}
        credTitle={credTitle}
        setCredTitle={setCredTitle}
        setCredData={setCredData}
        creating={creatingCred}
        onCreate={handleCreateCredential}
      />
    </div>
  );
};

export default FlowPage;
