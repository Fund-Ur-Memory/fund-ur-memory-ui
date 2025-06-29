// src/hooks/useVaultsAnalysis.ts
// Hook for managing AI-powered vault analysis data

import { useState, useEffect, useCallback } from 'react'
import { fetchVaultsAnalysis, clearVaultsAnalysisCache, type VaultsAnalysisData } from '../services/vaultsAnalysisService'

interface UseVaultsAnalysisReturn {
  data: VaultsAnalysisData | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  lastUpdated: Date | null
}

export const useVaultsAnalysis = (autoFetch = false): UseVaultsAnalysisReturn => {
  const [data, setData] = useState<VaultsAnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchAnalysis = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }
    setError(null)

    try {
      console.log('🔍 Fetching vaults analysis...')
      const response = await fetchVaultsAnalysis()

      if (response.success && response.data) {
        setData(response.data)
        setLastUpdated(new Date())
        console.log('✅ Vaults analysis loaded successfully')
      } else {
        throw new Error(response.error || 'Failed to fetch analysis')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('❌ Failed to fetch vaults analysis:', errorMessage)
      setError(errorMessage)
      setData(null)
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }, [])

  // Fetch analysis on mount if autoFetch is enabled
  useEffect(() => {
    if (autoFetch) {
      fetchAnalysis()
    }
  }, [autoFetch, fetchAnalysis])

  // Refetch function with cache clearing
  const refetch = useCallback(async () => {
    clearVaultsAnalysisCache()
    await fetchAnalysis()
  }, [fetchAnalysis])

  return {
    data,
    isLoading,
    error,
    refetch,
    lastUpdated
  }
}