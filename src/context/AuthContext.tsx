"use client"
import { createContext, useContext, useState, ReactNode } from "react"
import { User, LoginPayload, SignupPayload } from "@/types/auth"
import { loginUser, signupUser, logoutUser } from "@/lib/api/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (payload: LoginPayload) => Promise<void>
  signup: (payload: SignupPayload) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (payload: LoginPayload) => {
    setLoading(true)
    setError(null)
    try {
      const data = await loginUser(payload)
      setUser(data.user)
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const signup = async (payload: SignupPayload) => {
    setLoading(true)
    setError(null)
    try {
      const data = await signupUser(payload)
      setUser(data.user)
    } catch (err: any) {
      const errors = err.response?.data?.errors?.join(", ") || "Signup failed"
      setError(errors)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await logoutUser()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
