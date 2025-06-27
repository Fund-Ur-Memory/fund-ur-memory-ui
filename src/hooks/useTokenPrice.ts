// src/hooks/useTokenPrice.ts
import { useState, useEffect, useCallback } from 'react'
import { fetchTokenPrice, fetchMultipleTokenPrices, type TokenPriceData } from '../services/coingecko'

interface UseTokenPriceReturn {
  price: number | null
  change24h: number | null
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
  refetch: () => Promise<void>
}

interface UseMultipleTokenPricesReturn {
  prices: Record<string, TokenPriceData | null>
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch and manage a single token price
 */
export const useTokenPrice = (tokenSymbol: string, autoRefresh = true): UseTokenPriceReturn => {
  const [price, setPrice] = useState<number | null>(null)
  const [change24h, setChange24h] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchPrice = useCallback(async () => {
    if (!tokenSymbol) return

    setIsLoading(true)
    setError(null)

    try {
      const priceData = await fetchTokenPrice(tokenSymbol)
      
      if (priceData) {
        setPrice(priceData.price)
        setChange24h(priceData.change24h || null)
        setLastUpdated(priceData.lastUpdated)
      } else {
        setError(`Unable to fetch price for ${tokenSymbol}`)
        setPrice(null)
        setChange24h(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price')
      setPrice(null)
      setChange24h(null)
    } finally {
      setIsLoading(false)
    }
  }, [tokenSymbol])

  // Initial fetch
  useEffect(() => {
    fetchPrice()
  }, [fetchPrice])

  // Auto-refresh every 5 minutes if enabled
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchPrice()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [fetchPrice, autoRefresh])

  return {
    price,
    change24h,
    isLoading,
    error,
    lastUpdated,
    refetch: fetchPrice
  }
}

/**
 * Hook to fetch and manage multiple token prices
 */
export const useMultipleTokenPrices = (
  tokenSymbols: string[], 
  autoRefresh = true
): UseMultipleTokenPricesReturn => {
  const [prices, setPrices] = useState<Record<string, TokenPriceData | null>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPrices = useCallback(async () => {
    if (!tokenSymbols.length) return

    setIsLoading(true)
    setError(null)

    try {
      const priceData = await fetchMultipleTokenPrices(tokenSymbols)
      setPrices(priceData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices')
      setPrices({})
    } finally {
      setIsLoading(false)
    }
  }, [tokenSymbols])

  // Initial fetch
  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  // Auto-refresh every 5 minutes if enabled
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchPrices()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [fetchPrices, autoRefresh])

  return {
    prices,
    isLoading,
    error,
    refetch: fetchPrices
  }
}

/**
 * Hook to calculate USD value for a token amount
 */
export const useTokenValue = (
  tokenSymbol: string, 
  amount: number
): { usdValue: number | null; isLoading: boolean; error: string | null } => {
  const { price, isLoading, error } = useTokenPrice(tokenSymbol)

  const usdValue = price !== null && amount ? price * amount : null

  return {
    usdValue,
    isLoading,
    error
  }
}

/**
 * Hook for vault-specific price data
 */
export const useVaultTokenPrice = (tokenSymbol: string) => {
  const { price, change24h, isLoading, error, lastUpdated, refetch } = useTokenPrice(tokenSymbol)

  // Format price for display
  const formattedPrice = price !== null ? `$${price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: price >= 1 ? 2 : 6
  })}` : null

  // Format change for display
  const formattedChange = change24h !== null ? {
    value: change24h,
    formatted: `${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`,
    color: change24h > 0 ? '#10B981' : change24h < 0 ? '#EF4444' : '#6B7280'
  } : null

  return {
    price,
    formattedPrice,
    change24h: formattedChange,
    isLoading,
    error,
    lastUpdated,
    refetch
  }
}
