"use client"

import { createContext, useEffect, useState, useCallback } from "react"
import type { ReactNode } from "react"
import { login as loginApi, signup as signupApi, logout as logoutApi } from "@/lib/api/auth"
import { getProfile } from "@/lib/api/users"
import { getToken, clearToken } from "@/lib/storage"
import type { User } from "@/types/user"

type AuthContextValue = {
  user: User | null
  isCheckingAuth: boolean
  login: (email: string, password: string) => Promise<User>
  signup: (input: SignupInput) => Promise<User>
  logout: () => Promise<void>
}

type SignupInput = {
  email: string
  password: string
  password_confirmation: string
  first_name: string
  last_name: string
  phone_number: string
  date_of_birth: string
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setIsCheckingAuth(false)
      return
    }
    getProfile()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setIsCheckingAuth(false))
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const u = await loginApi({ email, password })
    setUser(u)
    return u
  }, [])

  const signup = useCallback(async (input: SignupInput): Promise<User> => {
    const u = await signupApi(input)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    await logoutApi()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isCheckingAuth, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
