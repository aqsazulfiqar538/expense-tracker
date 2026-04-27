"use client"

import { Input } from "@/components/ui/Input"
import { formatCurrency } from "@/lib/format"
import type { PickableFriend } from "@/components/expense/ParticipantPicker"

export type SplitMode = "equal" | "custom"

export type CustomShare = {
  user_id: number
  paid_share: string
  owed_share: string
}

type Props = {
  amount: string
  participants: PickableFriend[]
  mode: SplitMode
  onModeChange: (mode: SplitMode) => void
  customShares: CustomShare[]
  onCustomSharesChange: (shares: CustomShare[]) => void
}

const sumShares = (shares: CustomShare[], key: "paid_share" | "owed_share"): number => {
  return shares.reduce((acc, row) => acc + (parseFloat(row[key]) || 0), 0)
}

export const isCustomSplitValid = (amount: string, shares: CustomShare[]): boolean => {
  const total = parseFloat(amount) || 0
  if (total <= 0 || shares.length === 0) return false
  const paid = sumShares(shares, "paid_share")
  const owed = sumShares(shares, "owed_share")
  return Math.abs(paid - total) < 0.01 && Math.abs(owed - total) < 0.01
}

export const SplitEditor = ({ amount, participants, mode, onModeChange, customShares, onCustomSharesChange }: Props) => {
  const total = parseFloat(amount) || 0
  const perPerson = participants.length > 0 ? total / participants.length : 0

  const updateShare = (user_id: number, key: "paid_share" | "owed_share", value: string) => {
    const next = customShares.map((row) =>
      row.user_id === user_id ? { ...row, [key]: value } : row,
    )
    onCustomSharesChange(next)
  }

  const paidSum = sumShares(customShares, "paid_share")
  const owedSum = sumShares(customShares, "owed_share")
  const paidDiff = total - paidSum
  const owedDiff = total - owedSum

  return (
    <div className="space-y-3">
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={mode === "equal"} onChange={() => onModeChange("equal")} className="accent-blue-600" />
          Split equally
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={mode === "custom"} onChange={() => onModeChange("custom")} className="accent-blue-600" />
          Custom split
        </label>
      </div>

      {mode === "equal" ? (
        <p className="text-sm text-gray-600">
          {participants.length > 0
            ? <>Each person owes <span className="font-medium">{formatCurrency(perPerson)}</span></>
            : "Pick at least one friend to split with."}
        </p>
      ) : (
        <div className="space-y-2">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500">
              <tr>
                <th className="text-left font-medium pb-1">Person</th>
                <th className="text-right font-medium pb-1">Paid</th>
                <th className="text-right font-medium pb-1">Owes</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => {
                const row = customShares.find((s) => s.user_id === p.id)
                return (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="py-1 pr-2 text-gray-700">{p.full_name}</td>
                    <td className="py-1 px-1">
                      <Input
                        type="number" step="0.01" min="0"
                        value={row?.paid_share ?? "0"}
                        onChange={(e) => updateShare(p.id, "paid_share", e.target.value)}
                        className="text-right"
                      />
                    </td>
                    <td className="py-1 pl-1">
                      <Input
                        type="number" step="0.01" min="0"
                        value={row?.owed_share ?? "0"}
                        onChange={(e) => updateShare(p.id, "owed_share", e.target.value)}
                        className="text-right"
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="flex justify-between text-xs">
            <span className={Math.abs(paidDiff) < 0.01 ? "text-green-700" : "text-red-700"}>
              Paid total: {formatCurrency(paidSum)} {Math.abs(paidDiff) >= 0.01 && <>(diff {formatCurrency(paidDiff)})</>}
            </span>
            <span className={Math.abs(owedDiff) < 0.01 ? "text-green-700" : "text-red-700"}>
              Owes total: {formatCurrency(owedSum)} {Math.abs(owedDiff) >= 0.01 && <>(diff {formatCurrency(owedDiff)})</>}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
