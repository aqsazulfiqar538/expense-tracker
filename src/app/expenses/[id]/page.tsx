"use client"

import { use } from "react"
import { RequireAuth } from "@/components/layout/RequireAuth"
import { AppShell } from "@/components/layout/AppShell"
import { Card } from "@/components/ui/Card"
import { Spinner } from "@/components/ui/Spinner"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { ExpenseDetail } from "@/components/expense/ExpenseDetail"
import { CommentList } from "@/components/expense/CommentList"
import { CommentForm } from "@/components/expense/CommentForm"
import { useApi } from "@/hooks/useApi"
import { getExpense } from "@/lib/api/expenses"
import { listComments } from "@/lib/api/comments"
import { listCategories } from "@/lib/api/categories"

type PageProps = { params: Promise<{ id: string }> }

export default function ExpenseDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const expenseQ = useApi(() => getExpense(id), [id])
  const commentsQ = useApi(() => listComments(id), [id])
  const categoriesQ = useApi(listCategories, [])

  const isLoading = expenseQ.isLoading || commentsQ.isLoading || categoriesQ.isLoading
  const error = expenseQ.error ?? commentsQ.error ?? categoriesQ.error

  return (
    <RequireAuth>
      <AppShell>
        {isLoading && <Spinner />}
        {error && <ErrorBanner messages={error.messages} />}
        {expenseQ.data && categoriesQ.data && commentsQ.data && (
          <div className="space-y-4">
            <ExpenseDetail
              expense={expenseQ.data}
              categories={categoriesQ.data}
              friends={[]}
              onChanged={() => expenseQ.refetch()}
              onCategoryCreated={() => categoriesQ.refetch()}
            />
            <Card title="Comments">
              <div className="space-y-4">
                <CommentList comments={commentsQ.data.items} />
                <CommentForm expenseId={id} onPosted={() => commentsQ.refetch()} />
              </div>
            </Card>
          </div>
        )}
      </AppShell>
    </RequireAuth>
  )
}
