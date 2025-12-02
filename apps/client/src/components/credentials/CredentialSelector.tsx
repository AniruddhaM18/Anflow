import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { type Credential } from "./useCredentials";

export const CredentialSelector = ({
  appType,
  value,
  credentials,
  onAdd,
  onChange
}: {
  appType: string;
  value: string;
  credentials: Credential[];
  onAdd: () => void;
  onChange: (v: string) => void;
}) => {
  const items = credentials.filter((c) => c.application === appType);

  return (
    <Select
      value={value || ""}
      onValueChange={(val) => {
        if (val === "__add__") return onAdd();
        onChange(val);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Credential" />
      </SelectTrigger>
      <SelectContent>
        {items.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
        <SelectItem value="__add__">+ Add Credential…</SelectItem>
      </SelectContent>
    </Select>
  );
};
