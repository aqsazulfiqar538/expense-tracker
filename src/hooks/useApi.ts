"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { ApiError } from "@/types/api"

type UseApiResult<T> = {
  data: T | null
  isLoading: boolean
  error: ApiError | null
  refetch: () => void
}

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

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    fetcher()
      .then((result) => { if (mounted.current) setData(result) })
      .catch((err: ApiError) => { if (mounted.current) setError(err) })
      .finally(() => { if (mounted.current) setIsLoading(false) })
  }, [tick, ...deps])

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  return { data, isLoading, error, refetch }
}
