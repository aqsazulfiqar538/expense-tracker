import { AuthCard } from "@/components/auth/AuthCard"
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"
import { RedirectIfLoggedIn } from "@/components/layout/RedirectIfLoggedIn"

export default function ForgotPasswordPage() {
  return (
    <RedirectIfLoggedIn>
      <AuthCard title="Forgot your password?" subtitle="We'll email you a reset link">
        <ForgotPasswordForm />
      </AuthCard>
    </RedirectIfLoggedIn>
  )
}
