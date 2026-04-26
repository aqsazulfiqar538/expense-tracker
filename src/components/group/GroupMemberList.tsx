"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { addGroupMember, removeGroupMember } from "@/lib/api/members"
import type { Group } from "@/types/group"
import type { ApiError } from "@/types/api"
import type { PickableFriend } from "@/components/expense/ParticipantPicker"

type Props = {
  group: Group
  friends: PickableFriend[]
  onChanged: () => void
}

export const GroupMemberList = ({ group, friends, onChanged }: Props) => {
  const [error, setError] = useState<ApiError | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [addUserId, setAddUserId] = useState("")

  const memberIds = new Set(group.users.map((u) => u.id))
  const addableFriends = friends.filter((f) => !memberIds.has(f.id))

  const handleRemove = async (userId: number, name: string) => {
    if (!confirm(`Remove ${name} from this group?`)) return
    setError(null)
    setPendingId(userId)
    try {
      await removeGroupMember(group.id, userId)
      onChanged()
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setPendingId(null)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addUserId) return
    const userId = Number(addUserId)
    setError(null)
    setPendingId(userId)
    try {
      await addGroupMember(group.id, userId)
      setAddUserId("")
      onChanged()
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="space-y-3">
      {error && <ErrorBanner messages={error.messages} />}

      <ul className="divide-y divide-gray-100">
        {group.users.map((u) => {
          const isCreator = u.id === group.created_by.id
          return (
            <li key={u.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-medium flex items-center justify-center">
                  {u.initials}
                </div>
                <div>
                  <span className="text-sm text-gray-800">{u.full_name}</span>
                  {isCreator && <span className="ml-2 text-xs text-gray-500">(creator)</span>}
                </div>
              </div>
              {!isCreator && (
                <Button
                  variant="ghost"
                  disabled={pendingId === u.id}
                  onClick={() => handleRemove(u.id, u.full_name)}
                >
                  {pendingId === u.id ? "Removing…" : "Remove"}
                </Button>
              )}
            </li>
          )
        })}
      </ul>

      {addableFriends.length > 0 && (
        <form onSubmit={handleAdd} className="flex gap-2 items-end pt-2 border-t border-gray-100">
          <div className="flex-1">
            <Select label="Add a friend to this group" value={addUserId} onChange={(e) => setAddUserId(e.target.value)}>
              <option value="">Select a friend…</option>
              {addableFriends.map((f) => (
                <option key={f.id} value={f.id}>{f.full_name}</option>
              ))}
            </Select>
          </div>
          <Button type="submit" disabled={!addUserId || pendingId !== null}>
            Add
          </Button>
        </form>
      )}
    </div>
  )
}
