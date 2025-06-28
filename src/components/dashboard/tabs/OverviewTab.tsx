// src/components/dashboard/tabs/OverviewTab.tsx - Final fixed version with proper icon types
import React from 'react'
import { TrendingUp, DollarSign, Shield, Brain } from 'lucide-react'
import { MetricCard } from '../cards/MetricCard'
import { type DashboardData } from '../../../types/dashboard'
import { motion } from 'framer-motion'
import { type Transaction } from '../../../types/dashboard'
import { formatDate } from '../../../utils/formatters'
import { useGetVaults } from '../../../hooks/contracts/useGetVaults'
import { useAccount } from 'wagmi'
import { useVaultsAnalysis } from '../../../hooks/useVaultsAnalysis'
import { VaultsAnalysisCard } from '../cards/VaultsAnalysisCard'
import { useRecentVaultActivity } from '../../../hooks/useIndexerVaults'
import '../../../styles/header-compact.css'

interface OverviewTabProps {
  data: DashboardData
  isPrivacyMode: boolean
  onRefetch: () => void
}

// Local Activity Card component to avoid conflicts
const OverviewActivityCard: React.FC<{
  transactions: Transaction[]
  isPrivate?: boolean
  onViewAll?: () => void
  maxItems?: number
  isLoading?: boolean
  error?: string | null
  onRefresh?: () => void
}> = ({
  transactions,
  isPrivate = false,
  onViewAll,
  maxItems = 3,
  isLoading = false,
  error = null,
  onRefresh
}) => {
  const displayTransactions = transactions.slice(0, maxItems)

  // Show loading state
  if (isLoading) {
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
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-3"
            >
              <span style={{ fontSize: '2rem' }}>🔄</span>
            </motion.div>
            <h5 className="text-white mb-2">Loading Recent Activity</h5>
            <p className="text-gray mb-0" style={{ opacity: '0.7' }}>
              Fetching your latest vault transactions...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div
        className="ico_iconbox_block"
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '1.25rem'
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="text-white mb-1">Recent Activity Error</h5>
            <p className="text-gray mb-0" style={{ opacity: '0.8', fontSize: '0.85rem' }}>
              {error}
            </p>
          </div>
          {onRefresh && (
            <button onClick={onRefresh} className="compact-action-btn">
              <span className="btn_wrapper">
                <span>🔄</span>
                <span>Retry</span>
              </span>
            </button>
          )}
        </div>
      </div>
    )
  }

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

  const handleTransactionClick = (transaction: Transaction) => {
    if (transaction.transactionHash) {
      const explorerUrl = `https://testnet.snowtrace.io/tx/${transaction.transactionHash}`
      window.open(explorerUrl, '_blank', 'noopener,noreferrer')
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
              transition: 'all 0.3s ease',
              cursor: tx.transactionHash ? 'pointer' : 'default'
            }}
            title={tx.transactionHash ? 'Click to view on Snowtrace block explorer' : ''}
            onClick={() => handleTransactionClick(tx)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
              e.currentTarget.style.transform = 'translateX(4px)'
              if (tx.transactionHash) {
                e.currentTarget.style.borderColor = 'rgba(111, 66, 193, 0.3)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              e.currentTarget.style.transform = 'translateX(0)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
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
              <div className="d-flex align-items-center justify-content-end mb-1">
                <p className="text-white mb-0 fw-bold me-2" style={{ fontSize: '1rem' }}>
                  {isPrivate ? '••••' : tx.amount} {tx.asset}
                </p>
                {tx.transactionHash && (
                  <span className="text-gray" style={{ fontSize: '0.7rem', opacity: '0.6' }}>
                    🔗
                  </span>
                )}
              </div>
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
  const { profile, portfolio, transactions } = data
  
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
  
  // Get AI vaults analysis
  const { 
    data: vaultsAnalysis, 
    isLoading: isAnalysisLoading, 
    error: analysisError, 
    refetch: refetchAnalysis 
  } = useVaultsAnalysis(false)
  
  // Get real vault activity from indexer
  const {
    transactions: indexerTransactions,
    isLoading: isIndexerLoading,
    error: indexerError,
    refetch: refetchIndexer
  } = useRecentVaultActivity(address, 5)
  
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

      {/* AI Vaults Analysis Section - New */}
      <section style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="row justify-content-center"
          >
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="heading_text text-white mb-1" style={{ fontSize: '1.4rem', fontWeight: '600' }}>
                    Community Vault Analysis
                  </h3>
                  <p className="text-gray mb-0" style={{ opacity: '0.8', fontSize: '0.9rem' }}>
                    AI-powered insights on vault patterns
                  </p>
                </div>
              </div>
              <VaultsAnalysisCard
                data={vaultsAnalysis}
                isLoading={isAnalysisLoading}
                error={analysisError}
                onRefresh={refetchAnalysis}
                delay={0.9}
              />
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
            transition={{ delay: 1.0 }}
            className="row justify-content-center"
          >
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="heading_text text-white mb-1" style={{ fontSize: '1.4rem', fontWeight: '600' }}>
                    Recent Activity
                  </h3>
                  <p className="text-gray mb-0" style={{ opacity: '0.8', fontSize: '0.9rem' }}>
                    {indexerTransactions.length > 0 ? 'Live data from indexer' : 'Latest transactions and updates'}
                  </p>
                </div>
                {indexerTransactions.length > 0 && (
                  <button
                    onClick={refetchIndexer}
                    className="compact-action-btn"
                    disabled={isIndexerLoading}
                  >
                    <span className="btn_wrapper">
                      <span className={isIndexerLoading ? 'rotating' : ''}>🔄</span>
                      <span>Refresh</span>
                    </span>
                  </button>
                )}
              </div>
              <OverviewActivityCard
                transactions={indexerTransactions.length > 0 ? indexerTransactions : transactions}
                isPrivate={isPrivacyMode}
                onViewAll={() => console.log('View all transactions')}
                isLoading={isIndexerLoading}
                error={indexerError}
                onRefresh={refetchIndexer}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}