import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import TgCredentials from "./TelegramCredential";
import ResendCredential from "./ResendCredential";
import { Loader2 } from "lucide-react";

export const CredentialDialog = ({
  isOpen,
  onOpenChange,
  platform,
  credTitle,
  setCredTitle,
  setCredData,
  creating,
  onCreate
}: any) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="font-vietnam">
        <DialogHeader>
          <DialogTitle>Create {platform} Credential</DialogTitle>
          <DialogDescription>Add a new credential</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Credential Name"
            value={credTitle}
            onChange={(e) => setCredTitle(e.target.value)}
          />

          {platform === "telegram" && <TgCredentials onDataChange={setCredData} />}
          {platform === "resend" && <ResendCredential onDataChange={setCredData} />}

          <Button
            className="w-full bg-corporateBlue hover:bg-corporateBlue/90"
            onClick={onCreate}
            disabled={creating}
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Credential"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
