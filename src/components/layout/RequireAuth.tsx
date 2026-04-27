"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Spinner } from "@/components/ui/Spinner"
import type { ReactNode } from "react"

type Props = { children: ReactNode }

export const RequireAuth = ({ children }: Props) => {
  const router = useRouter()
  const { user, isCheckingAuth } = useAuth()

  useEffect(() => {
    if (!isCheckingAuth && !user) {
      router.replace("/login")
    }
  }, [isCheckingAuth, user, router])

  if (isCheckingAuth) return <Spinner label="Loading…" />

  if (!user) return null

  return <>{children}</>
}
