// src/hooks/contracts/useFUMVault.ts
import { useState, useCallback } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import type { Address } from 'viem'
import { FUM_VAULT_CONFIG } from '../../contracts/FUMVault'
import type {
  UseFUMVaultReturn,
  TransactionResult,
  FormattedVault,
  ContractStats,
  DetailedPrice,
  EmergencyPenalty
} from '../../types/contracts'


export const useFUMVault = (): UseFUMVaultReturn => {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper function to handle contract writes
  const executeContractWrite = useCallback(async (
    functionName: string,
    args: unknown[],
    value?: bigint
  ): Promise<TransactionResult> => {
    if (!address) {
      return { hash: '', success: false, error: 'Wallet not connected' }
    }

    setIsLoading(true)
    setError(null)

    try {
      const hash = await writeContractAsync({
        address: FUM_VAULT_CONFIG.address,
        abi: FUM_VAULT_CONFIG.abi,
        functionName,
        args,
        value,
      })

      return { hash, success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed'
      setError(errorMessage)
      return { hash: '', success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [address, writeContractAsync])

  // Vault creation functions
  const createTimeVault = useCallback(async (
    token: Address,
    amount: bigint,
    unlockTime: bigint,
    title: string,
    message: string
  ): Promise<TransactionResult> => {
    console.log('📞 Calling createTimeVault contract function...')
    console.log('📊 Parameters:', {
      token,
      amount: amount.toString(),
      unlockTime: unlockTime.toString(),
      unlockDate: new Date(Number(unlockTime) * 1000).toLocaleString(),
      title,
      message
    })

    const isNativeToken = token === '0x0000000000000000000000000000000000000000'
    const value = isNativeToken ? amount : undefined

    console.log('💰 Transaction value:', value?.toString() || '0', '(native token:', isNativeToken, ')')

    return executeContractWrite(
      'createTimeVault',
      [token, amount, unlockTime, title, message],
      value
    )
  }, [executeContractWrite])

  const createPriceVault = useCallback(async (
    token: Address,
    amount: bigint,
    targetPrice: bigint,
    title: string,
    message: string
  ): Promise<TransactionResult> => {
    console.log('📞 Calling createPriceVault contract function...')
    console.log('📊 Parameters:', {
      token,
      amount: amount.toString(),
      targetPrice: targetPrice.toString(),
      targetPriceUSD: Number(targetPrice) / 1e8,
      title,
      message
    })

    const isNativeToken = token === '0x0000000000000000000000000000000000000000'
    const value = isNativeToken ? amount : undefined

    console.log('💰 Transaction value:', value?.toString() || '0', '(native token:', isNativeToken, ')')

    return executeContractWrite(
      'createPriceVault',
      [token, amount, targetPrice, title, message],
      value
    )
  }, [executeContractWrite])

  const createTimeOrPriceVault = useCallback(async (
    token: Address,
    amount: bigint,
    unlockTime: bigint,
    targetPrice: bigint,
    title: string,
    message: string
  ): Promise<TransactionResult> => {
    console.log('📞 Calling createTimeOrPriceVault contract function (COMBO)...')
    console.log('📊 Parameters:', {
      token,
      amount: amount.toString(),
      unlockTime: unlockTime.toString(),
      unlockDate: new Date(Number(unlockTime) * 1000).toLocaleString(),
      targetPrice: targetPrice.toString(),
      targetPriceUSD: Number(targetPrice) / 1e8,
      title,
      message
    })
    console.log('💡 This vault will unlock when EITHER time OR price condition is met')

    const isNativeToken = token === '0x0000000000000000000000000000000000000000'
    const value = isNativeToken ? amount : undefined

    console.log('💰 Transaction value:', value?.toString() || '0', '(native token:', isNativeToken, ')')

    return executeContractWrite(
      'createTimeOrPriceVault',
      [token, amount, unlockTime, targetPrice, title, message],
      value
    )
  }, [executeContractWrite])

  const createTimeAndPriceVault = useCallback(async (
    token: Address,
    amount: bigint,
    unlockTime: bigint,
    targetPrice: bigint,
    title: string,
    message: string
  ): Promise<TransactionResult> => {
    const isNativeToken = token === '0x0000000000000000000000000000000000000000'
    const value = isNativeToken ? amount : undefined

    return executeContractWrite(
      'createTimeAndPriceVault',
      [token, amount, unlockTime, targetPrice, title, message],
      value
    )
  }, [executeContractWrite])

  // Vault management functions
  const withdrawVault = useCallback(async (vaultId: number): Promise<TransactionResult> => {
    return executeContractWrite('withdrawVault', [vaultId])
  }, [executeContractWrite])

  const executeEmergencyWithdrawal = useCallback(async (vaultId: number): Promise<TransactionResult> => {
    return executeContractWrite('executeEmergencyWithdrawal', [vaultId])
  }, [executeContractWrite])

  const checkAndUnlockVault = useCallback(async (vaultId: number): Promise<TransactionResult> => {
    return executeContractWrite('checkAndUnlockVault', [vaultId])
  }, [executeContractWrite])

  // View functions using useReadContract
  const getVault = useCallback(async (_vaultId: number): Promise<FormattedVault | null> => {
    try {
      // This would need to be implemented with useReadContract hook
      // For now, return null as placeholder
      return null
    } catch (err) {
      console.error('Failed to get vault:', err)
      return null
    }
  }, [])

  const getOwnerVaults = useCallback(async (_owner: Address): Promise<number[]> => {
    try {
      // This would need to be implemented with useReadContract hook
      // For now, return empty array as placeholder
      return []
    } catch (err) {
      console.error('Failed to get owner vaults:', err)
      return []
    }
  }, [])

  const getCurrentPrice = useCallback(async (_token: Address): Promise<bigint> => {
    try {
      // This would need to be implemented with useReadContract hook
      // For now, return 0 as placeholder
      return 0n
    } catch (err) {
      console.error('Failed to get current price:', err)
      return 0n
    }
  }, [])

  const getDetailedPrice = useCallback(async (_token: Address): Promise<DetailedPrice> => {
    try {
      // This would need to be implemented with useReadContract hook
      // For now, return default values as placeholder
      return {
        price: 0n,
        updatedAt: 0n,
        isStale: true,
      }
    } catch (err) {
      console.error('Failed to get detailed price:', err)
      return {
        price: 0n,
        updatedAt: 0n,
        isStale: true,
      }
    }
  }, [])

  const checkConditions = useCallback(async (_vaultId: number): Promise<boolean> => {
    try {
      // This would need to be implemented with useReadContract hook
      // For now, return false as placeholder
      return false
    } catch (err) {
      console.error('Failed to check conditions:', err)
      return false
    }
  }, [])

  const getContractStats = useCallback(async (): Promise<ContractStats> => {
    try {
      // This would need to be implemented with useReadContract hook
      // For now, return default values as placeholder
      return {
        totalVaults: 0n,
        contractBalance: 0n,
      }
    } catch (err) {
      console.error('Failed to get contract stats:', err)
      return {
        totalVaults: 0n,
        contractBalance: 0n,
      }
    }
  }, [])

  const getEmergencyPenalty = useCallback(async (_user: Address): Promise<EmergencyPenalty> => {
    try {
      // This would need to be implemented with useReadContract hook
      // For now, return default values as placeholder
      return {
        amount: 0n,
        penaltyTime: 0n,
        claimed: false,
      }
    } catch (err) {
      console.error('Failed to get emergency penalty:', err)
      return {
        amount: 0n,
        penaltyTime: 0n,
        claimed: false,
      }
    }
  }, [])

  const claimEmergencyPenalty = useCallback(async (): Promise<TransactionResult> => {
    return executeContractWrite('claimEmergencyPenalty', [])
  }, [executeContractWrite])

  return {
    // Vault operations
    createTimeVault,
    createPriceVault,
    createTimeOrPriceVault,
    createTimeAndPriceVault,

    // Vault management
    withdrawVault,
    executeEmergencyWithdrawal,
    checkAndUnlockVault,

    // View functions
    getVault,
    getOwnerVaults,
    getCurrentPrice,
    getDetailedPrice,
    checkConditions,
    getContractStats,

    // Emergency penalties
    getEmergencyPenalty,
    claimEmergencyPenalty,

    // State
    isLoading,
    error,
  }
}
