// src/components/dashboard/tabs/HistoryTab.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { Archive, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import { VaultCard } from '../cards/VaultCard'
import { MetricCard } from '../cards/MetricCard'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { VaultGridSkeleton } from '../common/SkeletonLoader'
import { useGetVaults } from '../../../hooks/contracts/useGetVaults'
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
  const { vaults: contractVaults, refetch, isLoading: isLoadingVaults } = useGetVaults(connectedAddress)

  // Only show user's own NON-ACTIVE vaults if connected, otherwise show empty state
  const allUserVaults = isConnected && contractVaults.length > 0
    ? contractVaults
    : []

  // Filter to show only NON-ACTIVE vaults in the History tab
  const historyVaults = allUserVaults.filter(v =>
    v.status?.name === 'UNLOCKED' ||
    v.status?.name === 'WITHDRAWN' ||
    v.status?.name === 'EMERGENCY'
  )

  // Calculate user-specific metrics from their historical vaults
  const historyMetrics = {
    totalHistoryVaults: historyVaults.length,
    withdrawnVaults: historyVaults.filter(v => v.status?.name === 'WITHDRAWN').length,
    unlockedVaults: historyVaults.filter(v => v.status?.name === 'UNLOCKED').length,
    emergencyVaults: historyVaults.filter(v => v.status?.name === 'EMERGENCY').length,
    totalWithdrawnValue: historyVaults
      .filter(v => v.status?.name === 'WITHDRAWN')
      .reduce((sum, vault) => sum + (vault.amount?.usd || 0), 0),
    successRate: historyVaults.length > 0
      ? Math.round((historyVaults.filter(v => v.status?.name === 'WITHDRAWN').length / historyVaults.length) * 100)
      : 0
  }

  const handleVaultClick = (vaultId: number) => {
    console.log('View vault details:', vaultId)
  }



  const handleVaultWithdraw = (vaultId: number) => {
    console.log(`✅ Vault ${vaultId} withdrawn successfully`)
    // Refresh vault data
    refetch()
  }

  const handleVaultEmergencyWithdraw = (vaultId: number) => {
    console.log(`🚨 Emergency withdrawal for vault ${vaultId}`)
    // Refresh vault data
    refetch()
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
              />

              <MetricCard
                title="Successfully Withdrawn"
                value={historyMetrics.totalWithdrawnValue}
                subtitle="Total withdrawn value"
                icon={CheckCircle}
                iconColor="text-green-400"
                isPrivate={isPrivacyMode}
                delay={0.1}
              />

              <MetricCard
                title="Success Rate"
                value={`${historyMetrics.successRate}%`}
                subtitle="Completion rate"
                icon={Clock}
                iconColor="text-blue-400"
                delay={0.2}
              />

              <MetricCard
                title="Emergency Exits"
                value={historyMetrics.emergencyVaults}
                subtitle="Early withdrawals"
                icon={AlertTriangle}
                iconColor="text-red-400"
                delay={0.3}
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
              ) : isLoadingVaults ? (
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
