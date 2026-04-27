"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { settleRepayment } from "@/lib/api/repayments"
import { formatCurrency } from "@/lib/format"
import type { LedgerRepayment } from "@/types/repayment"
import type { ApiError } from "@/types/api"

type Props = {
  repayment: LedgerRepayment
  direction: "they-owe-me" | "i-owe-them"
  onSettled: () => void
}

export const RepaymentRow = ({ repayment, direction, onSettled }: Props) => {
  const [error, setError] = useState<ApiError | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSettle = async () => {
    if (!confirm(`Mark this repayment as settled?`)) return
    setError(null)
    setIsPending(true)
    try {
      await settleRepayment(repayment.id)
      onSettled()
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsPending(false)
    }
  }

  const tone = direction === "they-owe-me" ? "text-green-700" : "text-red-700"

  return (
    <li className="py-2">
      {error && <div className="mb-1"><ErrorBanner messages={error.messages} /></div>}
      <div className="flex items-center justify-between text-sm">
        <Link href={`/expenses/${repayment.expense_id}`} className="text-gray-700 hover:underline">
          {repayment.expense_title ?? "(deleted expense)"}
        </Link>
        <div className="flex items-center gap-3">
          <span className={`font-medium ${tone}`}>{formatCurrency(repayment.amount)}</span>
          <Button variant="secondary" disabled={isPending} onClick={handleSettle}>
            {isPending ? "…" : "Settle"}
          </Button>
        </div>
      </div>
    </li>
  )
}
