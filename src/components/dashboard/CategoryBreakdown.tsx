import { Card } from "@/components/ui/Card"
import { EmptyState } from "@/components/ui/EmptyState"
import { formatCurrency } from "@/lib/format"

type Props = {
  totals: Record<string, string>
}

export const CategoryBreakdown = ({ totals }: Props) => {
  // why sort here, not on the backend:
  //   The backend groups by category name and returns a hash, which has no
  //   inherent order. Sorting on the client keeps the API generic and lets
  //   the UI choose ordering (here: highest spend first).
  const entries = Object.entries(totals).sort(
    ([, a], [, b]) => parseFloat(b) - parseFloat(a),
  )

  return (
    <Card title="Category breakdown">
      {entries.length === 0 ? (
        <EmptyState title="No spending yet" description="Add an expense to see this breakdown." />
      ) : (
        <ul className="divide-y divide-gray-100">
          {entries.map(([name, amount]) => (
            <li key={name} className="flex items-center justify-between py-2 text-sm">
              <span className="text-gray-700">{name}</span>
              <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
