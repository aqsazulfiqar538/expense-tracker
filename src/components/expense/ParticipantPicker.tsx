"use client"

import Link from "next/link"

export type PickableFriend = {
  id: number
  full_name: string
}

type Props = {
  friends: PickableFriend[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
}

export const ParticipantPicker = ({ friends, selectedIds, onChange }: Props) => {
  if (friends.length === 0) {
    return (
      <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
        You don&apos;t have any friends yet.{" "}
        <Link href="/friends" className="text-blue-600 hover:underline">Add some</Link> to split expenses.
      </div>
    )
  }

  const toggle = (id: number) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id],
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">Split with</p>
      <ul className="space-y-1">
        {friends.map((friend) => (
          <li key={friend.id}>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.includes(friend.id)}
                onChange={() => toggle(friend.id)}
                className="accent-blue-600"
              />
              {friend.full_name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
