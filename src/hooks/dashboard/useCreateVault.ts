import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useCreateVault as useContractCreateVault } from '../contracts/useCreateVault'
import type { VaultFormData } from '../../types/contracts'
import type { FUMAnalysisResponse } from '../../services/fumAgentService'

interface UseCreateVaultReturn {
  isModalOpen: boolean
  isCreating: boolean
  openModal: () => void
  closeModal: () => void
  createVault: (vaultData: VaultFormData, aiAnalysis?: FUMAnalysisResponse['data']) => Promise<void>
}

export const useCreateVault = (): UseCreateVaultReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const contractCreateVault = useContractCreateVault()

  const openModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const createVault = useCallback(async (vaultData: VaultFormData, aiAnalysis?: FUMAnalysisResponse['data']) => {
    try {
      console.log('Creating vault with data:', vaultData)
      console.log('AI analysis data:', aiAnalysis)

      // Call the contract to create the vault
      const result = await contractCreateVault.createVault(vaultData, aiAnalysis)

      if (result.success) {
        toast.success('Vault created successfully!', {
          icon: '🎉',
          duration: 4000
        })

        // Track analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'vault_created', {
            usdAmount: vaultData.usdAmount,
            token: vaultData.token,
            condition: vaultData.condition,
            transactionHash: result.hash
          })
        }

        // Close modal on success
        setIsModalOpen(false)
      } else {
        // Show specific error message from contract
        toast.error(result.error || 'Failed to create vault. Please try again.', {
          duration: 6000
        })
      }

    } catch (error) {
      console.error('Failed to create vault:', error)
      toast.error('An unexpected error occurred. Please try again.')
    }
  }, [contractCreateVault])

  return {
    isModalOpen,
    isCreating: contractCreateVault.isLoading,
    openModal,
    closeModal,
    createVault
  }
}

// Extend window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}
