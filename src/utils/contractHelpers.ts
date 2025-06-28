// src/utils/contractHelpers.ts

import type {
  RawVault,
  FormattedVault,
  VaultFormData,
  ContractVaultData
} from '../types/contracts'
import {
  ConditionType,
  VaultStatus
} from '../types/contracts'
import {
  SUPPORTED_TOKENS,
  getTokenConfig,
  formatAmount,
  parseAmount,
  formatPrice,
  parsePrice,
  formatUnlockTime,
  parseUnlockTime,
  getConditionType
} from '../contracts/FUMVault'

/**
 * Convert raw vault data from contract to formatted vault for UI
 */
export const formatVaultData = (rawVault: RawVault, vaultId: number): FormattedVault => {
  // Get token configuration based on the actual token address from the contract
  let tokenConfig
  if (rawVault.token.toLowerCase() === '0x0000000000000000000000000000000000000000') {
    // This is the native token - AVAX on Avalanche Fuji
    tokenConfig = {
      address: rawVault.token,
      symbol: 'AVAX',
      name: 'Avalanche',
      decimals: 18,
      color: '#E84142',
      isNative: true,
    }
  } else {
    // Look up other tokens by address
    tokenConfig = Object.values(SUPPORTED_TOKENS).find(
      token => token.address.toLowerCase() === rawVault.token.toLowerCase()
    )

    // If not found in SUPPORTED_TOKENS, try to determine by address patterns
    if (!tokenConfig) {
      // Add known token addresses for Avalanche Fuji testnet
      const knownTokens: Record<string, { address: string; symbol: string; name: string; decimals: number; color: string; isNative: boolean }> = {
        // WAVAX on Fuji (if different from native)
        '0xd00ae08403b9bbb9124bb305c09058e32c39a48c': {
          address: rawVault.token as `0x${string}`,
          symbol: 'WAVAX',
          name: 'Wrapped AVAX',
          decimals: 18,
          color: '#E84142',
          isNative: false,
        },
        // Add other known token addresses here
      }

      tokenConfig = knownTokens[rawVault.token.toLowerCase()] || {
        address: rawVault.token as `0x${string}`,
        symbol: 'UNKNOWN',
        name: 'Unknown Token',
        decimals: 18,
        color: '#666666',
        isNative: false,
      }
    }
  }

  // Format amounts
  const formattedAmount = formatAmount(rawVault.amount, tokenConfig.decimals)

  // Format times
  const unlockDate = formatUnlockTime(rawVault.unlockTime)
  const createdDate = formatUnlockTime(rawVault.createdAt)

  // Format prices
  const formattedTargetPrice = formatPrice(rawVault.targetPrice)

  // Determine status display
  const statusDisplay = getVaultStatusDisplay(rawVault.status)

  // Calculate progress and time remaining
  const now = new Date()
  const progress = calculateVaultProgress(rawVault, now)
  const timeRemaining = calculateTimeRemaining(rawVault, now)

  // Determine withdrawal capabilities
  const canWithdraw = rawVault.status === VaultStatus.UNLOCKED
  const canEmergencyWithdraw = rawVault.status === VaultStatus.ACTIVE

  const formattedVault: FormattedVault = {
    id: vaultId,
    owner: rawVault.owner,
    token: {
      address: tokenConfig.address as `0x${string}`,
      symbol: tokenConfig.symbol,
      name: tokenConfig.name,
      decimals: tokenConfig.decimals,
      color: tokenConfig.color,
      isNative: tokenConfig.isNative,
    },
    amount: {
      raw: rawVault.amount,
      formatted: formattedAmount,
      // USD value would be calculated with price feeds
    },
    unlockTime: {
      raw: rawVault.unlockTime,
      date: unlockDate,
      formatted: formatDateForDisplay(unlockDate),
    },
    targetPrice: {
      raw: rawVault.targetPrice,
      formatted: formattedTargetPrice,
      usd: `$${formattedTargetPrice.toLocaleString()}`,
    },
    priceUp: {
      raw: rawVault.priceUp,
      formatted: Number(rawVault.priceUp) / 1e8,
      usd: `$${(Number(rawVault.priceUp) / 1e8).toLocaleString()}`,
    },
    priceDown: {
      raw: rawVault.priceDown,
      formatted: Number(rawVault.priceDown) / 1e8,
      usd: `$${(Number(rawVault.priceDown) / 1e8).toLocaleString()}`,
    },
    conditionType: {
      raw: rawVault.conditionType,
      name: getConditionTypeName(rawVault.conditionType),
      display: getConditionTypeDisplay(rawVault.conditionType),
    },
    status: statusDisplay,
    createdAt: {
      raw: rawVault.createdAt,
      date: createdDate,
      formatted: formatDateForDisplay(createdDate),
    },
    emergencyInitiated: rawVault.emergencyInitiated > 0n ? {
      raw: rawVault.emergencyInitiated,
      date: formatUnlockTime(rawVault.emergencyInitiated),
      formatted: formatDateForDisplay(formatUnlockTime(rawVault.emergencyInitiated)),
    } : undefined,
    progress,
    timeRemaining,
    canWithdraw,
    canEmergencyWithdraw,
    title: rawVault.title,
    message: rawVault.message,
    autoWithdraw: rawVault.autoWithdraw,
  }

  return formattedVault
}

