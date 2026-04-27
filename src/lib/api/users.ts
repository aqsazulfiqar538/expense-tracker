import { apiClient } from "@/lib/apiClient"
import { unwrap, unwrapList } from "@/lib/jsonapi"
import type { User, PublicUser } from "@/types/user"

export const getProfile = async (): Promise<User> => {
  const res = await apiClient.get("/api/v1/users/profile")
  return unwrap<User>(res.data)
}

export const searchUsers = async (query: string): Promise<PublicUser[]> => {
  const res = await apiClient.get("/api/v1/users/search", { params: { q: query } })
  return unwrapList<PublicUser>(res.data)
}
