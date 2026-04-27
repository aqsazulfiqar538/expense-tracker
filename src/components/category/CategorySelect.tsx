"use client"

import { useState } from "react"
import { Select } from "@/components/ui/Select"
import { CategoryCreateModal } from "@/components/category/CategoryCreateModal"
import type { Category } from "@/types/category"

type Props = {
  categories: Category[]
  value: string
  onChange: (categoryId: string) => void
  onCategoryCreated?: () => void
}

const CREATE_SENTINEL = "__create_new__"

export const CategorySelect = ({ categories, value, onChange, onCategoryCreated }: Props) => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === CREATE_SENTINEL) {
      setModalOpen(true)
      return
    }
    onChange(e.target.value)
  }

  const handleCreated = (created: Category) => {
    onChange(created.id)
    setModalOpen(false)
    onCategoryCreated?.()
  }

  return (
    <>
      <Select label="Category" value={value} onChange={handleChange}>
        <option value="">Select a category…</option>
        {categories.map((parent) =>
          parent.subcategories.length === 0 ? (
            <option key={parent.id} value={parent.id}>
              {parent.name}{parent.custom ? " (custom)" : ""}
            </option>
          ) : (
            <optgroup key={parent.id} label={parent.name + (parent.custom ? " (custom)" : "")}>
              <option value={parent.id}>{parent.name} (general)</option>
              {parent.subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </optgroup>
          ),
        )}
        <option value={CREATE_SENTINEL}>+ Create your own…</option>
      </Select>

      <CategoryCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
        onCreated={handleCreated}
      />
    </>
  )
}
