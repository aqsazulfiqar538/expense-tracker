import { apiClient } from "@/lib/apiClient"
import { unwrap, unwrapList } from "@/lib/jsonapi"
import type { Comment } from "@/types/comment"
import type { Paginated, PaginationMeta } from "@/types/api"

type RawList = {
  data: Array<{ id: string; type: string; attributes: Record<string, unknown> }>
  meta: PaginationMeta
}

export const listComments = async (expenseId: string): Promise<Paginated<Comment>> => {
  const res = await apiClient.get<RawList>(`/api/v1/expenses/${expenseId}/comments`)
  return {
    items: unwrapList<Comment>(res.data),
    meta: res.data.meta,
  }
}

export const createComment = async (expenseId: string, content: string): Promise<Comment> => {
  const res = await apiClient.post(`/api/v1/expenses/${expenseId}/comments`, { content })
  return unwrap<Comment>(res.data)
}

export const deleteComment = async (expenseId: string, commentId: string): Promise<void> => {
  await apiClient.delete(`/api/v1/expenses/${expenseId}/comments/${commentId}`)
}
