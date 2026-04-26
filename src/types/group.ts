import type { UserSummary } from "@/types/user"

export type GroupType = "other" | "home" | "trip" | "couple" | "apartment"

export const GROUP_TYPES: ReadonlyArray<{ value: GroupType; label: string }> = [
  { value: "other", label: "Other" },
  { value: "home", label: "Home" },
  { value: "trip", label: "Trip" },
  { value: "couple", label: "Couple" },
  { value: "apartment", label: "Apartment" },
]

export type Group = {
  id: string
  name: string
  group_type: GroupType
  created_at: string
  user_count: number
  users: UserSummary[]
  created_by: UserSummary
}

export type CreateGroupInput = {
  name: string
  group_type?: GroupType
  member_ids: number[]
}

export type UpdateGroupInput = {
  name?: string
  group_type?: GroupType
}
