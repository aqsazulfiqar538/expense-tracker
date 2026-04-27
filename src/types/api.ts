// Cross-cutting types for the API layer.
//
// why `type` not `interface`: see ARCHITECTURE.md §1. These are flat data
// shapes, not extension points.

// ApiError is what every `lib/api/*.ts` function rejects with. The axios
// response interceptor in `lib/apiClient.ts` is responsible for normalizing
// every backend error shape — Rails returns `{errors: [...]}` from controllers
// and `{error: "..."}` from Devise — into this single type.
export type ApiError = {
  messages: string[]
  status: number
}

// Pagy returns this `meta` block on paginated endpoints. We model it once
// here so paginated lists across features can share the type.
export type PaginationMeta = {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
  next_page: number | null
  prev_page: number | null
}

export type Paginated<T> = {
  items: T[]
  meta: PaginationMeta
}
