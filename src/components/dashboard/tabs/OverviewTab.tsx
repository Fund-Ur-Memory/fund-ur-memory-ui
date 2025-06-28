// src/components/dashboard/tabs/OverviewTab.tsx - Final fixed version with proper icon types
import React from 'react'
import { TrendingUp, DollarSign, Shield, Brain } from 'lucide-react'
import { MetricCard } from '../cards/MetricCard'
import { type DashboardData } from '../../../types/dashboard'
import { motion } from 'framer-motion'
import { type AIRecommendation, type Transaction } from '../../../types/dashboard'
import { getPriorityIcon } from '../../../utils/helpers'
import { formatDate } from '../../../utils/formatters'
import { useGetVaults } from '../../../hooks/contracts/useGetVaults'
import { useAccount } from 'wagmi'
import '../../../styles/header-compact.css'

interface OverviewTabProps {
  data: DashboardData
  isPrivacyMode: boolean
  onRefetch: () => void
}

// Local AI Recommendation Card component to avoid conflicts
const OverviewAIRecommendationCard: React.FC<{
  recommendation: AIRecommendation
  onAction?: () => void
  onLearnMore?: () => void
  delay?: number
}> = ({
  recommendation,
  onAction,
  onLearnMore,
  delay = 0
}) => {
  const getTypeIcon = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'opportunity': return '📈'
      case 'warning': return '⚠️'
      case 'suggestion': return '💡'
      default: return '🤖'
    }
  }

  const getTypeColor = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'opportunity': return 'rgba(34, 197, 94, 0.2)'
      case 'warning': return 'rgba(239, 68, 68, 0.2)'
      case 'suggestion': return 'rgba(59, 130, 246, 0.2)'
      default: return 'rgba(156, 163, 175, 0.2)'
    }
  }

  const getTypeBorder = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'opportunity': return '1px solid rgba(34, 197, 94, 0.3)'
      case 'warning': return '1px solid rgba(239, 68, 68, 0.3)'
      case 'suggestion': return '1px solid rgba(59, 130, 246, 0.3)'
      default: return '1px solid rgba(156, 163, 175, 0.3)'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="h-100"
    >
      <div
        className="ico_iconbox_block h-100"
        style={{
          background: getTypeColor(recommendation.type),
          border: getTypeBorder(recommendation.type),
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          padding: '1.25rem',
          minHeight: '180px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(111, 66, 193, 0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div className="d-flex align-items-start mb-4">
          <div
            className="me-3 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
              borderRadius: '12px',
              fontSize: '1.4rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {getTypeIcon(recommendation.type)}
          </div>

          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h5 className="text-white mb-0" style={{ fontSize: '1.2rem', fontWeight: '600', lineHeight: '1.3' }}>
                {recommendation.title}
              </h5>
              <div
                className="d-flex align-items-center px-2 py-1 rounded-pill ms-2"
                style={{
                  background: recommendation.priority === 'high' ? 'rgba(239, 68, 68, 0.15)' :
                             recommendation.priority === 'medium' ? 'rgba(245, 158, 11, 0.15)' :
                             'rgba(16, 185, 129, 0.15)',
                  border: `1px solid ${
                    recommendation.priority === 'high' ? 'rgba(239, 68, 68, 0.3)' :
                    recommendation.priority === 'medium' ? 'rgba(245, 158, 11, 0.3)' :
                    'rgba(16, 185, 129, 0.3)'
                  }`,
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}
              >
                <span className="me-1">{getPriorityIcon(recommendation.priority)}</span>
                <span className={
                  recommendation.priority === 'high' ? 'text-danger' :
                  recommendation.priority === 'medium' ? 'text-warning' :
                  'text-success'
                }>
                  {recommendation.priority}
                </span>
              </div>
            </div>

            <p className="text-gray mb-4" style={{ fontSize: '0.9rem', opacity: '0.8', lineHeight: '1.5' }}>
              {recommendation.description}
            </p>

            <div className="d-flex flex-wrap gap-2">
              {onAction && (
                <button
                  onClick={onAction}
                  className={`${recommendation.action.toLowerCase().includes('vault') ? 'large-action-btn' : 'compact-action-btn'} flex-grow-1`}
                >
                  <span className="btn_wrapper">
                    {recommendation.action.toLowerCase().includes('vault') && (
                      <span className="btn_icon_left">
                        <small className="dot_top"></small>
                        <small className="dot_bottom"></small>
                        <svg className="icon_arrow_left" viewBox="0 0 28 23" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.4106 20.8083L5.36673 12.6878C5.26033 12.5804 5.11542 12.52 4.96423 12.52H1.84503C1.34158 12.52 1.08822 13.1276 1.44252 13.4852L9.48642 21.6057C9.59281 21.7131 9.73773 21.7736 9.88892 21.7736H13.0081C13.5116 21.7736 13.7649 21.166 13.4106 20.8083Z" />
                          <path d="M12.6803 9.57324H24.71C25.7116 9.57324 26.5234 10.3851 26.5234 11.3866C26.5234 12.3882 25.7116 13.2 24.71 13.2H12.6803C11.6788 13.2 10.8669 12.3882 10.8669 11.3866C10.8669 10.3851 11.6788 9.57324 12.6803 9.57324Z" />
                          <path d="M1.44252 9.28834L9.48641 1.16784C9.59281 1.06043 9.73772 1 9.88891 1H13.0081C13.5116 1 13.7649 1.60758 13.4106 1.96525L5.36672 10.0858C5.26033 10.1932 5.11541 10.2536 4.96422 10.2536H1.84502C1.34158 10.2536 1.08822 9.64601 1.44252 9.28834Z" />
                        </svg>
                      </span>
                    )}
                    <span className="btn_label">{recommendation.action}</span>
                    {recommendation.action.toLowerCase().includes('vault') && (
                      <span className="btn_icon_right">
                        <small className="dot_top"></small>
                        <small className="dot_bottom"></small>
                        <svg className="icon_arrow_right" viewBox="0 0 27 23" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.4106 1.96525L5.36672 10.0858C5.26033 10.1932 5.11541 10.2536 4.96422 10.2536H1.84502C1.34158 10.2536 1.08822 9.64601 1.44252 9.28834L9.48641 1.16784C9.59281 1.06043 9.73772 1 9.88891 1H13.0081C13.5116 1 13.7649 1.60758 13.4106 1.96525Z" />
                          <path d="M12.6803 13.2H24.71C25.7116 13.2 26.5234 12.3882 26.5234 11.3866C26.5234 10.3851 25.7116 9.57324 24.71 9.57324H12.6803C11.6788 9.57324 10.8669 10.3851 10.8669 11.3866C10.8669 12.3882 11.6788 13.2 12.6803 13.2Z" />
                          <path d="M1.44252 13.4852L9.48642 21.6057C9.59281 21.7131 9.73773 21.7736 9.88892 21.7736H13.0081C13.5116 21.7736 13.7649 21.166 13.4106 20.8083L5.36673 12.6878C5.26033 12.5804 5.11542 12.52 4.96423 12.52H1.84503C1.34158 12.52 1.08822 13.1276 1.44252 13.4852Z" />
                        </svg>
                      </span>
                    )}
                  </span>
                </button>
              )}

              {onLearnMore && (
                <button
                  onClick={onLearnMore}
                  className="compact-action-btn outline"
                >
                  <span className="btn_wrapper">
                    <span className="btn_label">Learn More →</span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-3">
          <div className="text-end">
            <span className="text-muted" style={{ fontSize: '0.8rem', opacity: '0.6' }}>
              {recommendation.confidence}% confidence
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Local Activity Card component to avoid conflicts
const OverviewActivityCard: React.FC<{
  transactions: Transaction[]
  isPrivate?: boolean
  onViewAll?: () => void
  maxItems?: number
}> = ({
  transactions,
  isPrivate = false,
  onViewAll,
  maxItems = 3
}) => {
  const displayTransactions = transactions.slice(0, maxItems)

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'vault_create': return '🔒'
      case 'vault_execute': return '✅'
      case 'cross_chain_transfer': return '🌉'
      case 'swap': return '🔄'
      default: return '📄'
    }
  }

  const getTransactionLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'vault_create': return 'Vault Created'
      case 'vault_execute': return 'Vault Executed'
      case 'cross_chain_transfer': return 'Cross-Chain Transfer'
      case 'swap': return 'Token Swap'
      default: return 'Transaction'
    }
  }

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return '🟢'
      case 'active': return '🔵'
      case 'pending': return '🟡'
      case 'failed': return '🔴'
      default: return '⚪'
    }
  }

  return (
    <div
      className="ico_iconbox_block"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        padding: '1.25rem'
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="iconbox_title text-white mb-1" style={{ fontSize: '1.3rem', fontWeight: '600' }}>
            Recent Activity
          </h3>
          <p className="text-gray mb-0" style={{ fontSize: '0.85rem', opacity: '0.8' }}>
            Latest transactions and updates
          </p>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="compact-action-btn"
          >
            <span className="btn_wrapper">
              <span className="btn_label">View All →</span>
            </span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {displayTransactions.map((tx, index) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="d-flex justify-content-between align-items-center p-3 mb-2"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
              e.currentTarget.style.transform = 'translateX(4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              e.currentTarget.style.transform = 'translateX(0)'
            }}
          >
            <div className="d-flex align-items-center">
              <div
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, rgba(111, 66, 193, 0.2), rgba(157, 91, 232, 0.2))',
                  borderRadius: '12px',
                  fontSize: '1.3rem',
                  border: '1px solid rgba(111, 66, 193, 0.3)'
                }}
              >
                {getTransactionIcon(tx.type)}
              </div>
              <div>
                <h6 className="text-white mb-1" style={{ fontSize: '1rem', fontWeight: '600' }}>
                  {getTransactionLabel(tx.type)}
                </h6>
                <p className="text-gray mb-0" style={{ fontSize: '0.85rem', opacity: '0.8' }}>
                  {tx.conditions || 'No conditions'}
                </p>
              </div>
            </div>

            <div className="text-end">
              <p className="text-white mb-1 fw-bold" style={{ fontSize: '1rem' }}>
                {isPrivate ? '••••' : tx.amount} {tx.asset}
              </p>
              <p className="text-gray mb-2" style={{ fontSize: '0.85rem', opacity: '0.7' }}>
                {formatDate(tx.date)}
              </p>
              <div className="d-flex align-items-center justify-content-end">
                <div
                  className="d-flex align-items-center px-2 py-1 rounded-pill"
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    fontSize: '0.8rem'
                  }}
                >
                  <span className="me-1">{getStatusIcon(tx.status)}</span>
                  <span className="text-success" style={{ fontWeight: '500' }}>
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: '0.6' }}>📝</div>
          <h5 className="text-white mb-2">No Recent Activity</h5>
          <p className="text-gray" style={{ opacity: '0.7' }}>
            Your transactions will appear here once you start using F.U.M
          </p>
        </div>
      )}
    </div>
  )
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  isPrivacyMode
}) => {
  const { profile, portfolio, transactions, aiInsights } = data
  
  // Log data for debugging (can be removed in production)
  console.log('📊 OverviewTab data:', {
    totalValue: portfolio.totalValue,
    activeVaults: profile.activeVaults,
    totalReturns: profile.totalReturns,
    successRate: profile.successRate
  })
  
  // Get real vault data for dynamic subtitles
  const { address } = useAccount()
  const { vaults: contractVaults } = useGetVaults(address as `0x${string}`)
  
  // Calculate dynamic metrics for subtitles
  const expiringVaults = contractVaults.filter(vault => {
    if (!vault.unlockTime?.date) return false
    const daysUntilExpiry = Math.ceil((vault.unlockTime.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }).length
  
  const portfolioChangeLabel = portfolio.change24h >= 0 ? 'gaining' : 'declining'
  const successRateLabel = profile.successRate >= 80 ? 'Excellent' : 
                          profile.successRate >= 60 ? 'Good' : 
                          profile.successRate >= 40 ? 'Fair' : 'Needs improvement'

  return (
    <div>
      {/* Portfolio Summary Section - Compact */}
      <section style={{ paddingTop: '1rem', paddingBottom: '1.5rem' }}>
        <div className="container">
          {/* Metric Cards - Compact Layout */}
          <div className="row g-3">
            <MetricCard
              title="Total Portfolio"
              value={portfolio.totalValue}
              change={portfolio.change24h}
              icon={DollarSign}
              iconColor="text-green-400"
              isPrivate={isPrivacyMode}
              delay={0}
            />

            <MetricCard
              title="Active Vaults"
              value={profile.activeVaults}
              icon={Shield}
              iconColor="text-white"
              delay={0.1}
              subtitle={expiringVaults > 0 ? `${expiringVaults} expiring soon` : 'All on track'}
            />

            <MetricCard
              title="Total Returns"
              value={`${profile.totalReturns.toFixed(1)}%`}
              change={profile.totalReturns}
              icon={TrendingUp}
              iconColor="text-blue-400"
              isPrivate={isPrivacyMode}
              delay={0.2}
              subtitle={portfolioChangeLabel}
            />

            <MetricCard
              title="Success Rate"
              value={`${profile.successRate}%`}
              icon={Brain}
              iconColor="text-green-400"
              delay={0.3}
              subtitle={successRateLabel}
            />
          </div>
        </div>
      </section>

      {/* AI Recommendations Section - Compact */}
      <section style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="row justify-content-center"
          >
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="heading_text text-white mb-1" style={{ fontSize: '1.4rem', fontWeight: '600' }}>
                    AI Recommendations
                  </h3>
                  <p className="text-gray mb-0" style={{ opacity: '0.8', fontSize: '0.9rem' }}>
                    Personalized insights
                  </p>
                </div>
                <button
                  className="compact-action-btn"
                  onClick={() => console.log('View all recommendations')}
                >
                  <span className="btn_wrapper">
                    <span className="btn_label">View All →</span>
                  </span>
                </button>
              </div>

              <div className="row g-3">
                {aiInsights.recommendations.slice(0, 2).map((rec, index) => (
                  <div key={rec.id} className="col-lg-6">
                    <OverviewAIRecommendationCard
                      recommendation={rec}
                      delay={0.6 + index * 0.1}
                      onAction={() => console.log('Execute recommendation:', rec.action)}
                      onLearnMore={() => console.log('Learn more about:', rec.title)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Activity Section - Compact */}
      <section style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="row justify-content-center"
          >
            <div className="col-12">
              <div className="mb-3">
                <h3 className="heading_text text-white mb-1" style={{ fontSize: '1.4rem', fontWeight: '600' }}>
                  Recent Activity
                </h3>
                <p className="text-gray mb-0" style={{ opacity: '0.8', fontSize: '0.9rem' }}>
                  Latest transactions and updates
                </p>
              </div>
              <OverviewActivityCard
                transactions={transactions}
                isPrivate={isPrivacyMode}
                onViewAll={() => console.log('View all transactions')}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}