// src/components/dashboard/cards/VaultsAnalysisCard.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, TrendingUp, Users, Shield, Brain, AlertCircle } from 'lucide-react'
import type { VaultsAnalysisData } from '../../../services/vaultsAnalysisService'
import { formatSuccessRate, formatMarketSentiment } from '../../../services/vaultsAnalysisService'
import { formatCurrency } from '../../../utils/formatters'

interface VaultsAnalysisCardProps {
  data: VaultsAnalysisData | null
  isLoading?: boolean
  error?: string | null
  onRefresh?: () => void
  delay?: number
}

export const VaultsAnalysisCard: React.FC<VaultsAnalysisCardProps> = ({
  data,
  isLoading = false,
  error = null,
  onRefresh,
  delay = 0
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
        className="ico_iconbox_block"
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '1.5rem'
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <AlertCircle className="text-danger me-2" style={{ width: '1.5rem', height: '1.5rem' }} />
            <h3 className="text-white mb-0" style={{ fontSize: '1.2rem', fontWeight: '600' }}>
              AI Analysis Error
            </h3>
          </div>
          {onRefresh && (
            <button onClick={onRefresh} className="compact-action-btn">
              <span className="btn_wrapper">
                <RefreshCw style={{ width: '1rem', height: '1rem' }} />
                <span>Retry</span>
              </span>
            </button>
          )}
        </div>
        <p className="text-gray mb-0" style={{ opacity: '0.8' }}>
          {error}
        </p>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
        className="ico_iconbox_block"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1.5rem'
        }}
      >
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '200px' }}>
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-3"
            >
              <Brain className="text-purple-400" style={{ width: '2rem', height: '2rem' }} />
            </motion.div>
            <h4 className="text-white mb-2">Analyzing Vault Patterns</h4>
            <p className="text-gray mb-0" style={{ opacity: '0.7' }}>
              AI agents are processing community vault data...
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (!data && !isLoading && !error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
        className="ico_iconbox_block"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}
      >
        <div className="d-flex align-items-center justify-content-center mb-3">
          <Brain className="text-purple-400 me-2" style={{ width: '2rem', height: '2rem' }} />
          <h4 className="text-white mb-0">AI Community Analysis</h4>
        </div>
        <p className="text-gray mb-3" style={{ opacity: '0.8' }}>
          Get AI-powered insights on community vault patterns and behaviors
        </p>
        {onRefresh && (
          <button onClick={onRefresh} className="ico_creative_btn">
            <span className="btn_wrapper">
              <Brain style={{ width: '1rem', height: '1rem' }} />
              <span>Load Analysis</span>
            </span>
          </button>
        )}
      </motion.div>
    )
  }

  if (!data) {
    return null
  }

  const successRateFormat = formatSuccessRate(data.successRate)
  const marketSentimentFormat = formatMarketSentiment(data.marketData?.sentiment || 'neutral')

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="ico_iconbox_block"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(111, 66, 193, 0.3)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        padding: '1.5rem'
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div
            className="me-3 d-flex align-items-center justify-content-center"
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, rgba(111, 66, 193, 0.2), rgba(157, 91, 232, 0.2))',
              borderRadius: '12px',
              border: '1px solid rgba(111, 66, 193, 0.3)'
            }}
          >
            <Brain className="text-purple-400" style={{ width: '1.5rem', height: '1.5rem' }} />
          </div>
          <div>
            <h3 className="text-white mb-1" style={{ fontSize: '1.3rem', fontWeight: '600' }}>
              AI Community Insights
            </h3>
            <p className="text-gray mb-0" style={{ fontSize: '0.85rem', opacity: '0.8' }}>
              {data.character} • {data.totalVaults} vaults analyzed
            </p>
          </div>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="compact-action-btn"
            disabled={isLoading}
          >
            <span className="btn_wrapper">
              <RefreshCw className={isLoading ? 'rotating' : ''} style={{ width: '1rem', height: '1rem' }} />
              <span>Refresh</span>
            </span>
          </button>
        )}
      </div>

      {/* Key Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center mb-1">
              <Users className="text-blue-400 me-1" style={{ width: '1rem', height: '1rem' }} />
              <span className="text-white fw-bold" style={{ fontSize: '1.2rem' }}>
                {data.totalVaults}
              </span>
            </div>
            <p className="text-gray mb-0" style={{ fontSize: '0.75rem', opacity: '0.7' }}>
              Total Vaults
            </p>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center mb-1">
              <span className="me-1" style={{ fontSize: '1rem' }}>{successRateFormat.emoji}</span>
              <span className="text-white fw-bold" style={{ fontSize: '1.2rem' }}>
                {data.successRate}%
              </span>
            </div>
            <p className="text-gray mb-0" style={{ fontSize: '0.75rem', opacity: '0.7' }}>
              Success Rate
            </p>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center mb-1">
              <Shield className="text-green-400 me-1" style={{ width: '1rem', height: '1rem' }} />
              <span className="text-white fw-bold" style={{ fontSize: '1.2rem' }}>
                {formatCurrency(data.totalValueLocked, false)}
              </span>
            </div>
            <p className="text-gray mb-0" style={{ fontSize: '0.75rem', opacity: '0.7' }}>
              Total Locked
            </p>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center mb-1">
              <span className="me-1" style={{ fontSize: '1rem' }}>{marketSentimentFormat.emoji}</span>
              <span className="text-white fw-bold" style={{ fontSize: '1.2rem' }}>
                {data.marketData?.fearGreedIndex || 50}
              </span>
            </div>
            <p className="text-gray mb-0" style={{ fontSize: '0.75rem', opacity: '0.7' }}>
              Fear & Greed
            </p>
          </div>
        </div>
      </div>

      {/* Insights Sections */}
      <div className="space-y-3">
        {/* Common Patterns */}
        {data.commonPatterns.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('patterns')}
              className="w-100 d-flex justify-content-between align-items-center p-3 rounded"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer'
              }}
            >
              <div className="d-flex align-items-center">
                <TrendingUp className="text-blue-400 me-2" style={{ width: '1rem', height: '1rem' }} />
                <span className="text-white fw-medium">Common Patterns ({data.commonPatterns.length})</span>
              </div>
              <span className="text-gray">{expandedSection === 'patterns' ? '−' : '+'}</span>
            </button>

            {expandedSection === 'patterns' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 p-3 rounded"
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}
              >
                {data.commonPatterns.map((pattern, index) => (
                  <div key={index} className="d-flex align-items-start mb-2">
                    <span className="text-blue-400 me-2" style={{ fontSize: '0.8rem' }}>•</span>
                    <span className="text-gray" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                      {pattern}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('recommendations')}
              className="w-100 d-flex justify-content-between align-items-center p-3 rounded"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer'
              }}
            >
              <div className="d-flex align-items-center">
                <Brain className="text-purple-400 me-2" style={{ width: '1rem', height: '1rem' }} />
                <span className="text-white fw-medium">AI Recommendations ({data.recommendations.length})</span>
              </div>
              <span className="text-gray">{expandedSection === 'recommendations' ? '−' : '+'}</span>
            </button>

            {expandedSection === 'recommendations' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 p-3 rounded"
                style={{
                  background: 'rgba(147, 51, 234, 0.1)',
                  border: '1px solid rgba(147, 51, 234, 0.2)'
                }}
              >
                {data.recommendations.map((recommendation, index) => (
                  <div key={index} className="d-flex align-items-start mb-2">
                    <span className="text-purple-400 me-2" style={{ fontSize: '0.8rem' }}>💡</span>
                    <span className="text-gray" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                      {recommendation}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* Risk Insights */}
        {data.riskInsights.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('risks')}
              className="w-100 d-flex justify-content-between align-items-center p-3 rounded"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer'
              }}
            >
              <div className="d-flex align-items-center">
                <AlertCircle className="text-orange-400 me-2" style={{ width: '1rem', height: '1rem' }} />
                <span className="text-white fw-medium">Risk Insights ({data.riskInsights.length})</span>
              </div>
              <span className="text-gray">{expandedSection === 'risks' ? '−' : '+'}</span>
            </button>

            {expandedSection === 'risks' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 p-3 rounded"
                style={{
                  background: 'rgba(251, 146, 60, 0.1)',
                  border: '1px solid rgba(251, 146, 60, 0.2)'
                }}
              >
                {data.riskInsights.map((insight, index) => (
                  <div key={index} className="d-flex align-items-start mb-2">
                    <span className="text-orange-400 me-2" style={{ fontSize: '0.8rem' }}>⚠️</span>
                    <span className="text-gray" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                      {insight}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Footer with timestamp */}
      <div className="mt-4 pt-3 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-gray" style={{ fontSize: '0.75rem', opacity: '0.6' }}>
            Market Context: {marketSentimentFormat.emoji} {marketSentimentFormat.label}
          </span>
          <span className="text-gray" style={{ fontSize: '0.75rem', opacity: '0.6' }}>
            Updated: {data.marketData?.timestamp ? new Date(data.marketData.timestamp).toLocaleTimeString() : 'N/A'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}