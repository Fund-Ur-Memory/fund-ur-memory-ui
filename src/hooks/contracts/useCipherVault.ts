// src/hooks/contracts/useCipherVault.ts
import { useState, useCallback } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import type { Address } from 'viem'
import { CIPHER_VAULT_CONFIG } from '../../contracts/CipherVault'
import type {
  UseCipherVaultReturn,
  TransactionResult,
  FormattedVault,
  ContractStats,
  DetailedPrice,
  EmergencyPenalty
} from '../../types/contracts'


export const useCipherVault = (): UseCipherVaultReturn => {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper function to handle contract writes with transaction receipt waiting
  const executeContractWrite = useCallback(async (
    functionName: string,
    args: unknown[],
    value?: bigint
  ): Promise<TransactionResult> => {
    console.log('🔗 Executing contract write...')
    console.log('📋 Function:', functionName)
    console.log('📊 Arguments:', args)
    console.log('💰 Value:', value?.toString() || '0')
    console.log('🏠 Contract:', CIPHER_VAULT_CONFIG.address)

    if (!address) {
      console.error('❌ Wallet not connected')
      return { hash: '', success: false, error: 'Wallet not connected' }
    }

    console.log('👤 Connected address:', address)
    setIsLoading(true)
    setError(null)

    try {
      console.log('📡 Sending transaction...')
      const hash = await writeContractAsync({
        address: CIPHER_VAULT_CONFIG.address,
        abi: CIPHER_VAULT_CONFIG.abi,
        functionName,
        args,
        value,
      })

      console.log('✅ Transaction sent successfully!')
      console.log('🔗 Transaction hash:', hash)
      
      // Clear loading state immediately after transaction is sent successfully
      // This allows UI to close modal and show transaction as "pending"
      setIsLoading(false)
      
      // Start receipt checking in background (don't block UI)
      console.log('⏳ Starting background receipt checking...')
      const receiptCheckPromise = (async () => {
        try {
          const waitForReceipt = async (txHash: string): Promise<boolean> => {
            return new Promise((resolve) => {
              const checkReceipt = async () => {
                try {
                  // Use fetch to check transaction receipt
                  const response = await fetch(`https://api.avax.network/ext/bc/C/ws`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      jsonrpc: '2.0',
                      method: 'eth_getTransactionReceipt',
                      params: [txHash],
                      id: 1
                    })
                  })
                  
                  const data = await response.json()
                  if (data.result && data.result.status) {
                    console.log('✅ Transaction confirmed!')
                    console.log('📊 Receipt:', data.result)
                    resolve(true)
                    return
                  }
                } catch (error) {
                  console.log('⏳ Still waiting for receipt...')
                }
                
                // Check again in 2 seconds
                setTimeout(checkReceipt, 2000)
              }
              
              checkReceipt()
            })
          }
          
          // Wait for receipt with timeout
          const receiptPromise = waitForReceipt(hash)
          const timeoutPromise = new Promise<boolean>((resolve) => 
            setTimeout(() => resolve(false), 60000) // 60 second timeout
          )
          
          const receiptReceived = await Promise.race([receiptPromise, timeoutPromise])
          
          if (receiptReceived) {
            console.log('🎉 Transaction fully completed with receipt!')
            return true
          } else {
            console.log('⚠️ Receipt timeout - transaction likely still pending')
            return false
          }
        } catch (error) {
          console.error('❌ Error checking receipt:', error)
          return false
        }
      })()
      
      // Don't await the receipt check - return immediately with transaction success
      // The receipt will be checked in background
      receiptCheckPromise.then((receiptReceived) => {
        console.log('📋 Final receipt status:', receiptReceived ? 'confirmed' : 'timeout/error')
      })
      
      return { hash, success: true, receiptReceived: false } // Always return false initially since we don't wait
    } catch (err) {
      console.error('💥 Contract write failed:', err)
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed'
      console.error('📄 Error message:', errorMessage)
      setError(errorMessage)
      setIsLoading(false) // Clear loading on error
      return { hash: '', success: false, error: errorMessage }
    }
    
    console.log('🏁 Contract write execution completed')
  }, [address, writeContractAsync])

  // Vault creation functions
  const createTimeVault = useCallback(async (
    token: Address,
    amount: bigint,
    unlockTime: bigint,
    title: string,
    message: string,
    autoWithdraw: boolean = true
  ): Promise<TransactionResult> => {
    console.log('📞 Calling createTimeVault contract function...')
    console.log('📊 Parameters:', {
      token,
      amount: amount.toString(),
      unlockTime: unlockTime.toString(),
      unlockDate: new Date(Number(unlockTime) * 1000).toLocaleString(),
      title,
      message,
      autoWithdraw
    })

    const isNativeToken = token === '0x0000000000000000000000000000000000000000'
    const value = isNativeToken ? amount : undefined

    console.log('💰 Transaction value:', value?.toString() || '0', '(native token:', isNativeToken, ')')

    return executeContractWrite(
      'createTimeVault',
      [token, amount, unlockTime, title, message, autoWithdraw],
      value
    )
  }, [executeContractWrite])

  const createPriceVault = useCallback(async (
    token: Address,
    amount: bigint,
    priceUp: bigint,
    priceDown: bigint,
    title: string,
    message: string,
    autoWithdraw: boolean = true
  ): Promise<TransactionResult> => {
    console.log('📞 Calling createPriceVault contract function...')
    console.log('📊 Parameters:', {
      token,
      amount: amount.toString(),
      priceUp: priceUp.toString(),
      priceDown: priceDown.toString(),
      priceUpUSD: Number(priceUp) / 1e8,
      priceDownUSD: Number(priceDown) / 1e8,
      title,
      message,
      autoWithdraw
    })

    const isNativeToken = token === '0x0000000000000000000000000000000000000000'
    const value = isNativeToken ? amount : undefined

    console.log('💰 Transaction value:', value?.toString() || '0', '(native token:', isNativeToken, ')')

    return executeContractWrite(
      'createPriceVault',
      [token, amount, priceUp, priceDown, title, message, autoWithdraw],
      value
    )
  }, [executeContractWrite])

  const createTimeOrPriceVault = useCallback(async (
    token: Address,
    amount: bigint,
    unlockTime: bigint,
    priceUp: bigint,
    priceDown: bigint,
    title: string,
    message: string,
    autoWithdraw: boolean = true
  ): Promise<TransactionResult> => {
    console.log('📞 Calling createTimeAndPriceVault contract function (TIME OR PRICE)...')
    console.log('📊 Parameters:', {
      token,
      amount: amount.toString(),
      unlockTime: unlockTime.toString(),
      unlockDate: new Date(Number(unlockTime) * 1000).toLocaleString(),
      priceUp: priceUp.toString(),
      priceDown: priceDown.toString(),
      priceUpUSD: Number(priceUp) / 1e8,
      priceDownUSD: Number(priceDown) / 1e8,
      title,
      message,
      requireBoth: false,
      autoWithdraw
    })
    console.log('💡 This vault will unlock when EITHER time OR price condition is met')

    const isNativeToken = token === '0x0000000000000000000000000000000000000000'
    const value = isNativeToken ? amount : undefined

    console.log('💰 Transaction value:', value?.toString() || '0', '(native token:', isNativeToken, ')')

    return executeContractWrite(
      'createTimeAndPriceVault',
      [token, amount, unlockTime, priceUp, priceDown, false, title, message, autoWithdraw],
      value
    )
  }, [executeContractWrite])

  const createTimeAndPriceVault = useCallback(async (
    token: Address,
    amount: bigint,
    unlockTime: bigint,
    priceUp: bigint,
    priceDown: bigint,
    title: string,
    message: string,
    autoWithdraw: boolean = true
  ): Promise<TransactionResult> => {
    console.log('📞 Calling createTimeAndPriceVault contract function (TIME AND PRICE)...')
    console.log('📊 Parameters:', {
      token,
      amount: amount.toString(),
      unlockTime: unlockTime.toString(),
      unlockDate: new Date(Number(unlockTime) * 1000).toLocaleString(),
      priceUp: priceUp.toString(),
      priceDown: priceDown.toString(),
      priceUpUSD: Number(priceUp) / 1e8,
      priceDownUSD: Number(priceDown) / 1e8,
      title,
      message,
      requireBoth: true,
      autoWithdraw
    })
    console.log('💡 This vault will unlock when BOTH time AND price conditions are met')

    const isNativeToken = token === '0x0000000000000000000000000000000000000000'
    const value = isNativeToken ? amount : undefined

    console.log('💰 Transaction value:', value?.toString() || '0', '(native token:', isNativeToken, ')')

    return executeContractWrite(
      'createTimeAndPriceVault',
      [token, amount, unlockTime, priceUp, priceDown, true, title, message, autoWithdraw],
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
