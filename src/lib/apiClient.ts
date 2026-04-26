import axios, { AxiosError, AxiosResponse } from "axios"
import { getToken, setToken, clearToken } from "@/lib/storage"
import type { ApiError } from "@/types/api"

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

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

    if (status === 401 && typeof window !== "undefined") {
      clearToken()
      const onAuthRoute = ["/login", "/signup", "/forgot-password", "/reset-password", "/confirm"].some((p) => window.location.pathname.startsWith(p))
      if (!onAuthRoute) window.location.href = "/login"
    }

    return Promise.reject(toApiError(error))
  },
)

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
