// src/hooks/contracts/useWithdrawVault.ts
import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { FUM_VAULT_CONFIG } from '../../contracts/FUMVault'
import type { Address } from 'viem'

export interface UseWithdrawVaultReturn {
  withdrawVault: (vaultId: number) => Promise<void>
  emergencyWithdraw: (vaultId: number) => Promise<void>
  isLoading: boolean
  isConfirming: boolean
  error: string | null
  txHash: string | null
}

export const useWithdrawVault = (): UseWithdrawVaultReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: hash as Address,
  })

  const withdrawVault = async (vaultId: number) => {
    try {
      setIsLoading(true)
      setError(null)
      setTxHash(null)

      console.log(`🔓 Withdrawing vault ${vaultId}...`)

      const result = await writeContract({
        address: FUM_VAULT_CONFIG.address,
        abi: FUM_VAULT_CONFIG.abi,
        functionName: 'withdrawVault',
        args: [BigInt(vaultId)],
      })

      setTxHash(result)
      console.log(`✅ Withdraw transaction submitted:`, result)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to withdraw vault'
      setError(errorMessage)
      console.error('❌ Withdraw vault error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const emergencyWithdraw = async (vaultId: number) => {
    try {
      setIsLoading(true)
      setError(null)
      setTxHash(null)

      console.log(`🚨 Emergency withdrawing vault ${vaultId}...`)

      const result = await writeContract({
        address: FUM_VAULT_CONFIG.address,
        abi: FUM_VAULT_CONFIG.abi,
        functionName: 'executeEmergencyWithdrawal',
        args: [BigInt(vaultId)],
      })

      setTxHash(result)
      console.log(`✅ Emergency withdraw transaction submitted:`, result)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to emergency withdraw vault'
      setError(errorMessage)
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
  }
}
