"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { createComment } from "@/lib/api/comments"
import type { ApiError } from "@/types/api"

type Props = {
  expenseId: string
  onPosted: () => void
}

export const CommentForm = ({ expenseId, onPosted }: Props) => {
  const [content, setContent] = useState("")
  const [error, setError] = useState<ApiError | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setIsPending(true)
    setError(null)
    try {
      await createComment(expenseId, content.trim())
      setContent("")
      onPosted()
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {error && <ErrorBanner messages={error.messages} />}
      <Textarea
        name="content"
        placeholder="Write a comment…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || !content.trim()}>
          {isPending ? "Posting…" : "Post"}
        </Button>
      </div>
    </form>
  )
}
