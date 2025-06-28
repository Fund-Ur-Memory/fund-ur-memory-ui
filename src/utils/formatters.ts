export const formatCurrency = (amount: number, isPrivate: boolean = false): string => {
  if (isPrivate) return '••••••'
  
  // Handle invalid or zero amounts
  if (!amount || isNaN(amount)) {
    return '$0.00'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export const formatNumber = (value: number, isPrivate: boolean = false): string => {
  if (isPrivate) return '••••'

  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`
  }

  return value.toFixed(2)
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else {
    return `${days}d ago`
  }
}

// Contract-specific formatters
export const formatTokenAmount = (amount: bigint, decimals: number = 18): string => {
  const divisor = BigInt(10 ** decimals)
  const quotient = amount / divisor
  const remainder = amount % divisor

  if (remainder === 0n) {
    return quotient.toString()
  }

  const remainderStr = remainder.toString().padStart(decimals, '0')
  const trimmedRemainder = remainderStr.replace(/0+$/, '')

  return trimmedRemainder ? `${quotient}.${trimmedRemainder}` : quotient.toString()
}

export const formatContractPrice = (price: bigint, decimals: number = 8): string => {
  const formattedPrice = Number(price) / Math.pow(10, decimals)
  return formatCurrency(formattedPrice)
}

// Format token amount with USD equivalent
export const formatTokenWithUSD = (
  tokenAmount: number, 
  tokenSymbol: string, 
  tokenPrice?: number, 
  isPrivate: boolean = false
): string => {
  if (isPrivate) return '••••'
  
  const tokenDisplay = `${tokenAmount} ${tokenSymbol}`
  
  if (tokenPrice && tokenPrice > 0) {
    const usdValue = tokenAmount * tokenPrice
    const usdDisplay = formatCurrency(usdValue, false)
    return `${tokenDisplay} (${usdDisplay})`
  }
  
  return tokenDisplay
}

export const formatVaultStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'Active'
    case 'unlocked':
      return 'Ready to Withdraw'
    case 'withdrawn':
      return 'Completed'
    case 'emergency':
      return 'Emergency Exit'
    default:
      return status
  }
}

export const formatConditionType = (conditionType: string): string => {
  switch (conditionType) {
    case 'TIME_ONLY':
      return 'Time Lock'
    case 'PRICE_ONLY':
      return 'Price Target'
    case 'TIME_OR_PRICE':
      return 'Time OR Price'
    case 'TIME_AND_PRICE':
      return 'Time AND Price'
    default:
      return conditionType
  }
}