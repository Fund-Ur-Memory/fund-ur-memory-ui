// src/hooks/contracts/useWithdrawVault.ts
import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CIPHER_VAULT_CONFIG } from '../../contracts/CipherVault'
import { enhancedToast } from '../../components/dashboard/common/EnhancedToast'
import type { Address } from 'viem'
import { appEvents, APP_EVENTS } from '../../utils/events'

export interface UseWithdrawVaultReturn {
  withdrawVault: (vaultId: number, amount?: string, tokenSymbol?: string) => Promise<void>
  emergencyWithdraw: (vaultId: number, amount?: string, tokenSymbol?: string) => Promise<void>
  isLoading: boolean
  isConfirming: boolean
  error: string | null
  txHash: string | null
  operationStatus: 'idle' | 'pending' | 'confirming' | 'success' | 'error'
}

export const useWithdrawVault = (): UseWithdrawVaultReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [operationStatus, setOperationStatus] = useState<'idle' | 'pending' | 'confirming' | 'success' | 'error'>('idle')
  const [currentToastId, setCurrentToastId] = useState<string | null>(null)

  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: hash as Address,
  })

  // Update txHash when hash changes
  useEffect(() => {
    if (hash) {
      setTxHash(hash)
      setOperationStatus('confirming')
    }
  }, [hash])

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      setOperationStatus('success')
      console.log('✅ Withdraw transaction confirmed, refreshing dashboard...')

      // Emit events for dashboard refresh
      appEvents.emit(APP_EVENTS.VAULT_WITHDRAWN, {
        hash,
        timestamp: Date.now()
      })
      appEvents.emit(APP_EVENTS.DASHBOARD_REFRESH)

      // Show success toast
      if (currentToastId) {
        enhancedToast.success(
          'Withdrawal Successful!',
          'Your funds have been transferred to your wallet',
          {
            txHash: hash,
            actions: [
              {
                label: 'View Transaction',
                onClick: () => window.open(`https://testnet.snowtrace.io/tx/${hash}`, '_blank'),
                variant: 'primary'
              }
            ]
          }
        )
        setCurrentToastId(null)
      }
    }
  }, [isConfirmed, hash, currentToastId])

  const withdrawVault = async (vaultId: number, amount?: string, tokenSymbol?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      setTxHash(null)
      setOperationStatus('pending')

      console.log(`🔓 Withdrawing vault ${vaultId}...`)

      // Show loading toast
      const toastId = enhancedToast.loading(
        'Withdrawing Vault',
        `Processing withdrawal${amount && tokenSymbol ? ` of ${amount} ${tokenSymbol}` : ''} from vault #${vaultId}`,
        {
          showProgress: true,
          progress: 25
        }
      )
      setCurrentToastId(toastId)

      writeContract({
        address: CIPHER_VAULT_CONFIG.address,
        abi: CIPHER_VAULT_CONFIG.abi,
        functionName: 'withdrawVault',
        args: [BigInt(vaultId)],
      })

      console.log(`✅ Withdraw transaction initiated`)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to withdraw vault'
      setError(errorMessage)
      setOperationStatus('error')

      // Show error toast
      enhancedToast.error(
        'Withdrawal Failed',
        `Failed to withdraw from vault #${vaultId}: ${errorMessage}`,
        {
          actions: [
            {
              label: 'Try Again',
              onClick: () => withdrawVault(vaultId, amount, tokenSymbol),
              variant: 'primary'
            }
          ]
        }
      )

      if (currentToastId) {
        setCurrentToastId(null)
      }

      console.error('❌ Withdraw vault error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const emergencyWithdraw = async (vaultId: number, amount?: string, tokenSymbol?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      setTxHash(null)
      setOperationStatus('pending')

      console.log(`🚨 Emergency withdrawing vault ${vaultId}...`)

      // Show warning toast for emergency withdrawal
      const toastId = enhancedToast.warning(
        'Emergency Withdrawal',
        `Processing emergency withdrawal from vault #${vaultId}. A 10% penalty will be applied.`,
        {
          showProgress: true,
          progress: 25,
          duration: 8000
        }
      )
      setCurrentToastId(toastId)

      writeContract({
        address: CIPHER_VAULT_CONFIG.address,
        abi: CIPHER_VAULT_CONFIG.abi,
        functionName: 'executeEmergencyWithdrawal',
        args: [BigInt(vaultId)],
      })

      console.log(`✅ Emergency withdraw transaction initiated`)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to emergency withdraw vault'
      setError(errorMessage)
      setOperationStatus('error')

      // Show error toast
      enhancedToast.error(
        'Emergency Withdrawal Failed',
        `Failed to emergency withdraw from vault #${vaultId}: ${errorMessage}`,
        {
          actions: [
            {
              label: 'Try Again',
              onClick: () => emergencyWithdraw(vaultId, amount, tokenSymbol),
              variant: 'primary'
            }
          ]
        }
      )

      if (currentToastId) {
        setCurrentToastId(null)
      }

      console.error('❌ Emergency withdraw vault error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    withdrawVault,
    emergencyWithdraw,
    isLoading: isLoading || isPending,
    isConfirming,
    error,
    txHash,
    operationStatus,
  }
}
