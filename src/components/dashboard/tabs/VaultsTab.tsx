// src/components/dashboard/tabs/VaultsTab.tsx - Final fixed version
import React from 'react'
import { motion } from 'framer-motion'
import { Shield, DollarSign, CheckCircle, Clock } from 'lucide-react'
import { VaultCard } from '../cards/VaultCard'
import { MetricCard } from '../cards/MetricCard'
import { CreateVaultModal } from '../modals/CreateVaultModal'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { VaultCardSkeleton } from '../common/SkeletonLoader'
import { useCreateVault } from '../../../hooks/dashboard/useCreateVault'
import { useGetVaults } from '../../../hooks/contracts/useGetVaults'
import { useAccount } from 'wagmi'
import '../../../styles/header-compact.css'
import '../../../styles/vault-cards.css'


interface VaultsTabProps {
  isPrivacyMode: boolean
  onRefetch: () => void
}



export const VaultsTab: React.FC<VaultsTabProps> = ({
  isPrivacyMode,
  onRefetch,
}) => {
  // Get connected wallet address
  const { address: connectedAddress, isConnected } = useAccount()

  // Use real vault data from contract for connected user only
  const { vaults: contractVaults, refetch, isLoading: isLoadingVaults } = useGetVaults(connectedAddress)
  const { isModalOpen, isCreating, openModal, closeModal, createVault } = useCreateVault()

  // Only show user's own ACTIVE vaults if connected, otherwise show empty state
  const allUserVaults = isConnected && contractVaults.length > 0
    ? contractVaults
    : []

  // Filter to show only ACTIVE vaults in the Vaults tab
  const userVaults = allUserVaults.filter(v => v.status?.name === 'ACTIVE')

  // Calculate user-specific metrics from their active vaults
  const userMetrics = {
    totalActiveVaults: userVaults.length,
    totalLockedValue: userVaults.reduce((sum, vault) => sum + (vault.amount?.usd || 0), 0),
    avgProgress: userVaults.length > 0
      ? Math.round(userVaults.reduce((sum, vault) => sum + (vault.progress || 0), 0) / userVaults.length)
      : 0,
    // Time-based metrics for active vaults
    timeBasedVaults: userVaults.filter(v => v.conditionType?.name?.includes('TIME')).length,
    priceBasedVaults: userVaults.filter(v => v.conditionType?.name?.includes('PRICE')).length
  }

  const handleVaultClick = (vaultId: number) => {
    console.log('View vault details:', vaultId)
  }

  const handleCreateVault = () => {
    openModal()
  }

  const handleRefresh = async () => {
    await refetch()
    onRefetch?.()
  }



  const handleVaultWithdraw = (vaultId: number) => {
    console.log(`✅ Vault ${vaultId} withdrawn successfully`)
    // Refresh vault data
    refetch()
  }

  const handleVaultEmergencyWithdraw = (vaultId: number) => {
    console.log(`🚨 Vault ${vaultId} emergency withdrawn successfully`)
    // Refresh vault data
    refetch()
  }

  return (
    <div>
      {/* Header Section */}
      <section style={{ paddingTop: '2rem', paddingBottom: '0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="row justify-content-center mb-4"
          >
            <div className="col-lg-10">
              <div className="ico_heading_block text-center">
                <h2 className="heading_text mb-0 text-white">Your Commitment Vaults</h2>
                <p className="text-secondary mt-3">Manage your time-locked and condition-based investment strategies</p>
              </div>
            </div>
          </motion.div>

          {/* Create Vault Button */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-10 text-center">
              <button
                onClick={handleCreateVault}
                className="ico_creative_btn"
              >
                <span className="btn_wrapper">
                  <span className="btn_icon_left">
                    <small className="dot_top"></small>
                    <small className="dot_bottom"></small>
                    <svg className="icon_arrow_left" viewBox="0 0 28 23" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.4106 20.8083L5.36673 12.6878C5.26033 12.5804 5.11542 12.52 4.96423 12.52H1.84503C1.34158 12.52 1.08822 13.1276 1.44252 13.4852L9.48642 21.6057C9.59281 21.7131 9.73773 21.7736 9.88892 21.7736H13.0081C13.5116 21.7736 13.7649 21.166 13.4106 20.8083Z" />
                      <path d="M12.6803 9.57324H24.71C25.7116 9.57324 26.5234 10.3851 26.5234 11.3866C26.5234 12.3882 25.7116 13.2 24.71 13.2H12.6803C11.6788 13.2 10.8669 12.3882 10.8669 11.3866C10.8669 10.3851 11.6788 9.57324 12.6803 9.57324Z" />
                      <path d="M1.44252 9.28834L9.48641 1.16784C9.59281 1.06043 9.73772 1 9.88891 1H13.0081C13.5116 1 13.7649 1.60758 13.4106 1.96525L5.36672 10.0858C5.26033 10.1932 5.11541 10.2536 4.96422 10.2536H1.84502C1.34158 10.2536 1.08822 9.64601 1.44252 9.28834Z" />
                    </svg>
                  </span>
                  <span className="btn_label">+ Create New Vault</span>
                  <span className="btn_icon_right">
                    <small className="dot_top"></small>
                    <small className="dot_bottom"></small>
                    <svg className="icon_arrow_right" viewBox="0 0 27 23" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.6558 2.19168L21.6997 10.3122C21.8061 10.4196 21.951 10.48 22.1022 10.48H25.2214C25.7248 10.48 25.9782 9.87238 25.6239 9.51478L17.58 1.39428C17.4736 1.28688 17.3287 1.22638 17.1775 1.22638H14.0583C13.5548 1.22638 13.3015 1.83398 13.6558 2.19168Z" />
                      <path d="M14.3861 13.4268H2.35637C1.35486 13.4268 0.542969 12.6149 0.542969 11.6134C0.542969 10.6118 1.35486 9.79996 2.35637 9.79996H14.3861C15.3876 9.79996 16.1995 10.6118 16.1995 11.6134C16.1995 12.6149 15.3876 13.4268 14.3861 13.4268Z" />
                      <path d="M25.6239 13.7117L17.58 21.8322C17.4736 21.9396 17.3287 22 17.1775 22H14.0583C13.5548 22 13.3015 21.3924 13.6558 21.0347L21.6997 12.9142C21.8061 12.8068 21.951 12.7464 22.1022 12.7464H25.2214C25.7248 12.7464 25.9782 13.354 25.6239 13.7117Z" />
                    </svg>
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Active Vault Stats - Only show if connected */}
          {isConnected && (
            <div className="row g-3">
              <MetricCard
                title="Active Vaults"
                value={userMetrics.totalActiveVaults}
                subtitle="Currently locked"
                icon={Shield}
                iconColor="text-white"
                delay={0}
              />

              <MetricCard
                title="Locked Value"
                value={userMetrics.totalLockedValue}
                subtitle="In active vaults"
                icon={DollarSign}
                iconColor="text-blue-400"
                isPrivate={isPrivacyMode}
                delay={0.1}
              />

              <MetricCard
                title="Time-Based"
                value={userMetrics.timeBasedVaults}
                subtitle="Time conditions"
                icon={Clock}
                iconColor="text-yellow-400"
                delay={0.2}
              />

              <MetricCard
                title="Avg Progress"
                value={`${userMetrics.avgProgress}%`}
                subtitle="Completion rate"
                icon={CheckCircle}
                iconColor="text-green-400"
                delay={0.3}
              />
            </div>
          )}
        </div>
      </section>

      {/* Vaults Grid Section */}
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
                      Connect your wallet to view and manage your commitment vaults.
                      Your vaults are tied to your wallet address for security.
                    </p>
                  </div>
                </motion.div>
              ) : isLoadingVaults ? (
                /* Enhanced Loading State with Skeleton Cards */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="row g-2"
                >
                  {/* Loading header */}
                  <div className="col-12 text-center mb-4">
                    <LoadingSpinner
                      variant="vault"
                      size="lg"
                      text="Loading your commitment vaults..."
                      color="purple"
                    />
                  </div>

                  {/* Skeleton vault cards */}
                  {Array.from({ length: 4 }, (_, index) => (
                    <motion.div
                      key={index}
                      className="col-lg-6 col-md-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <VaultCardSkeleton />
                    </motion.div>
                  ))}
                </motion.div>
              ) : userVaults.length > 0 ? (
                /* User Has Vaults */
                <div className="row g-2">
                  {userVaults.map((vault, index) => (
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
                /* Connected User - No Vaults */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-5"
                >
                  <div className="ico_iconbox_block p-5">
                    <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🔒</div>
                    <h3 className="heading_text text-white mb-4">No Active Vaults</h3>
                    <p className="text-secondary mb-4">
                      {allUserVaults.length > 0
                        ? "All your vaults have been completed or withdrawn. Check the History tab to view past vaults, or create a new one to continue building discipline."
                        : "You haven't created any commitment vaults yet. Start your disciplined investment journey by creating your first vault with time-based or price-based conditions."
                      }
                    </p>

                    <div className="row justify-content-center mt-4">
                      <div className="col-lg-8">
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <div className="text-center p-3" style={{
                              background: 'rgba(111, 66, 193, 0.1)',
                              borderRadius: '12px',
                              border: '1px solid rgba(111, 66, 193, 0.3)'
                            }}>
                              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏰</div>
                              <h6 className="text-white mb-1">Time Lock</h6>
                              <p className="text-secondary small mb-0">Lock for a specific period</p>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="text-center p-3" style={{
                              background: 'rgba(34, 197, 94, 0.1)',
                              borderRadius: '12px',
                              border: '1px solid rgba(34, 197, 94, 0.3)'
                            }}>
                              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                              <h6 className="text-white mb-1">Price Target</h6>
                              <p className="text-secondary small mb-0">Execute at target price</p>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="text-center p-3" style={{
                              background: 'rgba(59, 130, 246, 0.1)',
                              borderRadius: '12px',
                              border: '1px solid rgba(59, 130, 246, 0.3)'
                            }}>
                              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
                              <h6 className="text-white mb-1">Smart Combo</h6>
                              <p className="text-secondary small mb-0">AI-powered conditions</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-3 justify-content-center mt-4">
                      <button
                        onClick={handleCreateVault}
                        className="ico_creative_btn"
                      >
                        <span className="btn_wrapper">
                          <span className="btn_label">
                            {allUserVaults.length > 0 ? 'Create New Vault' : 'Create Your First Vault'}
                          </span>
                        </span>
                      </button>

                      {/* Debug button - remove in production */}
                      {/* <button
                        onClick={handleDebugContract}
                        className="btn btn-outline-secondary"
                        style={{
                          borderRadius: '12px',
                          padding: '12px 24px',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: 'rgba(255, 255, 255, 0.8)'
                        }}
                      >
                        🔍 Debug Contract
                      </button> */}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Vault Management Tips - Only show if user has vaults */}
      {isConnected && userVaults.length > 0 && (
        <section className="section_space pt-0">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="ico_iconbox_block p-4" style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <div className="row align-items-center">
                    <div className="col-lg-2 text-center">
                      <div style={{ fontSize: '3rem' }}>💡</div>
                    </div>
                    <div className="col-lg-8">
                      <h4 className="text-white mb-2">Vault Management Tips</h4>
                      <ul className="text-secondary mb-0" style={{ listStyle: 'none', paddingLeft: 0 }}>
                        <li className="mb-1">• Review your vault conditions regularly</li>
                        <li className="mb-1">• AI score updates help optimize timing</li>
                        <li className="mb-1">• Diversify across different condition types</li>
                      </ul>
                    </div>
                    <div className="col-lg-2 text-center">
                      <button className="compact-action-btn outline">
                        <span className="btn_wrapper">
                          <span className="btn_label">Learn More</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Create Vault Modal */}
      <CreateVaultModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onCreateVault={async (vaultData) => {
          await createVault(vaultData)
          // Refresh vault data after successful creation
          await handleRefresh()
        }}
        isLoading={isCreating}
      />
    </div>
  )
}