"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { createCategory } from "@/lib/api/categories"
import type { Category } from "@/types/category"
import type { ApiError } from "@/types/api"

type Props = {
  open: boolean
  onClose: () => void
  categories: Category[]
  onCreated: (category: Category) => void
}

export const CategoryCreateModal = ({ open, onClose, categories, onCreated }: Props) => {
  const [name, setName] = useState("")
  const [parentId, setParentId] = useState<string>("")
  const [error, setError] = useState<ApiError | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    try {
      const created = await createCategory({
        name,
        parent_id: parentId === "" ? null : Number(parentId),
      })
      setName("")
      setParentId("")
      onCreated(created)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create a category">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBanner messages={error.messages} />}

        <Input
          label="Name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Groceries, Utilities, Books"
        />

        <Select
          label="Parent (optional)"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        >
          <option value="">None — make this a top-level category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}{c.custom ? " (your category)" : " (system)"}
            </option>
          ))}
        </Select>
        <p className="text-xs text-gray-500">
          Pick a parent to make this a subcategory. You can choose any system or your own category.
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating…" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
