import { apiClient } from "@/lib/apiClient"
import { clearToken } from "@/lib/storage"
import type { User } from "@/types/user"

// One function per endpoint. The axios interceptor in `apiClient` already
// attaches the token, captures the new token from the response header, and
// normalizes errors — so each function below stays a one-liner.

// Devise wraps the user payload under a `user` key, both inbound and out.
// We model that here so callers pass plain objects.

type LoginInput = { email: string; password: string }
type LoginResponse = { message: string; user: User }
export const login = async (input: LoginInput): Promise<User> => {
  const res = await apiClient.post<LoginResponse>("/api/v1/login", { user: input })
  return res.data.user
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
type SignupResponse = { message: string; user: User }
export const signup = async (input: SignupInput): Promise<User> => {
  const res = await apiClient.post<SignupResponse>("/api/v1/signup", { user: input })
  return res.data.user
}

export const logout = async (): Promise<void> => {
  // why try/finally: the backend sometimes 401s if the token is already
  // expired. Whether the request succeeds or not, the local token must be
  // wiped — otherwise the interceptor keeps attaching a dead token and the
  // user gets stuck.
  try {
    await apiClient.delete("/api/v1/logout")
  } finally {
    clearToken()
  }
}

export const forgotPassword = async (email: string): Promise<string> => {
  const res = await apiClient.post<{ message: string }>("/api/v1/password", { user: { email } })
  return res.data.message
}

type ResetPasswordInput = {
  reset_password_token: string
  password: string
  password_confirmation: string
}
export const resetPassword = async (input: ResetPasswordInput): Promise<string> => {
  const res = await apiClient.patch<{ message: string }>("/api/v1/password", { user: input })
  return res.data.message
}

export const confirmAccount = async (token: string): Promise<string> => {
  const res = await apiClient.get<{ message: string }>("/api/v1/confirmation", {
    params: { confirmation_token: token },
  })
  return res.data.message
}

export const resendConfirmation = async (email: string): Promise<string> => {
  const res = await apiClient.post<{ message: string }>("/api/v1/confirmation", { user: { email } })
  return res.data.message
}
