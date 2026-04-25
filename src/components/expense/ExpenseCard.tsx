import Link from "next/link"
import { formatCurrency } from "@/lib/format"
import type { Expense } from "@/types/expense"

type Props = {
  expense: Expense
  categoryName: string | null
}

export const ExpenseCard = ({ expense, categoryName }: Props) => {
  return (
    <Link
      href={`/expenses/${expense.id}`}
      className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">{expense.title}</h3>
        <span className="font-semibold text-blue-600">{formatCurrency(expense.amount)}</span>
      </div>
      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
        <span>{expense.start_date}</span>
        {categoryName && (
          <span className="bg-gray-100 px-2 py-0.5 rounded-full">{categoryName}</span>
        )}
        {expense.shared && (
          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Shared</span>
        )}
      </div>
    </Link>
  )
}
