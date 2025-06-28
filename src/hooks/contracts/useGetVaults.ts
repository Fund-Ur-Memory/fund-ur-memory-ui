// src/hooks/contracts/useGetVaults.ts
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAccount, useReadContract, useBlockNumber, useReadContracts } from 'wagmi'
import type { Address } from 'viem'
import { FUM_VAULT_CONFIG } from '../../contracts/FUMVault'
import type { UseGetVaultsReturn, FormattedVault, RawVault, ConditionType, VaultStatus } from '../../types/contracts'
import { formatVaultData } from '../../utils/contractHelpers'
import { appEvents, APP_EVENTS } from '../../utils/events'

export const useGetVaults = (owner?: Address): UseGetVaultsReturn => {
  const { address } = useAccount()
  // Disable block watching to prevent constant refreshing
  // const { data: blockNumber } = useBlockNumber({ watch: true })
  const [error] = useState<string | null>(null)

  // Use the provided owner or the connected wallet address
  const targetOwner = owner || address

  // Step 1: Get owner's vault IDs
  const {
    data: vaultIds,
    isLoading: isLoadingIds,
    error: idsError,
    refetch: refetchIds
  } = useReadContract({
    address: FUM_VAULT_CONFIG.address,
    abi: FUM_VAULT_CONFIG.abi,
    functionName: 'getOwnerVaults',
    args: targetOwner ? [targetOwner] : undefined,
    query: {
      enabled: !!targetOwner,
    },
  })

  // Debug logging
  useEffect(() => {
    console.log('🔍 Debug useGetVaults:', {
      targetOwner,
      vaultIds,
      isLoadingIds,
      idsError: idsError?.message,
      contractAddress: FUM_VAULT_CONFIG.address,
      chainId: FUM_VAULT_CONFIG.chainId
    })
  }, [targetOwner, vaultIds, isLoadingIds, idsError])

  // Step 2: Create contract calls for each vault
  const vaultContracts = useMemo(() => {
    if (!vaultIds || !Array.isArray(vaultIds) || vaultIds.length === 0) {
      return []
    }

    return (vaultIds as number[]).map(vaultId => ({
      address: FUM_VAULT_CONFIG.address,
      abi: FUM_VAULT_CONFIG.abi,
      functionName: 'getVault',
      args: [vaultId],
    }))
  }, [vaultIds])

  // Step 3: Fetch all vault data using useReadContracts
  const {
    data: vaultDataArray,
    isLoading: isLoadingVaults,
    error: vaultsError,
    refetch: refetchVaults
  } = useReadContracts({
    contracts: vaultContracts,
    query: {
      enabled: vaultContracts.length > 0,
    },
  })

  // Step 4: Process vault data into formatted vaults
  const vaults = useMemo(() => {
    if (!vaultDataArray || !vaultIds || vaultDataArray.length === 0) {
      return []
    }

    const formattedVaults: FormattedVault[] = []

    vaultDataArray.forEach((result, index) => {
      if (result.status === 'success' && result.result && Array.isArray(vaultIds) && vaultIds[index]) {
        try {
          // Convert contract result to RawVault format
          // The contract returns a struct, not an array
          const vaultData = result.result as Record<string, unknown>
          const currentVaultId = Number(vaultIds[index])

          // Check if we have the required properties (struct format)
          if (vaultData && typeof vaultData === 'object' && 'owner' in vaultData) {
            const rawVault: RawVault = {
              owner: vaultData.owner as Address,
              token: vaultData.token as Address,
              amount: vaultData.amount as bigint,
              unlockTime: vaultData.unlockTime as bigint,
              targetPrice: vaultData.targetPrice as bigint,
              priceUp: (vaultData.priceUp as bigint) || 0n,
              priceDown: (vaultData.priceDown as bigint) || 0n,
              conditionType: vaultData.conditionType as ConditionType,
              status: vaultData.status as VaultStatus,
              createdAt: vaultData.createdAt as bigint,
              emergencyInitiated: vaultData.emergencyInitiated as bigint,
              title: (vaultData.title as string) || '',
              message: (vaultData.message as string) || '',
              autoWithdraw: (vaultData.autoWithdraw as boolean) || false,
            }

            const formattedVault = formatVaultData(rawVault, currentVaultId)
            formattedVaults.push(formattedVault)
          }
        } catch {
          // Silently skip failed vault formatting
        }
      }
    })

    // Sort by creation date (newest first)
    return formattedVaults.sort((a, b) => Number(b.createdAt.raw) - Number(a.createdAt.raw))
  }, [vaultDataArray, vaultIds])

  // Refetch function
  const refetch = useCallback(async () => {
    await refetchIds()
    await refetchVaults()
  }, [refetchIds, refetchVaults])

  // Effect to refetch on new blocks (DISABLED - was causing refresh loops)
  // useEffect(() => {
  //   if (blockNumber && vaults.length > 0) {
  //     // Refetch every 10 blocks to avoid too frequent updates
  //     if (Number(blockNumber) % 10 === 0) {
  //       refetch()
  //     }
  //   }
  // }, [blockNumber, vaults.length, refetch])

  // Listen for vault creation/withdrawal events to auto-refresh
  useEffect(() => {
    const handleVaultUpdate = () => {
      console.log('🔄 Vault updated, refetching vault data...')
      refetch()
    }

    appEvents.on(APP_EVENTS.VAULT_CREATED, handleVaultUpdate)
    appEvents.on(APP_EVENTS.VAULT_WITHDRAWN, handleVaultUpdate)

    return () => {
      appEvents.off(APP_EVENTS.VAULT_CREATED, handleVaultUpdate)
      appEvents.off(APP_EVENTS.VAULT_WITHDRAWN, handleVaultUpdate)
    }
  }, [refetch])

  // Handle loading state
  const isLoading = isLoadingIds || isLoadingVaults

  // Handle error state
  const combinedError = idsError?.message || vaultsError?.message || error

  return {
    vaults,
    isLoading,
    error: combinedError,
    refetch,
  }
}

