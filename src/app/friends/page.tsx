"use client"

import Link from "next/link"
import { RequireAuth } from "@/components/layout/RequireAuth"
import { AppShell } from "@/components/layout/AppShell"
import { Card } from "@/components/ui/Card"
import { Spinner } from "@/components/ui/Spinner"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { FriendList } from "@/components/friend/FriendList"
import { UserSearch } from "@/components/friend/UserSearch"
import { useApi } from "@/hooks/useApi"
import { listFriends } from "@/lib/api/friends"
import { listFriendRequests } from "@/lib/api/friendRequests"

export default function FriendsPage() {
  const friendsQ = useApi(listFriends, [])
  const requestsQ = useApi(listFriendRequests, [])

  const isLoading = friendsQ.isLoading || requestsQ.isLoading
  const error = friendsQ.error ?? requestsQ.error
  const requestCount = requestsQ.data?.items.length ?? 0

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-4">
          <Card
            title="Friends"
            action={
              <Link href="/friends/requests" className="text-sm text-blue-600 hover:underline">
                Pending requests{requestCount > 0 && <> ({requestCount})</>}
              </Link>
            }
          >
            {isLoading && <Spinner />}
            {error && <ErrorBanner messages={error.messages} />}
            {friendsQ.data && (
              <FriendList friendships={friendsQ.data.items} onChanged={friendsQ.refetch} />
            )}
          </Card>

          <Card title="Add friends">
            <UserSearch />
          </Card>
        </div>
      </AppShell>
    </RequireAuth>
  )
}
