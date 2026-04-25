import { AuthCard } from "@/components/auth/AuthCard"
import { SignupForm } from "@/components/auth/SignupForm"
import { RedirectIfLoggedIn } from "@/components/layout/RedirectIfLoggedIn"

export default function SignupPage() {
  return (
    <RedirectIfLoggedIn>
      <AuthCard title="Create your account" subtitle="Track expenses with friends">
        <SignupForm />
      </AuthCard>
    </RedirectIfLoggedIn>
  )
}
