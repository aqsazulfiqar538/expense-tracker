import type { UserSummary } from "@/types/user"

export type LedgerEntry = UserSummary & {
  amount: string
}

export type LedgerSummary = {
  i_owe: LedgerEntry[]
  owed_to_me: LedgerEntry[]
  total_i_owe: string
  total_owed_to_me: string
}

export type DashboardRecentExpense = {
  id: string
  title: string
  amount: string
  start_date: string
  category_name: string | null
}

export type DashboardLedgerActivity = {
  id: number
  expense_title: string
  from: UserSummary
  to: UserSummary
  amount: string
  settled: boolean
  created_at: string
}

export type Dashboard = {
  total_expenses: string
  current_month_total: string
  category_totals: Record<string, string>
  recent_expenses: DashboardRecentExpense[]
  recent_ledger_activity: DashboardLedgerActivity[]
  ledger_summary: LedgerSummary
}
