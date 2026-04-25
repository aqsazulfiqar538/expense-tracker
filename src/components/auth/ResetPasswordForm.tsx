"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { resetPassword } from "@/lib/api/auth"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import type { ApiError } from "@/types/api"

export const ResetPasswordForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  // why read it inside the component, not as a page prop:
  //   App Router pages receive `searchParams` as a prop, but only on Server
  //   Components. This form is "use client" so it reads via the hook.
  const token = searchParams.get("reset_password_token") ?? ""

  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [error, setError] = useState<ApiError | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    try {
      await resetPassword({
        reset_password_token: token,
        password,
        password_confirmation: confirmation,
      })
      router.push("/login")
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsPending(false)
    }
  }

  if (!token) {
    return <ErrorBanner messages={["Missing reset token. Use the link from your email."]} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorBanner messages={error.messages} />}
      <Input label="New password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      <Input label="Confirm new password" name="password_confirmation" type="password" required value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Resetting…" : "Reset password"}
      </Button>
    </form>
  )
}
