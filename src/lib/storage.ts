// JWT lives in localStorage. See ARCHITECTURE.md §7 for the trade-off.
//
// why the `typeof window` guard:
//   Next.js's App Router runs every module on the server during SSR. There is
//   no `localStorage` there, so a bare `localStorage.getItem(...)` throws
//   `ReferenceError: localStorage is not defined`. Centralizing the guard in
//   one file means callers never have to think about it.

const TOKEN_KEY = "token"

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export const clearToken = (): void => {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_KEY)
}
