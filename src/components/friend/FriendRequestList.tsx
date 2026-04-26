"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { acceptFriendRequest, rejectFriendRequest } from "@/lib/api/friendRequests"
import type { Friendship } from "@/types/friend"
import type { ApiError } from "@/types/api"

type Props = {
  requests: Friendship[]
  onChanged: () => void
}

export const FriendRequestList = ({ requests, onChanged }: Props) => {
  const [error, setError] = useState<ApiError | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  const handleAction = async (id: string, action: "accept" | "reject") => {
    setError(null)
    setPendingId(id)
    try {
      if (action === "accept") await acceptFriendRequest(id)
      else await rejectFriendRequest(id)
      onChanged()
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setPendingId(null)
    }
  }

  if (requests.length === 0) {
    return <EmptyState title="No pending requests" description="When someone sends you a friend request, it'll show up here." />
  }

  return (
    <div className="space-y-2">
      {error && <ErrorBanner messages={error.messages} />}
      <ul className="divide-y divide-gray-100">
        {requests.map((r) => (
          <li key={r.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-medium flex items-center justify-center">
                {r.friend.initials}
              </div>
              <span className="text-sm text-gray-800">{r.friend.full_name}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={pendingId === r.id} onClick={() => handleAction(r.id, "reject")}>
                {pendingId === r.id ? "…" : "Reject"}
              </Button>
              <Button disabled={pendingId === r.id} onClick={() => handleAction(r.id, "accept")}>
                {pendingId === r.id ? "…" : "Accept"}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
