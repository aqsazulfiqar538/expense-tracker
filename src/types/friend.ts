import type { UserSummary } from "@/types/user"

export type FriendshipStatus = "pending" | "accepted" | "rejected"

export type Friendship = {
  id: string
  status: FriendshipStatus
  created_at: string
  friend: UserSummary
  requested_by_me: boolean
}