/**
 * Convert form data to contract parameters
 */
export const convertFormDataToContractData = (formData: VaultFormData): ContractVaultData => {
  console.log('🔄 Converting form data to contract data...')
  console.log('📝 Input form data:', formData)

  const tokenConfig = getTokenConfig(formData.token)
  if (!tokenConfig) {
    console.error('❌ Unsupported token:', formData.token)
    throw new Error(`Unsupported token: ${formData.token}`)
  }

  console.log('🪙 Token config:', tokenConfig)

  // Parse USD amount to token amount
  const usdAmount = parseFloat(formData.usdAmount)
  if (isNaN(usdAmount) || usdAmount <= 0) {
    console.error('❌ Invalid USD amount:', formData.usdAmount)
    throw new Error('Invalid USD amount')
  }

  console.log('💰 USD amount:', usdAmount)

  // Use converted token amount if available (from USD to token conversion)
  let tokenAmount: bigint
  if (formData._convertedTokenAmount) {
    console.log('💱 Using converted token amount:', formData._convertedTokenAmount)
    tokenAmount = parseAmount(formData._convertedTokenAmount, tokenConfig.decimals)
  } else {
    console.log('⚠️ No converted amount found, using USD amount as fallback')
    // Fallback: use USD amount directly (for backward compatibility)
    tokenAmount = parseAmount(usdAmount.toString(), tokenConfig.decimals)
  }

  // Calculate unlock time
  let unlockTime = 0n
  if (formData.condition === 'TIME_BASED' || formData.condition === 'COMBO') {
    console.log('⏰ Calculating unlock time for condition:', formData.condition)

    // Use new time format if available, fallback to old format
    const timeValue = formData.timeValue || formData.timeMonths || 0
    const timeUnit = formData.timeUnit || 'months'

    console.log('📅 Time input:', { timeValue, timeUnit })

    if (timeValue <= 0) {
      console.error('❌ Invalid time duration:', timeValue)
      throw new Error('Invalid time duration')
    }

    const futureDate = new Date()

    // Add time based on unit
    switch (timeUnit) {
      case 'minutes':
        futureDate.setMinutes(futureDate.getMinutes() + timeValue)
        break
      case 'hours':
        futureDate.setHours(futureDate.getHours() + timeValue)
        break
      case 'days':
        futureDate.setDate(futureDate.getDate() + timeValue)
        break
      case 'months':
        futureDate.setMonth(futureDate.getMonth() + timeValue)
        break
      case 'years':
        futureDate.setFullYear(futureDate.getFullYear() + timeValue)
        break
      default:
        throw new Error(`Invalid time unit: ${timeUnit}`)
    }

    unlockTime = parseUnlockTime(futureDate)
    console.log('⏰ Calculated unlock time:', {
      futureDate: futureDate.toLocaleString(),
      unlockTime: unlockTime.toString(),
      timestamp: Number(unlockTime)
    })
  }

  // Parse target price and convert to priceUp/priceDown format
  let targetPrice = 0n
  let priceUp = 0n
  let priceDown = 0n

  if (formData.condition === 'PRICE_TARGET' || formData.condition === 'COMBO') {
    console.log('💰 Calculating price targets for condition:', formData.condition)

    // Check if new price fields are used
    if (formData.priceUp !== undefined || formData.priceDown !== undefined) {
      console.log('🎯 Using new price up/down fields')
      console.log('📈 Price Up input:', formData.priceUp)
      console.log('📉 Price Down input:', formData.priceDown)

      // Validate at least one price is set
      if ((!formData.priceUp || formData.priceUp <= 0) && (!formData.priceDown || formData.priceDown <= 0)) {
        throw new Error('At least one price target (up or down) must be set and greater than 0')
      }

      // Parse price up
      if (formData.priceUp && formData.priceUp > 0) {
        if (formData.priceUp > 1000000) {
          throw new Error('Price up target too high (max $1,000,000)')
        }
        if (formData.priceUp < 0.01) {
          throw new Error('Price up target too low (min $0.01)')
        }
        priceUp = parsePrice(formData.priceUp)
      }

      // Parse price down
      if (formData.priceDown && formData.priceDown > 0) {
        if (formData.priceDown > 1000000) {
          throw new Error('Price down target too high (max $1,000,000)')
        }
        if (formData.priceDown < 0.01) {
          throw new Error('Price down target too low (min $0.01)')
        }
        priceDown = parsePrice(formData.priceDown)
      }

      // Set targetPrice for backward compatibility (use priceUp if available, otherwise priceDown)
      targetPrice = priceUp > 0n ? priceUp : priceDown

    } else if (formData.targetPrice && formData.targetPrice > 0) {
      // Backward compatibility: use old targetPrice field
      console.log('🎯 Using legacy targetPrice field:', formData.targetPrice)

      if (formData.targetPrice > 1000000) {
        throw new Error('Target price too high (max $1,000,000)')
      }
      if (formData.targetPrice < 0.01) {
        throw new Error('Target price too low (min $0.01)')
      }

      targetPrice = parsePrice(formData.targetPrice)
      // For backward compatibility, assume price target means "price up" (bullish)
      priceUp = targetPrice
      priceDown = 0n

    } else {
      throw new Error('Price target is required for price-based conditions')
    }

    console.log('💰 Parsed price targets:', {
      priceUp: priceUp.toString(),
      priceDown: priceDown.toString(),
      targetPrice: targetPrice.toString(),
      priceUpUSD: Number(priceUp) / 1e8,
      priceDownUSD: Number(priceDown) / 1e8
    })
  }

  // Get condition type
  const conditionType = getConditionType(formData.condition)
  console.log('🏷️ Condition type:', conditionType)

  const result = {
    token: tokenConfig.address,
    amount: tokenAmount,
    unlockTime,
    targetPrice,
    priceUp,
    priceDown,
    conditionType,
    isNativeToken: tokenConfig.isNative,
  }

  console.log('✅ Final contract data:', {
    token: result.token,
    amount: result.amount.toString(),
    unlockTime: result.unlockTime.toString(),
    targetPrice: result.targetPrice.toString(),
    priceUp: result.priceUp.toString(),
    priceDown: result.priceDown.toString(),
    conditionType: result.conditionType,
    isNativeToken: result.isNativeToken
  })

  return result
}

