"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import type { ApiError } from "@/types/api"

export const LoginForm = () => {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<ApiError | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    try {
      await login(email, password)
      router.push("/")
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorBanner messages={error.messages} />}
      <Input label="Email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="Password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Logging in…" : "Log in"}
      </Button>
      <div className="flex justify-between text-sm pt-2">
        <Link href="/forgot-password" className="text-blue-600 hover:underline">Forgot password?</Link>
        <Link href="/signup" className="text-blue-600 hover:underline">Create account</Link>
      </div>
    </form>
  )
}
