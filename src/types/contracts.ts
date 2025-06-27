// src/types/contracts.ts
import type { Address } from 'viem'

// Enums from the contract
export const ConditionType = {
  TIME_ONLY: 0,
  PRICE_ONLY: 1,
  TIME_OR_PRICE: 2,
  TIME_AND_PRICE: 3,
} as const

export type ConditionType = typeof ConditionType[keyof typeof ConditionType]

export const VaultStatus = {
  ACTIVE: 0,
  UNLOCKED: 1,
  WITHDRAWN: 2,
  EMERGENCY: 3,
} as const

export type VaultStatus = typeof VaultStatus[keyof typeof VaultStatus]

// Raw vault data from contract
export interface RawVault {
  owner: Address
  token: Address
  amount: bigint
  unlockTime: bigint
  targetPrice: bigint
  conditionType: ConditionType
  status: VaultStatus
  createdAt: bigint
  emergencyInitiated: bigint
  title: string
  message: string
}

// Formatted vault data for UI
export interface FormattedVault {
  id: number
  owner: Address
  token: {
    address: Address
    symbol: string
    name: string
    decimals: number
    color: string
    isNative: boolean
  }
  amount: {
    raw: bigint
    formatted: string
    usd?: number
  }
  unlockTime: {
    raw: bigint
    date: Date
    formatted: string
  }
  targetPrice: {
    raw: bigint
    formatted: number
    usd: string
  }
  conditionType: {
    raw: ConditionType
    name: string
    display: string
  }
  status: {
    raw: VaultStatus
    name: string
    display: string
    color: string
  }
  createdAt: {
    raw: bigint
    date: Date
    formatted: string
  }
  emergencyInitiated?: {
    raw: bigint
    date: Date
    formatted: string
  }
  // UI specific fields
  progress?: number
  timeRemaining?: string
  canWithdraw: boolean
  canEmergencyWithdraw: boolean
  title: string
  message: string
}

// Emergency penalty data
export interface EmergencyPenalty {
  amount: bigint
  penaltyTime: bigint
  claimed: boolean
}

// Contract stats
export interface ContractStats {
  totalVaults: bigint
  contractBalance: bigint
}

// Price feed info
export interface PriceFeedInfo {
  priceFeed: Address
  heartbeat: bigint
  decimals: number
}

// Detailed price data
export interface DetailedPrice {
  price: bigint
  updatedAt: bigint
  isStale: boolean
}

// Vault creation parameters
export interface CreateVaultParams {
  token: Address
  amount: bigint
  unlockTime?: bigint
  targetPrice?: bigint
  conditionType: ConditionType
}

// Form data for vault creation
export interface VaultFormData {
  usdAmount: string
  token: string
  condition: 'TIME_BASED' | 'PRICE_TARGET' | 'COMBO'
  timeValue?: number
  timeUnit?: 'minutes' | 'hours' | 'days' | 'months' | 'years'
  timeMonths?: number // Keep for backward compatibility
  targetPrice?: number
  title: string
  message: string
}

// Converted form data for contract interaction
export interface ContractVaultData {
  token: Address
  amount: bigint
  unlockTime: bigint
  targetPrice: bigint
  conditionType: ConditionType
  isNativeToken: boolean
}

// Transaction result
export interface TransactionResult {
  hash: string
  success: boolean
  vaultId?: number
  error?: string
}

// Hook return types
export interface UseCreateVaultReturn {
  createVault: (formData: VaultFormData) => Promise<TransactionResult>
  isLoading: boolean
  error: string | null
}

export interface UseGetVaultsReturn {
  vaults: FormattedVault[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export interface UseFUMVaultReturn {
  // Vault operations
  createTimeVault: (token: Address, amount: bigint, unlockTime: bigint, title: string, message: string) => Promise<TransactionResult>
  createPriceVault: (token: Address, amount: bigint, targetPrice: bigint, title: string, message: string) => Promise<TransactionResult>
  createTimeOrPriceVault: (token: Address, amount: bigint, unlockTime: bigint, targetPrice: bigint, title: string, message: string) => Promise<TransactionResult>
  createTimeAndPriceVault: (token: Address, amount: bigint, unlockTime: bigint, targetPrice: bigint, title: string, message: string) => Promise<TransactionResult>

  // Vault management
  withdrawVault: (vaultId: number) => Promise<TransactionResult>
  executeEmergencyWithdrawal: (vaultId: number) => Promise<TransactionResult>
  checkAndUnlockVault: (vaultId: number) => Promise<TransactionResult>

  // View functions
  getVault: (vaultId: number) => Promise<FormattedVault | null>
  getOwnerVaults: (owner: Address) => Promise<number[]>
  getCurrentPrice: (token: Address) => Promise<bigint>
  getDetailedPrice: (token: Address) => Promise<DetailedPrice>
  checkConditions: (vaultId: number) => Promise<boolean>
  getContractStats: () => Promise<ContractStats>

  // Emergency penalties
  getEmergencyPenalty: (user: Address) => Promise<EmergencyPenalty>
  claimEmergencyPenalty: () => Promise<TransactionResult>

  // State
  isLoading: boolean
  error: string | null
}

// Token configuration
export interface TokenConfig {
  address: Address
  symbol: string
  name: string
  decimals: number
  color: string
  isNative: boolean
}

// Supported tokens map
export type SupportedTokens = {
  [key: string]: TokenConfig
}
