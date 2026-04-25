// Flat shape consumed by the dashboard. The /api/v1/dashboard endpoint is a
// plain JSON object on the wire (not JSON:API), with one nested JSON:API
// payload — `recent_expenses` — that lib/api/dashboard.ts flattens for us.
//
// why decimals are strings: Rails serializes `decimal(12,2)` as a string in
// JSON to preserve precision (avoids float rounding). Components format for
// display.

// User.summary returned by the backend — id is integer here (not the
// string-id from JSON:API resources, since this comes from a plain hash).
export type UserSummary = {
  id: number
  first_name: string
  last_name: string
  full_name: string
  initials: string
}

export type LedgerEntry = UserSummary & {
  amount: string
}

export type LedgerSummary = {
  i_owe: LedgerEntry[]
  owed_to_me: LedgerEntry[]
  total_i_owe: string
  total_owed_to_me: string
}

// Just the bits the dashboard's "Recent expenses" card displays. The full
// Expense type lands in Phase 3.
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
