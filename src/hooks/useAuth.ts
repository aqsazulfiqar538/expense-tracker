"use client"

import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"

// Thin wrapper around `useContext(AuthContext)`. The runtime guard is the
// only reason this isn't a one-line re-export — without it, forgetting to
// wrap the tree in <AuthProvider> would surface as `Cannot read properties
// of null (reading 'login')` in some random child. The throw points to the
// real problem.
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
