import { apiClient } from "@/lib/apiClient"
import { unwrap, unwrapList } from "@/lib/jsonapi"
import type { Friendship } from "@/types/friend"
import type { Paginated, PaginationMeta } from "@/types/api"

type RawList = {
  data: Array<{ id: string; type: string; attributes: Record<string, unknown> }>
  meta: PaginationMeta
}

export const listFriendRequests = async (): Promise<Paginated<Friendship>> => {
  const res = await apiClient.get<RawList>("/api/v1/friends/requests")
  return {
    items: unwrapList<Friendship>(res.data),
    meta: res.data.meta,
  }
}

export const acceptFriendRequest = async (friendshipId: string): Promise<Friendship> => {
  const res = await apiClient.patch(`/api/v1/friends/${friendshipId}/accept`)
  return unwrap<Friendship>(res.data)
}

export const rejectFriendRequest = async (friendshipId: string): Promise<void> => {
  await apiClient.patch(`/api/v1/friends/${friendshipId}/reject`)
}
