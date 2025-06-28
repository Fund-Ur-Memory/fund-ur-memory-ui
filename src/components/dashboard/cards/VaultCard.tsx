import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, AlertTriangle, Clock } from 'lucide-react'
import { useWithdrawVault } from '../../../hooks/contracts/useWithdrawVault'
import { useVaultTokenPrice } from '../../../hooks/useTokenPrice'
import { useVaultProgress } from '../../../hooks/useVaultProgress'
import { VaultOperationLoader } from '../common/VaultOperationLoader'
import type { FormattedVault } from '../../../types/contracts'
import '../../../styles/vault-cards.css'
import '../../../styles/enhanced-loading.css'



interface VaultCardProps {
  vault: FormattedVault
  isPrivate?: boolean
  onClick?: () => void
  delay?: number
  onWithdraw?: (vaultId: number) => void
  onEmergencyWithdraw?: (vaultId: number) => void
}

export const VaultCard: React.FC<VaultCardProps> = ({
  vault,
  isPrivate = false,
  onClick,
  delay = 0,
  onWithdraw,
  onEmergencyWithdraw
}) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isEmergencyWithdrawing, setIsEmergencyWithdrawing] = useState(false)
  const [operationStatus, setOperationStatus] = useState<'pending' | 'confirming' | 'success' | 'error'>('pending')
  const { withdrawVault, emergencyWithdraw, isLoading, txHash: hookTxHash } = useWithdrawVault()

  // Get real-time token price
  const tokenSymbol = vault.token?.symbol || 'UNKNOWN'
  const { price: tokenPrice, formattedPrice, change24h } = useVaultTokenPrice(tokenSymbol)
  
  // Get real-time progress calculation
  const { progress: realTimeProgress, timeRemaining, isUnlocked } = useVaultProgress(vault)

  // Safety checks for vault data
  if (!vault || !vault.token || !vault.conditionType || !vault.status) {
    console.error('Invalid vault data:', vault)
    return (
      <div className="col-lg-6 col-md-6 mb-4">
        <div style={{
          padding: '20px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#EF4444', margin: 0 }}>
            Error loading vault data
          </p>
        </div>
      </div>
    )
  }

  const handleWithdraw = async () => {
    if (!vault.canWithdraw) return

    setIsWithdrawing(true)
    setOperationStatus('pending')
    try {
      await withdrawVault(vault.id)
      setOperationStatus('confirming')

      // Simulate confirmation delay
      setTimeout(() => {
        setOperationStatus('success')
        onWithdraw?.(vault.id)
        setTimeout(() => setIsWithdrawing(false), 2000)
      }, 3000)
    } catch (err) {
      console.error('Withdraw failed:', err)
      setOperationStatus('error')
      setTimeout(() => setIsWithdrawing(false), 3000)
    }
  }

  const handleEmergencyWithdraw = async () => {
    if (!vault.canEmergencyWithdraw) return

    setIsEmergencyWithdrawing(true)
    setOperationStatus('pending')
    try {
      await emergencyWithdraw(vault.id)
      setOperationStatus('confirming')

      // Simulate confirmation delay
      setTimeout(() => {
        setOperationStatus('success')
        onEmergencyWithdraw?.(vault.id)
        setTimeout(() => setIsEmergencyWithdrawing(false), 2000)
      }, 3000)
    } catch (err) {
      console.error('Emergency withdraw failed:', err)
      setOperationStatus('error')
      setTimeout(() => setIsEmergencyWithdrawing(false), 3000)
    }
  }

  // Safe accessors with fallbacks
  const conditionDisplay = vault.conditionType?.display || 'Unknown'
  const statusDisplay = vault.status?.display || 'Unknown'
  const statusColor = vault.status?.color || '#6B7280'
  const amountFormatted = vault.amount?.formatted || '0'
  const amountUsd = vault.amount?.usd
  const createdAtFormatted = vault.createdAt?.formatted || 'Unknown'
  const targetPriceUsd = vault.targetPrice?.usd
  const unlockTimeFormatted = vault.unlockTime?.formatted

  const getAssetIcon = (asset: string) => {
    const icons: Record<string, string> = {
      ETH: '⟠',
      BTC: '₿',
      USDC: '$',
      AVAX: '▲',
      ARB: '◆'
    }
    return icons[asset] || '●'
  }

  const getAssetColor = (asset: string) => {
    const colors: Record<string, string> = {
      ETH: '#627EEA',
      BTC: '#F7931A',
      USDC: '#2775CA',
      AVAX: '#E84142',
      ARB: '#28A0F0'
    }
    return colors[asset] || '#6B7280'
  }



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="col-lg-6 col-md-6 mb-4"
    >
      <div className="vault-card-container">
        <div
          className="ico_iconbox_block"
          onClick={onClick}
          style={{
            cursor: onClick ? 'pointer' : 'default',
            height: '100%',
            minHeight: '260px',
            position: 'relative',
            overflow: 'hidden'
          }}
          tabIndex={onClick ? 0 : -1}
          role={onClick ? 'button' : 'article'}
          aria-label={`${tokenSymbol} Vault - ${conditionDisplay}`}
        >
        {/* Header Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div
              className="vault-asset-icon"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${getAssetColor(tokenSymbol)}20, ${getAssetColor(tokenSymbol)}40)`,
                border: `2px solid ${getAssetColor(tokenSymbol)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: getAssetColor(tokenSymbol)
              }}
            >
              {getAssetIcon(tokenSymbol)}
            </div>
            <div>
              <h3 className="heading_text text-white" style={{
                fontSize: '18px',
                marginBottom: '5px',
                fontFamily: 'var(--font-heading)'
              }}>
                {vault.title || `${tokenSymbol} Commitment Vault`}
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                margin: '0 0 5px 0'
              }}>
                {conditionDisplay} • {tokenSymbol} Token
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* Claim/Withdraw Button - Available when conditions are met */}
            {vault.canWithdraw && vault.status?.name !== 'WITHDRAWN' && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleWithdraw()
                }}
                disabled={isWithdrawing || isLoading}
                className="vault-action-button vault-claim-button"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: isWithdrawing || isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  opacity: isWithdrawing || isLoading ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isWithdrawing && !isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Download size={14} />
                {isWithdrawing || isLoading ? 'Claiming...' : 'Claim Funds'}
              </button>
            )}

            {/* Emergency Withdraw Button - Available for active vaults */}
            {vault.canEmergencyWithdraw && !vault.canWithdraw && vault.status?.name === 'ACTIVE' && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleEmergencyWithdraw()
                }}
                disabled={isWithdrawing || isLoading}
                className="vault-action-button vault-emergency-button"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: isWithdrawing || isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  opacity: isWithdrawing || isLoading ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isWithdrawing && !isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
              >
                <AlertTriangle size={14} />
                {isWithdrawing || isLoading ? 'Processing...' : 'Emergency Exit'}
              </button>
            )}

            {/* Status Display - Shows current vault state */}
            {vault.status?.name === 'WITHDRAWN' && (
              <div
                className="vault-status-badge vault-status-completed"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                }}
              >
                <Download size={14} />
                Funds Claimed
              </div>
            )}

            {vault.status?.name === 'ACTIVE' && !vault.canWithdraw && !vault.canEmergencyWithdraw && (
              <div
                className="vault-status-badge vault-status-locked"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.3), rgba(75, 85, 99, 0.3))',
                  color: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(107, 114, 128, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                <Clock size={14} />
                Commitment Active
              </div>
            )}

            {vault.status?.name === 'UNLOCKED' && !vault.canWithdraw && (
              <div
                className="vault-status-badge vault-status-ready"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                }}
              >
                <Clock size={14} />
                Ready to Claim
              </div>
            )}
          </div>
        </div>

        {/* Vault Details */}
        <div style={{ marginBottom: '10px' }}>
          <div
            className="vault-details-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginBottom: '10px'
            }}
          >
            <div>
              <p style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '12px',
                margin: '0 0 5px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Locked Amount
              </p>
              <p className="text-white" style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {isPrivate ? '••••' : amountFormatted}
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: getAssetColor(tokenSymbol),
                  textTransform: 'uppercase'
                }}>
                  {tokenSymbol}
                </span>
              </p>
            </div>

            <div>
              <p style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '12px',
                margin: '0 0 5px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Current Value
              </p>
              <p className="text-white" style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: '0 0 3px 0'
              }}>
                {isPrivate ? '••••••' : (
                  tokenPrice && !isPrivate
                    ? `$${(parseFloat(amountFormatted) * tokenPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : amountUsd ? `$${amountUsd.toLocaleString()}` : 'Loading...'
                )}
              </p>
              {formattedPrice && !isPrivate && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '11px'
                  }}>
                    {formattedPrice}
                  </span>
                  {change24h && (
                    <span style={{
                      color: change24h.color,
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: `${change24h.color}20`
                    }}>
                      {change24h.formatted}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div>
              <p style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '12px',
                margin: '0 0 5px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {vault.conditionType?.name?.includes('PRICE') ? 'Price Targets' : 'Unlock Time'}
              </p>

              {vault.conditionType?.name?.includes('PRICE') ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {/* Price Up Target */}
                  {vault.priceUp && Number(vault.priceUp.formatted) > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        color: '#10B981',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        ↗ {vault.priceUp.usd}
                      </span>
                      <span style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '11px'
                      }}>
                        (up)
                      </span>
                    </div>
                  )}

                  {/* Price Down Target */}
                  {vault.priceDown && Number(vault.priceDown.formatted) > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        color: '#EF4444',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        ↘ {vault.priceDown.usd}
                      </span>
                      <span style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '11px'
                      }}>
                        (down)
                      </span>
                    </div>
                  )}

                  {/* Legacy Target Price (fallback) */}
                  {(!vault.priceUp || Number(vault.priceUp.formatted) === 0) &&
                   (!vault.priceDown || Number(vault.priceDown.formatted) === 0) &&
                   targetPriceUsd && (
                    <span style={{
                      color: '#8B5CF6',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {targetPriceUsd}
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-white" style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    {isUnlocked ? '🔓 Unlocked!' : timeRemaining}
                  </p>
                  {!isUnlocked && unlockTimeFormatted && (
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '12px',
                      margin: '2px 0 0 0'
                    }}>
                      {unlockTimeFormatted}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <p style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '12px',
                margin: '0 0 5px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Created
              </p>
              <p className="text-white" style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0
              }}>
                {createdAtFormatted}
              </p>
            </div>
          </div>

          {/* Progress Section */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <p style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '12px',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Progress
              </p>
              <p className="text-white" style={{
                fontSize: '14px',
                fontWeight: '600',
                margin: 0
              }}>
                {realTimeProgress}%
              </p>
            </div>
            <div
              className="vault-progress-bar"
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${realTimeProgress}%`,
                  height: '100%',
                  background: isUnlocked 
                    ? 'linear-gradient(90deg, #10b981, #059669)' 
                    : 'linear-gradient(90deg, var(--bs-primary), var(--bs-secondary))',
                  borderRadius: '3px',
                  transition: 'width 1s ease-out'
                }}
              />
            </div>
          </div>

          {/* Status and Condition */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                className="vault-status-indicator"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: statusColor
                }}
              />
              <span style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)',
                textTransform: 'capitalize'
              }}>
                {statusDisplay}
              </span>
            </div>

            {vault.conditionType?.name === 'TIME_ONLY' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px'
              }}>
                <span>⏰</span>
                <span>Time Lock</span>
              </div>
            )}
          </div>
        </div>

        {/* Commitment Message Section */}
        {vault.message && vault.message.trim() && (
          <div
            className="vault-message-box"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderLeft: `4px solid ${getAssetColor(tokenSymbol)}`,
              borderRadius: '8px',
              padding: '12px',
              marginTop: 'auto'
            }}
          >
            <p style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '11px',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Commitment Message:
            </p>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '13px',
              margin: 0,
              lineHeight: '1.4',
              fontStyle: 'italic'
            }}>
              "{vault.message}"
            </p>
          </div>
        )}
        </div>
      </div>

      {/* Enhanced Loading Overlay for Vault Operations */}
      <VaultOperationLoader
        isVisible={isWithdrawing || isEmergencyWithdrawing}
        operation={isEmergencyWithdrawing ? 'emergency-withdraw' : 'withdraw'}
        vaultId={vault.id}
        amount={amountFormatted}
        tokenSymbol={tokenSymbol}
        status={operationStatus}
        txHash={hookTxHash || undefined}
        onClose={() => {
          setIsWithdrawing(false)
          setIsEmergencyWithdrawing(false)
        }}
        estimatedTime={isEmergencyWithdrawing ? 45 : 30}
      />
    </motion.div>
  )
}