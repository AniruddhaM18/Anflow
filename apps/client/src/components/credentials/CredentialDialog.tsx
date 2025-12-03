import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import TgCredentials from "./TelegramCredential";
import ResendCredential from "./ResendCredential";
import { Loader2 } from "lucide-react";

export const CredentialDialog = ({
  isOpen,
  onOpenChange,
  app,
  credName,
  setCredName,
  setCredData,
  creating,
  onCreate,
}: any) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="font-vietnam">
        <DialogHeader>
          <DialogTitle>Create {app} Credential</DialogTitle>
          <DialogDescription>Add a new credential</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Credential Name"
            value={credName}
            onChange={(e) => setCredName(e.target.value)}
          />

          {app === "telegram" && <TgCredentials onDataChange={setCredData} />}
          {app === "resend" && <ResendCredential onDataChange={setCredData} />}

          <Button className="w-full bg-corporateBlue hover:bg-corporateBlue/90" onClick={onCreate} disabled={creating}>
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Credential"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
