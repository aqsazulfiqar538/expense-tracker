"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { ApiError } from "@/types/api"

// Generic GET hook. Replaces TanStack Query for our needs (see
// ARCHITECTURE.md §6). Holds loading / error / data and exposes a refetch
// trigger.
//
// why the `mounted` ref:
//   If the component unmounts while the request is in flight, calling
//   setState would log a React warning and leak. The ref lets us short-
//   circuit the state updates after unmount.

type UseApiResult<T> = {
  data: T | null
  isLoading: boolean
  error: ApiError | null
  refetch: () => void
}

// why ReadonlyArray<unknown>:
//   The deps array is treated as opaque — we never read it, only feed it
//   back into useEffect. Marking it readonly prevents accidental mutation.
export const useApi = <T,>(fetcher: () => Promise<T>, deps: ReadonlyArray<unknown> = []): UseApiResult<T> => {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [tick, setTick] = useState(0)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  // why we ignore the lint warning on the next useEffect:
  //   The caller passes the dependency array explicitly via `deps`. Listing
  //   `fetcher` here would force every consumer to memoize their fetcher
  //   with useCallback — exactly the boilerplate this hook exists to remove.
  //   The spread is also intentional: `deps` is opaque to us, the caller
  //   chooses what triggers a refetch.
  useEffect(() => {
    setIsLoading(true)
    setError(null)
    fetcher()
      .then((result) => { if (mounted.current) setData(result) })
      .catch((err: ApiError) => { if (mounted.current) setError(err) })
      .finally(() => { if (mounted.current) setIsLoading(false) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps])

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  return { data, isLoading, error, refetch }
}
