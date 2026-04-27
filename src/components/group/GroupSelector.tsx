"use client"

import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { GroupTypeSelect } from "@/components/group/GroupTypeSelect"
import type { Group, GroupType } from "@/types/group"

export type GroupChoice =
  | { kind: "none" }
  | { kind: "existing"; group_id: number }
  | { kind: "new"; name: string; group_type: GroupType }

type Props = {
  groups: Group[]
  value: GroupChoice
  onChange: (choice: GroupChoice) => void
}

export const GroupSelector = ({ groups, value, onChange }: Props) => {
  return (
    <div className="space-y-3 pt-2 border-t border-gray-100">
      <p className="text-sm font-medium text-gray-700">Group (optional)</p>

      <div className="flex flex-wrap gap-4 text-sm">
        <ModeRadio label="None" checked={value.kind === "none"} onSelect={() => onChange({ kind: "none" })} />
        <ModeRadio label="Existing" checked={value.kind === "existing"} onSelect={() => onChange({ kind: "existing", group_id: groups[0] ? Number(groups[0].id) : 0 })} />
        <ModeRadio label="Create new" checked={value.kind === "new"} onSelect={() => onChange({ kind: "new", name: "", group_type: "other" })} />
      </div>

      {value.kind === "existing" && (
        groups.length === 0 ? (
          <p className="text-xs text-gray-500">You haven&apos;t joined any groups yet.</p>
        ) : (
          <Select
            label="Pick a group"
            value={String(value.group_id)}
            onChange={(e) => onChange({ kind: "existing", group_id: Number(e.target.value) })}
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </Select>
        )
      )}

      {value.kind === "new" && (
        <div className="space-y-3">
          <Input
            label="Group name"
            name="new_group_name"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder="e.g. Lahore trip"
          />
          <GroupTypeSelect
            value={value.group_type}
            onChange={(group_type) => onChange({ ...value, group_type })}
          />
          <p className="text-xs text-gray-500">
            The expense&apos;s split friends will be added to this new group.
          </p>
        </div>
      )}
    </div>
  )
}

type ModeRadioProps = { label: string; checked: boolean; onSelect: () => void }

const ModeRadio = ({ label, checked, onSelect }: ModeRadioProps) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input type="radio" checked={checked} onChange={onSelect} className="accent-blue-600" />
    {label}
  </label>
)
