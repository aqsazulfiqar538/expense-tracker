import { apiClient } from "@/lib/apiClient"
import { unwrap } from "@/lib/jsonapi"
import type { Group } from "@/types/group"

export const addGroupMember = async (groupId: string, userId: number): Promise<Group> => {
  const res = await apiClient.post(`/api/v1/groups/${groupId}/members`, { user_id: userId })
  return unwrap<Group>(res.data)
}

export const removeGroupMember = async (groupId: string, userId: number): Promise<void> => {
  await apiClient.delete(`/api/v1/groups/${groupId}/members/${userId}`)
}
