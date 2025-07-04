import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useCipherVault } from './useCipherVault'
import type { VaultFormData, UseCreateVaultReturn, TransactionResult } from '../../types/contracts'
import { convertFormDataToContractData, validateVaultFormData } from '../../utils/contractHelpers'
import { indexerService } from '../../services/indexerService'
import type { CipherAnalysisResponse } from '../../services/cipherAgentService'
import { appEvents, APP_EVENTS } from '../../utils/events'

export const useCreateVault = (): UseCreateVaultReturn => {
  const { address } = useAccount()
  const cipherVault = useCipherVault()

  const createVault = useCallback(async (formData: VaultFormData, aiAnalysis?: CipherAnalysisResponse['data']): Promise<TransactionResult> => {
    console.log('🚀 Starting vault creation process...')
    console.log('📋 Form data:', formData)
    console.log('💰 USD Amount:', formData.usdAmount)
    console.log('🪙 Converted Token Amount:', formData._convertedTokenAmount)
    console.log('🤖 AI analysis:', aiAnalysis)

    // Check wallet connection
    if (!address) {
      console.error('❌ Wallet not connected')
      return {
        hash: '',
        success: false,
        error: 'Please connect your wallet first'
      }
    }

    console.log('✅ Wallet connected:', address)

    // Validate form data
    const validationErrors = validateVaultFormData(formData)
    if (validationErrors.length > 0) {
      console.error('❌ Form validation errors:', validationErrors)
      return {
        hash: '',
        success: false,
        error: validationErrors.join(', ')
      }
    }

    console.log('✅ Form validation passed')

    try {
      console.log('🔄 Converting form data to contract parameters...')

      const contractData = convertFormDataToContractData(formData)

      console.log('📊 Contract data:', {
        token: contractData.token,
        amount: contractData.amount.toString(),
        unlockTime: contractData.unlockTime.toString(),
        targetPrice: contractData.targetPrice.toString(),
        conditionType: contractData.conditionType,
        isNativeToken: contractData.isNativeToken
      })

      let result: TransactionResult

      console.log('🎯 Vault condition type:', formData.condition)

      switch (formData.condition) {
        case 'TIME_BASED':
          console.log('⏰ Creating TIME_BASED vault...')
          console.log('📅 Unlock time:', new Date(Number(contractData.unlockTime) * 1000).toLocaleString())
          console.log('💰 Amount:', contractData.amount.toString(), 'wei')
          console.log('🏷️ Title:', formData.title)
          console.log('💬 Message:', formData.message)

          result = await cipherVault.createTimeVault(
            contractData.token,
            contractData.amount,
            contractData.unlockTime,
            formData.title,
            formData.message
          )
          break

        case 'PRICE_TARGET':
          console.log('💰 Creating PRICE_TARGET vault...')
          console.log('🎯 Price Up:', Number(contractData.priceUp) / 1e8, 'USD')
          console.log('🎯 Price Down:', Number(contractData.priceDown) / 1e8, 'USD')
          console.log('💰 Amount:', contractData.amount.toString(), 'wei')
          console.log('🏷️ Title:', formData.title)
          console.log('💬 Message:', formData.message)

          result = await cipherVault.createPriceVault(
            contractData.token,
            contractData.amount,
            contractData.priceUp,
            contractData.priceDown,
            formData.title,
            formData.message
          )
          break

        case 'COMBO':
          console.log('🔄 Creating COMBO vault (TIME_OR_PRICE)...')
          console.log('📅 Unlock time:', new Date(Number(contractData.unlockTime) * 1000).toLocaleString())
          console.log('🎯 Price Up:', Number(contractData.priceUp) / 1e8, 'USD')
          console.log('🎯 Price Down:', Number(contractData.priceDown) / 1e8, 'USD')
          console.log('💰 Amount:', contractData.amount.toString(), 'wei')
          console.log('🏷️ Title:', formData.title)
          console.log('💬 Message:', formData.message)
          console.log('💡 Vault will unlock when EITHER condition is met')

          result = await cipherVault.createTimeOrPriceVault(
            contractData.token,
            contractData.amount,
            contractData.unlockTime,
            contractData.priceUp,
            contractData.priceDown,
            formData.title,
            formData.message
          )
          break

        default:
          console.error('❌ Invalid condition type:', formData.condition)
          return {
            hash: '',
            success: false,
            error: 'Invalid condition type'
          }
      }

      console.log('📡 Transaction submitted, waiting for result...')

      if (result.success && result.hash) {
        console.log('✅ Transaction successful!')
        console.log('🔗 Transaction hash:', result.hash)
        
        // Always emit immediate event for UI responsiveness
        console.log('📡 Emitting immediate vault creation event...')
        appEvents.emit(APP_EVENTS.VAULT_CREATED, {
          vaultId: result.vaultId,
          hash: result.hash,
          formData,
          receiptReceived: false // Always false initially since we don't wait for receipt
        })
        
        // Start background process to wait for receipt and then index
        console.log('🔄 Starting background receipt monitoring and indexing...')
        setTimeout(async () => {
          try {
            // Wait a bit for receipt to be available
            await new Promise(resolve => setTimeout(resolve, 3000))
            
            // Check if receipt is available now
            let receiptReceived = false
            try {
              const response = await fetch(`https://api.avax.network/ext/bc/C/ws`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  method: 'eth_getTransactionReceipt',
                  params: [result.hash],
                  id: 1
                })
              })
              
              const data = await response.json()
              receiptReceived = !!(data.result && data.result.status)
            } catch (error) {
              console.log('⚠️ Could not check receipt status, proceeding with indexing anyway')
            }
            
            // Proceed with indexing regardless of receipt status
            if (aiAnalysis) {
              console.log('📡 Background indexing vault with AI analysis...')
              try {
                const indexData = {
                  vault_id: result.vaultId || 1,
                  vault_title: formData.title,
                  commitment_message: formData.message,
                  owner_address: address,
                  metadata: JSON.stringify(aiAnalysis),
                  tx_hash: result.hash
                }

                const indexResult = await indexerService.createVault(indexData)

                if (indexResult.success) {
                  console.log('✅ Vault indexed successfully in background')
                } else {
                  console.warn('⚠️ Failed to index vault in background:', indexResult.error)
                }
              } catch (indexError) {
                console.warn('⚠️ Error during background vault indexing:', indexError)
              }
            }
            
            // Emit final event with updated status
            console.log('📡 Emitting final vault creation event with receipt status...')
            appEvents.emit(APP_EVENTS.VAULT_CREATED, {
              vaultId: result.vaultId,
              hash: result.hash,
              formData,
              receiptReceived
            })
            
          } catch (error) {
            console.error('❌ Error in background processing:', error)
          }
        }, 100) // Start background process after 100ms
        
        return result
      } else {
        console.error('❌ Transaction failed')
        console.error('📄 Result:', result)
      }

      return result

    } catch (error) {
      console.error('💥 Error creating vault:', error)
      console.error('📊 Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })

      let errorMessage = 'Failed to create vault'

      if (error instanceof Error) {
        if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds for this transaction'
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Transaction was rejected by user'
        } else if (error.message.includes('TokenNotSupported')) {
          errorMessage = 'This token is not supported yet'
        } else if (error.message.includes('PriceFeedNotSet')) {
          errorMessage = 'Price feed not configured for this token. Please contact support.'
        } else if (error.message.includes('InvalidTimeCondition')) {
          errorMessage = 'Invalid unlock time specified'
        } else if (error.message.includes('InvalidPriceCondition')) {
          errorMessage = 'Invalid target price specified. Price must be greater than 0.'
        } else if (error.message.includes('InsufficientAmount')) {
          errorMessage = 'Amount too small. Minimum amount is 0.001 AVAX.'
        } else if (error.message.includes('execution reverted')) {
          const revertMatch = error.message.match(/execution reverted: (.+)/)
          if (revertMatch) {
            errorMessage = `Transaction failed: ${revertMatch[1]}`
          } else {
            errorMessage = 'Transaction failed. Please check your inputs and try again.'
          }
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
  }, [address, cipherVault])

  return {
    createVault,
    isLoading: cipherVault.isLoading,
    error: cipherVault.error
  }
}

