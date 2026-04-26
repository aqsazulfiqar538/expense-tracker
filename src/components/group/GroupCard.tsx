import Link from "next/link"
import type { Group } from "@/types/group"

type Props = {
  group: Group
}

export const GroupCard = ({ group }: Props) => {
  return (
    <Link
      href={`/groups/${group.id}`}
      className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">{group.name}</h3>
        <span className="text-xs uppercase tracking-wide bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
          {group.group_type}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {group.user_count} {group.user_count === 1 ? "member" : "members"} · created by {group.created_by.full_name}
      </p>
    </Link>
  )
}
