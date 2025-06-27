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

  // Parse USD amount to token amount (simplified - would need price feeds for accurate conversion)
  const usdAmount = parseFloat(formData.usdAmount)
  if (isNaN(usdAmount) || usdAmount <= 0) {
    console.error('❌ Invalid USD amount:', formData.usdAmount)
    throw new Error('Invalid USD amount')
  }

  console.log('💰 USD amount:', usdAmount)

  // For now, assume 1:1 ratio for simplicity (would be replaced with actual price conversion)
  const tokenAmount = parseAmount(usdAmount.toString(), tokenConfig.decimals)

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

  // Parse target price
  let targetPrice = 0n
  if (formData.condition === 'PRICE_TARGET' || formData.condition === 'COMBO') {
    console.log('💰 Calculating target price for condition:', formData.condition)
    console.log('🎯 Target price input:', formData.targetPrice)

    if (!formData.targetPrice || formData.targetPrice <= 0) {
      console.error('❌ Invalid target price:', formData.targetPrice)
      throw new Error('Invalid target price: Price must be greater than 0')
    }
    // Validate price range (reasonable bounds)
    if (formData.targetPrice > 1000000) {
      console.error('❌ Target price too high:', formData.targetPrice)
      throw new Error('Invalid target price: Price too high (max $1,000,000)')
    }
    if (formData.targetPrice < 0.01) {
      console.error('❌ Target price too low:', formData.targetPrice)
      throw new Error('Invalid target price: Price too low (min $0.01)')
    }
    targetPrice = parsePrice(formData.targetPrice)
    console.log('💰 Parsed target price:', {
      input: formData.targetPrice,
      parsed: targetPrice.toString(),
      inUSD: Number(targetPrice) / 1e8
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
    conditionType,
    isNativeToken: tokenConfig.isNative,
  }

  console.log('✅ Final contract data:', {
    token: result.token,
    amount: result.amount.toString(),
    unlockTime: result.unlockTime.toString(),
    targetPrice: result.targetPrice.toString(),
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
    if (!formData.targetPrice || formData.targetPrice <= 0) {
      errors.push('Target price must be greater than 0')
    }
  }

  // Validate message
  if (!formData.message || formData.message.trim().length < 10) {
    errors.push('Commitment message must be at least 10 characters')
  }

  return errors
}
