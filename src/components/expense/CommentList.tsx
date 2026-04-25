import { EmptyState } from "@/components/ui/EmptyState"
import type { Comment } from "@/types/comment"

type Props = {
  comments: Comment[]
}

export const CommentList = ({ comments }: Props) => {
  if (comments.length === 0) {
    return <EmptyState title="No comments yet" description="Be the first to comment on this expense." />
  }

  return (
    <ul className="space-y-3">
      {comments.map((c) => (
        <li key={c.id}>
          {c.comment_type === "system_comment" ? (
            <SystemRow content={c.content} createdAt={c.created_at} />
          ) : (
            <UserRow content={c.content} createdAt={c.created_at} initials={c.user.initials} fullName={c.user.full_name} />
          )}
        </li>
      ))}
    </ul>
  )
}

const SystemRow = ({ content, createdAt }: { content: string; createdAt: string }) => (
  <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs text-gray-600 italic">
    {content}
    <span className="block text-[10px] text-gray-400 mt-0.5">{new Date(createdAt).toLocaleString()}</span>
  </div>
)

const UserRow = ({ content, createdAt, initials, fullName }: { content: string; createdAt: string; initials: string; fullName: string }) => (
  <div className="flex gap-2">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-medium flex items-center justify-center">
      {initials}
    </div>
    <div className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2">
      <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">{fullName}</span> · {new Date(createdAt).toLocaleString()}</p>
      <p className="text-sm text-gray-800 mt-0.5 whitespace-pre-wrap">{content}</p>
    </div>
  </div>
)
