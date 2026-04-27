"use client"

import { useMemo } from "react"
import { RequireAuth } from "@/components/layout/RequireAuth"
import { AppShell } from "@/components/layout/AppShell"
import { Card } from "@/components/ui/Card"
import { Spinner } from "@/components/ui/Spinner"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { GroupForm } from "@/components/group/GroupForm"
import type { PickableFriend } from "@/components/expense/ParticipantPicker"
import { useApi } from "@/hooks/useApi"
import { listFriends } from "@/lib/api/friends"

export default function NewGroupPage() {
  const { data, isLoading, error } = useApi(listFriends, [])

  const friends = useMemo<PickableFriend[]>(() => {
    if (!data) return []
    return data.items.map((f) => ({ id: f.friend.id, full_name: f.friend.full_name }))
  }, [data])

  return (
    <RequireAuth>
      <AppShell>
        <Card title="New group">
          {isLoading && <Spinner />}
          {error && <ErrorBanner messages={error.messages} />}
          {data && <GroupForm mode={{ kind: "create" }} friends={friends} />}
        </Card>
      </AppShell>
    </RequireAuth>
  )
}
