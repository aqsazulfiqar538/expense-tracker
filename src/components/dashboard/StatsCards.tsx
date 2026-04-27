import { formatCurrency } from "@/lib/format"
import type { Dashboard } from "@/types/dashboard"

type Props = {
  dashboard: Dashboard
}

// One small inline component for a single card. Defined here (not its own
// file) because it's only used here and is six lines long. See
// ARCHITECTURE.md §5: extract when reused, not before.
type StatProps = {
  label: string
  value: string
  tone: "default" | "positive" | "negative"
}

const toneClass: Record<StatProps["tone"], string> = {
  default: "text-gray-900",
  positive: "text-green-600",
  negative: "text-red-600",
}

const Stat = ({ label, value, tone }: StatProps) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
    <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
    <p className={`text-2xl font-semibold mt-1 ${toneClass[tone]}`}>{value}</p>
  </div>
)

export const StatsCards = ({ dashboard }: Props) => {
  const { total_expenses, current_month_total, ledger_summary } = dashboard
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Stat label="Total spent" value={formatCurrency(total_expenses)} tone="default" />
      <Stat label="This month" value={formatCurrency(current_month_total)} tone="default" />
      <Stat label="Owed to you" value={formatCurrency(ledger_summary.total_owed_to_me)} tone="positive" />
      <Stat label="You owe" value={formatCurrency(ledger_summary.total_i_owe)} tone="negative" />
    </div>
  )
}
