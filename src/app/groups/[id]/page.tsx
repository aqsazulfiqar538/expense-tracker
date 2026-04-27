"use client"

import { use, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { RequireAuth } from "@/components/layout/RequireAuth"
import { AppShell } from "@/components/layout/AppShell"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Spinner } from "@/components/ui/Spinner"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { GroupForm } from "@/components/group/GroupForm"
import { GroupMemberList } from "@/components/group/GroupMemberList"
import { ExpenseList } from "@/components/expense/ExpenseList"
import type { PickableFriend } from "@/components/expense/ParticipantPicker"
import { useApi } from "@/hooks/useApi"
import { getGroup, deleteGroup } from "@/lib/api/groups"
import { listFriends } from "@/lib/api/friends"
import { listCategories } from "@/lib/api/categories"
import { useAuth } from "@/hooks/useAuth"
import type { ApiError } from "@/types/api"

type PageProps = { params: Promise<{ id: string }> }

export default function GroupDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const groupQ = useApi(() => getGroup(id), [id])
  const friendsQ = useApi(listFriends, [])
  const categoriesQ = useApi(listCategories, [])

  const friends = useMemo<PickableFriend[]>(() => {
    if (!friendsQ.data) return []
    return friendsQ.data.items.map((f) => ({ id: f.friend.id, full_name: f.friend.full_name }))
  }, [friendsQ.data])

  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isLoading = groupQ.isLoading || friendsQ.isLoading || categoriesQ.isLoading
  const loadError = groupQ.error ?? friendsQ.error ?? categoriesQ.error

  const isCreator = user && groupQ.data && Number(user.id) === groupQ.data.created_by.id

  const handleDelete = async () => {
    if (!groupQ.data) return
    if (!confirm(`Delete group "${groupQ.data.name}"? This will archive it.`)) return
    setError(null)
    setIsDeleting(true)
    try {
      await deleteGroup(groupQ.data.id)
      router.push("/groups")
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <RequireAuth>
      <AppShell>
        {isLoading && <Spinner />}
        {loadError && <ErrorBanner messages={loadError.messages} />}
        {groupQ.data && categoriesQ.data && (
          <div className="space-y-4">
            {error && <ErrorBanner messages={error.messages} />}

            {isEditing ? (
              <Card title="Edit group" action={<Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>}>
                <GroupForm
                  mode={{ kind: "edit", group: groupQ.data }}
                  friends={friends}
                  onSaved={() => { setIsEditing(false); groupQ.refetch() }}
                />
              </Card>
            ) : (
              <Card
                title={groupQ.data.name}
                action={isCreator && (
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit</Button>
                    <Button variant="danger" disabled={isDeleting} onClick={handleDelete}>
                      {isDeleting ? "Deleting…" : "Delete"}
                    </Button>
                  </div>
                )}
              >
                <p className="text-sm text-gray-600 capitalize">{groupQ.data.group_type} · {groupQ.data.user_count} members</p>
              </Card>
            )}

            <Card title="Members">
              <GroupMemberList group={groupQ.data} friends={friends} onChanged={groupQ.refetch} />
            </Card>

            <Card title="Group expenses">
              <ExpenseList expenses={groupQ.data.expenses} categories={categoriesQ.data} />
            </Card>
          </div>
        )}
      </AppShell>
    </RequireAuth>
  )
}