/**
 * Get vault status display information
 */
export const getVaultStatusDisplay = (status: VaultStatus) => {
  switch (status) {
    case VaultStatus.ACTIVE:
      return {
        raw: status,
        name: 'ACTIVE',
        display: 'Active',
        color: '#10B981', // green
      }
    case VaultStatus.UNLOCKED:
      return {
        raw: status,
        name: 'UNLOCKED',
        display: 'Unlocked',
        color: '#F59E0B', // yellow
      }
    case VaultStatus.WITHDRAWN:
      return {
        raw: status,
        name: 'WITHDRAWN',
        display: 'Withdrawn',
        color: '#6B7280', // gray
      }
    case VaultStatus.EMERGENCY:
      return {
        raw: status,
        name: 'EMERGENCY',
        display: 'Emergency',
        color: '#EF4444', // red
      }
    default:
      return {
        raw: status,
        name: 'UNKNOWN',
        display: 'Unknown',
        color: '#6B7280',
      }
  }
}

/**
 * Get condition type name
 */
export const getConditionTypeName = (conditionType: ConditionType): string => {
  switch (conditionType) {
    case ConditionType.TIME_ONLY:
      return 'TIME_ONLY'
    case ConditionType.PRICE_ONLY:
      return 'PRICE_ONLY'
    case ConditionType.TIME_OR_PRICE:
      return 'TIME_OR_PRICE'
    case ConditionType.TIME_AND_PRICE:
      return 'TIME_AND_PRICE'
    default:
      return 'UNKNOWN'
  }
}

/**
 * Get condition type display text
 */
export const getConditionTypeDisplay = (conditionType: ConditionType): string => {
  switch (conditionType) {
    case ConditionType.TIME_ONLY:
      return 'Time Lock'
    case ConditionType.PRICE_ONLY:
      return 'Price Target'
    case ConditionType.TIME_OR_PRICE:
      return 'Time OR Price'
    case ConditionType.TIME_AND_PRICE:
      return 'Time AND Price'
    default:
      return 'Unknown'
  }
}

/**
 * Calculate vault progress percentage
 */
