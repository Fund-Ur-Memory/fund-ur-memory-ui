// src/components/dashboard/tabs/OverviewTab.tsx - Final fixed version with proper icon types
import React from 'react'
import { TrendingUp, DollarSign, Shield, Brain } from 'lucide-react'
import { MetricCard } from '../cards/MetricCard'
import { type DashboardData } from '../../../types/dashboard'
import { motion } from 'framer-motion'
import { type AIRecommendation, type Transaction } from '../../../types/dashboard'
import { getPriorityIcon } from '../../../utils/helpers'
import { formatDate } from '../../../utils/formatters'

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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <div 
        className="ico_iconbox_block p-4"
        style={{
          background: getTypeColor(recommendation.type),
          border: getTypeBorder(recommendation.type)
        }}
      >
        <div className="d-flex align-items-start mb-3">
          <div 
            className="me-3 d-flex align-items-center justify-content-center"
            style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              fontSize: '1.2rem'
            }}
          >
            {getTypeIcon(recommendation.type)}
          </div>
          
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="text-white mb-0">{recommendation.title}</h5>
              <span style={{ fontSize: '1.2rem' }}>
                {getPriorityIcon(recommendation.priority)}
              </span>
            </div>
            
            <p className="text-gray mb-3 small">{recommendation.description}</p>
            
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2">
                {onAction && (
                  <button
                    onClick={onAction}
                    className="btn btn-light btn-sm"
                  >
                    {recommendation.action}
                  </button>
                )}
                
                {onLearnMore && (
                  <button 
                    onClick={onLearnMore}
                    className="btn btn-outline-light btn-sm"
                  >
                    Learn More →
                  </button>
                )}
              </div>
              
              <div className="text-end">
                <div className={`small mb-1 ${
                  recommendation.priority === 'high' ? 'text-danger' :
                  recommendation.priority === 'medium' ? 'text-warning' :
                  'text-success'
                }`}>
                  ● {recommendation.priority}
                </div>
                <span className="text-muted small">
                  {recommendation.confidence}% confidence
                </span>
              </div>
            </div>
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
    <div className="ico_iconbox_block p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="iconbox_title text-white mb-0">Recent Activity</h3>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="btn btn-outline-light btn-sm"
          >
            View All →
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
            className="d-flex justify-content-between align-items-center p-3 mb-3"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="d-flex align-items-center">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(111, 66, 193, 0.2)',
                  borderRadius: '8px',
                  fontSize: '1.2rem'
                }}
              >
                {getTransactionIcon(tx.type)}
              </div>
              <div>
                <h6 className="text-white mb-1">
                  {getTransactionLabel(tx.type)}
                </h6>
                <p className="text-gray mb-0 small">{tx.conditions || 'No conditions'}</p>
              </div>
            </div>
            
            <div className="text-end">
              <p className="text-white mb-1 fw-bold">
                {isPrivate ? '••••' : tx.amount} {tx.asset}
              </p>
              <p className="text-gray mb-1 small">
                {formatDate(tx.date)}
              </p>
              <div className="d-flex align-items-center justify-content-end">
                <span className="me-2">{getStatusIcon(tx.status)}</span>
                <span className="small text-gray">
                  {tx.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {transactions.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <p className="text-gray">No recent activity</p>
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

  return (
    <div>
      {/* Portfolio Summary Section */}
      <section className="section_space pb-0">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="row justify-content-center mb-4"
          >
            <div className="col-lg-10">
              <div className="ico_heading_block text-center">
                <h2 className="heading_text mb-0 text-white">Portfolio Overview</h2>
                <p className="text-gray mt-3">Your comprehensive wealth management dashboard</p>
              </div>
            </div>
          </motion.div>

          {/* Metric Cards */}
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="row">
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
                  subtitle="3 expiring soon"
                />
                
                <MetricCard
                  title="Total Returns"
                  value={profile.totalReturns}
                  change={12.4}
                  icon={TrendingUp}
                  iconColor="text-blue-400"
                  isPrivate={isPrivacyMode}
                  delay={0.2}
                />
                
                <MetricCard
                  title="Success Rate"
                  value={`${profile.successRate}%`}
                  icon={Brain}
                  iconColor="text-green-400"
                  delay={0.3}
                  subtitle="Above average"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="section_space pb-0">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="row justify-content-center"
          >
            <div className="col-lg-10">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="heading_text text-white mb-0">AI Recommendations</h3>
                <button 
                  className="btn btn-outline-light btn-sm"
                  onClick={() => console.log('View all recommendations')}
                >
                  View All
                </button>
              </div>
              
              <div className="row">
                {aiInsights.recommendations.slice(0, 2).map((rec, index) => (
                  <div key={rec.id} className="col-lg-6 mb-4">
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

      {/* Recent Activity Section */}
      <section className="section_space">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="row justify-content-center"
          >
            <div className="col-lg-10">
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