import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../lib/config"
import { toast } from "sonner";

export type Credential = {
  id: string;
  user_id: string;
  name: string;
  application: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export const useCredentials = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isCredDialogOpen, setIsCredDialogOpen] = useState(false);
  const [creatingCred, setCreatingCred] = useState(false);
  const [credSelectedApp, setCredSelectedApp] = useState("");
  const [credName, setCredName] = useState("");
  const [credData, setCredData] = useState<Record<string, any>>({});
  const [pendingCredentialForNodeId, setPendingCredentialForNodeId] = useState<string | null>(null);

  const fetchAllCredentials = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/credentials`);
      const data = response.data;
      if (!data.success) return;

      setCredentials(
        data.credentials.sort(
          (a: Credential, b: Credential) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
      );
    } catch {}
  };

  useEffect(() => {
    fetchAllCredentials();
  }, []);

  const openCreateCredentialDialog = (app: string, forNodeId?: string) => {
    setCredSelectedApp(app);
    setCredName("");
    setCredData({});
    if (forNodeId) setPendingCredentialForNodeId(forNodeId);
    setIsCredDialogOpen(true);
  };

  const handleCreateCredential = async () => {
    setCreatingCred(true);
    try {
      const payload = { name: credName, application: credSelectedApp, data: credData };
      const response = await axios.post(`${BACKEND_URL}/credentials/create`, payload);
      const data = response.data;

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("Credential created");

      await fetchAllCredentials();
      setIsCredDialogOpen(false);
      setPendingCredentialForNodeId(null);

    } catch {
      toast.error("Failed to create credential");
    } finally {
      setCreatingCred(false);
    }
  };

  return {
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
    pendingCredentialForNodeId,
    setPendingCredentialForNodeId,
  };
};
