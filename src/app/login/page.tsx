import { AuthCard } from "@/components/auth/AuthCard"
import { LoginForm } from "@/components/auth/LoginForm"
import { RedirectIfLoggedIn } from "@/components/layout/RedirectIfLoggedIn"

export default function LoginPage() {
  return (
    <RedirectIfLoggedIn>
      <AuthCard title="Welcome back" subtitle="Log in to your account">
        <LoginForm />
      </AuthCard>
    </RedirectIfLoggedIn>
  )
}
