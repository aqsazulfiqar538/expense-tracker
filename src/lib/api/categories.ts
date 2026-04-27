import { apiClient } from "@/lib/apiClient"
import { unwrap } from "@/lib/jsonapi"
import type { Category, CreateCategoryInput } from "@/types/category"

type RawCategoryResource = {
  id: string
  attributes: Omit<Category, "id" | "subcategories">
  relationships?: {
    subcategories?: { data: { type: string; id: string }[] }
  }
}
type RawCategoriesResponse = {
  data: RawCategoryResource[] //parent here
  included?: RawCategoryResource[] //child here
}

export const listCategories = async (): Promise<Category[]> => {
  const res = await apiClient.get<RawCategoriesResponse>("/api/v1/categories")
  return buildCategoryTree(res.data)
}

const buildCategoryTree = (payload: RawCategoriesResponse): Category[] => {
  const subcategoryById = new Map<string, RawCategoryResource>()
  for (const item of payload.included ?? []) {
    subcategoryById.set(item.id, item)
  }

  return payload.data.map((parent) => {
    const subRefs = parent.relationships?.subcategories?.data ?? [] //"data" is child ids in the parent
    const subcategories: Category[] = subRefs
      .map((ref) => subcategoryById.get(ref.id))//For each child id reference, look up the full data in phone book
      .filter((c): c is RawCategoryResource => c !== undefined)//remove any that wasn't found
      .map((c) => ({ id: c.id, ...c.attributes, subcategories: [] }))//convert each child into a clean category object
    return { id: parent.id, ...parent.attributes, subcategories }//return complete parent with child attached
  })
}

export const createCategory = async (input: CreateCategoryInput): Promise<Category> => {
  const res = await apiClient.post("/api/v1/categories", { category: input })

  const flat = unwrap<Omit<Category, "subcategories">>(res.data)
  return { ...flat, subcategories: [] }
}
