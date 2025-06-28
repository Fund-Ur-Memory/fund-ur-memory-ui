import { useState, useEffect, useCallback } from 'react'
import { useTokenPrice } from './useTokenPrice'

interface UseUsdToTokenConversionReturn {
  tokenAmount: number | null
  tokenAmountFormatted: string
  usdAmount: number
  tokenPrice: number | null
  isLoading: boolean
  error: string | null
  refreshPrice: () => Promise<void>
}

/**
 * Hook to convert USD amount to token amount using real-time prices
 */
export const useUsdToTokenConversion = (
  usdAmount: string | number,
  tokenSymbol: string
): UseUsdToTokenConversionReturn => {
  const [tokenAmount, setTokenAmount] = useState<number | null>(null)
  const [tokenAmountFormatted, setTokenAmountFormatted] = useState('')
  
  const { price: tokenPrice, isLoading, error, refetch } = useTokenPrice(tokenSymbol, true)
  
  // Convert USD to token amount
  const calculateTokenAmount = useCallback(() => {
    const usdValue = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount
    
    if (!tokenPrice || !usdValue || usdValue <= 0 || isNaN(usdValue)) {
      setTokenAmount(null)
      setTokenAmountFormatted('')
      return
    }
    
    const calculatedAmount = usdValue / tokenPrice
    setTokenAmount(calculatedAmount)
    
    // Format with appropriate decimal places
    const formatted = calculatedAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: calculatedAmount >= 1 ? 4 : 8
    })
    setTokenAmountFormatted(formatted)
  }, [usdAmount, tokenPrice])
  
  // Recalculate when inputs change
  useEffect(() => {
    calculateTokenAmount()
  }, [calculateTokenAmount])
  
  const refreshPrice = useCallback(async () => {
    await refetch()
  }, [refetch])
  
  return {
    tokenAmount,
    tokenAmountFormatted,
    usdAmount: typeof usdAmount === 'string' ? parseFloat(usdAmount) || 0 : usdAmount,
    tokenPrice,
    isLoading,
    error,
    refreshPrice
  }
}

/**
 * Hook specifically for AVAX conversion with additional utilities
 */
export const useUsdToAvaxConversion = (usdAmount: string | number) => {
  const conversion = useUsdToTokenConversion(usdAmount, 'AVAX')
  
  // Convert to wei (18 decimals) for contract interaction
  const getTokenAmountInWei = useCallback((): bigint | null => {
    if (!conversion.tokenAmount) return null
    
    try {
      // Convert to wei (multiply by 10^18)
      const weiAmount = BigInt(Math.floor(conversion.tokenAmount * 1e18))
      return weiAmount
    } catch (error) {
      console.error('Error converting to wei:', error)
      return null
    }
  }, [conversion.tokenAmount])
  
  // Get minimum amount validation
  const getValidationError = useCallback((): string | null => {
    const usdValue = conversion.usdAmount
    
    if (usdValue <= 0) {
      return 'Amount must be greater than 0'
    }
    
    if (usdValue < 1) {
      return 'Minimum amount is $1 USD'
    }
    
    if (!conversion.tokenAmount) {
      return 'Unable to calculate token amount'
    }
    
    if (conversion.tokenAmount < 0.001) {
      return 'Amount too small (minimum 0.001 AVAX)'
    }
    
    return null
  }, [conversion.usdAmount, conversion.tokenAmount])
  
  return {
    ...conversion,
    getTokenAmountInWei,
    getValidationError,
    isValid: getValidationError() === null
  }
}

/**
 * Hook for multi-token conversion support
 */
export const useMultiTokenConversion = (usdAmount: string | number) => {
  const avaxConversion = useUsdToTokenConversion(usdAmount, 'AVAX')
  const ethConversion = useUsdToTokenConversion(usdAmount, 'ETH')
  
  const getConversionForToken = useCallback((tokenSymbol: string) => {
    switch (tokenSymbol.toUpperCase()) {
      case 'AVAX':
        return avaxConversion
      case 'ETH':
        return ethConversion
      default:
        return {
          tokenAmount: null,
          tokenAmountFormatted: '',
          usdAmount: typeof usdAmount === 'string' ? parseFloat(usdAmount) || 0 : usdAmount,
          tokenPrice: null,
          isLoading: false,
          error: 'Unsupported token',
          refreshPrice: async () => {}
        }
    }
  }, [avaxConversion, ethConversion, usdAmount])
  
  const getTokenAmountInWei = useCallback((tokenSymbol: string): bigint | null => {
    const conversion = getConversionForToken(tokenSymbol)
    if (!conversion.tokenAmount) return null
    
    try {
      // All supported tokens use 18 decimals
      const weiAmount = BigInt(Math.floor(conversion.tokenAmount * 1e18))
      return weiAmount
    } catch (error) {
      console.error('Error converting to wei:', error)
      return null
    }
  }, [getConversionForToken])
  
  return {
    getConversionForToken,
    getTokenAmountInWei,
    avax: avaxConversion,
    eth: ethConversion
  }
}
