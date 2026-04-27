import { apiClient } from "@/lib/apiClient"

export const settleRepayment = async (id: number | string): Promise<void> => {
  await apiClient.patch(`/api/v1/repayments/${id}/settle`)
}
