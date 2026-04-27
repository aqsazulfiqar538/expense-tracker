"use client"

import Link from "next/link"
import { RequireAuth } from "@/components/layout/RequireAuth"
import { AppShell } from "@/components/layout/AppShell"
import { Card } from "@/components/ui/Card"
import { Spinner } from "@/components/ui/Spinner"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { FriendRequestList } from "@/components/friend/FriendRequestList"
import { useApi } from "@/hooks/useApi"
import { listFriendRequests } from "@/lib/api/friendRequests"

export default function FriendRequestsPage() {
  const { data, isLoading, error, refetch } = useApi(listFriendRequests, [])

  return (
    <RequireAuth>
      <AppShell>
        <Card
          title="Friend requests"
          action={<Link href="/friends" className="text-sm text-blue-600 hover:underline">Back to friends</Link>}
        >
          {isLoading && <Spinner />}
          {error && <ErrorBanner messages={error.messages} />}
          {data && <FriendRequestList requests={data.items} onChanged={refetch} />}
        </Card>
      </AppShell>
    </RequireAuth>
  )
}
