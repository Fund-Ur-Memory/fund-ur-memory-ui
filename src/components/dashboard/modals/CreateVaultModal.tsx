import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, Sparkles, RefreshCw, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import type { VaultFormData } from '../../../types/contracts'
import { useVaultCreationWithConversion } from '../../../hooks/contracts/useCreateVaultWithConversion'
import '../../../styles/create-vault-modal.css'
import { COMMITMENT_CONDITIONS, TIME_UNITS, SUPPORTED_TOKENS } from '../../../utils/constants'
import { getMaxTimeValue, getDefaultTimeValue } from '../../../utils/helpers'
import { cipherAgentService } from '../../../services/cipherAgentService'

interface CreateVaultModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAnalysisComplete: (formData: VaultFormData, aiAnalysis: any) => void
  isLoading?: boolean
}

export const CreateVaultModal: React.FC<CreateVaultModalProps> = ({
  isOpen,
  onClose,
  onAnalysisComplete,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<VaultFormData>({
    usdAmount: '',
    token: 'AVAX',
    condition: 'TIME_BASED',
    timeValue: 6,
    timeUnit: 'months',
    targetPrice: undefined,
    priceUp: undefined,
    priceDown: undefined,
    title: '',
    message: ''
  })

  const [inputMode, setInputMode] = useState<'usd' | 'token'>('usd')
  const [tokenAmount, setTokenAmount] = useState('')

  // USD to AVAX conversion
  const {
    avaxAmountFormatted,
    avaxPrice,
    isPriceLoading,
    priceError,
    refreshPrice,
    isFormValid: isFormValidWithConversion,
    validationError
  } = useVaultCreationWithConversion(formData)

  const [showTokenDropdown, setShowTokenDropdown] = useState(false)
  const [showConditionDropdown, setShowConditionDropdown] = useState(false)
  const [showTimeUnitDropdown, setShowTimeUnitDropdown] = useState(false)

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState('')

  const handleSwapInputMode = () => {
    if (inputMode === 'usd') {
      // Switching from USD to token
      if (avaxAmountFormatted && formData.usdAmount) {
        setTokenAmount(avaxAmountFormatted.replace(/,/g, ''))
        setFormData(prev => ({ ...prev, usdAmount: '' }))
      }
      setInputMode('token')
    } else {
      // Switching from token to USD
      if (tokenAmount && avaxPrice) {
        const usdValue = (parseFloat(tokenAmount) * avaxPrice).toFixed(2)
        setFormData(prev => ({ ...prev, usdAmount: usdValue }))
        setTokenAmount('')
      }
      setInputMode('usd')
    }
  }

  const handleTokenAmountChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      if (value === '' || value === '0' || value === '0.' || !/^0\d/.test(value)) {
        setTokenAmount(value)
        // Update USD amount based on token amount
        if (value && avaxPrice) {
          const usdValue = (parseFloat(value) * avaxPrice).toFixed(2)
          setFormData(prev => ({ ...prev, usdAmount: usdValue }))
        } else {
          setFormData(prev => ({ ...prev, usdAmount: '' }))
        }
      }
    }
  }

  const handleUsdAmountChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      if (value === '' || value === '0' || value === '0.' || !/^0\d/.test(value)) {
        setFormData(prev => ({ ...prev, usdAmount: value }))
        // Update token amount based on USD amount
        if (value && avaxPrice) {
          const tokenValue = (parseFloat(value) / avaxPrice).toFixed(6)
          setTokenAmount(tokenValue)
        } else {
          setTokenAmount('')
        }
      }
    }
  }

  const selectedToken = SUPPORTED_TOKENS.find(token => token.symbol === formData.token)
  const selectedCondition = COMMITMENT_CONDITIONS.find(condition => condition.id === formData.condition)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.inline-dropdown-container') && !target.closest('.inline-time-unit-container')) {
        setShowTokenDropdown(false)
        setShowConditionDropdown(false)
        setShowTimeUnitDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isFormValid = () => {
    // Use the comprehensive validation from the conversion hook which includes USD to AVAX validation
    const selectedTokenData = SUPPORTED_TOKENS.find(token => token.symbol === formData.token)
    const isTokenAvailable = selectedTokenData?.available !== false
    const selectedConditionData = COMMITMENT_CONDITIONS.find(condition => condition.id === formData.condition)
    const isConditionAvailable = selectedConditionData?.available !== false

    if (!isTokenAvailable || !isConditionAvailable) {
      return false
    }

    // Use the conversion hook's validation which includes amount, title, message, and condition validation
    return isFormValidWithConversion
  }

  const generateCommitmentText = () => {
    // Use the converted token amount instead of USD amount
    const tokenAmount = avaxAmountFormatted?.replace(/,/g, '') || formData.usdAmount
    const token = formData.token
    // const usdAmount = parseFloat(formData.usdAmount)

    if (formData.condition === 'TIME_BASED') {
      return `I want to lock ${tokenAmount} ${token} for ${formData.timeValue} ${formData.timeUnit}`
    } else if (formData.condition === 'PRICE_TARGET') {
      return `I want to lock ${tokenAmount} ${token} until either the price goes up to $${formData.priceUp} or price goes down to $${formData.priceDown}`
    } else if (formData.condition === 'COMBO') {
      return `I want to lock ${tokenAmount} ${token} for ${formData.timeValue} ${formData.timeUnit} or until the price reaches $${formData.priceUp}`
    }
    return ''
  }

  const analyzeCommitment = async () => {
    if (!isFormValid()) return

    setIsAnalyzing(true)
    setAnalysisError('')

    // Include USD to AVAX conversion info in the form data
    const enhancedFormData = {
      ...formData,
      avaxAmountFormatted,
      avaxPrice,
      _convertedTokenAmount: avaxAmountFormatted?.replace(/,/g, '') // Remove commas for parsing
    }

    console.log('🔄 Enhanced form data with conversion:', enhancedFormData)
    console.log('💰 USD Amount:', formData.usdAmount)
    console.log('🪙 Converted AVAX Amount:', avaxAmountFormatted)

    const commitmentText = generateCommitmentText()
    const result = await cipherAgentService.analyzeCommitment(commitmentText)

    if (result.success && result.data) {
      onAnalysisComplete(enhancedFormData, result.data)
    } else {
      setAnalysisError(result.error || 'Failed to get AI analysis')
    }

    setIsAnalyzing(false)
  }

  const handleSubmit = async () => {
    if (!isFormValid() || isLoading) return

    await analyzeCommitment()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="create-vault-modal"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="create-vault-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <h2 className="modal-title">Create Commitment Vault</h2>
            <button
              onClick={onClose}
              className="modal-close-button"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Form - Seamless UX */}
          <div className="modal-form-container">
            {/* Interactive Commitment Statement */}
            <div className="commitment-statement-container">
              {/* Main Statement Row */}
              <div className="commitment-statement">
                <span className="statement-text">I want to commit</span>

                {/* Enhanced Amount Input with USD/Token Toggle */}
                <div className="amount-input-container">
                  <div className={`amount-input-wrapper ${
                    (inputMode === 'usd' && formData.usdAmount && parseFloat(formData.usdAmount) > 0) || 
                    (inputMode === 'token' && tokenAmount && parseFloat(tokenAmount) > 0) ? 'has-value' : ''
                  } ${
                    validationError && validationError.toLowerCase().includes('amount') ? 'has-error' : ''
                  }`}>
                    <div className="currency-symbol">
                      {inputMode === 'usd' ? '$' : selectedToken?.symbol.charAt(0) || 'A'}
                    </div>
                    <input
                      type="text"
                      value={inputMode === 'usd' ? formData.usdAmount : tokenAmount}
                      onChange={(e) => {
                        const value = e.target.value
                        if (inputMode === 'usd') {
                          handleUsdAmountChange(value)
                        } else {
                          handleTokenAmountChange(value)
                        }
                      }}
                      placeholder={inputMode === 'usd' ? '0.00' : '0.000000'}
                      className="amount-input-field"
                      disabled={isAnalyzing}
                      style={{ minWidth: '120px', width: 'auto', flex: '1' }}
                    />
                    <div className="currency-code ml-auto">{inputMode === 'usd' ? 'USD' : formData.token}</div>
                    
                    {/* Swap Button */}
                    <button
                      type="button"
                      onClick={handleSwapInputMode}
                      className="swap-button"
                      disabled={isAnalyzing || !avaxPrice}
                      title={`Switch to ${inputMode === 'usd' ? 'token' : 'USD'} input`}
                      style={{
                        padding: '8px',
                        marginRight: '8px',
                        background: 'rgba(154, 68, 151, 0.2)',
                        border: '1px solid rgba(154, 68, 151, 0.3)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        cursor: isAnalyzing || !avaxPrice ? 'not-allowed' : 'pointer',
                        opacity: isAnalyzing || !avaxPrice ? 0.5 : 1,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '32px',
                        height: '32px'
                      }}
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Conversion Info */}
                  <div className="conversion-info">
                    {isPriceLoading ? (
                      <motion.div
                        className="conversion-loading"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="loading-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span>Getting price...</span>
                      </motion.div>
                    ) : priceError ? (
                      <motion.div
                        className="conversion-error"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="error-icon">⚠</span>
                        <span>Price unavailable</span>
                        <button
                          type="button"
                          onClick={refreshPrice}
                          className="retry-btn"
                        >
                          Retry
                        </button>
                      </motion.div>
                    ) : ((inputMode === 'usd' && formData.usdAmount && parseFloat(formData.usdAmount) > 0) || 
                          (inputMode === 'token' && tokenAmount && parseFloat(tokenAmount) > 0)) ? (
                      <motion.div
                        className="conversion-success"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <div className="conversion-amount">
                          {inputMode === 'usd' ? (
                            <>
                              <span className="amount">{avaxAmountFormatted}</span>
                              <span className="token">AVAX</span>
                            </>
                          ) : (
                            <>
                              <span className="amount">${formData.usdAmount}</span>
                              <span className="token">USD</span>
                            </>
                          )}
                        </div>
                        <div className="price-info">
                          <span className="price-label">1 AVAX = ${avaxPrice?.toFixed(2)}</span>
                          <button
                            type="button"
                            onClick={refreshPrice}
                            className="refresh-btn"
                            title="Refresh price"
                          >
                            <RefreshCw className={`refresh-icon ${isPriceLoading ? 'spinning' : ''}`} />
                          </button>
                        </div>
                      </motion.div>
                    ) : null}
                  </div>
                </div>

                <span className="statement-text">in</span>

                {/* Token Dropdown - Inline */}
                <div className="inline-dropdown-container">
                  <button
                    onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                    className="inline-token-dropdown"
                    disabled={isAnalyzing}
                  >
                    <span className="token-display">
                      <span
                        className="token-icon"
                        style={{ color: selectedToken?.color }}
                      >
                        {selectedToken?.symbol}
                      </span>
                    </span>
                    <ChevronDown className="w-4 h-4 dropdown-arrow" />
                  </button>

                  {showTokenDropdown && (
                    <div className="inline-dropdown-menu">
                      {SUPPORTED_TOKENS.map((token) => (
                        <button
                          key={token.symbol}
                          onClick={() => {
                            if (token.available) {
                              setFormData(prev => ({ ...prev, token: token.symbol }))
                              setShowTokenDropdown(false)
                            }
                          }}
                          className={`inline-dropdown-item ${!token.available ? 'disabled' : ''}`}
                          disabled={!token.available || isAnalyzing}
                        >
                          <span
                            className="token-icon"
                            style={{
                              color: token.available ? token.color : 'rgba(255, 255, 255, 0.3)',
                              opacity: token.available ? 1 : 0.5
                            }}
                          >
                            {token.symbol.replace(' (Coming Soon)', '')}
                          </span>
                          <span className={`token-name ${!token.available ? 'coming-soon' : ''}`}>
                            {token.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Second Row - Based On + Parameters */}
              <div className="based-on-section">
                <span className="statement-text">based on</span>

                {/* Condition Dropdown */}
                <div className="inline-dropdown-container">
                  <button
                    onClick={() => setShowConditionDropdown(!showConditionDropdown)}
                    className="inline-condition-dropdown"
                    disabled={isAnalyzing}
                  >
                    <span className="condition-display">
                      {selectedCondition?.title}
                    </span>
                    <ChevronDown className="w-4 h-4 dropdown-arrow" />
                  </button>

                  {showConditionDropdown && (
                    <div className="inline-dropdown-menu">
                      {COMMITMENT_CONDITIONS.map((condition) => (
                        <button
                          key={condition.id}
                          onClick={() => {
                            if (condition.available) {
                              setFormData(prev => ({ ...prev, condition: condition.id as 'TIME_BASED' | 'PRICE_TARGET' | 'COMBO' }))
                              setShowConditionDropdown(false)
                            }
                          }}
                          className={`inline-dropdown-item ${!condition.available ? 'disabled' : ''}`}
                          disabled={!condition.available || isAnalyzing}
                        >
                          <condition.icon
                            className="w-4 h-4"
                            style={{
                              color: condition.available ? condition.color : 'rgba(255, 255, 255, 0.3)',
                              opacity: condition.available ? 1 : 0.5
                            }}
                          />
                          <span className={!condition.available ? 'coming-soon' : ''}>
                            {condition.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Conditional Parameters */}
                {(formData.condition === 'TIME_BASED' || formData.condition === 'COMBO') && (
                  <>
                    <span className="statement-text">for</span>
                    <div className="inline-parameter-container">
                      <input
                        type="text"
                        value={formData.timeValue?.toString() || ''}
                        onChange={(e) => {
                          const value = e.target.value
                          // Allow only positive integers
                          if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
                            const numValue = value === '' ? 0 : parseInt(value)
                            const maxValue = getMaxTimeValue(formData.timeUnit || 'months')
                            if (numValue <= maxValue) {
                              setFormData(prev => ({ ...prev, timeValue: numValue }))
                            }
                          }
                        }}
                        placeholder="6"
                        className="inline-parameter-input"
                        disabled={isAnalyzing}
                        style={{ minWidth: '60px', width: 'auto' }}
                      />
                    </div>

                    <div className="inline-time-unit-container">
                      <div
                        className="inline-time-unit-dropdown"
                        onClick={() => setShowTimeUnitDropdown(!showTimeUnitDropdown)}
                        tabIndex={0}
                        style={{ pointerEvents: isAnalyzing ? 'none' : 'auto' }}
                      >
                        <div className="time-unit-display">
                          <span className="time-unit-text">
                            {TIME_UNITS.find(unit => unit.value === (formData.timeUnit || 'months'))?.label || 'months'}
                          </span>
                        </div>
                        <ChevronDown className="time-unit-arrow" size={14} />
                      </div>

                      <AnimatePresence>
                        {showTimeUnitDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="inline-time-unit-menu"
                          >
                            {TIME_UNITS.map((unit) => (
                              <button
                                key={unit.value}
                                className="time-unit-option"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    timeUnit: unit.value as 'minutes' | 'hours' | 'days' | 'months' | 'years',
                                    timeValue: getDefaultTimeValue(unit.value)
                                  }))
                                  setShowTimeUnitDropdown(false)
                                }}
                              >
                                {unit.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}

                {(formData.condition === 'PRICE_TARGET' || formData.condition === 'COMBO') && (
                  <>
                    {formData.condition === 'COMBO' && <span className="parameter-separator">or</span>}
                    <span className="statement-text">when price</span>

                    {/* Price Up Target */}
                    <div className="price-target-container">
                      <ArrowUp className="price-arrow up" />
                      <span className="statement-text">reaches</span>
                      <div className="amount-input-container">
                        <div className={`amount-input-wrapper ${
                          formData.priceUp && formData.priceUp > 0 ? 'has-value' : ''
                        }`}>
                          <div className="currency-symbol">$</div>
                          <input
                            type="text"
                            value={formData.priceUp?.toString() || ''}
                            onChange={(e) => {
                              const value = e.target.value
                              // Use same validation as USD amount input
                              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                if (value === '' || value === '0' || value === '0.' || !/^0\d/.test(value)) {
                                  setFormData(prev => ({
                                    ...prev,
                                    priceUp: value === '' ? undefined : parseFloat(value)
                                  }))
                                }
                              }
                            }}
                            placeholder="0.00"
                            className="amount-input-field"
                            disabled={isAnalyzing}
                            style={{ minWidth: '120px', width: 'auto', flex: '1' }}
                          />
                          <div className="currency-code ml-auto">USD</div>
                        </div>
                      </div>
                    </div>

                    {formData.condition === 'PRICE_TARGET' && (
                      <>
                        <span className="statement-text">or</span>
                        {/* Price Down Target */}
                        <div className="price-target-container">
                          <ArrowDown className="price-arrow down" />
                          <span className="statement-text">drops to</span>
                          <div className="amount-input-container">
                            <div className={`amount-input-wrapper ${
                              formData.priceDown && formData.priceDown > 0 ? 'has-value' : ''
                            }`}>
                              <div className="currency-symbol">$</div>
                              <input
                                type="text"
                                value={formData.priceDown?.toString() || ''}
                                onChange={(e) => {
                                  const value = e.target.value
                                  // Use same validation as USD amount input
                                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                    if (value === '' || value === '0' || value === '0.' || !/^0\d/.test(value)) {
                                      setFormData(prev => ({
                                        ...prev,
                                        priceDown: value === '' ? undefined : parseFloat(value)
                                      }))
                                    }
                                  }
                                }}
                                placeholder="0.00"
                                className="amount-input-field"
                                disabled={isAnalyzing}
                                style={{ minWidth: '120px', width: 'auto', flex: '1' }}
                              />
                              <div className="currency-code ml-auto">USD</div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Card 2: Title and Commitment Message */}
            <div className="message-card">
              <label className="parameter-label">
                Vault Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Give your commitment vault a memorable title..."
                className="commitment-title-input vault-title-enhanced"
                maxLength={50}
                disabled={isAnalyzing}
                style={{
                  all: 'unset',
                  display: 'block',
                  width: '100%',
                  background: 'linear-gradient(135deg, rgba(154, 68, 151, 0.08), rgba(139, 92, 246, 0.05))',
                  color: '#FFFFFF',
                  padding: '1.2rem 1.5rem',
                  borderRadius: '12px',
                  border: '2px solid transparent',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  lineHeight: '1.5',
                  minHeight: '64px',
                  boxSizing: 'border-box',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(154, 68, 151, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: isAnalyzing ? 0.6 : 1,
                  cursor: isAnalyzing ? 'not-allowed' : 'text'
                }}
              />
              <div className="message-counter">
                <span className={`counter-text ${formData.title.length >= 3 ? 'valid' : 'invalid'}`}>
                  {formData.title.length}/3 minimum
                </span>
              </div>

              <label className="parameter-label" style={{ marginTop: '20px' }}>
                Commitment Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Write a message to your future self about this commitment..."
                rows={4}
                className="commitment-message-textarea"
                disabled={isAnalyzing}
              />
              <div className="message-counter">
                <span className={`counter-text ${formData.message.length >= 10 ? 'valid' : 'invalid'}`}>
                  {formData.message.length}/10 minimum
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="action-section">
              <button
                onClick={handleSubmit}
                className="commitment-action-btn"
                disabled={!isFormValid() || isLoading || isAnalyzing}
              >
                <span className="btn_wrapper">
                  <span className="btn_icon_left">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <span className="btn_label">
                    {isAnalyzing ? 'Analyzing...' : 'Get AI Analysis'}
                  </span>
                </span>
              </button>

              {!isFormValid() && (
                <div className="validation-message">
                  <p className="error-text">
                    {validationError || 'Please complete all fields correctly'}
                  </p>
                </div>
              )}

              {analysisError && (
                <div className="validation-message">
                  <p className="error-text">{analysisError}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
