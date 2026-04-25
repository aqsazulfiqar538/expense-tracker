"use client"

import { useCallback, useRef, useEffect, useState } from "react"
import type { ApiError } from "@/types/api"

// Generic write hook. Mirrors useApi but for writes — the caller decides
// when to fire by calling `mutate(...)` and awaiting the result.
//
// why this exists separately from useApi:
//   Writes are imperative ("when the user clicks submit, then..."). Reads
//   are declarative ("while this component is mounted, keep this fresh").
//   Conflating them with one hook makes both signatures awkward.

type UseMutationResult<TInput, TOutput> = {
  mutate: (input: TInput) => Promise<TOutput>
  isPending: boolean
  error: ApiError | null
  reset: () => void
}

export const useMutation = <TInput, TOutput>(
  fn: (input: TInput) => Promise<TOutput>,
): UseMutationResult<TInput, TOutput> => {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  // why we still throw from `mutate`:
  //   Even though we set `error` on state for UI, callers often want to
  //   await + branch (e.g. "on success, redirect"). Re-throwing keeps that
  //   ergonomic with try/catch.
  const mutate = useCallback(async (input: TInput): Promise<TOutput> => {
    setIsPending(true)
    setError(null)
    try {
      const result = await fn(input)
      return result
    } catch (err) {
      if (mounted.current) setError(err as ApiError)
      throw err
    } finally {
      if (mounted.current) setIsPending(false)
    }
  }, [fn])

  const reset = useCallback(() => setError(null), [])

  return { mutate, isPending, error, reset }
}
