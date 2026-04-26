import type { UserSummary } from "@/types/user"
import type { LedgerSummary } from "@/types/ledger"

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
