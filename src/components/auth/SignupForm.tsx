"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import type { ApiError } from "@/types/api"

type FormState = {
  email: string
  password: string
  password_confirmation: string
  first_name: string
  last_name: string
  phone_number: string
  date_of_birth: string
}

const initialState: FormState = {
  email: "", password: "", password_confirmation: "",
  first_name: "", last_name: "", phone_number: "", date_of_birth: "",
}

export const SignupForm = () => {
  const router = useRouter()
  const { signup } = useAuth()
  const [form, setForm] = useState<FormState>(initialState)
  const [error, setError] = useState<ApiError | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    try {
      await signup(form)
      router.push(`/confirm?email=${encodeURIComponent(form.email)}`)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <ErrorBanner messages={error.messages} />}
      <div className="grid grid-cols-2 gap-3">
        <Input label="First name" name="first_name" required value={form.first_name} onChange={handleChange} />
        <Input label="Last name" name="last_name" required value={form.last_name} onChange={handleChange} />
      </div>
      <Input label="Email" name="email" type="email" required value={form.email} onChange={handleChange} />
      <Input label="Phone" name="phone_number" required value={form.phone_number} onChange={handleChange} />
      <Input label="Date of birth" name="date_of_birth" type="date" required value={form.date_of_birth} onChange={handleChange} />
      <Input label="Password" name="password" type="password" required value={form.password} onChange={handleChange} />
      <Input label="Confirm password" name="password_confirmation" type="password" required value={form.password_confirmation} onChange={handleChange} />
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating account…" : "Sign up"}
      </Button>
      <p className="text-sm text-center pt-2">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
      </p>
    </form>
  )
}
