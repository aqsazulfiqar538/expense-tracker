import { apiClient } from "@/lib/apiClient"
import type { LedgerSummary, FriendLedger } from "@/types/ledger"

export const getLedgerSummary = async (): Promise<LedgerSummary> => {
  const res = await apiClient.get<LedgerSummary>("/api/v1/ledger")
  return res.data
}

export const getFriendLedger = async (friendId: number | string): Promise<FriendLedger> => {
  const res = await apiClient.get<FriendLedger>(`/api/v1/ledger/${friendId}`)
  return res.data
}
