import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { EmptyState } from "@/components/ui/EmptyState"
import { formatCurrency } from "@/lib/format"
import type { LedgerSummary as LedgerSummaryType, LedgerEntry } from "@/types/ledger"

type Props = {
  summary: LedgerSummaryType
}

export const LedgerSummary = ({ summary }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card title={`You owe · ${formatCurrency(summary.total_i_owe)}`}>
        {summary.i_owe.length === 0
          ? <EmptyState title="Nothing you owe" />
          : <EntryList entries={summary.i_owe} tone="text-red-700" />
        }
      </Card>

      <Card title={`Owed to you · ${formatCurrency(summary.total_owed_to_me)}`}>
        {summary.owed_to_me.length === 0
          ? <EmptyState title="Nothing owed to you" />
          : <EntryList entries={summary.owed_to_me} tone="text-green-700" />
        }
      </Card>
    </div>
  )
}

const EntryList = ({ entries, tone }: { entries: LedgerEntry[]; tone: string }) => (
  <ul className="divide-y divide-gray-100">
    {entries.map((e) => (
      <li key={e.id}>
        <Link href={`/ledger/${e.id}`} className="flex items-center justify-between py-2 text-sm hover:bg-gray-50 -mx-2 px-2 rounded">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium flex items-center justify-center">
              {e.initials}
            </div>
            <span className="text-gray-800">{e.full_name}</span>
          </div>
          <span className={`font-medium ${tone}`}>{formatCurrency(e.amount)}</span>
        </Link>
      </li>
    ))}
  </ul>
)
