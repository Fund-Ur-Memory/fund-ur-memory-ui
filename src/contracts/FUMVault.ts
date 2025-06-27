// src/contracts/FUMVault.ts
import type { Address, Abi } from 'viem'
import FUMVaultABI from '../contratcs/FUMVault.json'

// Contract Configuration
export const FUM_VAULT_CONFIG = {
  address: '0xEF5a0f3F1e6924F3Fb5160C3e0A4DB3ed3B5DEEb' as Address,
  abi: FUMVaultABI as Abi,
  chainId: 43113, // Avalanche Fuji testnet
} as const

// Contract Constants (from Solidity contract)
export const FUM_VAULT_CONSTANTS = {
  EMERGENCY_PENALTY: 1000n, // 10% in basis points
  PENALTY_CLAIM_DELAY: 90n * 24n * 60n * 60n, // 90 days in seconds
  BASIS_POINTS: 10000n,
  MIN_VAULT_AMOUNT: BigInt('1000000000000000'), // 0.001 ether
  MAX_PRICE_STALENESS: 3600n, // 1 hour
} as const

// Supported Tokens Configuration
// On Avalanche Fuji testnet, AVAX is the native token (address 0x0)
export const SUPPORTED_TOKENS = {
  AVAX: {
    address: '0x0000000000000000000000000000000000000000' as Address, // Native AVAX on Avalanche Fuji
    symbol: 'AVAX',
    name: 'Avalanche',
    decimals: 18,
    color: '#E84142',
    isNative: true,
    available: true,
  },
  ETH: {
    address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB' as Address, // WETH.e on Avalanche Fuji
    symbol: 'ETH',
    name: 'Ethereum (WETH.e)',
    decimals: 18,
    color: '#627EEA',
    isNative: false,
    available: true,
  },
  MONAD: {
    address: '0x0000000000000000000000000000000000000002' as Address, // Placeholder for MONAD (coming soon)
    symbol: 'MONAD',
    name: 'Monad',
    decimals: 18,
    color: '#8B5CF6',
    isNative: false,
    available: false,
  },
} as const

// Price Feed Addresses (verified from Chainlink docs)
export const PRICE_FEEDS = {
  AVAX_USD: '0x5498BB86BC934c8D34FDA08E81D444153d0D06aD',
  ETH_USD: '0x86d67c3D38D2bCeE722E601025C25a575021c6EA',
} as const

// Condition Type Mapping
export const CONDITION_TYPES = {
  TIME_ONLY: 0,
  PRICE_ONLY: 1,
  TIME_OR_PRICE: 2,
  TIME_AND_PRICE: 3,
} as const

// Vault Status Mapping
export const VAULT_STATUS = {
  ACTIVE: 0,
  UNLOCKED: 1,
  WITHDRAWN: 2,
  EMERGENCY: 3,
} as const

// Reverse mappings for display
export const CONDITION_TYPE_NAMES = {
  0: 'TIME_ONLY',
  1: 'PRICE_ONLY',
  2: 'TIME_OR_PRICE',
  3: 'TIME_AND_PRICE',
} as const

export const VAULT_STATUS_NAMES = {
  0: 'ACTIVE',
  1: 'UNLOCKED',
  2: 'WITHDRAWN',
  3: 'EMERGENCY',
} as const

// Helper function to get token config by symbol
export const getTokenConfig = (symbol: string) => {
  return SUPPORTED_TOKENS[symbol as keyof typeof SUPPORTED_TOKENS]
}

// Helper function to get condition type number
export const getConditionType = (condition: string) => {
  switch (condition) {
    case 'TIME_BASED':
      return CONDITION_TYPES.TIME_ONLY
    case 'PRICE_TARGET':
      return CONDITION_TYPES.PRICE_ONLY
    case 'COMBO':
      return CONDITION_TYPES.TIME_OR_PRICE // Default to OR for combo
    default:
      return CONDITION_TYPES.TIME_ONLY
  }
}

// Helper function to format condition type for display
export const formatConditionType = (conditionType: number): string => {
  return CONDITION_TYPE_NAMES[conditionType as keyof typeof CONDITION_TYPE_NAMES] || 'UNKNOWN'
}

// Helper function to format vault status for display
export const formatVaultStatus = (status: number): string => {
  return VAULT_STATUS_NAMES[status as keyof typeof VAULT_STATUS_NAMES] || 'UNKNOWN'
}

// Price formatting helpers
export const formatPrice = (price: bigint, decimals: number = 8): number => {
  return Number(price) / Math.pow(10, decimals)
}

export const parsePrice = (price: number, decimals: number = 8): bigint => {
  return BigInt(Math.floor(price * Math.pow(10, decimals)))
}

// Time formatting helpers
export const formatUnlockTime = (timestamp: bigint): Date => {
  return new Date(Number(timestamp) * 1000)
}

export const parseUnlockTime = (date: Date): bigint => {
  return BigInt(Math.floor(date.getTime() / 1000))
}

// Amount formatting helpers
export const formatAmount = (amount: bigint, decimals: number = 18): string => {
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

export const parseAmount = (amount: string, decimals: number = 18): bigint => {
  const [whole, fraction = ''] = amount.split('.')
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals)
  return BigInt(whole + paddedFraction)
}
