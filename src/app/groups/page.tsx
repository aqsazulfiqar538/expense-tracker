"use client"

import Link from "next/link"
import { RequireAuth } from "@/components/layout/RequireAuth"
import { AppShell } from "@/components/layout/AppShell"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Spinner } from "@/components/ui/Spinner"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { EmptyState } from "@/components/ui/EmptyState"
import { GroupCard } from "@/components/group/GroupCard"
import { useApi } from "@/hooks/useApi"
import { listGroups } from "@/lib/api/groups"

export default function GroupsPage() {
  const { data, isLoading, error } = useApi(listGroups, [])

  return (
    <RequireAuth>
      <AppShell>
        <Card title="Groups" action={<Link href="/groups/new"><Button>New group</Button></Link>}>
          {isLoading && <Spinner />}
          {error && <ErrorBanner messages={error.messages} />}
          {data && (
            data.items.length === 0
              ? <EmptyState title="No groups yet" description="Create a group to start sharing expenses." />
              : <div className="space-y-3">{data.items.map((g) => <GroupCard key={g.id} group={g} />)}</div>
          )}
        </Card>
      </AppShell>
    </RequireAuth>
  )
}