/**
 * Hook for creating vaults with additional validation and error handling
 */
export const useCreateVaultWithValidation = () => {
  const { createVault, isLoading, error } = useCreateVault()

  const createVaultWithValidation = useCallback(async (
    formData: VaultFormData,
    onSuccess?: (result: TransactionResult) => void,
    onError?: (error: string) => void
  ) => {
    const result = await createVault(formData)

    if (result.success) {
      onSuccess?.(result)
    } else {
      onError?.(result.error || 'Unknown error occurred')
    }

    return result
  }, [createVault])

  return {
    createVault: createVaultWithValidation,
    isLoading,
    error
  }
}

/**
 * Utility function to estimate gas for vault creation
 */
export const useEstimateVaultCreationGas = () => {
  const estimateGas = useCallback(async (formData: VaultFormData): Promise<bigint | null> => {
    try {

      // TODO: Implement gas estimation using wagmi's useEstimateGas
      // This would require calling the appropriate contract function with estimateGas: true

      // For now, return a rough estimate based on condition type
      switch (formData.condition) {
        case 'TIME_BASED':
          return BigInt(150000) // Estimated gas for time vault
        case 'PRICE_TARGET':
          return BigInt(180000) // Estimated gas for price vault
        case 'COMBO':
          return BigInt(200000) // Estimated gas for combo vault
        default:
          return BigInt(150000)
      }
    } catch (error) {
      console.error('Failed to estimate gas:', error)
      return null
    }
  }, [])

  return { estimateGas }
}

/**
 * Hook to check if a token is supported before vault creation
 */
export const useCheckTokenSupport = () => {
  const checkTokenSupport = useCallback(async (tokenSymbol: string): Promise<boolean> => {
    // TODO: Implement actual token support check using contract read
    // For now, return true for supported tokens
    const supportedTokens = ['ETH', 'AVAX', 'MONAD']
    return supportedTokens.includes(tokenSymbol)
  }, [])

  return { checkTokenSupport }
}
