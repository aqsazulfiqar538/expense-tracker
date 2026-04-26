"use client"

import { Card } from "@/components/ui/Card"
import { EmptyState } from "@/components/ui/EmptyState"
import { RepaymentRow } from "@/components/ledger/RepaymentRow"
import { formatCurrency } from "@/lib/format"
import type { FriendLedger as FriendLedgerType } from "@/types/ledger"

type Props = {
  data: FriendLedgerType
  onChanged: () => void
}

export const FriendLedger = ({ data, onChanged }: Props) => {
  const net = parseFloat(data.net) || 0
  const netLabel = net > 0 ? "owes you" : net < 0 ? "you owe" : "settled"
  const netTone = net > 0 ? "text-green-700" : net < 0 ? "text-red-700" : "text-gray-600"

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 text-sm font-medium flex items-center justify-center">
              {data.friend.initials}
            </div>
            <div>
              <p className="font-medium text-gray-900">{data.friend.full_name}</p>
              <p className={`text-sm ${netTone}`}>
                {netLabel}{" "}{formatCurrency(Math.abs(net))}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card title={`They owe you · ${formatCurrency(data.total_they_owe_me)}`}>
        {data.they_owe_me.length === 0
          ? <EmptyState title="Nothing owed to you" />
          : <ul className="divide-y divide-gray-100">
              {data.they_owe_me.map((r) => (
                <RepaymentRow key={r.id} repayment={r} direction="they-owe-me" onSettled={onChanged} />
              ))}
            </ul>
        }
      </Card>

      <Card title={`You owe them · ${formatCurrency(data.total_i_owe_them)}`}>
        {data.i_owe_them.length === 0
          ? <EmptyState title="Nothing you owe" />
          : <ul className="divide-y divide-gray-100">
              {data.i_owe_them.map((r) => (
                <RepaymentRow key={r.id} repayment={r} direction="i-owe-them" onSettled={onChanged} />
              ))}
            </ul>
        }
      </Card>
    </div>
  )
}
