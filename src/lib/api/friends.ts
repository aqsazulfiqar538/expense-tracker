import { apiClient } from "@/lib/apiClient"
import { unwrap, unwrapList } from "@/lib/jsonapi"
import type { Friendship } from "@/types/friend"
import type { Paginated, PaginationMeta } from "@/types/api"

type RawList = {
  data: Array<{ id: string; type: string; attributes: Record<string, unknown> }>
  meta: PaginationMeta
}

export const listFriends = async (): Promise<Paginated<Friendship>> => {
  const res = await apiClient.get<RawList>("/api/v1/friends")
  return {
    items: unwrapList<Friendship>(res.data),
    meta: res.data.meta,
  }
}

export const sendFriendRequest = async (friendUserId: number | string): Promise<Friendship> => {
  const res = await apiClient.post("/api/v1/friends", { friend_id: friendUserId })
  return unwrap<Friendship>(res.data)
}

export const removeFriend = async (friendshipId: string): Promise<void> => {
  await apiClient.delete(`/api/v1/friends/${friendshipId}`)
}
