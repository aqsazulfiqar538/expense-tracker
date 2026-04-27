import type { UserSummary } from "@/types/user"
import type { LedgerRepayment } from "@/types/repayment"

export type LedgerEntry = UserSummary & {
  amount: string
}

export type LedgerSummary = {
  i_owe: LedgerEntry[]
  owed_to_me: LedgerEntry[]
  total_i_owe: string
  total_owed_to_me: string
}

export type FriendLedger = {
  friend: UserSummary
  they_owe_me: LedgerRepayment[]
  i_owe_them: LedgerRepayment[]
  total_they_owe_me: string
  total_i_owe_them: string
  net: string
}
