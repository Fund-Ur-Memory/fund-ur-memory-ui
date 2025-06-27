// src/services/coingecko.ts
// CoinGecko API service for fetching cryptocurrency prices

interface CoinGeckoPrice {
  [key: string]: {
    usd: number
    usd_24h_change?: number
  }
}

export interface TokenPriceData {
  price: number
  change24h?: number
  lastUpdated: Date
}

// Token ID mapping for CoinGecko API
const TOKEN_ID_MAP: Record<string, string> = {
  'ETH': 'ethereum',
  'AVAX': 'avalanche-2',
  'MONAD': 'monad', // Note: May not be available on CoinGecko yet
  'BTC': 'bitcoin',
  'USDC': 'usd-coin',
  'USDT': 'tether'
}

// Cache for price data to avoid excessive API calls
const priceCache = new Map<string, { data: TokenPriceData; timestamp: number }>()
const CACHE_DURATION = 60000 // 1 minute cache

/**
 * Get the CoinGecko ID for a token symbol
 */
export const getCoinGeckoId = (tokenSymbol: string): string | null => {
  return TOKEN_ID_MAP[tokenSymbol.toUpperCase()] || null
}

/**
 * Fetch current price for a single token
 */
export const fetchTokenPrice = async (tokenSymbol: string): Promise<TokenPriceData | null> => {
  try {
    const coinId = getCoinGeckoId(tokenSymbol)
    if (!coinId) {
      console.warn(`No CoinGecko ID found for token: ${tokenSymbol}`)
      return null
    }

    // Check cache first
    const cacheKey = coinId
    const cached = priceCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data: CoinGeckoPrice = await response.json()

    if (!data[coinId]) {
      throw new Error(`No price data found for ${tokenSymbol}`)
    }

    const priceData: TokenPriceData = {
      price: data[coinId].usd,
      change24h: data[coinId].usd_24h_change,
      lastUpdated: new Date()
    }

    // Cache the result
    priceCache.set(cacheKey, {
      data: priceData,
      timestamp: Date.now()
    })

    return priceData

  } catch (error) {
    console.error(`Failed to fetch price for ${tokenSymbol}:`, error)
    return null
  }
}

/**
 * Fetch prices for multiple tokens
 */
export const fetchMultipleTokenPrices = async (tokenSymbols: string[]): Promise<Record<string, TokenPriceData | null>> => {
  try {
    const coinIds = tokenSymbols
      .map(symbol => ({ symbol, id: getCoinGeckoId(symbol) }))
      .filter(item => item.id !== null)

    if (coinIds.length === 0) {
      return {}
    }

    const idsString = coinIds.map(item => item.id).join(',')

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${idsString}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data: CoinGeckoPrice = await response.json()
    const result: Record<string, TokenPriceData | null> = {}

    coinIds.forEach(({ symbol, id }) => {
      if (id && data[id]) {
        const priceData: TokenPriceData = {
          price: data[id].usd,
          change24h: data[id].usd_24h_change,
          lastUpdated: new Date()
        }

        // Cache individual results
        priceCache.set(id, {
          data: priceData,
          timestamp: Date.now()
        })

        result[symbol] = priceData
      } else {
        result[symbol] = null
      }
    })

    return result

  } catch (error) {
    console.error('Failed to fetch multiple token prices:', error)
    return {}
  }
}

/**
 * Calculate USD value for a token amount
 */
export const calculateUsdValue = async (
  tokenSymbol: string,
  amount: number
): Promise<number | null> => {
  try {
    const priceData = await fetchTokenPrice(tokenSymbol)
    if (!priceData) {
      return null
    }

    return amount * priceData.price
  } catch (error) {
    console.error(`Failed to calculate USD value for ${tokenSymbol}:`, error)
    return null
  }
}

/**
 * Format price with appropriate decimal places
 */
export const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  } else if (price >= 1) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    })
  } else {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 8
    })
  }
}

/**
 * Format price change percentage
 */
export const formatPriceChange = (change: number): string => {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
}

/**
 * Get price change color for UI
 */
export const getPriceChangeColor = (change: number): string => {
  if (change > 0) return '#10B981' // Green
  if (change < 0) return '#EF4444' // Red
  return '#6B7280' // Gray
}

/**
 * Clear price cache (useful for testing or manual refresh)
 */
export const clearPriceCache = (): void => {
  priceCache.clear()
}

/**
 * Get cache status for debugging
 */
export const getCacheStatus = (): { size: number; entries: string[] } => {
  return {
    size: priceCache.size,
    entries: Array.from(priceCache.keys())
  }
}
