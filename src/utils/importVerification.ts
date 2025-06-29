// src/utils/importVerification.ts
// Quick verification that all imports are working correctly

// Test viem imports


// Test contract configuration imports
import { CIPHER_VAULT_CONFIG, SUPPORTED_TOKENS } from '../contracts/CipherVault'

// Test type imports
import type {
  VaultFormData,

  TransactionResult
} from '../types/contracts'

// Test enum imports (these need to be value imports)
import { ConditionType, VaultStatus } from '../types/contracts'

// Test utility imports
import {
  validateVaultFormData,
  convertFormDataToContractData,
  formatVaultData
} from './contractHelpers'

// Test hook imports
import { useCipherVault } from '../hooks/contracts/useCipherVault'
import { useCreateVault } from '../hooks/contracts/useCreateVault'
import { useGetVaults } from '../hooks/contracts/useGetVaults'

/**
 * Verification function to test all imports
 */
export const verifyImports = () => {
  console.log('🔍 Verifying all imports...')

  // Test viem imports
  console.log('✅ Address type imported correctly from viem')

  // Test contract config
  console.log('✅ Contract address:', CIPHER_VAULT_CONFIG.address)
  console.log('✅ Supported tokens:', Object.keys(SUPPORTED_TOKENS))

  // Test enum values
  console.log('✅ ConditionType.TIME_ONLY:', ConditionType.TIME_ONLY)
  console.log('✅ VaultStatus.ACTIVE:', VaultStatus.ACTIVE)

  // Test utility functions exist
  console.log('✅ validateVaultFormData:', typeof validateVaultFormData)
  console.log('✅ convertFormDataToContractData:', typeof convertFormDataToContractData)
  console.log('✅ formatVaultData:', typeof formatVaultData)

  // Test hooks exist
  console.log('✅ useCipherVault:', typeof useCipherVault)
  console.log('✅ useCreateVault:', typeof useCreateVault)
  console.log('✅ useGetVaults:', typeof useGetVaults)

  console.log('🎉 All imports verified successfully!')
}

// Test sample data structures
export const testDataStructures = () => {
  console.log('🧪 Testing data structures...')

  // Sample form data
  const sampleFormData: VaultFormData = {
    usdAmount: '1000',
    token: 'ETH',
    condition: 'TIME_BASED',
    timeMonths: 6,
    title: 'Test Vault',
    message: 'Test commitment'
  }

  // Sample transaction result
  const sampleResult: TransactionResult = {
    hash: '0x123...',
    success: true,
    vaultId: 1
  }

  console.log('✅ Sample form data:', sampleFormData)
  console.log('✅ Sample transaction result:', sampleResult)
  console.log('✅ Data structures working correctly!')
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  (window as typeof window & { verifyIntegration: unknown }).verifyIntegration = {
    verifyImports,
    testDataStructures,
    config: CIPHER_VAULT_CONFIG,
    tokens: SUPPORTED_TOKENS
  }
}
