import React from 'react'
import { motion } from 'framer-motion'
import '../../../styles/vault-cards.css'

interface VaultCardProps {
  vault: {
    id: number
    asset: string
    amount: number
    value: number
    condition: string
    target: string
    progress: number
    status: string
    createdAt: string
    aiScore: number
    message: string
  }
  isPrivate?: boolean
  onClick?: () => void
  delay?: number
}

export const VaultCard: React.FC<VaultCardProps> = ({
  vault,
  isPrivate = false,
  onClick,
  delay = 0
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981'
      case 'completed':
        return '#3B82F6'
      case 'pending':
        return '#F59E0B'
      default:
        return '#EF4444'
    }
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
          aria-label={`${vault.asset} Vault - ${vault.condition}`}
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
                background: `linear-gradient(135deg, ${getAssetColor(vault.asset)}20, ${getAssetColor(vault.asset)}40)`,
                border: `2px solid ${getAssetColor(vault.asset)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: getAssetColor(vault.asset)
              }}
            >
              {getAssetIcon(vault.asset)}
            </div>
            <div>
              <h3 className="heading_text text-white" style={{
                fontSize: '20px',
                marginBottom: '5px',
                fontFamily: 'var(--font-heading)'
              }}>
                {vault.asset} Vault
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                margin: 0
              }}>
                {vault.condition}
              </p>
            </div>
          </div>

          <div
            className="vault-ai-score"
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              background: vault.aiScore >= 80 ? 'rgba(16, 185, 129, 0.2)' :
                         vault.aiScore >= 60 ? 'rgba(245, 158, 11, 0.2)' :
                         'rgba(239, 68, 68, 0.2)',
              color: vault.aiScore >= 80 ? '#10B981' :
                     vault.aiScore >= 60 ? '#F59E0B' :
                     '#EF4444',
              border: `1px solid ${vault.aiScore >= 80 ? '#10B981' :
                                  vault.aiScore >= 60 ? '#F59E0B' :
                                  '#EF4444'}40`
            }}
          >
            AI Score: {vault.aiScore}
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
                Amount
              </p>
              <p className="text-white" style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0
              }}>
                {isPrivate ? '••••' : vault.amount} {vault.asset}
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
                Value
              </p>
              <p className="text-white" style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0
              }}>
                {isPrivate ? '••••••' : `$${vault.value.toLocaleString()}`}
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
                Target
              </p>
              <p className="text-white" style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0
              }}>
                {vault.target}
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
                Created
              </p>
              <p className="text-white" style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0
              }}>
                {formatDate(vault.createdAt)}
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
                {vault.progress}%
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
                  width: `${vault.progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--bs-primary), var(--bs-secondary))',
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
                  backgroundColor: getStatusColor(vault.status)
                }}
              />
              <span style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)',
                textTransform: 'capitalize'
              }}>
                {vault.status}
              </span>
            </div>

            {vault.condition === 'Time Lock' && (
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

        {/* Message Section */}
        <div
          className="vault-message-box"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderLeft: `4px solid var(--bs-primary)`,
            borderRadius: '8px',
            padding: '10px',
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
            Message from past you:
          </p>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            fontStyle: 'italic',
            margin: 0,
            lineHeight: '1.4'
          }}>
            "{vault.message}"
          </p>
        </div>
        </div>
      </div>
    </motion.div>
  )
}