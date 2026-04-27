import { apiClient } from "@/lib/apiClient"
import { unwrap } from "@/lib/jsonapi"
import type { User } from "@/types/user"

// Backend route: GET /api/v1/users/profile (users#profile). This returns the
// CURRENT user — there is no /users/me, despite the name being a common
// convention. AuthContext calls this on mount when a token exists in
// localStorage, since we don't keep the user object in storage (it can drift
// from the source of truth).
export const getProfile = async (): Promise<User> => {
  const res = await apiClient.get("/api/v1/users/profile")
  // why unwrap: the endpoint returns JSON:API shape via UserSerializer.
  // See ARCHITECTURE.md §8.
  return unwrap<User>(res.data)
}
