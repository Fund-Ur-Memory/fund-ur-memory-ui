// src/utils/contractDebugger.ts
// Debugging utilities for contract integration

import { readContract } from 'wagmi/actions'
import { FUM_VAULT_CONFIG } from '../contracts/FUMVault'
import { config } from '../components/config/wagmi'
import type { Address } from 'viem'

/**
 * Debug function to test contract calls directly
 */
export const debugContractCalls = async (userAddress: Address) => {
  console.log('🔍 Starting contract debugging...')
  console.log('Contract Address:', FUM_VAULT_CONFIG.address)
  console.log('User Address:', userAddress)
  console.log('Chain ID:', FUM_VAULT_CONFIG.chainId)

  try {
    // Test 1: Check if contract exists by calling a simple view function
    console.log('\n📋 Test 1: Getting contract stats...')
    const stats = await readContract(config, {
      address: FUM_VAULT_CONFIG.address,
      abi: FUM_VAULT_CONFIG.abi,
      functionName: 'getContractStats',
    })
    console.log('✅ Contract stats:', stats)

    // Test 2: Get owner vaults
    console.log('\n📋 Test 2: Getting owner vaults...')
    const vaultIds = await readContract(config, {
      address: FUM_VAULT_CONFIG.address,
      abi: FUM_VAULT_CONFIG.abi,
      functionName: 'getOwnerVaults',
      args: [userAddress],
    })
    console.log('✅ Vault IDs:', vaultIds)

    // Test 3: If vaults exist, get first vault data
    if (vaultIds && Array.isArray(vaultIds) && vaultIds.length > 0) {
      console.log('\n📋 Test 3: Getting first vault data...')
      const firstVaultId = vaultIds[0]
      const vaultData = await readContract(config, {
        address: FUM_VAULT_CONFIG.address,
        abi: FUM_VAULT_CONFIG.abi,
        functionName: 'getVault',
        args: [firstVaultId],
      })
      console.log(`✅ Vault ${firstVaultId} data:`, vaultData)
    } else {
      console.log('ℹ️ No vaults found for this user')
    }

    return {
      success: true,
      stats,
      vaultIds,
      message: 'Contract debugging completed successfully'
    }

  } catch (error) {
    console.error('❌ Contract debugging failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Contract debugging failed'
    }
  }
}

/**
 * Check if user is on the correct network
 */
export const checkNetwork = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return window.ethereum.request({ method: 'eth_chainId' })
      .then((chainId: string) => {
        const currentChainId = parseInt(chainId, 16)
        const expectedChainId = FUM_VAULT_CONFIG.chainId

        console.log('🌐 Network check:', {
          currentChainId,
          expectedChainId,
          isCorrect: currentChainId === expectedChainId
        })

        return {
          currentChainId,
          expectedChainId,
          isCorrect: currentChainId === expectedChainId,
          networkName: currentChainId === 43113 ? 'Avalanche Fuji' : 'Unknown'
        }
      })
  }

  return Promise.resolve({
    currentChainId: null,
    expectedChainId: FUM_VAULT_CONFIG.chainId,
    isCorrect: false,
    networkName: 'No wallet detected'
  })
}

/**
 * Test specific contract function
 */
export const testContractFunction = async (
  functionName: string,
  args: unknown[] = []
) => {
  try {
    console.log(`🧪 Testing ${functionName} with args:`, args)

    const result = await readContract(config, {
      address: FUM_VAULT_CONFIG.address,
      abi: FUM_VAULT_CONFIG.abi,
      functionName,
      args,
    })

    console.log(`✅ ${functionName} result:`, result)
    return { success: true, result }

  } catch (error) {
    console.error(`❌ ${functionName} failed:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Comprehensive contract health check
 */
export const contractHealthCheck = async (userAddress?: Address) => {
  console.log('🏥 Starting contract health check...')

  const results = {
    networkCheck: await checkNetwork(),
    contractStats: await testContractFunction('getContractStats'),
    userVaults: userAddress ? await testContractFunction('getOwnerVaults', [userAddress]) : null,
  }

  console.log('🏥 Health check results:', results)

  const isHealthy = results.networkCheck.isCorrect &&
                   results.contractStats.success &&
                   (results.userVaults?.success !== false)

  return {
    isHealthy,
    results,
    recommendations: getHealthCheckRecommendations(results)
  }
}

/**
 * Get recommendations based on health check results
 */
const getHealthCheckRecommendations = (results: any) => {
  const recommendations: string[] = []

  if (!results.networkCheck.isCorrect) {
    recommendations.push('Switch to Avalanche Fuji testnet (Chain ID: 43113)')
  }

  if (!results.contractStats.success) {
    recommendations.push('Check contract address and ABI')
    recommendations.push('Verify contract is deployed on current network')
  }

  if (results.userVaults && !results.userVaults.success) {
    recommendations.push('Check wallet connection')
    recommendations.push('Verify user address is correct')
  }

  if (recommendations.length === 0) {
    recommendations.push('All systems operational! 🎉')
  }

  return recommendations
}

// Export for browser console access
if (typeof window !== 'undefined') {
  (window as any).contractDebugger = {
    debugContractCalls,
    checkNetwork,
    testContractFunction,
    contractHealthCheck,
    config: FUM_VAULT_CONFIG
  }
}
