"use client"

import { Card } from "@/components/ui/Card"
import { EmptyState } from "@/components/ui/EmptyState"
import { formatCurrency } from "@/lib/format"
import { useAuth } from "@/hooks/useAuth"
import type { DashboardLedgerActivity } from "@/types/dashboard"

type Props = {
  activity: DashboardLedgerActivity[]
}

export const RecentLedger = ({ activity }: Props) => {
  const { user } = useAuth()
  // Numeric id from backend (User.summary returns id as integer). The
  // logged-in user's id is a string from JSON:API; convert once to compare.
  const myId = user ? Number(user.id) : null

  return (
    <Card title="Recent ledger">
      {activity.length === 0 ? (
        <EmptyState title="No repayments yet" description="Settled and pending payments will show up here." />
      ) : (
        <ul className="divide-y divide-gray-100">
          {activity.map((row) => {
            const iAmPayer = myId !== null && row.from.id === myId
            const counterpart = iAmPayer ? row.to : row.from
            const direction = iAmPayer ? "You owe" : "Owes you"
            const tone = iAmPayer ? "text-red-600" : "text-green-600"
            return (
              <li key={row.id} className="flex items-center justify-between py-2 text-sm">
                <div className="space-y-0.5">
                  <p className="text-gray-900">
                    <span className={tone}>{direction}</span>{" "}
                    <span className="font-medium">{counterpart.full_name}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {row.expense_title} · {row.settled ? "Settled" : "Pending"}
                  </p>
                </div>
                <span className={`font-semibold ${tone}`}>{formatCurrency(row.amount)}</span>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