export const calculateVaultProgress = (vault: RawVault, currentTime: Date): number => {
  if (vault.status !== VaultStatus.ACTIVE) {
    return 100
  }

  const createdTime = Number(vault.createdAt) * 1000
  const unlockTime = Number(vault.unlockTime) * 1000
  const currentTimeMs = currentTime.getTime()

  if (vault.conditionType === ConditionType.PRICE_ONLY) {
    // For price-only vaults, progress is harder to calculate without current price
    return 0
  }

  if (unlockTime <= createdTime) {
    return 0
  }

  const totalDuration = unlockTime - createdTime
  const elapsed = currentTimeMs - createdTime

  return Math.round(Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100))
}

/**
 * Calculate time remaining for vault
 */
export const calculateTimeRemaining = (vault: RawVault, currentTime: Date): string => {
  if (vault.status !== VaultStatus.ACTIVE) {
    return 'N/A'
  }

  if (vault.conditionType === ConditionType.PRICE_ONLY) {
    return 'Price dependent'
  }

  const unlockTime = Number(vault.unlockTime) * 1000
  const currentTimeMs = currentTime.getTime()
  const remaining = unlockTime - currentTimeMs

  if (remaining <= 0) {
    return 'Ready to unlock'
  }

  return formatDuration(remaining)
}

/**
 * Format duration in milliseconds to human readable string
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m`
  } else {
    return `${seconds}s`
  }
}

/**
 * Format date for display
 */
export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Validate vault form data
 */
export const validateVaultFormData = (formData: VaultFormData): string[] => {
  const errors: string[] = []

  // Validate USD amount
  const usdAmount = parseFloat(formData.usdAmount)
  if (isNaN(usdAmount) || usdAmount <= 0) {
    errors.push('USD amount must be greater than 0')
  }

  // Validate token
  if (!getTokenConfig(formData.token)) {
    errors.push('Invalid token selected')
  }

  // Validate time-based conditions
  if (formData.condition === 'TIME_BASED' || formData.condition === 'COMBO') {
    // Use new time format if available, fallback to old format
    const timeValue = formData.timeValue || formData.timeMonths || 0
    const timeUnit = formData.timeUnit || 'months'

    if (timeValue <= 0) {
      errors.push(`Time duration must be greater than 0 ${timeUnit}`)
    }

    // Validate maximum values based on time unit
    const maxValues = {
      minutes: 60 * 24 * 30, // 30 days
      hours: 24 * 30, // 30 days
      days: 365, // 1 year
      months: 24, // 2 years
      years: 5 // 5 years
    }

    const maxValue = maxValues[timeUnit as keyof typeof maxValues] || 24
    if (timeValue > maxValue) {
      errors.push(`Time duration cannot exceed ${maxValue} ${timeUnit}`)
    }
  }

  // Validate price-based conditions
  if (formData.condition === 'PRICE_TARGET' || formData.condition === 'COMBO') {
    // Check if new price fields are used
    const hasPriceUp = formData.priceUp && formData.priceUp > 0
    const hasPriceDown = formData.priceDown && formData.priceDown > 0
    const hasLegacyPrice = formData.targetPrice && formData.targetPrice > 0

    // At least one price target must be set
    if (!hasPriceUp && !hasPriceDown && !hasLegacyPrice) {
      errors.push('At least one price target must be set')
    }

    // Validate price up if set
    if (formData.priceUp !== undefined && formData.priceUp !== null) {
      if (formData.priceUp <= 0) {
        errors.push('Price up target must be greater than 0')
      } else if (formData.priceUp > 1000000) {
        errors.push('Price up target cannot exceed $1,000,000')
      } else if (formData.priceUp < 0.01) {
        errors.push('Price up target must be at least $0.01')
      }
    }

    // Validate price down if set
    if (formData.priceDown !== undefined && formData.priceDown !== null) {
      if (formData.priceDown <= 0) {
        errors.push('Price down target must be greater than 0')
      } else if (formData.priceDown > 1000000) {
        errors.push('Price down target cannot exceed $1,000,000')
      } else if (formData.priceDown < 0.01) {
        errors.push('Price down target must be at least $0.01')
      }
    }

    // Validate legacy target price if used
    if (formData.targetPrice !== undefined && formData.targetPrice !== null && formData.targetPrice > 0) {
      if (formData.targetPrice > 1000000) {
        errors.push('Target price cannot exceed $1,000,000')
      } else if (formData.targetPrice < 0.01) {
        errors.push('Target price must be at least $0.01')
      }
    }

    // Validate price logic: price up should be higher than price down if both are set
    if (hasPriceUp && hasPriceDown && formData.priceUp! <= formData.priceDown!) {
      errors.push('Price up target must be higher than price down target')
    }
  }

  // Validate message
  if (!formData.message || formData.message.trim().length < 10) {
    errors.push('Commitment message must be at least 10 characters')
  }

  return errors
}
