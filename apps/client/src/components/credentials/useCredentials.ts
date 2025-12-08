import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../lib/config";
import { toast } from "sonner";

export type Credential = {
  id: string;
  userId: string;
  title: string;
  platform: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

export const useCredentials = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isCredDialogOpen, setIsCredDialogOpen] = useState(false);
  const [creatingCred, setCreatingCred] = useState(false);

  const [credPlatform, setCredPlatform] = useState("");
  const [credTitle, setCredTitle] = useState("");
  const [credData, setCredData] = useState<Record<string, any>>({});

  const fetchAllCredentials = async () => {
    try {
      // FIXED ROUTE
      const response = await axios.get(
        `${BACKEND_URL}/api/credentials/credential/all`,
        { withCredentials: true }
      );

      const data = response.data;

      if (!data.success) return;

      setCredentials(
        data.credentials.sort(
          (a: Credential, b: Credential) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
        )
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchAllCredentials();
  }, []);

  const openCreateCredentialDialog = (platform: string) => {
    setCredPlatform(platform);
    setCredTitle("");
    setCredData({});
    setIsCredDialogOpen(true);
  };

  const handleCreateCredential = async () => {
    setCreatingCred(true);

    try {
      const payload = {
        title: credTitle,
        platform: credPlatform,
        data: credData,
      };

      // FIXED ROUTE
      const response = await axios.post(
        `${BACKEND_URL}/api/credentials/credential/create`,
        payload,
        { withCredentials: true }
      );

      const result = response.data;

      if (!result.success) {
        toast.error(result.message || "Failed to create credential");
        return;
      }

      toast.success("Credential created successfully");
      await fetchAllCredentials();
      setIsCredDialogOpen(false);

    } catch (e) {
      toast.error("Error creating credential");
    } finally {
      setCreatingCred(false);
    }
  };

  return {
    credentials,
    isCredDialogOpen,
    setIsCredDialogOpen,

    credPlatform,
    credTitle,
    credData,

    setCredTitle,
    setCredData,
    openCreateCredentialDialog,

    creatingCred,
    handleCreateCredential,
  };
};
