"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Spinner } from "@/components/ui/Spinner"
import type { ReactNode } from "react"

// Wrap any page that requires login.
//
// why a component, not Next middleware:
//   Middleware runs on the server before client JS. It can't read
//   localStorage where our JWT lives, so it can't tell whether the user is
//   logged in. The decision has to happen in the browser, after AuthContext
//   has bootstrapped from localStorage. If/when we move to httpOnly cookies,
//   middleware becomes viable and this file can shrink to a no-op.

type Props = { children: ReactNode }

export const RequireAuth = ({ children }: Props) => {
  const router = useRouter()
  const { user, isBootstrapping } = useAuth()

  useEffect(() => {
    if (!isBootstrapping && !user) {
      router.replace("/login")
    }
  }, [isBootstrapping, user, router])

  // While bootstrapping, show spinner — premature redirect would flash a
  // login page even for an already-logged-in user just refreshing.
  if (isBootstrapping) return <Spinner label="Loading…" />

  // Effect above handles the redirect; render nothing in the meantime.
  if (!user) return null

  return <>{children}</>
}
