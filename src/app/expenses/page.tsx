"use client"

import Link from "next/link"
import { RequireAuth } from "@/components/layout/RequireAuth"
import { AppShell } from "@/components/layout/AppShell"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Spinner } from "@/components/ui/Spinner"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { ExpenseList } from "@/components/expense/ExpenseList"
import { useApi } from "@/hooks/useApi"
import { listExpenses } from "@/lib/api/expenses"
import { listCategories } from "@/lib/api/categories"

export default function ExpensesPage() {
  const expensesQ = useApi(listExpenses, [])
  const categoriesQ = useApi(listCategories, [])
  const isLoading = expensesQ.isLoading || categoriesQ.isLoading
  const error = expensesQ.error ?? categoriesQ.error

  return (
    <RequireAuth>
      <AppShell>
        <Card title="Expenses" action={<Link href="/expenses/new"><Button>Add expense</Button></Link>}>
          {isLoading && <Spinner />}
          {error && <ErrorBanner messages={error.messages} />}
          {expensesQ.data && categoriesQ.data && (
            <ExpenseList expenses={expensesQ.data.items} categories={categoriesQ.data} />
          )}
        </Card>
      </AppShell>
    </RequireAuth>
  )
}
