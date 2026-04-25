"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Spinner } from "@/components/ui/Spinner"
import type { ReactNode } from "react"

// Mirror of RequireAuth.
//
// Use on auth pages (login, signup, forgot-password). If the visitor is
// already logged in, send them to "/" instead of rendering the form. This
// fixes the case where a user clicks the browser back button after logging
// in and ends up on the login form — meaningless if they're authenticated.
//
// why we need this even though RequireAuth exists:
//   RequireAuth keeps logged-OUT users away from PROTECTED pages.
//   RedirectIfLoggedIn keeps logged-IN users away from AUTH pages.
//   They guard opposite directions — neither replaces the other.

type Props = { children: ReactNode }

export const RedirectIfLoggedIn = ({ children }: Props) => {
  const router = useRouter()
  const { user, isBootstrapping } = useAuth()

  useEffect(() => {
    if (!isBootstrapping && user) {
      router.replace("/")
    }
  }, [isBootstrapping, user, router])

  // Don't render anything until bootstrap finishes — we don't want to flash
  // the login form for a half-second before deciding to redirect.
  if (isBootstrapping) return <Spinner label="Loading…" />

  // Effect above triggers the redirect; render nothing until it fires.
  if (user) return null

  return <>{children}</>
}
