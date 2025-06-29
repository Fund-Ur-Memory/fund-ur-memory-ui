// src/types/contracts.ts
import type { Address } from 'viem'
import type { CipherAnalysisResponse } from '../services/cipherAgentService'

// Enums from the contract (updated to match CipherVault.sol)
export const ConditionType = {
  TIME_ONLY: 0,
  PRICE_UP_ONLY: 1,
  PRICE_DOWN_ONLY: 2,
  PRICE_UP_OR_DOWN: 3,
  TIME_OR_PRICE: 4,
  TIME_AND_PRICE: 5,
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
  priceUp: bigint
  priceDown: bigint
  conditionType: ConditionType
  status: VaultStatus
  createdAt: bigint
  emergencyInitiated: bigint
  title: string
  message: string
  autoWithdraw: boolean
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
  priceUp: {
    raw: bigint
    formatted: number
    usd: string
  }
  priceDown: {
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
  autoWithdraw: boolean
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
  targetPrice?: number // Keep for backward compatibility
  priceUp?: number // New: Price up target
  priceDown?: number // New: Price down target
  title: string
  message: string
  _convertedTokenAmount?: string // Internal: converted token amount for contract
}

// Converted form data for contract interaction
export interface ContractVaultData {
  token: Address
  amount: bigint
  unlockTime: bigint
  targetPrice: bigint
  priceUp: bigint
  priceDown: bigint
  conditionType: ConditionType
  isNativeToken: boolean
}

// Transaction result
export interface TransactionResult {
  hash: string
  success: boolean
  vaultId?: number
  error?: string
  receiptReceived?: boolean
}

// Hook return types
export interface UseCreateVaultReturn {
  createVault: (formData: VaultFormData, aiAnalysis?: CipherAnalysisResponse['data']) => Promise<TransactionResult>
  isLoading: boolean
  error: string | null
}

export interface UseGetVaultsReturn {
  vaults: FormattedVault[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export interface UseCipherVaultReturn {
  // Vault operations
  createTimeVault: (token: Address, amount: bigint, unlockTime: bigint, title: string, message: string, autoWithdraw?: boolean) => Promise<TransactionResult>
  createPriceVault: (token: Address, amount: bigint, priceUp: bigint, priceDown: bigint, title: string, message: string, autoWithdraw?: boolean) => Promise<TransactionResult>
  createTimeOrPriceVault: (token: Address, amount: bigint, unlockTime: bigint, priceUp: bigint, priceDown: bigint, title: string, message: string, autoWithdraw?: boolean) => Promise<TransactionResult>
  createTimeAndPriceVault: (token: Address, amount: bigint, unlockTime: bigint, priceUp: bigint, priceDown: bigint, title: string, message: string, autoWithdraw?: boolean) => Promise<TransactionResult>

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
