import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Shield, DollarSign, Calendar, ArrowRight, Check } from 'lucide-react'
import type { FormattedVault } from '../../../types/contracts'
import '../../../styles/create-vault-modal.css'

interface EmergencyWithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  vault: FormattedVault
  isLoading?: boolean
}

export const EmergencyWithdrawalModal: React.FC<EmergencyWithdrawalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  vault,
  isLoading = false
}) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const [hasConfirmedPenalty, setHasConfirmedPenalty] = useState(false)
  const [hasConfirmedPermanent, setHasConfirmedPermanent] = useState(false)

  // Calculate penalty and final amount
  const originalAmount = parseFloat(vault.amount?.formatted || '0')
  const penaltyPercent = 10
  const penaltyAmount = (originalAmount * penaltyPercent) / 100
  const finalAmount = originalAmount - penaltyAmount
  
  const usdValue = vault.amount?.usd || 0
  const penaltyUsdValue = (usdValue * penaltyPercent) / 100
  const finalUsdValue = usdValue - penaltyUsdValue

  const tokenSymbol = vault.token?.symbol || 'UNKNOWN'

  const handleConfirm = async () => {
    if (!hasConfirmedPenalty || !hasConfirmedPermanent) return
    
    setIsConfirming(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Emergency withdrawal failed:', error)
    } finally {
      setIsConfirming(false)
    }
  }

  const isFormValid = hasConfirmedPenalty && hasConfirmedPermanent

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
          style={{ maxWidth: '50rem' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h2 className="modal-title">Emergency Withdrawal</h2>
            </div>
            <button
              onClick={onClose}
              className="modal-close-button"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content */}
          <div className="modal-form-container">
            {/* Warning Alert */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 style={{ 
                    color: '#FFFFFF', 
                    fontSize: '1.1rem', 
                    fontWeight: '700', 
                    marginBottom: '8px' 
                  }}>
                    Emergency Withdrawal Warning
                  </h3>
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    You are about to perform an emergency withdrawal from your commitment vault. 
                    This action will break your commitment early and incur a 10% penalty fee.
                  </p>
                </div>
              </div>
            </div>

            {/* Vault Information Card */}
            <div className="message-card" style={{ marginBottom: '24px' }}>
              <label className="parameter-label">Vault Information</label>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px',
                marginTop: '16px'
              }}>
                {/* Vault Title */}
                <div style={{
                  background: 'rgba(111, 66, 193, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(111, 66, 193, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Title</span>
                  </div>
                  <span style={{ color: '#FFFFFF', fontWeight: '600' }}>
                    {vault.title || 'Untitled Vault'}
                  </span>
                </div>

                {/* Current Amount */}
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Locked Amount</span>
                  </div>
                  <div>
                    <div style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '1.1rem' }}>
                      {originalAmount.toFixed(6)} {tokenSymbol}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                      ≈ ${usdValue.toFixed(2)} USD
                    </div>
                  </div>
                </div>

                {/* Condition */}
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Condition</span>
                  </div>
                  <span style={{ color: '#FFFFFF', fontWeight: '600' }}>
                    {vault.conditionType?.display || 'Unknown'}
                  </span>
                </div>
              </div>

              {/* Vault Message */}
              {vault.message && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                      Your Commitment Message
                    </span>
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontStyle: 'italic',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6'
                  }}>
                    "{vault.message}"
                  </div>
                </div>
              )}
            </div>

            {/* Withdrawal Breakdown */}
            <div className="message-card" style={{ marginBottom: '24px' }}>
              <label className="parameter-label">Withdrawal Breakdown</label>
              
              <div style={{ marginTop: '16px' }}>
                {/* Original Amount */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Original Amount</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#FFFFFF', fontWeight: '600' }}>
                      {originalAmount.toFixed(6)} {tokenSymbol}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                      ${usdValue.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Penalty */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span style={{ color: '#EF4444', fontWeight: '600' }}>
                    Penalty (10%)
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#EF4444', fontWeight: '600' }}>
                      -{penaltyAmount.toFixed(6)} {tokenSymbol}
                    </div>
                    <div style={{ color: '#EF4444', fontSize: '0.9rem' }}>
                      -${penaltyUsdValue.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Final Amount */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '16px 0 0 0',
                  fontSize: '1.1rem'
                }}>
                  <span style={{ color: '#FFFFFF', fontWeight: '700' }}>You Will Receive</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#22C55E', fontWeight: '700', fontSize: '1.2rem' }}>
                      {finalAmount.toFixed(6)} {tokenSymbol}
                    </div>
                    <div style={{ color: '#22C55E', fontSize: '1rem' }}>
                      ≈ ${finalUsdValue.toFixed(2)} USD
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Checkboxes */}
            <div className="message-card" style={{ marginBottom: '24px' }}>
              <label className="parameter-label">Confirmation Required</label>
              
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Penalty Confirmation */}
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '16px',
                  background: hasConfirmedPenalty ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  border: `2px solid ${hasConfirmedPenalty ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    background: hasConfirmedPenalty ? '#22C55E' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {hasConfirmedPenalty && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={hasConfirmedPenalty}
                    onChange={(e) => setHasConfirmedPenalty(e.target.checked)}
                    style={{ display: 'none' }}
                  />
                  <span style={{ 
                    color: '#FFFFFF', 
                    lineHeight: '1.6',
                    fontWeight: '500'
                  }}>
                    I understand that I will lose {penaltyAmount.toFixed(6)} {tokenSymbol} 
                    (≈${penaltyUsdValue.toFixed(2)}) as a 10% penalty for breaking my commitment early.
                  </span>
                </label>

                {/* Permanent Action Confirmation */}
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '16px',
                  background: hasConfirmedPermanent ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  border: `2px solid ${hasConfirmedPermanent ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    background: hasConfirmedPermanent ? '#22C55E' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {hasConfirmedPermanent && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={hasConfirmedPermanent}
                    onChange={(e) => setHasConfirmedPermanent(e.target.checked)}
                    style={{ display: 'none' }}
                  />
                  <span style={{ 
                    color: '#FFFFFF', 
                    lineHeight: '1.6',
                    fontWeight: '500'
                  }}>
                    I understand that this action is permanent and irreversible. 
                    Once confirmed, my vault will be closed forever.
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-section" style={{ display: 'flex', gap: '16px' }}>
              {/* Cancel Button */}
              <button
                onClick={onClose}
                className="commitment-action-btn"
                disabled={isConfirming || isLoading}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <span className="btn_wrapper">
                  <span className="btn_label">
                    Cancel
                  </span>
                </span>
              </button>

              {/* Confirm Emergency Withdrawal Button */}
              <button
                onClick={handleConfirm}
                className="commitment-action-btn"
                disabled={!isFormValid || isConfirming || isLoading}
                style={{
                  flex: 1,
                  background: isFormValid 
                    ? 'linear-gradient(135deg, #EF4444, #DC2626)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  opacity: !isFormValid ? 0.5 : 1
                }}
              >
                <span className="btn_wrapper">
                  <span className="btn_icon_left">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                  <span className="btn_label">
                    {isConfirming ? 'Processing...' : 'Emergency Withdraw'}
                  </span>
                  <span className="btn_icon_right">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </span>
              </button>
            </div>

            {!isFormValid && (
              <div className="validation-message">
                <p className="error-text">
                  Please confirm both checkboxes to proceed with emergency withdrawal
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}