/**
 * Hook to get a single vault by ID
 */
export const useGetVault = (vaultId: number) => {
  const [vault, setVault] = useState<FormattedVault | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    data: rawVault,
    isLoading: isLoadingVault,
    error: vaultError,
    refetch
  } = useReadContract({
    address: FUM_VAULT_CONFIG.address,
    abi: FUM_VAULT_CONFIG.abi,
    functionName: 'getVault',
    args: [vaultId],
    query: {
      enabled: vaultId > 0,
    },
  })

  useEffect(() => {
    if (rawVault && typeof rawVault === 'object' && 'owner' in rawVault) {
      try {
        // Convert the raw vault data to our RawVault type (struct format)
        const vaultData = rawVault as Record<string, unknown>
        const formattedRawVault: RawVault = {
          owner: vaultData.owner as Address,
          token: vaultData.token as Address,
          amount: vaultData.amount as bigint,
          unlockTime: vaultData.unlockTime as bigint,
          targetPrice: vaultData.targetPrice as bigint,
          priceUp: (vaultData.priceUp as bigint) || 0n,
          priceDown: (vaultData.priceDown as bigint) || 0n,
          conditionType: vaultData.conditionType as ConditionType,
          status: vaultData.status as VaultStatus,
          createdAt: vaultData.createdAt as bigint,
          emergencyInitiated: vaultData.emergencyInitiated as bigint,
          title: vaultData.title as string,
          message: vaultData.message as string,
          autoWithdraw: (vaultData.autoWithdraw as boolean) || false,
        }

        const formattedVault = formatVaultData(formattedRawVault, vaultId)
        setVault(formattedVault)
        setError(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to format vault data'
        setError(errorMessage)
        setVault(null)
      }
    } else if (rawVault === null || rawVault === undefined) {
      setVault(null)
      setError(null) // Don't show error for non-existent vaults
    }
  }, [rawVault, vaultId])

  return {
    vault,
    isLoading: isLoadingVault,
    error: vaultError?.message || error,
    refetch,
  }
}

/**
 * Hook to get vault statistics
 */
export const useVaultStats = (owner?: Address) => {
  const { vaults, isLoading, error } = useGetVaults(owner)

  const stats = {
    totalVaults: vaults.length,
    activeVaults: vaults.filter(v => v.status.name === 'ACTIVE').length,
    unlockedVaults: vaults.filter(v => v.status.name === 'UNLOCKED').length,
    withdrawnVaults: vaults.filter(v => v.status.name === 'WITHDRAWN').length,
    emergencyVaults: vaults.filter(v => v.status.name === 'EMERGENCY').length,
    totalLockedValue: vaults.reduce((sum, vault) => {
      if (vault.status.name === 'ACTIVE' && vault.amount.usd) {
        return sum + vault.amount.usd
      }
      return sum
    }, 0),
    averageProgress: vaults.length > 0
      ? vaults.reduce((sum, vault) => sum + (vault.progress || 0), 0) / vaults.length
      : 0,
  }

  return {
    stats,
    isLoading,
    error,
  }
}

/**
 * Hook to check if conditions are met for a vault
 */
export const useCheckVaultConditions = (vaultId: number) => {
  const {
    data: conditionsMet,
    isLoading,
    error,
    refetch
  } = useReadContract({
    address: FUM_VAULT_CONFIG.address,
    abi: FUM_VAULT_CONFIG.abi,
    functionName: 'checkConditions',
    args: [vaultId],
    query: {
      enabled: vaultId > 0,
    },
  })

  return {
    conditionsMet: conditionsMet as boolean,
    isLoading,
    error: error?.message,
    refetch,
  }
}
