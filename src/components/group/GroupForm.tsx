"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { GroupTypeSelect } from "@/components/group/GroupTypeSelect"
import { createGroup, updateGroup } from "@/lib/api/groups"
import type { Group, GroupType } from "@/types/group"
import type { ApiError } from "@/types/api"
import type { PickableFriend } from "@/components/expense/ParticipantPicker"

type Mode =
  | { kind: "create" }
  | { kind: "edit"; group: Group }

type Props = {
  mode: Mode
  friends: PickableFriend[]
  onSaved?: () => void
}

export const GroupForm = ({ mode, friends, onSaved }: Props) => {
  const router = useRouter()
  const initial = mode.kind === "edit" ? mode.group : null

  const [name, setName] = useState(initial?.name ?? "")
  const [groupType, setGroupType] = useState<GroupType>(initial?.group_type ?? "other")
  const [memberIds, setMemberIds] = useState<number[]>([])
  const [error, setError] = useState<ApiError | null>(null)
  const [isPending, setIsPending] = useState(false)

  const toggleMember = (id: number) => {
    setMemberIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsPending(true)
    try {
      if (mode.kind === "edit") {
        await updateGroup(mode.group.id, { name, group_type: groupType })
        onSaved?.()
      } else {
        const created = await createGroup({ name, group_type: groupType, member_ids: memberIds })
        router.push(`/groups/${created.id}`)
      }
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorBanner messages={error.messages} />}
      <Input label="Name" name="name" required value={name} onChange={(e) => setName(e.target.value)} />
      <GroupTypeSelect value={groupType} onChange={setGroupType} />

      {mode.kind === "create" && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Members</p>
          {friends.length === 0 ? (
            <p className="text-xs text-gray-500">You need at least one friend to create a group.</p>
          ) : (
            <ul className="space-y-1">
              {friends.map((friend) => (
                <li key={friend.id}>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={memberIds.includes(friend.id)}
                      onChange={() => toggleMember(friend.id)}
                      className="accent-blue-600"
                    />
                    {friend.full_name}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending || (mode.kind === "create" && memberIds.length === 0)}
        className="w-full"
      >
        {isPending ? "Saving…" : mode.kind === "create" ? "Create group" : "Save changes"}
      </Button>
    </form>
  )
}
