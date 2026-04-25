import { apiClient } from "@/lib/apiClient"
import { unwrap, unwrapList } from "@/lib/jsonapi"
import type { Expense, ExpenseListFilters, CreateExpenseInput, UpdateExpenseInput } from "@/types/expense"
import type { Paginated, PaginationMeta } from "@/types/api"

type RawList = {
  data: Array<{ id: string; type: string; attributes: Record<string, unknown> }>
  meta: PaginationMeta
}

export const listExpenses = async (filters: ExpenseListFilters = {}): Promise<Paginated<Expense>> => {
  const res = await apiClient.get<RawList>("/api/v1/expenses", { params: filters })
  return {
    items: unwrapList<Expense>(res.data),
    meta: res.data.meta,
  }
}

export const getExpense = async (id: string): Promise<Expense> => {
  const res = await apiClient.get(`/api/v1/expenses/${id}`)
  return unwrap<Expense>(res.data)
}

export const createExpense = async (input: CreateExpenseInput): Promise<Expense> => {
  const res = await apiClient.post(`/api/v1/expenses`, { expense: input })
  return unwrap<Expense>(res.data)
}

export const updateExpense = async (id: string, input: UpdateExpenseInput): Promise<Expense> => {
  const res = await apiClient.patch(`/api/v1/expenses/${id}`, { expense: input })
  return unwrap<Expense>(res.data)
}

export const deleteExpense = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/v1/expenses/${id}`)
}
