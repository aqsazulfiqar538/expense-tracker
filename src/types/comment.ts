import type { UserSummary } from "@/types/user"

export type CommentType = "user_comment" | "system_comment"

export type Comment = {
  id: string
  content: string
  comment_type: CommentType
  created_at: string
  user: UserSummary
}
