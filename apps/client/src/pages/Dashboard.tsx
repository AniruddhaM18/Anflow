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
import { CredentialsCards } from "../components/credentials/CredentialCard";
import { Loader2 } from "lucide-react";
import ExecutionsCards from "../components/ExecutionsCard";
import { WorkflowCards } from "../components/WorkflowCard";
import { BACKEND_URL } from "../lib/config";

const demoApplications = [
  { key: "telegram", name: "Telegram" },
  { key: "resend", name: "Resend (Mail)" },
];

export interface Credential {
  id: string;
  user_id: string;
  name: string;
  application: string;
  data: {
    apikey?: string;
    accessToken?: string;
    businessAccountId?: string;
  };
  created_at: string;
  updated_at: string;
}

const DashBoardPage = () => {
  const navigate = useNavigate();
  const [applications] = useState(demoApplications);
  const [selectedApp, setSelectedApp] = useState("");
  const [credName, setCredName] = useState("");
  const [credData, setCredData] = useState({});
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [loadingWorkflow, setLoadingWorkflow] = useState(false);
  const [executions, setExecutions] = useState([]);
  const [loadingExecutions, setLoadingExecutions] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllCredentials();
    fetchAllWorkflows();
    fetchAllExecutions();
  }, []);

  const fetchAllExecutions = async () => {
    setLoadingExecutions(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/execute`);

      const data = response.data;

      if (!data.success) {
        console.log(data.error);
        return;
      }
      setExecutions(data.executions);
    } catch (error) {
      console.log("Error fetching executions:", error);
    } finally {
      setLoadingExecutions(false);
    }
  }

  const fetchAllWorkflows = async () => {
    setLoadingWorkflow(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/workflows`
      );

      const data = response.data;

      if (!data.success) {
        console.log(data.error);
        return;
      }

      console.log(data.workflows);
      setWorkflows(data.workflows);

    } catch (error) {
      console.log("Error fetching workflows:", error);

    } finally {
      setLoadingWorkflow(false);
    }
  }

  const handleWorkflowDeleted = (workflowId: string) => {
    setWorkflows(workflows.filter((workflow: any) => workflow.id !== workflowId));
    toast.success("Workflow deleted successfully!");
  };

  const fetchAllCredentials = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/credentials`);
      const data = response.data;

      if (!data.success) {
        console.log(data.error);
        setLoading(false);
        return;
      }

      const mapped = data.credentials.map((c: Credential) => ({
        id: c.id,
        title: c.name,
        platform: c.application,
        data: c.data,
        updatedAt: c.updated_at,
      }));

      setCredentials(
        mapped.sort(
          (a: any, b: any) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      );
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };


  const handleCreateCredentials = async () => {
    setIsCreating(true);
    try {
      const payload = {
        name: credName,
        application: selectedApp,
        data: credData,
      };
      // console.log(payload);

      const response = await axios.post(`${BACKEND_URL}/credentials/create`, payload);

      const data = response.data;

      if (!data.success) {
        toast.error(data.message);
        console.log(data.error);
        return;
      }

      toast.success(data.message);

      setCredName("");
      setCredData({});
      setSelectedApp("");
      setIsDialogOpen(false);

      await fetchAllCredentials();
    } catch (error) {
      console.error("Error creating credential:", error);
      toast.error("Failed to create credential");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCredential = async (id: string) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/credentials/${id}`
      );
      const data = response.data;
      if (!data.success) {
        toast.error(data.message || "Delete failed");
        return;
      }
      setCredentials((prev) => prev.filter((c) => c.id !== id));
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };
  return (
    <div className="m-16 mx-auto max-w-7xl w-full">
      <div className="flex justify-between">
        <div className="">
          <div className="text-xl font-bold font-vietnam text-corporateBlue">
            Dashboard
          </div>
          <div className="font-inter">
            All the workflows, credentials and executions you have access to
          </div>
        </div>
        <div className="flex items-center gap-2 font-vietnam">
          <Button
            onClick={() => navigate("/workflow")}
            className="bg-corporateBlue hover:bg-corporateBlue/90 rounded-sm "
          >
            Create Workflow
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-corporateBlue hover:bg-corporateBlue/90 rounded-sm ">Create Credentials</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-vietnam font-bold text-corporateBlue">
                  Select Application
                </DialogTitle>
                <DialogDescription>
                  Choose an application to create credentials for
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Select
                  onValueChange={(value) => setSelectedApp(value)}
                  value={selectedApp}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Application" />
                  </SelectTrigger>
                  <SelectContent>
                    {applications.map((app) => (
                      <SelectItem key={app.key} value={app.key}>
                        {app.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="space-y-3 font-inter">
                  <Input
                    placeholder="Credential Name"
                    value={credName}
                    onChange={(e) => setCredName(e.target.value)}
                  />

                  {selectedApp === "telegram" && (
                    <TgCredentials onDataChange={setCredData} />
                  )}

                  {selectedApp === "resend" && (
                    <ResendCredential onDataChange={setCredData} />
                  )}
                  <Button
                    className="font-vietnam w-full bg-corporateBlue"
                    onClick={handleCreateCredentials}
                    disabled={isCreating || !selectedApp || !credName}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Credential"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-10 h-full w-full">
        <Tabs defaultValue="workflows" className="font-inter">
          <TabsList>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="executions">Executions</TabsTrigger>
          </TabsList>
          <TabsContent value="workflows">
            {loadingWorkflow ? (
              <div className="h-[600px] w-full justify-center flex items-center">
                <Loader2 className="animate-spin text-corporateBlue" />
              </div>
            ) :
              <WorkflowCards workflows={workflows} onWorkflowDeleted={handleWorkflowDeleted} />}
          </TabsContent>
          <TabsContent value="credentials">
            {loading ? (
              <div className="h-[600px] w-full justify-center flex items-center">
                <Loader2 className="animate-spin text-corporateBlue" />
              </div>
            ) : (
              <CredentialsCards
                credentials={credentials}
                onDelete={handleDeleteCredential}
              />
            )}
          </TabsContent>
          <TabsContent value="executions">
            {loadingExecutions ? (
              <div className="h-[600px] w-full justify-center flex items-center">
                <Loader2 className="animate-spin text-corporateBlue" />
              </div>
            ) : (
              <ExecutionsCards executions={executions as any} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashBoardPage;