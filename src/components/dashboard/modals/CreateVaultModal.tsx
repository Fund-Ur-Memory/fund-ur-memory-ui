import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ArrowRight, Clock, Target, Zap } from 'lucide-react'
import { LoadingSpinner } from '../common/LoadingSpinner'
import type { VaultFormData } from '../../../types/contracts'
import '../../../styles/create-vault-modal.css'
import '../../../styles/enhanced-loading.css'

interface CreateVaultModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateVault: (vaultData: VaultFormData) => void
  isLoading?: boolean
}

const SUPPORTED_TOKENS = [
  { symbol: 'AVAX', name: 'Avalanche', color: '#E84142', available: true },
  { symbol: 'ETH', name: '(Coming Soon)', color: '#627EEA', available: false },
  { symbol: 'MONAD', name: '(Coming Soon)', color: '#8B5CF6', available: false }
]

// Helper functions for time unit handling
const getMaxTimeValue = (timeUnit: string): number => {
  switch (timeUnit) {
    case 'minutes': return 60 * 24 * 30 // Max 30 days in minutes
    case 'hours': return 24 * 30 // Max 30 days in hours
    case 'days': return 365 // Max 1 year in days
    case 'months': return 24 // Max 2 years in months
    case 'years': return 5 // Max 5 years
    default: return 24
  }
}

const getDefaultTimeValue = (timeUnit: string): number => {
  switch (timeUnit) {
    case 'minutes': return 30
    case 'hours': return 24
    case 'days': return 30
    case 'months': return 6
    case 'years': return 1
    default: return 6
  }
}

const COMMITMENT_CONDITIONS = [
  {
    id: 'TIME_BASED',
    title: 'times',
    description: 'Lock for specific duration',
    icon: Clock,
    color: '#0E9462'
  },
  {
    id: 'PRICE_TARGET',
    title: 'price',
    description: 'Unlock at target price',
    icon: Target,
    color: '#FFCC00'
  },
  {
    id: 'COMBO',
    title: 'combo',
    description: 'Time + Price combination',
    icon: Zap,
    color: '#8B5CF6'
  }
]

const TIME_UNITS = [
  { value: 'minutes', label: 'minutes', shortLabel: 'min' },
  { value: 'hours', label: 'hours', shortLabel: 'hrs' },
  { value: 'days', label: 'days', shortLabel: 'days' },
  { value: 'months', label: 'months', shortLabel: 'mos' },
  { value: 'years', label: 'years', shortLabel: 'yrs' }
]

export const CreateVaultModal: React.FC<CreateVaultModalProps> = ({
  isOpen,
  onClose,
  onCreateVault,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<VaultFormData>({
    usdAmount: '',
    token: 'AVAX',
    condition: 'TIME_BASED',
    timeValue: 6,
    timeUnit: 'months',
    targetPrice: 0,
    title: '',
    message: ''
  })

  const [showTokenDropdown, setShowTokenDropdown] = useState(false)
  const [showConditionDropdown, setShowConditionDropdown] = useState(false)
  const [showTimeUnitDropdown, setShowTimeUnitDropdown] = useState(false)

  const selectedToken = SUPPORTED_TOKENS.find(token => token.symbol === formData.token)
  const selectedCondition = COMMITMENT_CONDITIONS.find(condition => condition.id === formData.condition)

  // Close dropdowns when clicking outside
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
    const usdAmount = parseFloat(formData.usdAmount)
    const hasValidAmount = usdAmount > 0
    const hasValidTitle = formData.title.trim().length >= 3
    const hasValidMessage = formData.message.trim().length >= 10
    const selectedTokenData = SUPPORTED_TOKENS.find(token => token.symbol === formData.token)
    const isTokenAvailable = selectedTokenData?.available !== false

    if (!isTokenAvailable) {
      return false
    }

    // Check time-based conditions
    const hasValidTime = (formData.condition === 'TIME_BASED' || formData.condition === 'COMBO')
      ? (formData.timeValue || 0) > 0
      : true

    if (formData.condition === 'PRICE_TARGET') {
      return hasValidAmount && hasValidTitle && hasValidMessage && (formData.targetPrice || 0) > 0
    }

    if (formData.condition === 'COMBO') {
      return hasValidAmount && hasValidTitle && hasValidMessage && (formData.targetPrice || 0) > 0 && hasValidTime
    }

    if (formData.condition === 'TIME_BASED') {
      return hasValidAmount && hasValidTitle && hasValidMessage && hasValidTime
    }

    return hasValidAmount && hasValidTitle && hasValidMessage
  }

  const handleSubmit = () => {
    if (!isFormValid() || isLoading) return
    onCreateVault(formData)
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
                <span className="statement-text">I want to commitment</span>

                {/* USD Amount Input - Inline */}
                <div className="inline-input-container">
                  <input
                    type="number"
                    value={formData.usdAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, usdAmount: e.target.value }))}
                    placeholder="0"
                    className="inline-amount-input"
                  />
                  <span className="currency-label">USD</span>
                </div>

                <span className="statement-text">with</span>

                {/* Token Dropdown - Inline */}
                <div className="inline-dropdown-container">
                  <button
                    onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                    className="inline-token-dropdown"
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
                          disabled={!token.available}
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
                            setFormData(prev => ({ ...prev, condition: condition.id as 'TIME_BASED' | 'PRICE_TARGET' | 'COMBO' }))
                            setShowConditionDropdown(false)
                          }}
                          className="inline-dropdown-item"
                        >
                          <condition.icon
                            className="w-4 h-4"
                            style={{ color: condition.color }}
                          />
                          <span>{condition.title}</span>
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
                        type="number"
                        value={formData.timeValue}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeValue: parseInt(e.target.value) || 0 }))}
                        placeholder="6"
                        min="1"
                        max={getMaxTimeValue(formData.timeUnit || 'months')}
                        className="inline-parameter-input"
                      />
                    </div>

                    <div className="inline-time-unit-container">
                      <div
                        className="inline-time-unit-dropdown"
                        onClick={() => setShowTimeUnitDropdown(!showTimeUnitDropdown)}
                        tabIndex={0}
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
                    <span className="statement-text">at</span>
                    <div className="inline-parameter-container">
                      <span className="inline-parameter-unit">$</span>
                      <input
                        type="number"
                        value={formData.targetPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, targetPrice: parseFloat(e.target.value) || 0 }))}
                        placeholder="0"
                        step="0.01"
                        className="inline-parameter-input"
                      />
                    </div>
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
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
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
                disabled={!isFormValid() || isLoading}
              >
                <span className="btn_wrapper">
                  <span className="btn_label">
                    {isLoading ? 'Creating Vault...' : "Create Vault"}
                  </span>
                  <span className="btn_icon_right">
                    {isLoading ? (
                      <LoadingSpinner
                        size="xs"
                        variant="dots"
                        color="white"
                        text=""
                        className="inline-flex"
                      />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </span>
                </span>
              </button>

              {!isFormValid() && (
                <div className="validation-message">
                  <p className="error-text">
                    {!formData.usdAmount || parseFloat(formData.usdAmount) <= 0
                      ? 'Enter a valid USD amount'
                      : formData.title.trim().length < 3
                      ? 'Title must be at least 3 characters'
                      : formData.message.trim().length < 10
                      ? 'Message must be at least 10 characters'
                      : formData.condition === 'PRICE_TARGET' && (formData.targetPrice || 0) <= 0
                      ? 'Enter a valid target price'
                      : formData.condition === 'COMBO' && ((formData.targetPrice || 0) <= 0 || (formData.timeMonths || 0) <= 0)
                      ? 'Enter valid time and price for combo'
                      : 'Please complete all fields'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
