"use client"

import { createContext, useEffect, useState, useCallback } from "react"
import type { ReactNode } from "react"
import { login as loginApi, signup as signupApi, logout as logoutApi } from "@/lib/api/auth"
import { getProfile } from "@/lib/api/users"
import { getToken, clearToken } from "@/lib/storage"
import type { User } from "@/types/user"

// What the rest of the app sees. Forms call `login` / `signup` / `logout`;
// the rest read `user` and `isBootstrapping`.
type AuthContextValue = {
  user: User | null
  isBootstrapping: boolean
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

// why exported: `useAuth` needs it for `useContext(AuthContext)`. We don't
// re-export through a barrel since this is the only consumer.
export const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  // why a separate "bootstrapping" flag instead of just `user === null`:
  //   On first paint, before /users/profile resolves, `user` is null. That's
  //   indistinguishable from "logged out", so RequireAuth would prematurely
  //   redirect to /login. The boolean tells consumers "we're still finding
  //   out — wait."
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setIsBootstrapping(false)
      return
    }
    getProfile()
      .then(setUser)
      // why catch -> clearToken: if the token is stale or revoked, the
      // profile call returns 401. The apiClient interceptor already handles
      // routing for in-flow 401s; here we just make sure local state agrees
      // (no token, no user) so the user can re-login cleanly.
      .catch(() => clearToken())
      .finally(() => setIsBootstrapping(false))
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
    <AuthContext.Provider value={{ user, isBootstrapping, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
