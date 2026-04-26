"use client"

import { RequireAuth } from "@/components/layout/RequireAuth"
import { AppShell } from "@/components/layout/AppShell"
import { Spinner } from "@/components/ui/Spinner"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { LedgerSummary } from "@/components/ledger/LedgerSummary"
import { useApi } from "@/hooks/useApi"
import { getLedgerSummary } from "@/lib/api/ledger"

export default function LedgerPage() {
  const { data, isLoading, error } = useApi(getLedgerSummary, [])

  return (
    <RequireAuth>
      <AppShell>
        {isLoading && <Spinner />}
        {error && <ErrorBanner messages={error.messages} />}
        {data && <LedgerSummary summary={data} />}
      </AppShell>
    </RequireAuth>
  )
}
