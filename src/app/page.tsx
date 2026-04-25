"use client"

import { RequireAuth } from "@/components/layout/RequireAuth"
import { AppShell } from "@/components/layout/AppShell"
import { Spinner } from "@/components/ui/Spinner"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown"
import { RecentExpenses } from "@/components/dashboard/RecentExpenses"
import { RecentLedger } from "@/components/dashboard/RecentLedger"
import { useApi } from "@/hooks/useApi"
import { getDashboard } from "@/lib/api/dashboard"

export default function DashboardPage() {
  const { data, isLoading, error } = useApi(getDashboard, [])

  return (
    <RequireAuth>
      <AppShell>
        {isLoading && <Spinner />}
        {error && <ErrorBanner messages={error.messages} />}
        {data && (
          <div className="space-y-6">
            <StatsCards dashboard={data} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RecentExpenses expenses={data.recent_expenses} />
              <RecentLedger activity={data.recent_ledger_activity} />
            </div>
            <CategoryBreakdown totals={data.category_totals} />
          </div>
        )}
      </AppShell>
    </RequireAuth>
  )
}
