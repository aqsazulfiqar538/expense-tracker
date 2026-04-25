"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { CategorySelect } from "@/components/category/CategorySelect"
import { ParticipantPicker, type PickableFriend } from "@/components/expense/ParticipantPicker"
import { SplitEditor, isCustomSplitValid, type SplitMode, type CustomShare } from "@/components/expense/SplitEditor"
import { createExpense, updateExpense } from "@/lib/api/expenses"
import { useAuth } from "@/hooks/useAuth"
import type { Category } from "@/types/category"
import type { Expense, CreateExpenseInput, UpdateExpenseInput } from "@/types/expense"
import type { ApiError } from "@/types/api"

type Mode =
  | { kind: "create" }
  | { kind: "edit"; expense: Expense }

type Props = {
  mode: Mode
  categories: Category[]
  friends: PickableFriend[]
  onUpdated?: () => void
}

export const ExpenseForm = ({ mode, categories, friends, onUpdated }: Props) => {
  const router = useRouter()
  const { user } = useAuth()

  const initial = mode.kind === "edit" ? mode.expense : null

  const [title, setTitle] = useState(initial?.title ?? "")
  const [amount, setAmount] = useState(initial?.amount ?? "")
  const [categoryId, setCategoryId] = useState(initial?.category_id ? String(initial.category_id) : "")
  const [startDate, setStartDate] = useState(initial?.start_date ?? new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState(initial?.notes ?? "")

  const [shareWithFriends, setShareWithFriends] = useState(false)
  const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>([])
  const [splitMode, setSplitMode] = useState<SplitMode>("equal")
  const [customShares, setCustomShares] = useState<CustomShare[]>([])

  const [error, setError] = useState<ApiError | null>(null)
  const [isPending, setIsPending] = useState(false)

  const me: PickableFriend | null = user
    ? { id: Number(user.id), full_name: `${user.first_name} ${user.last_name}` }
    : null

  const splitParticipants: PickableFriend[] = me
    ? [me, ...friends.filter((f) => selectedFriendIds.includes(f.id))]
    : []

  const splitInvalid =
    shareWithFriends && splitMode === "custom" && !isCustomSplitValid(amount, customShares)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsPending(true)
    try {
      if (mode.kind === "edit") {
        const payload: UpdateExpenseInput = {
          title, amount, category_id: Number(categoryId), start_date: startDate, notes: notes || null,
        }
        await updateExpense(mode.expense.id, payload)
        onUpdated?.()
      } else {
        const payload: CreateExpenseInput = {
          title, amount, category_id: Number(categoryId), start_date: startDate, notes: notes || null,
        }
        if (shareWithFriends && splitParticipants.length > 1) {
          payload.split_equally = splitMode === "equal"
          payload.participants = splitMode === "equal"
            ? splitParticipants.map((p) => ({ user_id: p.id }))
            : customShares
        }
        const created = await createExpense(payload)
        router.push(`/expenses/${created.id}`)
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

      <Input label="Title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input label="Amount" name="amount" type="number" step="0.01" min="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
      <CategorySelect categories={categories} value={categoryId} onChange={setCategoryId} />
      <Input label="Date" name="start_date" type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <Textarea label="Notes (optional)" name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />

      {mode.kind === "create" && (
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={shareWithFriends} onChange={(e) => setShareWithFriends(e.target.checked)} className="accent-blue-600" />
            Split this with friends
          </label>

          {shareWithFriends && (
            <>
              <ParticipantPicker friends={friends} selectedIds={selectedFriendIds} onChange={(ids) => {
                setSelectedFriendIds(ids)
                setCustomShares([
                  ...(me ? [{ user_id: me.id, paid_share: "0", owed_share: "0" }] : []),
                  ...friends.filter((f) => ids.includes(f.id)).map((f) => ({ user_id: f.id, paid_share: "0", owed_share: "0" })),
                ])
              }} />
              {splitParticipants.length > 1 && (
                <SplitEditor
                  amount={amount}
                  participants={splitParticipants}
                  mode={splitMode}
                  onModeChange={setSplitMode}
                  customShares={customShares}
                  onCustomSharesChange={setCustomShares}
                />
              )}
            </>
          )}
        </div>
      )}

      <Button type="submit" disabled={isPending || splitInvalid} className="w-full">
        {isPending ? "Saving…" : mode.kind === "create" ? "Create expense" : "Save changes"}
      </Button>
    </form>
  )
}
