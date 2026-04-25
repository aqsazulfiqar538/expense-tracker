import type { UserSummary } from "@/types/user"

export type ExpenseParticipant = {
  user: UserSummary
  paid_share: string
  owed_share: string
  net_balance: string
}

export type ExpenseRepayment = {
  id: number
  from: UserSummary
  to: UserSummary
  amount: string
  settled: boolean
}

export type Expense = {
  id: string
  title: string
  amount: string
  category_id: number | null
  start_date: string
  end_date: string | null
  notes: string | null
  group_id: number | null
  shared: boolean
  participants: ExpenseParticipant[]
  repayments: ExpenseRepayment[]
  created_at: string
  updated_at: string
}

export type ExpenseListFilters = {
  category_id?: string | number
  start_date?: string
  end_date?: string
}

export type CreateExpenseInput = {
  title: string
  amount: string
  category_id: number
  start_date: string
  end_date?: string | null
  notes?: string | null
  split_equally?: boolean
  participants?: Array<{ user_id: number; paid_share?: string; owed_share?: string }>
  group_id?: number | null
  new_group?: { name: string; group_type?: string } | null
}

export type UpdateExpenseInput = {
  title?: string
  amount?: string
  category_id?: number
  start_date?: string
  end_date?: string | null
  notes?: string | null
}
