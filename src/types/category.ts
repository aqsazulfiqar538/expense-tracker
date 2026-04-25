
export type Category = {
  id: string
  name: string
  active: boolean
  parent_id: number | null
  custom: boolean
  subcategories: Category[]
}

export type CreateCategoryInput = {
  name: string
  parent_id?: number | null
}
