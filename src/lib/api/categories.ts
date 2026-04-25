import { apiClient } from "@/lib/apiClient"
import { unwrap } from "@/lib/jsonapi"
import type { Category, CreateCategoryInput } from "@/types/category"

type RawCategoryAttributes = {
  name: string
  active: boolean
  parent_id: number | null
  custom: boolean
}
type RawCategoryResource = {
  id: string
  type: "category"
  attributes: RawCategoryAttributes
  relationships?: {
    subcategories?: { data: { type: string; id: string }[] }
  }
}
type RawCategoriesResponse = {
  data: RawCategoryResource[]
  included?: RawCategoryResource[]
}

export const listCategories = async (): Promise<Category[]> => {
  const res = await apiClient.get<RawCategoriesResponse>("/api/v1/categories")
  return buildCategoryTree(res.data)
}

const buildCategoryTree = (payload: RawCategoriesResponse): Category[] => {
  const subcategoryById = new Map<string, RawCategoryResource>()
  for (const item of payload.included ?? []) {
    if (item.type === "category") subcategoryById.set(item.id, item)
  }

  return payload.data.map((parent) => {
    const subRefs = parent.relationships?.subcategories?.data ?? []
    const subcategories: Category[] = subRefs
      .map((ref) => subcategoryById.get(ref.id))
      .filter((c): c is RawCategoryResource => c !== undefined)
      .map((c) => ({ id: c.id, ...c.attributes, subcategories: [] }))
    return { id: parent.id, ...parent.attributes, subcategories }
  })
}

export const createCategory = async (input: CreateCategoryInput): Promise<Category> => {
  const res = await apiClient.post("/api/v1/categories", { category: input })

  const flat = unwrap<Omit<Category, "subcategories">>(res.data)
  return { ...flat, subcategories: [] }
}
