"use client"

import { Select } from "@/components/ui/Select"
import { GROUP_TYPES, type GroupType } from "@/types/group"

type Props = {
  value: GroupType
  onChange: (type: GroupType) => void
  label?: string
}

export const GroupTypeSelect = ({ value, onChange, label = "Group type" }: Props) => {
  return (
    <Select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as GroupType)}
    >
      {GROUP_TYPES.map((t) => (
        <option key={t.value} value={t.value}>{t.label}</option>
      ))}
    </Select>
  )
}
