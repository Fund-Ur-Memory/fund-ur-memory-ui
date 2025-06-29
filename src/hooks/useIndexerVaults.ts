// src/hooks/useIndexerVaults.ts
// Hook for fetching real vault data from the indexer API

import { useState, useEffect, useCallback } from 'react'
import { fetchOwnerVaults, getRecentVaultActivity, convertVaultToTransaction, type IndexerVault } from '../services/indexerService'
import { type Transaction } from '../types/dashboard'

interface UseIndexerVaultsReturn {
  vaults: IndexerVault[]
  recentActivity: Transaction[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  lastUpdated: Date | null
}

export const useIndexerVaults = (owner?: string, autoFetch = true): UseIndexerVaultsReturn => {
  const [vaults, setVaults] = useState<IndexerVault[]>([])
  const [recentActivity, setRecentActivity] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchVaults = useCallback(async (showLoading = true) => {
    if (!owner) {
      setVaults([])
      setRecentActivity([])
      return
    }

    if (showLoading) {
      setIsLoading(true)
    }
    setError(null)

    try {
      console.log('🔍 Fetching vault data from indexer for:', owner)
      
      // Fetch all vaults for the owner
      const response = await fetchOwnerVaults(owner, 50, 0)

      if (response.success && response.data) {
        const fetchedVaults = response.data.vaults
        setVaults(fetchedVaults)

        // Convert vaults to transaction format for recent activity
        const transactions = fetchedVaults
          .slice(0, 10) // Limit to 10 most recent
          .map(vault => convertVaultToTransaction(vault))

        setRecentActivity(transactions)
        setLastUpdated(new Date())
        
        console.log('✅ Indexer vault data loaded successfully:', {
          vaultsCount: fetchedVaults.length,
          recentActivityCount: transactions.length
        })
      } else {
        throw new Error(response.error || 'Failed to fetch vault data')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('❌ Failed to fetch indexer vault data:', errorMessage)
      setError(errorMessage)
      setVaults([])
      setRecentActivity([])
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }, [owner])

  // Fetch vaults on mount if autoFetch is enabled and owner is provided
  useEffect(() => {
    if (autoFetch && owner) {
      fetchVaults()
    }
  }, [autoFetch, owner, fetchVaults])

  // Refetch function
  const refetch = useCallback(async () => {
    await fetchVaults()
  }, [fetchVaults])

  return {
    vaults,
    recentActivity,
    isLoading,
    error,
    refetch,
    lastUpdated
  }
}

/**
 * Hook specifically for getting recent vault activity as transactions
 */
export const useRecentVaultActivity = (owner?: string, maxItems = 5): {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
} => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchActivity = useCallback(async () => {
    if (!owner) {
      setTransactions([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const recentVaults = await getRecentVaultActivity(owner, maxItems)
      const activityTransactions = recentVaults.map(vault => convertVaultToTransaction(vault))
      
      setTransactions(activityTransactions)
      console.log('✅ Recent vault activity loaded:', activityTransactions.length, 'items')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('❌ Failed to fetch recent vault activity:', errorMessage)
      setError(errorMessage)
      setTransactions([])
    } finally {
      setIsLoading(false)
    }
  }, [owner, maxItems])

  useEffect(() => {
    if (owner) {
      fetchActivity()
    }
  }, [owner, fetchActivity])

  const refetch = useCallback(async () => {
    await fetchActivity()
  }, [fetchActivity])

  return {
    transactions,
    isLoading,
    error,
    refetch
  }
}