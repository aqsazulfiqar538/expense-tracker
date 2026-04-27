import { Suspense } from "react"
import { AuthCard } from "@/components/auth/AuthCard"
import { ConfirmEmailNotice } from "@/components/auth/ConfirmEmailNotice"
import { Spinner } from "@/components/ui/Spinner"

export default function ConfirmPage() {
  return (
    <AuthCard title="Confirm your email">
      <Suspense fallback={<Spinner />}>
        <ConfirmEmailNotice />
      </Suspense>
    </AuthCard>
  )
}
