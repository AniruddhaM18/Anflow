import { useState } from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { Eye, EyeOff, Copy, Edit, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import type { Credential } from "./useCredentials";

import telegram from "../../assets/telegramIcon.png";
import resend from "../../assets/resendIcon.svg";

const logos: Record<string, string> = {
  telegram,
  resend,
};

interface CredentialsCardProps {
  credentials: Credential[];
  onDelete?: (id: string) => void;
}

export function CredentialsCards({ credentials, onDelete }: CredentialsCardProps) {
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [editingById, setEditingById] = useState<Record<string, boolean>>({});
  const [editedValuesById, setEditedValuesById] =
    useState<Record<string, Record<string, string>>>({});

  const toggleVisibility = (credId: string, field: string) => {
    const key = `${credId}-${field}`;
    setVisibleKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const maskValue = (v: string) => {
    if (v.length <= 8) return "•".repeat(v.length);
    return v.slice(0, 4) + "•".repeat(v.length - 8) + v.slice(-4);
  };

  const startEdit = (cred: Credential) => {
    setEditingById((prev) => ({ ...prev, [cred.id]: true }));
    setEditedValuesById((prev) => ({
      ...prev,
      [cred.id]: { ...(cred.data as Record<string, string>) },
    }));
  };

  const saveEdit = (cred: Credential) => {
    // UI–only update (no backend update route)
    setEditingById((prev) => ({ ...prev, [cred.id]: false }));
  };

  const changeField = (credId: string, key: string, value: string) => {
    setEditedValuesById((prev) => ({
      ...prev,
      [credId]: { ...prev[credId], [key]: value },
    }));
  };

  const renderFields = (cred: Credential) => {
    const isEditing = editingById[cred.id];
    const entries = Object.entries(cred.data || {});

    if (entries.length === 0)
      return <p className="text-muted-foreground text-sm">No stored fields</p>;

    return (
      <div className="space-y-3">
        {entries.map(([key, originalValue]) => {
          const composite = `${cred.id}-${key}`;
          const currentValue =
            editedValuesById[cred.id]?.[key] ?? (originalValue as string);
          const displayValue =
            isEditing || visibleKeys[composite]
              ? currentValue
              : maskValue(currentValue);

          return (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>

                  <Badge variant="outline" className="text-xs">
                    Secret
                  </Badge>
                </div>

              <Input
                value={displayValue}
                disabled={!isEditing}
                onChange={(e) => changeField(cred.id, key, e.target.value)}
                className="font-mono"
              />
            </div>

              <div className="flex items-center gap-1 ml-3">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
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
                  className="h-8 w-8 p-0"
                  onClick={() => copyToClipboard(currentValue)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (credentials.length === 0)
    return (
      <div className="h-[600px] flex items-center justify-center">
        <p className="font-kode font-bold text-xl">
          No Credentials Yet — Create One!
        </p>
      </div>
    );

  return (
    <div className="space-y-2">
      {credentials.map((cred) => (
        <Card key={cred.id}>
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={logos[cred.platform] ?? ""}
                  className="h-10 w-10"
                  alt=""
                />

                <div>
                  <h3 className="font-kode text-lg font-semibold">
                    {cred.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{cred.platform}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Last updated{" "}
                      {new Date(cred.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {editingById[cred.id] ? (
                  <Button size="sm" onClick={() => saveEdit(cred)}>
                    Save
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(cred)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive"
                  onClick={() => onDelete?.(cred.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <Accordion type="single" collapsible>
              <AccordionItem value={cred.id} className="border-none">
                <AccordionTrigger className="py-1">
                  <span className="text-sm font-extrabold text-orange-500 font-kode">
                    View Credentials
                  </span>
                </AccordionTrigger>

                <AccordionContent>{renderFields(cred)}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
