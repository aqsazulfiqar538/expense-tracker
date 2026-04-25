import axios, { AxiosError, AxiosResponse } from "axios"
import { getToken, setToken, clearToken } from "@/lib/storage"
import type { ApiError } from "@/types/api"

// Single axios instance the whole app shares. See ARCHITECTURE.md §6 for why
// axios stays. The two interceptors below are the entire reason — they let
// every `lib/api/*.ts` function be a one-liner.

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
})

// Request: attach the JWT if we have one.
apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response: pull a fresh JWT off the Authorization header (devise-jwt sends
// one on login/signup), then on error normalize the various Rails/Devise
// error shapes into a single `ApiError` so callers don't branch on shape.
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const auth = response.headers["authorization"] ?? response.headers["Authorization"]
    if (typeof auth === "string" && auth.startsWith("Bearer ")) {
      setToken(auth.slice("Bearer ".length))
    }
    return response
  },
  (error: AxiosError) => {
    const status = error.response?.status ?? 0

    // 401: token expired or missing. Wipe and bounce to /login. The
    // `typeof window` guard keeps SSR safe.
    if (status === 401 && typeof window !== "undefined") {
      clearToken()
      const onAuthRoute = ["/login", "/signup", "/forgot-password", "/reset-password", "/confirm"]
        .some((p) => window.location.pathname.startsWith(p))
      if (!onAuthRoute) window.location.href = "/login"
    }

    return Promise.reject(toApiError(error))
  },
)

// Pull human-readable messages out of whatever the backend returned.
const toApiError = (error: AxiosError): ApiError => {
  const status = error.response?.status ?? 0
  const data = error.response?.data as unknown

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>
    if (Array.isArray(obj.errors)) return { messages: obj.errors.map(String), status }
    if (typeof obj.error === "string") return { messages: [obj.error], status }
    if (typeof obj.message === "string") return { messages: [obj.message], status }
  }

  return { messages: [error.message || "Something went wrong"], status }
}
