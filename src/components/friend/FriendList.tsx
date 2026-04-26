"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { removeFriend } from "@/lib/api/friends"
import type { Friendship } from "@/types/friend"
import type { ApiError } from "@/types/api"

type Props = {
  friendships: Friendship[]
  onChanged: () => void
}

export const FriendList = ({ friendships, onChanged }: Props) => {
  const [error, setError] = useState<ApiError | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  const handleRemove = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from your friends?`)) return
    setError(null)
    setPendingId(id)
    try {
      await removeFriend(id)
      onChanged()
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setPendingId(null)
    }
  }

  if (friendships.length === 0) {
    return <EmptyState title="No friends yet" description="Search for users below to add your first friend." />
  }

  return (
    <div className="space-y-2">
      {error && <ErrorBanner messages={error.messages} />}
      <ul className="divide-y divide-gray-100">
        {friendships.map((f) => (
          <li key={f.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-medium flex items-center justify-center">
                {f.friend.initials}
              </div>
              <span className="text-sm text-gray-800">{f.friend.full_name}</span>
            </div>
            <Button
              variant="ghost"
              disabled={pendingId === f.id}
              onClick={() => handleRemove(f.id, f.friend.full_name)}
            >
              {pendingId === f.id ? "Removing…" : "Remove"}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
