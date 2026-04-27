import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { EmptyState } from "@/components/ui/EmptyState"
import { formatCurrency } from "@/lib/format"
import type { DashboardRecentExpense } from "@/types/dashboard"

type Props = {
  expenses: DashboardRecentExpense[]
}

export const RecentExpenses = ({ expenses }: Props) => {
  return (
    <Card
      title="Recent expenses"
      action={
        <Link href="/expenses" className="text-sm text-blue-600 hover:underline">
          See all
        </Link>
      }
    >
      {expenses.length === 0 ? (
        <EmptyState title="No expenses yet" description="Your latest expenses will show up here." />
      ) : (
        <ul className="divide-y divide-gray-100">
          {expenses.map((e) => (
            <li key={e.id}>
              <Link
                href={`/expenses/${e.id}`}
                className="flex items-center justify-between py-2 text-sm hover:bg-gray-50 -mx-2 px-2 rounded"
              >
                <div className="space-y-0.5">
                  <p className="font-medium text-gray-900">{e.title}</p>
                  <p className="text-xs text-gray-500">
                    {e.start_date}
                    {e.category_name && <> - {e.category_name}</>}
                  </p>
                </div>
                <span className="font-semibold text-gray-900">{formatCurrency(e.amount)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
