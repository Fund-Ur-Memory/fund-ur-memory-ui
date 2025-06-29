// src/components/dashboard/tabs/HistoryTab.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { Archive, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import { VaultCard } from '../cards/VaultCard'
import { MetricCard } from '../cards/MetricCard'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { VaultGridSkeleton } from '../common/SkeletonLoader'
import { useGetVaults } from '../../../hooks/contracts/useGetVaults'
import { useIndexerVaults } from '../../../hooks/useIndexerVaults'
import { useAccount } from 'wagmi'
import '../../../styles/header-compact.css'
import '../../../styles/vault-cards.css'
import '../../../styles/enhanced-loading.css'

interface HistoryTabProps {
  isPrivacyMode: boolean
  onRefetch: () => void
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  isPrivacyMode,
  onRefetch: _onRefetch,
}) => {
  // Get connected wallet address
  const { address: connectedAddress, isConnected } = useAccount()

  // Use real vault data from contract for connected user only
  const { vaults: contractVaults, refetch: refetchContract, isLoading: isLoadingVaults } = useGetVaults(connectedAddress)
  
  // Get indexer data for comprehensive history view
  const { 
    vaults: indexerVaults, 
    isLoading: isLoadingIndexer, 
    error: indexerError, 
    refetch: refetchIndexer,
    lastUpdated 
  } = useIndexerVaults(connectedAddress, isConnected)

  // Combine contract and indexer vault data
  const allUserVaults = isConnected ? contractVaults : []

  // Filter to show only NON-ACTIVE vaults in the History tab
  const historyVaults = allUserVaults.filter(v =>
    v.status?.name === 'UNLOCKED' ||
    v.status?.name === 'WITHDRAWN' ||
    v.status?.name === 'EMERGENCY'
  )
  
  // Get indexer historical data for enhanced metrics
  const indexerCompletedVaults = indexerVaults.filter(v => 
    v.status === 2 || v.status === 3 // 2 = withdrawn/completed, 3 = emergency
  )
  const indexerWithdrawnVaults = indexerVaults.filter(v => v.status === 2) // 2 = withdrawn/completed
  const indexerEmergencyVaults = indexerVaults.filter(v => v.status === 3) // 3 = emergency

  // Helper function to safely convert vault amounts
  const safeConvertAmount = (amount: any): number => {
    if (!amount) return 0
    if (typeof amount === 'number') return amount
    if (typeof amount === 'string') return parseFloat(amount) || 0
    if (typeof amount === 'bigint') {
      // Convert BigInt to number safely, assuming 18 decimals
      const converted = Number(amount) / Math.pow(10, 18)
      return isFinite(converted) ? converted : 0
    }
    return 0
  }

  // Calculate enhanced metrics using both contract and indexer data
  const historyMetrics = {
    totalHistoryVaults: Math.max(historyVaults.length, indexerCompletedVaults.length),
    withdrawnVaults: Math.max(
      historyVaults.filter(v => v.status?.name === 'WITHDRAWN').length,
      indexerWithdrawnVaults.length
    ),
    unlockedVaults: historyVaults.filter(v => v.status?.name === 'UNLOCKED').length,
    emergencyVaults: Math.max(
      historyVaults.filter(v => v.status?.name === 'EMERGENCY').length,
      indexerEmergencyVaults.length
    ),
    totalWithdrawnValue: Math.max(
      historyVaults
        .filter(v => v.status?.name === 'WITHDRAWN')
        .reduce((sum, vault) => {
          const amount = safeConvertAmount(vault.amount?.usd)
          return sum + amount
        }, 0),
      indexerWithdrawnVaults.reduce((sum, vault) => sum + (parseFloat(vault.amount) || 0), 0) * 25 // Approximate USD
    ),
    successRate: Math.max(historyVaults.length, indexerCompletedVaults.length) > 0
      ? Math.round((Math.max(
          historyVaults.filter(v => v.status?.name === 'WITHDRAWN').length,
          indexerWithdrawnVaults.length
        ) / Math.max(historyVaults.length, indexerCompletedVaults.length)) * 100)
      : 0,
    // Additional indexer insights
    indexerTotalCompleted: indexerCompletedVaults.length,
    indexerSuccessRate: indexerVaults.length > 0 
      ? Math.round((indexerWithdrawnVaults.length / indexerVaults.length) * 100)
      : 0
  }

  const handleVaultClick = (vaultId: number) => {
    console.log('View vault details:', vaultId)
  }



  const handleRefresh = async () => {
    await Promise.all([refetchContract(), refetchIndexer()])
  }

  const handleVaultWithdraw = (vaultId: number) => {
    console.log(`✅ Vault ${vaultId} withdrawn successfully`)
    handleRefresh()
  }

  const handleVaultEmergencyWithdraw = (vaultId: number) => {
    console.log(`🚨 Emergency withdrawal for vault ${vaultId}`)
    handleRefresh()
  }

  return (
    <>
      {/* Header Section */}
      <section style={{ paddingTop: '2rem', paddingBottom: '2rem' }} className="bg-dark">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="heading_text text-white mb-4">
                  Vault History
                </h2>
                <p className="text-secondary mb-0">
                  View your completed, withdrawn, and emergency vaults. Track your commitment journey and learn from past decisions.
                </p>
                {indexerError && (
                  <div className="alert alert-warning mt-3" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px' }}>
                    <small>⚠️ Indexer data unavailable: {indexerError} (Using contract data only)</small>
                  </div>
                )}
                {lastUpdated && (
                  <small className="text-success d-block mt-2">
                    📊 Historical data updated: {lastUpdated.toLocaleTimeString()}
                  </small>
                )}
              </motion.div>
            </div>
          </div>

          {/* Historical Vault Stats - Only show if connected */}
          {isConnected && (
            <div className="row g-3">
              <MetricCard
                title="Total History"
                value={historyMetrics.totalHistoryVaults}
                subtitle="Completed vaults"
                icon={Archive}
                iconColor="text-white"
                delay={0}
                valueType="count"
              />

              <MetricCard
                title="Successfully Withdrawn"
                value={historyMetrics.totalWithdrawnValue}
                subtitle="Total withdrawn value"
                icon={CheckCircle}
                iconColor="text-green-400"
                isPrivate={isPrivacyMode}
                delay={0.1}
                valueType="currency"
              />

              <MetricCard
                title="Success Rate"
                value={historyMetrics.successRate}
                subtitle="Completion rate"
                icon={Clock}
                iconColor="text-blue-400"
                delay={0.2}
                valueType="percentage"
              />

              <MetricCard
                title="Emergency Exits"
                value={historyMetrics.emergencyVaults}
                subtitle="Early withdrawals"
                icon={AlertTriangle}
                iconColor="text-red-400"
                delay={0.3}
                valueType="count"
              />
            </div>
          )}
        </div>
      </section>

      {/* History Vaults Grid Section */}
      <section style={{ paddingTop: '1rem', paddingBottom: '3rem' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {!isConnected ? (
                /* Wallet Not Connected State */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-5"
                >
                  <div className="ico_iconbox_block p-5">
                    <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🔗</div>
                    <h3 className="heading_text text-white mb-4">Connect Your Wallet</h3>
                    <p className="text-secondary mb-4">
                      Connect your wallet to view your vault history and track your commitment journey.
                    </p>
                  </div>
                </motion.div>
              ) : (isLoadingVaults || isLoadingIndexer) ? (
                /* Enhanced Loading State for History */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="row g-2"
                >
                  <div className="col-12 text-center mb-4">
                    <LoadingSpinner
                      variant="blockchain"
                      size="lg"
                      text="Loading your vault history..."
                      subText="Scanning completed and withdrawn vaults..."
                      color="blue"
                    />
                  </div>
                  <VaultGridSkeleton count={3} />
                </motion.div>
              ) : historyVaults.length > 0 ? (
                /* User Has History Vaults */
                <div className="row g-2">
                  {historyVaults.map((vault, index) => (
                    <VaultCard
                      key={vault.id}
                      vault={vault}
                      isPrivate={isPrivacyMode}
                      onClick={() => handleVaultClick(vault.id)}
                      delay={index * 0.1}
                      onWithdraw={handleVaultWithdraw}
                      onEmergencyWithdraw={handleVaultEmergencyWithdraw}
                    />
                  ))}
                </div>
              ) : (
                /* Connected User - No History */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-5"
                >
                  <div className="ico_iconbox_block p-5">
                    <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>📜</div>
                    <h3 className="heading_text text-white mb-4">No History Yet</h3>
                    <p className="text-secondary mb-4">
                      {allUserVaults.length > 0
                        ? "Your vaults are still active. Once you complete or withdraw from vaults, they will appear here in your history."
                        : "You haven't created any vaults yet. Start your commitment journey by creating your first vault, and completed vaults will appear here."
                      }
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
