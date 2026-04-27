import { Suspense } from "react"
import { AuthCard } from "@/components/auth/AuthCard"
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"
import { Spinner } from "@/components/ui/Spinner"

export default function ResetPasswordPage() {
  return (
    <AuthCard title="Reset your password" subtitle="Choose a new password">
      {/* why Suspense: ResetPasswordForm calls useSearchParams(), which Next
          requires inside a Suspense boundary so the page can be statically
          prerendered. The fallback is what renders during prerender. */}
      <Suspense fallback={<Spinner />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  )
}
