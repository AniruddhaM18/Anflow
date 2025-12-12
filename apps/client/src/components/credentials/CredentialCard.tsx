import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../lib/config";
import { toast } from "sonner";

import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import { Eye, EyeOff, Copy, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

// images
import telegramPng from "../../assets/telegramIcon.png?url";
import resendSvg from "../../assets/resendIcon.svg?url";

export type Credential = {
  id: string;
  userId: string;
  title: string;
  platform: "telegram" | "resend";
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

const fallbackLogo =
  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

const logos: Record<string, string> = {
  telegram: telegramPng,
  resend: resendSvg,
};

interface CredentialsCardsProps {
  onCredentialDeleted?: (credentialId: string) => void;
}

export function CredentialsCards({ onCredentialDeleted }: CredentialsCardsProps) {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});


  // -------------------------------
  // FETCH
  // -------------------------------
  const fetchCredentials = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/credentials/credential/all`,
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error("Failed to load credentials");
        return;
      }

      const fixed = res.data.credentials.map((c: any) => ({
        ...c,
        platform: c.platform ?? "telegram",
      }));

      setCredentials(
        [...fixed].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      );
    } catch (err) {
      toast.error("Error fetching credentials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);


  // -------------------------------
  // DELETE — with same UX as WorkflowCards
  // -------------------------------
  const deleteCredential = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Delete this credential? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);

    try {
      const res = await axios.delete(
        `${BACKEND_URL}/api/credentials/credential/${id}`,
        {
          withCredentials: true,
        }
      );

      if (!res.data.success) {
        toast.error(res.data.message || "Could not delete credential");
        return;
      }

      // instantly remove from UI
      setCredentials((prev) => prev.filter((c) => c.id !== id));

      onCredentialDeleted?.(id);

      toast.success("Credential deleted");
    } catch (err) {
      toast.error("Failed to delete credential");
    } finally {
      setDeletingId(null);
    }
  };


  // -------------------------------
  // RENDER SECRET FIELDS
  // -------------------------------
  const maskValue = (v: string) => {
    if (!v) return "";
    if (v.length <= 8) return "•".repeat(v.length);
    return v.slice(0, 4) + "•".repeat(v.length - 8) + v.slice(-4);
  };

  const toggleVisibility = (id: string, key: string) => {
    const composite = `${id}-${key}`;
    setVisibleKeys((prev) => ({ ...prev, [composite]: !prev[composite] }));
  };


  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-lg font-vietnam font-semibold">Loading credentials...</p>
      </div>
    );
  }

  if (credentials.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-lg font-vietnam font-semibold">No Credentials Found — Add One!</p>
      </div>
    );
  }


  // -------------------------------
  // CARD RENDER
  // -------------------------------
  return (
    <div className="flex flex-col gap-4 max-w-7xl">
      {credentials.map((cred) => {
        const logo = logos[cred.platform] ?? fallbackLogo;
        const isDeleting = deletingId === cred.id;

        return (
          <Card
            key={cred.id}
            className={`transition-all duration-200 bg-slate-300/20 font-vietnam ${
              isDeleting ? "opacity-40 scale-[0.98]" : "hover:shadow-md"
            }`}
          >
            <CardHeader className="pb-1">
              <div className="flex items-center justify-between">

                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <img src={logo} className="h-10 w-10 object-contain" />

                  <div>
                    <h3 className="font-vietnam text-lg font-medium">
                      {cred.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="rounded-sm bg-tangerine">{cred.platform}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Updated {new Date(cred.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* DELETE BUTTON */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-violetPurple hover:bg-violetPurple/40 p-0 h-8 w-8"
                  onClick={(e) => deleteCredential(cred.id, e)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="text-[10px]">...</span>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <Accordion type="single" collapsible>
                <AccordionItem value={cred.id} className="border-none">
                  <AccordionTrigger className="py-1 font-semibold text-violetPurple">
                    View Credentials
                  </AccordionTrigger>

                  <AccordionContent>
                    {Object.entries(cred.data).map(([key, val]) => {
                      const composite = `${cred.id}-${key}`;
                      const raw = typeof val === "string" ? val : JSON.stringify(val);

                      const display = visibleKeys[composite]
                        ? raw
                        : maskValue(raw);

                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium capitalize">
                                {key}
                              </span>
                            </div>

                            <Input disabled value={display} className="font-mono" />
                          </div>

                          <div className="flex flex-col gap-2 ml-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => toggleVisibility(cred.id, key)}
                            >
                              {visibleKeys[composite] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => navigator.clipboard.writeText(raw)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
