"use client"

import { use } from "react"
import Link from "next/link"
import { RequireAuth } from "@/components/layout/RequireAuth"
import { AppShell } from "@/components/layout/AppShell"
import { Spinner } from "@/components/ui/Spinner"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { FriendLedger } from "@/components/ledger/FriendLedger"
import { useApi } from "@/hooks/useApi"
import { getFriendLedger } from "@/lib/api/ledger"

type PageProps = { params: Promise<{ friendId: string }> }

export default function FriendLedgerPage({ params }: PageProps) {
  const { friendId } = use(params)
  const { data, isLoading, error, refetch } = useApi(() => getFriendLedger(friendId), [friendId])

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-4">
          <Link href="/ledger" className="text-sm text-blue-600 hover:underline">← Back to ledger</Link>
          {isLoading && <Spinner />}
          {error && <ErrorBanner messages={error.messages} />}
          {data && <FriendLedger data={data} onChanged={refetch} />}
        </div>
      </AppShell>
    </RequireAuth>
  )
}
