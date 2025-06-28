import { useCallback } from 'react'
import { useCreateVault } from './useCreateVault'
import { useUsdToAvaxConversion } from '../useUsdToTokenConversion'
import type { VaultFormData, TransactionResult } from '../../types/contracts'

/**
 * Enhanced vault creation hook that handles USD to AVAX conversion
 */
export const useCreateVaultWithConversion = () => {
  const { createVault: createVaultOriginal, isLoading, error } = useCreateVault()

  const createVault = useCallback(async (formData: VaultFormData): Promise<TransactionResult> => {
    console.log('🔄 Creating vault with USD to AVAX conversion...')
    console.log('📝 Original form data:', formData)

    try {
      // Get the current AVAX price and convert USD to AVAX
      const usdAmount = parseFloat(formData.usdAmount)
      if (isNaN(usdAmount) || usdAmount <= 0) {
        throw new Error('Invalid USD amount')
      }

      // For AVAX token, we need to convert USD to AVAX amount
      if (formData.token === 'AVAX') {
        console.log('💰 Converting USD to AVAX...')

        // We need to fetch the current AVAX price
        // This is a simplified approach - in a real implementation,
        // you'd want to use the conversion hook's result
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd')
        const priceData = await response.json()
        const avaxPrice = priceData['avalanche-2']?.usd

        if (!avaxPrice) {
          throw new Error('Unable to fetch AVAX price')
        }

        const avaxAmount = usdAmount / avaxPrice
        console.log(`💱 Conversion: $${usdAmount} USD = ${avaxAmount} AVAX (price: $${avaxPrice})`)

        // Create modified form data with the converted amount
        // We'll keep usdAmount for display but use the converted amount internally
        const convertedFormData: VaultFormData = {
          ...formData,
          // Keep usdAmount for display purposes
          usdAmount: formData.usdAmount,
          // Add a hidden field for the actual AVAX amount (we'll modify the contract helper to use this)
          _convertedTokenAmount: avaxAmount.toString()
        }

        console.log('📊 Converted form data:', convertedFormData)
        return await createVaultOriginal(convertedFormData)
      } else {
        // For other tokens (ETH, etc.), use the original flow
        console.log('🪙 Using original flow for non-AVAX token:', formData.token)
        return await createVaultOriginal(formData)
      }
    } catch (error) {
      console.error('❌ Vault creation with conversion failed:', error)

      let errorMessage = 'Failed to create vault'
      if (error instanceof Error) {
        if (error.message.includes('Unable to fetch')) {
          errorMessage = 'Unable to fetch current token price. Please try again.'
        } else if (error.message.includes('Invalid USD amount')) {
          errorMessage = 'Please enter a valid USD amount'
        } else {
          errorMessage = error.message
        }
      }

      return {
        hash: '',
        success: false,
        error: errorMessage
      }
    }
  }, [createVaultOriginal])

  return {
    createVault,
    isLoading,
    error
  }
}

/**
 * Hook that provides real-time conversion info for the UI
 */
export const useVaultCreationWithConversion = (formData: VaultFormData) => {
  const { createVault, isLoading, error } = useCreateVaultWithConversion()

  // Get real-time conversion for display
  const {
    tokenAmount: avaxAmount,
    tokenAmountFormatted: avaxAmountFormatted,
    tokenPrice: avaxPrice,
    isLoading: isPriceLoading,
    error: priceError,
    getValidationError,
    isValid: isAmountValid,
    refreshPrice
  } = useUsdToAvaxConversion(formData.usdAmount)

  // Enhanced form validation that includes conversion validation
  const isFormValid = useCallback(() => {
    // Basic validations
    const hasValidTitle = formData.title.trim().length >= 3
    const hasValidMessage = formData.message.trim().length >= 10

    // Amount validation using conversion
    const hasValidAmount = isAmountValid && !getValidationError()

    // Time validation
    const hasValidTime = (formData.condition === 'TIME_BASED' || formData.condition === 'COMBO')
      ? (formData.timeValue || 0) > 0
      : true

    // Price validation
    const hasValidPrice = (formData.condition === 'PRICE_TARGET' || formData.condition === 'COMBO')
      ? ((formData.priceUp || 0) > 0 || (formData.priceDown || 0) > 0)
      : true

    return hasValidAmount && hasValidTitle && hasValidMessage && hasValidTime && hasValidPrice
  }, [formData, isAmountValid, getValidationError])

  // Get validation error message
  const getFormValidationError = useCallback(() => {
    const conversionError = getValidationError()
    if (conversionError) return conversionError

    if (formData.title.trim().length < 3) {
      return 'Title must be at least 3 characters'
    }

    if (formData.message.trim().length < 10) {
      return 'Message must be at least 10 characters'
    }

    if (formData.condition === 'TIME_BASED' && (formData.timeValue || 0) <= 0) {
      return 'Enter a valid time duration'
    }

    if (formData.condition === 'PRICE_TARGET' &&
        (formData.priceUp || 0) <= 0 && (formData.priceDown || 0) <= 0) {
      return 'Enter at least one price target'
    }

    if (formData.condition === 'COMBO') {
      if ((formData.timeValue || 0) <= 0) {
        return 'Enter a valid time duration for combo vault'
      }
      if ((formData.priceUp || 0) <= 0 && (formData.priceDown || 0) <= 0) {
        return 'Enter at least one price target for combo vault'
      }
    }

    return null
  }, [formData, getValidationError])

  return {
    // Vault creation
    createVault,
    isLoading,
    error,

    // Conversion info
    avaxAmount,
    avaxAmountFormatted,
    avaxPrice,
    isPriceLoading,
    priceError,
    refreshPrice,

    // Validation
    isFormValid: isFormValid(),
    validationError: getFormValidationError(),
    isAmountValid
  }
}
