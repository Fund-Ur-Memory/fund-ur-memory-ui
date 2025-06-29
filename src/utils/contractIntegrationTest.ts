// src/utils/contractIntegrationTest.ts
// Simple test utilities to verify contract integration


import type { VaultFormData } from '../types/contracts'
import { validateVaultFormData, convertFormDataToContractData } from './contractHelpers'
import { SUPPORTED_TOKENS, CIPHER_VAULT_CONFIG } from '../contracts/CipherVault'

/**
 * Test form data validation
 */
export const testFormValidation = () => {
  console.log('🧪 Testing form validation...')

  // Valid form data
  const validFormData: VaultFormData = {
    usdAmount: '1000',
    token: 'ETH',
    condition: 'TIME_BASED',
    timeMonths: 6,
    title: 'Test Vault',
    message: 'This is a test commitment message for my vault'
  }

  const validationErrors = validateVaultFormData(validFormData)
  console.log('✅ Valid form data errors:', validationErrors)

  // Invalid form data
  const invalidFormData: VaultFormData = {
    usdAmount: '0',
    token: 'INVALID',
    condition: 'TIME_BASED',
    timeMonths: 0,
    title: 'x',
    message: 'short'
  }

  const invalidErrors = validateVaultFormData(invalidFormData)
  console.log('❌ Invalid form data errors:', invalidErrors)
}

/**
 * Test form data conversion
 */
export const testFormConversion = () => {
  console.log('🧪 Testing form data conversion...')

  const formData: VaultFormData = {
    usdAmount: '1000',
    token: 'ETH',
    condition: 'TIME_BASED',
    timeMonths: 6,
    title: 'Test Vault',
    message: 'Test commitment message'
  }

  try {
    const contractData = convertFormDataToContractData(formData)
    console.log('✅ Converted contract data:', {
      token: contractData.token,
      amount: contractData.amount.toString(),
      unlockTime: contractData.unlockTime.toString(),
      targetPrice: contractData.targetPrice.toString(),
      conditionType: contractData.conditionType,
      isNativeToken: contractData.isNativeToken
    })
  } catch (error) {
    console.error('❌ Conversion error:', error)
  }
}

/**
 * Test supported tokens configuration
 */
export const testTokenConfiguration = () => {
  console.log('🧪 Testing token configuration...')

  Object.entries(SUPPORTED_TOKENS).forEach(([symbol, config]) => {
    console.log(`✅ Token ${symbol}:`, {
      address: config.address,
      decimals: config.decimals,
      isNative: config.isNative
    })
  })
}

/**
 * Test different vault conditions
 */
export const testVaultConditions = () => {
  console.log('🧪 Testing vault conditions...')

  const baseFormData = {
    usdAmount: '1000',
    token: 'ETH',
    title: 'Test Vault',
    message: 'Test commitment message for different conditions'
  }

  // Time-based vault
  const timeVault: VaultFormData = {
    ...baseFormData,
    condition: 'TIME_BASED',
    timeMonths: 12
  }

  // Price-based vault (new format)
  const priceVault: VaultFormData = {
    ...baseFormData,
    condition: 'PRICE_TARGET',
    priceUp: 5000,
    priceDown: 2000
  }

  // Price-based vault (legacy format)
  const legacyPriceVault: VaultFormData = {
    ...baseFormData,
    condition: 'PRICE_TARGET',
    targetPrice: 5000
  }

  // Combo vault (new format)
  const comboVault: VaultFormData = {
    ...baseFormData,
    condition: 'COMBO',
    timeMonths: 6,
    priceUp: 4000,
    priceDown: 1500
  }

  const testCases = [
    { name: 'Time Vault', data: timeVault },
    { name: 'Price Vault (New)', data: priceVault },
    { name: 'Price Vault (Legacy)', data: legacyPriceVault },
    { name: 'Combo Vault', data: comboVault }
  ]

  testCases.forEach(({ name, data }) => {
    try {
      const contractData = convertFormDataToContractData(data)
      console.log(`✅ ${name} conversion successful:`, {
        conditionType: contractData.conditionType,
        hasUnlockTime: contractData.unlockTime > 0n,
        hasTargetPrice: contractData.targetPrice > 0n
      })
    } catch (error) {
      console.error(`❌ ${name} conversion failed:`, error)
    }
  })
}

/**
 * Test edge cases
 */
