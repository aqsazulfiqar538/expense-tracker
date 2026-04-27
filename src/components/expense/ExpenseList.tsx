"use client"

import { useMemo } from "react"
import { ExpenseCard } from "@/components/expense/ExpenseCard"
import { EmptyState } from "@/components/ui/EmptyState"
import type { Expense } from "@/types/expense"
import type { Category } from "@/types/category"

type Props = {
  expenses: Expense[]
  categories: Category[]
}

export const ExpenseList = ({ expenses, categories }: Props) => {
  const categoryNameById = useMemo(() => {
    const map = new Map<number, string>()
    for (const parent of categories) {
      map.set(Number(parent.id), parent.name)
      for (const sub of parent.subcategories) {
        map.set(Number(sub.id), sub.name)
      }
    }
    return map
  }, [categories])

  if (expenses.length === 0) {
    return <EmptyState title="No expenses yet" description="Click 'Add expense' to log your first one." />
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          categoryName={expense.category_id ? (categoryNameById.get(expense.category_id) ?? null) : null}
        />
      ))}
    </div>
  )
}
