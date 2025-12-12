import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import type { Credential } from "./useCredentials";

export const CredentialSelector = ({
  platform,
  value,
  credentials,
  onAdd,
  onChange
}: {
  platform: string;
  value: string;
  credentials: Credential[];
  onAdd: () => void;
  onChange: (v: string) => void;
}) => {
  const filtered = credentials.filter((c) => c.platform === platform);

  return (
    <Select
      value={value || ""}
      onValueChange={(val) => {
        if (val === "__add__") return onAdd();
        onChange(val);
      }}
    >
      <SelectTrigger className="font-vietnam">
        <SelectValue placeholder="Select Credential" />
      </SelectTrigger>

      <SelectContent className="font-vietnam">
        {filtered.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.title}
          </SelectItem>
        ))}

        <SelectItem value="__add__">+ Add Credential…</SelectItem>
      </SelectContent>
    </Select>
  );
};
