"use client"

import { RequireAuth } from "@/components/layout/RequireAuth"
import { AppShell } from "@/components/layout/AppShell"
import { Card } from "@/components/ui/Card"
import { Spinner } from "@/components/ui/Spinner"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { ExpenseForm } from "@/components/expense/ExpenseForm"
import { useApi } from "@/hooks/useApi"
import { listCategories } from "@/lib/api/categories"

export default function NewExpensePage() {
  const { data, isLoading, error } = useApi(listCategories, [])

  return (
    <RequireAuth>
      <AppShell>
        <Card title="New expense">
          {isLoading && <Spinner />}
          {error && <ErrorBanner messages={error.messages} />}
          {data && <ExpenseForm mode={{ kind: "create" }} categories={data} friends={[]} />}
        </Card>
      </AppShell>
    </RequireAuth>
  )
}