export const testEdgeCases = () => {
  console.log('🧪 Testing edge cases...')

  // Very small amount
  const smallAmountData: VaultFormData = {
    usdAmount: '0.001',
    token: 'ETH',
    condition: 'TIME_BASED',
    timeMonths: 1,
    title: 'Small Amount Test',
    message: 'Small amount test'
  }

  // Very large amount
  const largeAmountData: VaultFormData = {
    usdAmount: '1000000',
    token: 'ETH',
    condition: 'TIME_BASED',
    timeMonths: 24,
    title: 'Large Amount Test',
    message: 'Large amount test'
  }

  // Maximum time duration
  const maxTimeData: VaultFormData = {
    usdAmount: '1000',
    token: 'ETH',
    condition: 'TIME_BASED',
    timeMonths: 24,
    title: 'Max Time Test',
    message: 'Maximum time duration test'
  }

  const edgeCases = [
    { name: 'Small Amount', data: smallAmountData },
    { name: 'Large Amount', data: largeAmountData },
    { name: 'Max Time', data: maxTimeData }
  ]

  edgeCases.forEach(({ name, data }) => {
    const errors = validateVaultFormData(data)
    if (errors.length === 0) {
      console.log(`✅ ${name} validation passed`)
    } else {
      console.log(`❌ ${name} validation failed:`, errors)
    }
  })
}

/**
 * Run all tests
 */
export const runContractIntegrationTests = () => {
  console.log('🚀 Running Contract Integration Tests...')
  console.log('=====================================')

  testNewContractIntegration()
  console.log('')

  testFormValidation()
  console.log('')

  testFormConversion()
  console.log('')

  testTokenConfiguration()
  console.log('')

  testVaultConditions()
  console.log('')

  testEdgeCases()
  console.log('')

  console.log('✅ All tests completed!')
}

/**
 * Test the new contract address and ABI integration
 */
export const testNewContractIntegration = () => {
  console.log('🧪 Testing New Contract Integration...')
  console.log('=====================================')

  // Test 1: Contract Configuration
  console.log('\n1. Testing Contract Configuration:')
  console.log('✅ Contract Address:', CIPHER_VAULT_CONFIG.address)
  console.log('✅ Chain ID:', CIPHER_VAULT_CONFIG.chainId)

  // Verify the new contract address
  const expectedAddress = '0x7Aa2608EeA7679FA66196DECd78989Bb13DACD38'
  if (CIPHER_VAULT_CONFIG.address === expectedAddress) {
    console.log('✅ Contract address updated correctly!')
  } else {
    console.error('❌ Contract address mismatch!')
    console.error('Expected:', expectedAddress)
    console.error('Actual:', CIPHER_VAULT_CONFIG.address)
  }

  // Test 2: New ABI Functions
  console.log('\n2. Testing New ABI Functions:')
  const abi = CIPHER_VAULT_CONFIG.abi as any[]

  // Check for new function signatures
  const createPriceVault = abi.find(item =>
    item.type === 'function' &&
    item.name === 'createPriceVault'
  )

  if (createPriceVault) {
    console.log('✅ createPriceVault function found')
    console.log('   Parameters:', createPriceVault.inputs?.map((input: any) => input.name).join(', '))

    // Check for new parameters
    const hasAutoWithdraw = createPriceVault.inputs?.some((input: any) => input.name === '_autoWithdraw')
    const hasPriceUp = createPriceVault.inputs?.some((input: any) => input.name === '_priceUp')
    const hasPriceDown = createPriceVault.inputs?.some((input: any) => input.name === '_priceDown')

    console.log('   ✅ Has _autoWithdraw:', hasAutoWithdraw)
    console.log('   ✅ Has _priceUp:', hasPriceUp)
    console.log('   ✅ Has _priceDown:', hasPriceDown)
  } else {
    console.error('❌ createPriceVault function not found in ABI')
  }

  console.log('\n🎉 New Contract Integration Test Complete!')
}

/**
 * Mock contract interaction test
 */
export const testMockContractInteraction = () => {
  console.log('🧪 Testing mock contract interaction...')

  // Simulate successful vault creation
  const mockSuccessResult = {
    hash: '0x1234567890abcdef1234567890abcdef12345678',
    success: true,
    vaultId: 1
  }

  // Simulate failed vault creation
  const mockFailureResult = {
    hash: '',
    success: false,
    error: 'TokenNotSupported'
  }

  console.log('✅ Mock success result:', mockSuccessResult)
  console.log('❌ Mock failure result:', mockFailureResult)
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).contractTests = {
    runAll: runContractIntegrationTests,
    testNewContractIntegration,
    testFormValidation,
    testFormConversion,
    testTokenConfiguration,
    testVaultConditions,
    testEdgeCases,
    testMockContractInteraction
  }
}
