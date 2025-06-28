import { useState, useEffect, useCallback } from 'react'
import { useReadContract, useWriteContract } from 'wagmi'

// Demo hook for real-time price monitoring during hackathon
export const useDemoRealTimePrice = (contractAddress?: string) => {
  const [priceHistory, setPriceHistory] = useState<Array<{
    price: number
    timestamp: number
    source: 'chainlink' | 'simulated'
  }>>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<number>(0)

  // Read latest price from Chainlink
  const { data: chainlinkPrice, refetch: refetchPrice } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: [
      {
        name: 'getLatestPrice',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [
          { name: 'price', type: 'int256' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'isStale', type: 'bool' }
        ]
      }
    ],
    functionName: 'getLatestPrice',
    query: {
      refetchInterval: 5000, // Check every 5 seconds
    }
  })

  // Read price freshness
  const { data: priceFreshness } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: [
      {
        name: 'getPriceFreshness',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [
          { name: 'secondsSinceUpdate', type: 'uint256' },
          { name: 'isStale', type: 'bool' }
        ]
      }
    ],
    functionName: 'getPriceFreshness',
    query: {
      refetchInterval: 1000, // Check freshness every second
    }
  })

  // Force price check for demo
  const { writeContract: forcePriceCheck } = useWriteContract()

  // Simulate real-time price updates for demo purposes
  const simulateRealTimePrice = useCallback(() => {
    if (!chainlinkPrice) return

    const [price] = chainlinkPrice as [bigint, bigint, boolean]
    const basePrice = Number(price) / 1e8 // Convert from 8 decimals

    // Add small random variations for demo effect
    const variation = (Math.random() - 0.5) * 0.02 // ±1% variation
    const simulatedPrice = basePrice * (1 + variation)

    setPriceHistory(prev => {
      const newEntry = {
        price: simulatedPrice,
        timestamp: Date.now(),
        source: 'simulated' as const
      }

      // Keep only last 50 entries for performance
      const updated = [...prev, newEntry].slice(-50)
      return updated
    })

    setLastUpdate(Date.now())
  }, [chainlinkPrice])

  // Update price history when Chainlink price changes
  useEffect(() => {
    if (!chainlinkPrice) return

    const [price, timestamp] = chainlinkPrice as [bigint, bigint, boolean]
    const priceNumber = Number(price) / 1e8
    const timestampNumber = Number(timestamp) * 1000 // Convert to milliseconds

    setPriceHistory(prev => {
      // Check if this is a new price update
      const lastEntry = prev[prev.length - 1]
      if (lastEntry && lastEntry.timestamp === timestampNumber) {
        return prev // Same timestamp, don't add duplicate
      }

      const newEntry = {
        price: priceNumber,
        timestamp: timestampNumber,
        source: 'chainlink' as const
      }

      return [...prev, newEntry].slice(-50)
    })

    setLastUpdate(timestampNumber)
  }, [chainlinkPrice])

  // Start/stop monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)
  }, [])

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
  }, [])

  // Simulate rapid price changes for demo
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      simulateRealTimePrice()
    }, 2000) // Update every 2 seconds for demo

    return () => clearInterval(interval)
  }, [isMonitoring, simulateRealTimePrice])

  // Force refresh Chainlink price
  const refreshChainlinkPrice = useCallback(async () => {
    if (contractAddress) {
      try {
        await forcePriceCheck({
          address: contractAddress as `0x${string}`,
          abi: [
            {
              name: 'checkVaultConditions',
              type: 'function',
              stateMutability: 'nonpayable',
              inputs: [],
              outputs: []
            }
          ],
          functionName: 'checkVaultConditions'
        })
        
        // Refetch after forcing update
        setTimeout(() => {
          refetchPrice()
        }, 1000)
      } catch (error) {
        console.error('Failed to force price check:', error)
      }
    }
  }, [contractAddress, forcePriceCheck, refetchPrice])

  // Get current price info
  const getCurrentPrice = useCallback(() => {
    if (!chainlinkPrice) return null

    const [price, timestamp, isStale] = chainlinkPrice as [bigint, bigint, boolean]
    return {
      price: Number(price) / 1e8,
      timestamp: Number(timestamp) * 1000,
      isStale,
      freshness: priceFreshness ? Number(priceFreshness[0]) : 0
    }
  }, [chainlinkPrice, priceFreshness])

  // Get price change percentage
  const getPriceChange = useCallback(() => {
    if (priceHistory.length < 2) return 0

    const latest = priceHistory[priceHistory.length - 1]
    const previous = priceHistory[priceHistory.length - 2]
    
    return ((latest.price - previous.price) / previous.price) * 100
  }, [priceHistory])

  // Check if price is updating frequently (good for demo)
  const isRealTimeReady = useCallback(() => {
    if (!priceFreshness) return false
    
    const [secondsSinceUpdate] = priceFreshness as [bigint, boolean]
    return Number(secondsSinceUpdate) < 300 // Less than 5 minutes old
  }, [priceFreshness])

  // Get demo recommendations
  const getDemoRecommendations = useCallback(() => {
    const currentPrice = getCurrentPrice()
    if (!currentPrice) return []

    const recommendations = []

    if (currentPrice.isStale) {
      recommendations.push({
        type: 'warning',
        message: 'Price is stale. Consider using simulated mode for demo.',
        action: 'Use simulated real-time updates'
      })
    }

    if (currentPrice.freshness > 1800) { // 30 minutes
      recommendations.push({
        type: 'info',
        message: 'Price updates are infrequent. Enable simulation for better demo experience.',
        action: 'Start monitoring with simulation'
      })
    }

    if (currentPrice.freshness < 60) { // 1 minute
      recommendations.push({
        type: 'success',
        message: 'Price is very fresh! Perfect for live demo.',
        action: 'Use live Chainlink data'
      })
    }

    return recommendations
  }, [getCurrentPrice])

  return {
    // Price data
    priceHistory,
    currentPrice: getCurrentPrice(),
    priceChange: getPriceChange(),
    lastUpdate,
    
    // Status
    isMonitoring,
    isRealTimeReady: isRealTimeReady(),
    
    // Actions
    startMonitoring,
    stopMonitoring,
    refreshChainlinkPrice,
    
    // Demo helpers
    getDemoRecommendations: getDemoRecommendations(),
    
    // Raw data for advanced use
    chainlinkPrice,
    priceFreshness
  }
}
