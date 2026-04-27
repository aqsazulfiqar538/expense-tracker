"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { ExpenseForm } from "@/components/expense/ExpenseForm"
import { deleteExpense } from "@/lib/api/expenses"
import { formatCurrency } from "@/lib/format"
import type { Expense } from "@/types/expense"
import type { Category } from "@/types/category"
import type { PickableFriend } from "@/components/expense/ParticipantPicker"
import type { ApiError } from "@/types/api"

type Props = {
  expense: Expense
  categories: Category[]
  friends: PickableFriend[]
  onChanged: () => void
  onCategoryCreated?: () => void
}

export const ExpenseDetail = ({ expense, categories, friends, onChanged, onCategoryCreated }: Props) => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const categoryName = expense.category_id
    ? findCategoryName(categories, expense.category_id)
    : null

  const handleDelete = async () => {
    if (!confirm("Delete this expense? It will be archived and removed from your lists.")) return
    setError(null)
    setIsDeleting(true)
    try {
      await deleteExpense(expense.id)
      router.push("/expenses")
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isEditing) {
    return (
      <Card title="Edit expense" action={<Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>}>
        <ExpenseForm
          mode={{ kind: "edit", expense }}
          categories={categories}
          friends={friends}
          groups={[]}
          onUpdated={() => { setIsEditing(false); onChanged() }}
          onCategoryCreated={onCategoryCreated}
        />
      </Card>
    )
  }

  return (
    <Card
      title={expense.title}
      action={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit</Button>
          <Button variant="danger" disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      }
    >
      {error && <ErrorBanner messages={error.messages} />}

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-semibold text-blue-600">{formatCurrency(expense.amount)}</span>
          <span className="text-sm text-gray-500">{expense.start_date}</span>
        </div>
        {categoryName && <p className="text-sm text-gray-600">Category: <span className="font-medium">{categoryName}</span></p>}
        {expense.notes && <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{expense.notes}</p>}

        {expense.shared && expense.participants.length > 0 && (
          <ParticipantsTable expense={expense} />
        )}
        {expense.repayments.length > 0 && (
          <RepaymentsTable expense={expense} />
        )}
      </div>
    </Card>
  )
}

const findCategoryName = (categories: Category[], id: number): string | null => {
  for (const parent of categories) {
    if (Number(parent.id) === id) return parent.name
    for (const sub of parent.subcategories) {
      if (Number(sub.id) === id) return sub.name
    }
  }
  return null
}

const ParticipantsTable = ({ expense }: { expense: Expense }) => (
  <div className="pt-3 border-t border-gray-100">
    <p className="text-sm font-medium text-gray-700 mb-2">Participants</p>
    <table className="w-full text-sm">
      <thead className="text-xs text-gray-500">
        <tr>
          <th className="text-left font-medium pb-1">Person</th>
          <th className="text-right font-medium pb-1">Paid</th>
          <th className="text-right font-medium pb-1">Owes</th>
        </tr>
      </thead>
      <tbody>
        {expense.participants.map((p) => (
          <tr key={p.user.id} className="border-t border-gray-100">
            <td className="py-1 text-gray-700">{p.user.full_name}</td>
            <td className="py-1 text-right">{formatCurrency(p.paid_share)}</td>
            <td className="py-1 text-right">{formatCurrency(p.owed_share)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const RepaymentsTable = ({ expense }: { expense: Expense }) => (
  <div className="pt-3 border-t border-gray-100">
    <p className="text-sm font-medium text-gray-700 mb-2">Repayments</p>
    <ul className="space-y-1 text-sm">
      {expense.repayments.map((r) => (
        <li key={r.id} className="flex items-center justify-between">
          <span className="text-gray-700">
            {r.from.full_name} <span className="text-gray-400">→</span> {r.to.full_name}
          </span>
          <span className="font-medium">
            {formatCurrency(r.amount)} {r.settled && <span className="text-xs text-green-700 ml-1">(settled)</span>}
          </span>
        </li>
      ))}
    </ul>
  </div>
)
