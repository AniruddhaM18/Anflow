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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import axios from "axios";
import { toast } from "sonner";

import { FlaskConical, Loader2, Plus, Copy, SheetIcon, SquarePower, Play } from "lucide-react";
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

import { BACKEND_URL } from "../lib/config";

// Credential system
import { useCredentials } from "../components/credentials/useCredentials";
import { CredentialSelector } from "../components/credentials/CredentialSelector";
import { CredentialDialog } from "../components/credentials/CredentialDialog";

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

// ⭐ NEW — Static trigger list (instead of fetching from backend)
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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<Node, Edge> | null>(null);
  const [pendingViewport, setPendingViewport] = useState<any>(null);

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

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [formData, setFormData] = useState<any>({});

  // Credential hook
  const {
    credentials,
    isCredDialogOpen,
    setIsCredDialogOpen,
    creatingCred,
    credSelectedApp,
    credName,
    credData,
    setCredName,
    setCredData,
    openCreateCredentialDialog,
    handleCreateCredential,
  } = useCredentials();

  const saveFlow = useCallback(() => {
    return rfInstance?.toObject();
  }, [rfInstance]);

  // Picker modal state
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<"trigger" | "action">("trigger");

  // ⭐ SIMPLIFIED — no backend call
  const openPicker = (mode: "trigger" | "action") => {
    setPickerMode(mode);
    setIsPickerOpen(true);
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
    setFormData((node.data as any)?.config || {});
    setIsConfigOpen(true);
  }, []);

  const updateForm = (k: string, v: any) => setFormData((prev) => ({ ...prev, [k]: v }));

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
        const res = await axios.get(`${BACKEND_URL}/workflows/${id}`);

        if (!res.data.success) {
          toast.error(res.data.message);
          return;
        }

        const wf = res.data.workflow;

        setWorkflowName(wf.name || "");
        setEnable(wf.enabled || false);

        if (wf.flow) {
          const flow = wf.flow;
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
          setPendingViewport(flow.viewport || null);
        }
      } catch {
        toast.error("Failed to fetch workflow");
      }

      setLoading(false);
    };

    fetchWorkflow();
  }, [id]);

  const handleSaveWorkflow = async () => {
    setSaving(true);
    const flow = saveFlow();

    try {
      if (id) {
        const res = await axios.put(`${BACKEND_URL}/workflows/${id}`, {
          name: workflowName,
          enabled: enable,
          nodes,
          edges,
          flow,
        });

        if (!res.data.success) return toast.error(res.data.message);
        toast.success(res.data.message);
      } else {
        const res = await axios.post(`${BACKEND_URL}/workflows/create`, {
          name: workflowName,
          enabled: enable,
          nodes,
          edges,
          flow,
        });

        if (!res.data.success) return toast.error(res.data.message);

        toast.success(res.data.message);
        navigate(`/workflows/${res.data.workflow.id}`);
      }
    } catch {
      toast.error("Failed to save workflow");
    }

    setSaving(false);
  };

  // Add node handlers
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

  const handleSelectAction = (action) => {
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

  const handleExecuteWorkflow = async () => {
    setIsExecuting(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/execute`, { workflowId: id });
      const data = res.data;

      if (!data.success) {
        toast.error(data.message);
        setIsExecuting(false);
        return;
      }

      const statuses: any = {};
      nodes.forEach((n) => (statuses[n.id] = "IDLE"));
      setNodeStatuses(statuses);

      const es = new EventSource(`${BACKEND_URL}/execute/stream`, { withCredentials: true });

      es.onmessage = (ev) => {
        try {
          const evt = JSON.parse(ev.data);
          if (evt.executionId !== data.executionId) return;
          setNodeStatuses((prev) => ({ ...prev, [evt.nodeId]: evt.status }));
        } catch {}
      };

      es.onerror = () => {
        es.close();
        setIsExecuting(false);
      };
    } finally {
      setIsExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="m-16 mx-auto max-w-7xl w-full flex items-center justify-center h-[850px]">
        <Loader2 className="animate-spin text-corporateBlue" />
      </div>
    );
  }

  // Render forms
  const nodeFormRenderers = {
    trigger: {
      "manual-trigger": () => (
        <Button className="bg-corporateBlue" onClick={handleExecuteWorkflow} disabled={isExecuting}>
          {isExecuting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FlaskConical />}
          Execute Workflow
        </Button>
      ),

      "webhook-trigger": () => {
        const url = id ? `${BACKEND_URL}/webhook/${id}` : "";
        return (
          <div className="flex flex-col gap-3">
            <Label>Webhook URL</Label>
            <div className="flex gap-2">
              <Input value={url} readOnly />
              <Button
                className="bg-corporateBlue"
                onClick={() => navigator.clipboard.writeText(url).then(() => toast.success("Copied"))}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
            </div>
          </div>
        );
      },
    },

    action: {
      telegram: (fd, update) => (
        <div className="flex flex-col gap-3">
          <Label>Credential</Label>
          <CredentialSelector
            appType="telegram"
            credentials={credentials}
            value={fd.credential}
            onAdd={() => openCreateCredentialDialog("telegram")}
            onChange={(v) => update("credential", v)}
          />

          <Label>Chat ID</Label>
          <Input value={fd.chatId || ""} onChange={(e) => update("chatId", e.target.value)} />

          <Label>Message</Label>
          <Input value={fd.message || ""} onChange={(e) => update("message", e.target.value)} />
        </div>
      ),

      resend: (fd, update) => (
        <div className="flex flex-col gap-3">
          <Label>Credential</Label>
          <CredentialSelector
            appType="resend"
            credentials={credentials}
            value={fd.credential}
            onAdd={() => openCreateCredentialDialog("resend")}
            onChange={(v) => update("credential", v)}
          />

          <Label>To</Label>
          <Input value={fd.to || ""} onChange={(e) => update("to", e.target.value)} />

          <Label>Subject</Label>
          <Input value={fd.subject || ""} onChange={(e) => update("subject", e.target.value)} />

          <Label>Body</Label>
          <Input value={fd.body || ""} onChange={(e) => update("body", e.target.value)} />
        </div>
      ),
    },
  };

  const renderNodeForm = () => {
    if (!selectedNode) return null;
    const nodeKind = selectedNode.type;
    const nodeType = (selectedNode.data as any)?.type;
    const renderer = nodeFormRenderers[nodeKind]?.[nodeType];
    return renderer ? renderer(formData, updateForm) : <div>No config</div>;
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden pt-14">
      {/* HEADER */}
      <div className="flex h-16 items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="font-vietnam font-medium text-neutral-700 ml-2 ">Workflow</div>
          <Input 
            placeholder="workflow name"
            className="font-vietnam border-zinc-200 border-2"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
          />
          
        </div>
        <div className="flex items-center gap-5">
          <div className="flex gap-2 items-center font-vietnam">
            Enabled: <SlideToggle enabled={enable} setEnable={setEnable} />
            <span className="text-sm opacity-70">{enable ? "On" : "Off"}</span>
          </div>

          <Button className="bg-corporateBlue font-vietnam hover:bg-corporateBlue/85 mr-2" onClick={handleSaveWorkflow} disabled={saving}>
            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Save"}
          </Button>
        </div>
      </div>

      {/* REACTFLOW CANVAS */}
      <div className="flex-1 w-full bg-neutral-100 ">
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
            <Button className="bg-corporateBlue font-vietnam" onClick={handleExecuteWorkflow} disabled={isExecuting}>
              {isExecuting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Play />}
              Execute
            </Button>
          </Panel>

          <Panel position="top-right">
            <Button
              className="border border-blue-400 h-10 w-10"
              variant="ghost"
              onClick={() => openPicker(nodes.length === 0 ? "trigger" : "action")}
            >
              <Plus className="h-4 w-4" />
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
                
                <SheetTitle className="flex font-vietnam text-xl ml-2"><SquarePower className=" bg-zinc-300 border-2 border-zinc-100 mr-2 rounded-md p-1 size-8 "/>
                   Select a trigger</SheetTitle>
                <SheetDescription className="font-vietnam text-neutral-600 ml-3">A trigger starts your workflow</SheetDescription>
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
                <SheetDescription className="font-vietnam">Add an action step</SheetDescription>
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
            <DialogTitle>{selectedNode?.data?.label || "Node"} Settings</DialogTitle>
            <DialogDescription>Configure this node</DialogDescription>
          </DialogHeader>

          <div className="mt-2">{renderNodeForm()}</div>

          {!(
            selectedNode?.type === "trigger" &&
            ["manual-trigger", "webhook-trigger"].includes(selectedNode.data?.type)
          ) && (
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsConfigOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-corporateBlue" onClick={handleSaveNodeConfig}>
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
        app={credSelectedApp}
        credName={credName}
        setCredName={setCredName}
        setCredData={setCredData}
        creating={creatingCred}
        onCreate={handleCreateCredential}
      />
    </div>
  );
};
