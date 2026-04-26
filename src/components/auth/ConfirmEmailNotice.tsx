"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { confirmAccount, resendConfirmation } from "@/lib/api/auth"
import { Button } from "@/components/ui/Button"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { Spinner } from "@/components/ui/Spinner"
import type { ApiError } from "@/types/api"

export const ConfirmEmailNotice = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("confirmation_token")
  const email = searchParams.get("email")

  if (token) return <TokenConfirmation token={token} />
  if (email) return <PendingNotice email={email} />
  return <ErrorBanner messages={["Missing email or confirmation token."]} />
}

const TokenConfirmation = ({ token }: { token: string }) => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    confirmAccount(token)
      .then((m) => { setMessage(m); setStatus("success") })
      .catch((err: ApiError) => { setMessage(err.messages[0] ?? "Confirmation failed."); setStatus("error") })
  }, [token])

  if (status === "loading") return <Spinner label="Confirming your account…" />
  if (status === "error") return <ErrorBanner messages={[message]} />
  return (
    <div className="space-y-4 text-center">
      <p className="text-green-700 text-sm">{message}</p>
      <Link href="/login" className="text-blue-600 hover:underline text-sm">Continue to login</Link>
    </div>
  )
}

const PendingNotice = ({ email }: { email: string }) => {
  const [error, setError] = useState<ApiError | null>(null)
  const [resent, setResent] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const handleResend = async () => {
    setIsPending(true)
    setError(null)
    try {
      await resendConfirmation(email)
      setResent(true)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-4 text-center">
      <p className="text-sm text-gray-700">
        We sent a confirmation link to <span className="font-medium">{email}</span>. Click the link to activate your account.
      </p>
      {error && <ErrorBanner messages={error.messages} />}
      {resent && <p className="text-green-700 text-xs">Confirmation email resent.</p>}
      <Button variant="secondary" onClick={handleResend} disabled={isPending} className="w-full">
        {isPending ? "Resending…" : "Resend email"}
      </Button>
      <Link href="/login" className="text-blue-600 hover:underline text-sm block">Back to login</Link>
    </div>
  )
}
