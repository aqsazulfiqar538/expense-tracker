import { useState } from "react";
import { Group } from "@/types/group";

const GROUP_TYPES = ["other", "home", "trip", "couple", "apartment"];

type Props = {
  groups: Group[];
  groupId: string;
  newGroup: { name: string; group_type: string } | null;
  onGroupIdChange: (id: string) => void;
  onNewGroupChange: (g: { name: string; group_type: string } | null) => void;
  onModeChange: (mode: "none" | "existing" | "new") => void;
};

const GroupSelector = ({
  groups,
  groupId,
  newGroup,
  onGroupIdChange,
  onNewGroupChange,
  onModeChange,
}: Props) => {
  const [mode, setMode] = useState<"none" | "existing" | "new">("none");

  const handleModeChange = (next: "none" | "existing" | "new") => {
    setMode(next);
    onGroupIdChange("");
    onNewGroupChange(null);
    onModeChange(next);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">Group (optional)</p>

      <div className="flex gap-3 text-sm">
        {(["none", "existing", "new"] as const).map((m) => (
          <label key={m} className="flex items-center gap-1">
            <input
              type="radio"
              checked={mode === m}
              onChange={() => handleModeChange(m)}
              className="accent-blue-600"
            />
            {m === "none" ? "No group" : m === "existing" ? "Existing" : "Create new"}
          </label>
        ))}
      </div>

      {mode === "existing" && (
        <select
          value={groupId}
          onChange={(e) => onGroupIdChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Select a group</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.attributes.name}
            </option>
          ))}
        </select>
      )}
		
      {mode === "new" && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Group name"
            value={newGroup?.name ?? ""}
            onChange={(e) =>
              onNewGroupChange({
                name: e.target.value,
                group_type: newGroup?.group_type ?? "other",
              })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <select
            value={newGroup?.group_type ?? "other"}
            onChange={(e) =>
              onNewGroupChange({
                name: newGroup?.name ?? "",
                group_type: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {GROUP_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default GroupSelector;
