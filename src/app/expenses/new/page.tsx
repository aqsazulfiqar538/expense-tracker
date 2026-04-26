"use client"

import { useMemo } from "react"
import { RequireAuth } from "@/components/layout/RequireAuth"
import { AppShell } from "@/components/layout/AppShell"
import { Card } from "@/components/ui/Card"
import { Spinner } from "@/components/ui/Spinner"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { ExpenseForm } from "@/components/expense/ExpenseForm"
import type { PickableFriend } from "@/components/expense/ParticipantPicker"
import { useApi } from "@/hooks/useApi"
import { listCategories } from "@/lib/api/categories"
import { listFriends } from "@/lib/api/friends"

export default function NewExpensePage() {
  const categoriesQ = useApi(listCategories, [])
  const friendsQ = useApi(listFriends, [])

  const friends = useMemo<PickableFriend[]>(() => {
    if (!friendsQ.data) return []
    return friendsQ.data.items.map((f) => ({ id: f.friend.id, full_name: f.friend.full_name }))
  }, [friendsQ.data])

  const isLoading = categoriesQ.isLoading || friendsQ.isLoading
  const error = categoriesQ.error ?? friendsQ.error

  return (
    <RequireAuth>
      <AppShell>
        <Card title="New expense">
          {isLoading && <Spinner />}
          {error && <ErrorBanner messages={error.messages} />}
          {categoriesQ.data && (
            <ExpenseForm
              mode={{ kind: "create" }}
              categories={categoriesQ.data}
              friends={friends}
              onCategoryCreated={categoriesQ.refetch}
            />
          )}
        </Card>
      </AppShell>
    </RequireAuth>
  )
}
