"use client"

import { useState } from "react"
import { RequireAuth } from "@/components/layout/RequireAuth"
import { AppShell } from "@/components/layout/AppShell"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Spinner } from "@/components/ui/Spinner"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { CategoryTree } from "@/components/category/CategoryTree"
import { CategoryCreateModal } from "@/components/category/CategoryCreateModal"
import { useApi } from "@/hooks/useApi"
import { listCategories } from "@/lib/api/categories"

export default function CategoriesPage() {
  const { data, isLoading, error, refetch } = useApi(listCategories, [])
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <RequireAuth>
      <AppShell>
        <Card
          title="Categories"
          action={<Button onClick={() => setModalOpen(true)}>New category</Button>}
        >
          {isLoading && <Spinner />}
          {error && <ErrorBanner messages={error.messages} />}
          {data && <CategoryTree categories={data} />}
        </Card>

        <CategoryCreateModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          categories={data ?? []}
          // why refetch instead of locally inserting:
          //   The new category may also be a subcategory; refetching
          //   avoids reasoning about where to insert it in the tree.
          onCreated={() => { setModalOpen(false); refetch() }}
        />
      </AppShell>
    </RequireAuth>
  )
}
