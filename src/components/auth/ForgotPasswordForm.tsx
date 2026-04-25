"use client"

import { useState } from "react"
import Link from "next/link"
import { forgotPassword } from "@/lib/api/auth"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import type { ApiError } from "@/types/api"

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<ApiError | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    setSuccess(null)
    try {
      const message = await forgotPassword(email)
      setSuccess(message)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsPending(false)
    }
  }

  // why we keep the form mounted after success:
  //   The user might typo the email. Replacing the form with a "check your
  //   inbox" page would force a back-and-click to retry. Showing the success
  //   message above the form lets them re-submit with a corrected email.
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorBanner messages={error.messages} />}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-3 py-2">
          {success}
        </div>
      )}
      <Input label="Email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Sending…" : "Send reset link"}
      </Button>
      <p className="text-sm text-center pt-2">
        <Link href="/login" className="text-blue-600 hover:underline">Back to login</Link>
      </p>
    </form>
  )
}
