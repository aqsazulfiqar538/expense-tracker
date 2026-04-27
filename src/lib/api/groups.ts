import { apiClient } from "@/lib/apiClient"
import { unwrap, unwrapList } from "@/lib/jsonapi"
import type { Group, CreateGroupInput, UpdateGroupInput } from "@/types/group"
import type { Expense } from "@/types/expense"
import type { Paginated, PaginationMeta } from "@/types/api"

type RawList = {
  data: Array<{ id: string; type: string; attributes: Record<string, unknown> }>
  meta: PaginationMeta
}

type RawGroupShow = {
  data: { id: string; type: string; attributes: Record<string, unknown> }
  expenses: { data: Array<{ id: string; type: string; attributes: Record<string, unknown> }> }
}

export type GroupWithExpenses = Group & { expenses: Expense[] }

export const listGroups = async (): Promise<Paginated<Group>> => {
  const res = await apiClient.get<RawList>("/api/v1/groups")
  return {
    items: unwrapList<Group>(res.data),
    meta: res.data.meta,
  }
}

export const getGroup = async (id: string): Promise<GroupWithExpenses> => {
  const res = await apiClient.get<RawGroupShow>(`/api/v1/groups/${id}`)
  const group = unwrap<Group>({ data: res.data.data })
  const expenses = unwrapList<Expense>(res.data.expenses)
  return { ...group, expenses }
}

export const createGroup = async (input: CreateGroupInput): Promise<Group> => {
  const { name, group_type, member_ids } = input
  const res = await apiClient.post("/api/v1/groups", {
    group: { name, group_type },
    member_ids,
  })
  return unwrap<Group>(res.data)
}

export const updateGroup = async (id: string, input: UpdateGroupInput): Promise<Group> => {
  const res = await apiClient.patch(`/api/v1/groups/${id}`, { group: input })
  return unwrap<Group>(res.data)
}

export const deleteGroup = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/v1/groups/${id}`)
}
