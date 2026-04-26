"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { useDebounced } from "@/hooks/useDebounced"
import { searchUsers } from "@/lib/api/users"
import { sendFriendRequest } from "@/lib/api/friends"
import type { PublicUser } from "@/types/user"
import type { ApiError } from "@/types/api"

type Props = {
  onRequestSent?: () => void
}

export const UserSearch = ({ onRequestSent }: Props) => {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounced(query, 300)
  const [results, setResults] = useState<PublicUser[]>([])
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }
    let cancelled = false
    setIsSearching(true)
    searchUsers(debouncedQuery)
      .then((users) => { if (!cancelled) setResults(users) })
      .catch((err: ApiError) => { if (!cancelled) setError(err) })
      .finally(() => { if (!cancelled) setIsSearching(false) })
    return () => { cancelled = true }
  }, [debouncedQuery])

  const handleSend = async (user: PublicUser) => {
    setError(null)
    setPendingId(user.id)
    try {
      await sendFriendRequest(user.id)
      setSentIds((prev) => new Set(prev).add(user.id))
      onRequestSent?.()
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="space-y-3">
      <Input
        label="Find people"
        name="user-search"
        placeholder="Search by name or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {error && <ErrorBanner messages={error.messages} />}

      {debouncedQuery.trim() && (
        <ul className="space-y-1 text-sm">
          {isSearching && <li className="text-gray-500">Searching…</li>}
          {!isSearching && results.length === 0 && (
            <li className="text-gray-500">No matches.</li>
          )}
          {results.map((u) => {
            const sent = sentIds.has(u.id)
            return (
              <li key={u.id} className="flex items-center justify-between py-1">
                <span className="text-gray-800">{u.full_name}</span>
                <Button
                  variant={sent ? "ghost" : "secondary"}
                  disabled={sent || pendingId === u.id}
                  onClick={() => handleSend(u)}
                >
                  {sent ? "Request sent" : pendingId === u.id ? "Sending…" : "Send request"}
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
