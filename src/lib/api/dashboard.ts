import { apiClient } from "@/lib/apiClient"
import type {
  Dashboard,
  DashboardRecentExpense,
  DashboardLedgerActivity,
} from "@/types/dashboard"
import type { LedgerSummary } from "@/types/ledger"

// Local types matching the raw wire format. Kept private here so components
// only ever see the flat `Dashboard` type. See ARCHITECTURE.md §8.
type RawJsonApiResource = {
  id: string
  type: string
  attributes: Record<string, unknown>
}
type RawRecentExpenses = {
  data: RawJsonApiResource[]
  included?: RawJsonApiResource[]
}
type RawDashboard = {
  total_expenses: string
  current_month_total: string
  category_totals: Record<string, string>
  recent_expenses: RawRecentExpenses
  recent_ledger_activity: DashboardLedgerActivity[]
  ledger_summary: LedgerSummary
}

export const getDashboard = async (): Promise<Dashboard> => {
  const res = await apiClient.get<RawDashboard>("/api/v1/dashboard")
  const raw = res.data

  return {
    total_expenses: raw.total_expenses,
    current_month_total: raw.current_month_total,
    category_totals: raw.category_totals,
    recent_expenses: flattenRecentExpenses(raw.recent_expenses),
    recent_ledger_activity: raw.recent_ledger_activity,
    ledger_summary: raw.ledger_summary,
  }
}

// Walk `included` once to build a category-id -> name lookup, then flatten
// every expense to a small UI-friendly shape. Keeps JSON:API knowledge out
// of components.
const flattenRecentExpenses = (payload: RawRecentExpenses): DashboardRecentExpense[] => {
  const categoryNameById = new Map<string, string>()
  for (const item of payload.included ?? []) {
    if (item.type === "category" && typeof item.attributes.name === "string") {
      categoryNameById.set(item.id, item.attributes.name)
    }
  }

  return payload.data.map((expense) => {
    const categoryId = expense.attributes.category_id
    const lookupKey = categoryId == null ? null : String(categoryId)
    return {
      id: expense.id,
      title: String(expense.attributes.title ?? ""),
      amount: String(expense.attributes.amount ?? "0"),
      start_date: String(expense.attributes.start_date ?? ""),
      category_name: lookupKey ? (categoryNameById.get(lookupKey) ?? null) : null,
    }
  })
}
