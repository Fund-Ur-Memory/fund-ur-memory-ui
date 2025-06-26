// src/components/dashboard/tabs/VaultsTab.tsx - Final fixed version
import React from 'react'
import { motion } from 'framer-motion'
import { Shield, DollarSign, Brain } from 'lucide-react'
import { VaultCard } from '../cards/VaultCard'
import { MetricCard } from '../cards/MetricCard'
import { type DashboardData } from '../../../types/dashboard'

interface VaultsTabProps {
  data: DashboardData
  isPrivacyMode: boolean
  onRefetch: () => void
}

export const VaultsTab: React.FC<VaultsTabProps> = ({
  data,
  isPrivacyMode,
}) => {
  const { vaults } = data

  const totalLockedValue = vaults.reduce((sum, vault) => sum + vault.value, 0)
  const avgAIScore = vaults.length > 0 
    ? Math.round(vaults.reduce((sum, vault) => sum + vault.aiScore, 0) / vaults.length) 
    : 0

  const handleVaultClick = (vaultId: number) => {
    console.log('View vault details:', vaultId)
  }

  const handleCreateVault = () => {
    console.log('Create new vault')
  }

  return (
    <div>
      {/* Header Section */}
      <section className="section_space pb-0">
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

          {/* Vault Stats */}
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="row">
                <MetricCard
                  title="Active Vaults"
                  value={vaults.length}
                  subtitle="All performing well"
                  icon={Shield}
                  iconColor="text-purple-400"
                  delay={0}
                />
                
                <MetricCard
                  title="Total Locked Value"
                  value={totalLockedValue}
                  subtitle="Across 3 chains"
                  icon={DollarSign}
                  iconColor="text-blue-400"
                  isPrivate={isPrivacyMode}
                  delay={0.1}
                />
                
                <MetricCard
                  title="Avg AI Score"
                  value={avgAIScore}
                  subtitle="High confidence"
                  icon={Brain}
                  iconColor="text-green-400"
                  delay={0.2}
                />

                <MetricCard
                  title="Success Rate"
                  value="87%"
                  subtitle="Above average"
                  icon={Brain}
                  iconColor="text-yellow-400"
                  delay={0.3}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vaults Grid Section */}
      <section className="section_space">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {vaults.length > 0 ? (
                <div className="row">
                  {vaults.map((vault, index) => (
                    <VaultCard
                      key={vault.id}
                      vault={vault}
                      isPrivate={isPrivacyMode}
                      onClick={() => handleVaultClick(vault.id)}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              ) : (
                /* Empty State */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-5"
                >
                  <div className="ico_iconbox_block p-5">
                    <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🔒</div>
                    <h3 className="heading_text text-white mb-4">No Vaults Yet</h3>
                    <p className="text-secondary mb-4">
                      Create your first commitment vault to start your disciplined investment journey.
                      Lock away assets based on time or market conditions to prevent emotional trading.
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

                    <button 
                      onClick={handleCreateVault}
                      className="ico_creative_btn mt-4"
                    >
                      <span className="btn_wrapper">
                        <span className="btn_label">Create Your First Vault</span>
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Vault Management Tips */}
      {vaults.length > 0 && (
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
                      <button className="btn btn-outline-light btn-sm">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}