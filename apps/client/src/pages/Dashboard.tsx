import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useEffect, useState } from "react";
import ResendCredential from "../components/credentials/ResendCredential";
import TgCredentials from "../components/credentials/TelegramCredential";
import { Input } from "../components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ExecutionsCards from "../components/ExecutionsCard";
import { WorkflowCards } from "../components/WorkflowCard";
import { BACKEND_URL } from "../lib/config";
import { CredentialsCards } from "../components/credentials/CredentialCard";

const demoApplications = [
  { key: "telegram", name: "Telegram" },
  { key: "resend", name: "Resend (Mail)" },
];

const DashBoardPage = () => {
  const navigate = useNavigate();

  // dialog + credential creation
  const [selectedApp, setSelectedApp] = useState("");
  const [credName, setCredName] = useState("");
  const [credData, setCredData] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // workflows
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loadingWorkflow, setLoadingWorkflow] = useState(false);

  // executions
  const [executions, setExecutions] = useState<any[]>([]);
  const [loadingExecutions, setLoadingExecutions] = useState(false);

  // auth loading
  const [authLoading, setAuthLoading] = useState(true);

  // --------------------------------------
  // CHECK AUTH
  // --------------------------------------
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/auth/me`, { withCredentials: true })
      .then(() => setAuthLoading(false))
      .catch(() => navigate("/signin"));
  }, [navigate]);

  // --------------------------------------
  // FETCH WORKFLOWS
  // --------------------------------------
  const fetchAllWorkflows = async () => {
    setLoadingWorkflow(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/workflow/all`, {
        withCredentials: true,
      });

      const list = response.data.workflows || [];

      const mapped = list.map((w: any) => ({
        id: w.id,
        name: w.title,
        enabled: w.isEnabled,
        created_at: w.createdAt,
        updated_at: w.updatedAt,
      }));

      setWorkflows(mapped);
    } catch (err) {
      console.log("Error fetching workflows:", err);
      setWorkflows([]);
    } finally {
      setLoadingWorkflow(false);
    }
  };

  // --------------------------------------
  // FETCH EXECUTIONS
  // --------------------------------------
  const fetchAllExecutions = async () => {
    setLoadingExecutions(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/execute/all`, {
        withCredentials: true,
      });

      if (!res.data.success) return;

      const mapped = res.data.executions.map((e: any) => ({
        id: e.id,
        status: e.status,
        startedAt: e.startedAt,
        endedAt: e.endedAt,
        workflow: {
          id: e.workflow.id,
          title: e.workflow.title,
        },
      }));

      setExecutions(mapped);
    } catch (err) {
      console.log("Error fetching executions:", err);
    } finally {
      setLoadingExecutions(false);
    }
  };

  // --------------------------------------
  // INITIAL LOAD
  // --------------------------------------
  useEffect(() => {
    fetchAllWorkflows();
    fetchAllExecutions();
  }, []);

  // --------------------------------------
  // CREATE CREDENTIAL
  // --------------------------------------
  const handleCreateCredentials = async () => {
    setIsCreating(true);
    try {
      const payload = {
        title: credName,
        platform: selectedApp,
        data: credData,
      };

      const res = await axios.post(
        `${BACKEND_URL}/api/credentials/credential/create`,
        payload,
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success("Credential created");

      // reset UI
      setCredName("");
      setCredData({});
      setSelectedApp("");
      setIsDialogOpen(false);
    } catch (e) {
      toast.error("Failed to create credential");
    } finally {
      setIsCreating(false);
    }
  };

  // --------------------------------------
  // DELETE WORKFLOW
  // --------------------------------------
  const handleWorkflowDeleted = async (workflowId: string) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/api/workflow/${workflowId}`,
        { withCredentials: true }
      );

      if (!response.data.success) {
        toast.error(response.data.message || "Delete failed");
        return;
      }

      toast.success("Workflow deleted");

      setWorkflows(
        response.data.workflows.map((w: any) => ({
          id: w.id,
          name: w.title,
          enabled: w.isEnabled,
          created_at: w.createdAt,
          updated_at: w.updatedAt,
        }))
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error deleting workflow");
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin text-corporateBlue" />
      </div>
    );
  }

  // --------------------------------------
  // UI
  // --------------------------------------
  return (
    <div className="m-16 mx-auto max-w-7xl w-full font-vietnam">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-corporateBlue">Dashboard</h1>
          <p>All your workflows, credentials and executions</p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate("/workflows")}
            className="bg-corporateBlue hover:bg-corporateBlue/90"
          >
            Create Workflow
          </Button>

          {/* CREATE CREDENTIALS */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-corporateBlue hover:bg-corporateBlue/90">
                Create Credentials
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-corporateBlue font-bold">
                  Select Application
                </DialogTitle>
                <DialogDescription>
                  Choose an application to create credentials for.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 font-vietnam">
                {/* APP SELECT */}
                <Select
                  onValueChange={setSelectedApp}
                  value={selectedApp}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Application" />
                  </SelectTrigger>
                  <SelectContent>
                    {demoApplications.map((app) => (
                      <SelectItem key={app.key} value={app.key}>
                        {app.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* NAME */}
                <Input
                  placeholder="Credential Name"
                  value={credName}
                  onChange={(e) => setCredName(e.target.value)}
                />

                {/* DYNAMIC SUBFORM */}
                {selectedApp === "telegram" && (
                  <TgCredentials onDataChange={setCredData} />
                )}
                {selectedApp === "resend" && (
                  <ResendCredential onDataChange={setCredData} />
                )}

                <Button
                  className="w-full bg-corporateBlue"
                  onClick={handleCreateCredentials}
                  disabled={!selectedApp || !credName || isCreating}
                >
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {isCreating ? "Creating..." : "Create Credential"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* LOGOUT */}
          <Button
            onClick={async () => {
               await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
            withCredentials:true
            });
              navigate("/");
            }}
            className="bg-corporateBlue hover:bg-corporateBlue/90"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* TABS */}
      {/* -------------------------------------- */}
      <div className="mt-10">
        <Tabs defaultValue="workflows">
          <TabsList>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="executions">Executions</TabsTrigger>
          </TabsList>

          {/* WORKFLOWS */}
          <TabsContent value="workflows">
            {loadingWorkflow ? (
              <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="animate-spin text-corporateBlue" />
              </div>
            ) : (
              <WorkflowCards
                workflows={workflows}
                onWorkflowDeleted={handleWorkflowDeleted}
              />
            )}
          </TabsContent>

          {/* CREDENTIALS — Uses Your Updated Component */}
          <TabsContent value="credentials">
            <CredentialsCards
              onCredentialDeleted={() => {
                // dashboard doesn’t store credentials anymore, but you can reload workflows/executions here if needed
              }}
            />
          </TabsContent>

          {/* EXECUTIONS */}
          <TabsContent value="executions">
            {loadingExecutions ? (
              <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="animate-spin text-corporateBlue" />
              </div>
            ) : (
              <ExecutionsCards executions={executions} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashBoardPage;
