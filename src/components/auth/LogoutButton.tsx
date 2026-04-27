"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/Button"

export const LogoutButton = () => {
  const router = useRouter()
  const { logout } = useAuth()
  const [isPending, setIsPending] = useState(false)

  const handleClick = async () => {
    setIsPending(true)
    try {
      await logout()
      router.push("/login")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button variant="secondary" onClick={handleClick} disabled={isPending}>
      {isPending ? "Logging out…" : "Log out"}
    </Button>
  )
}
