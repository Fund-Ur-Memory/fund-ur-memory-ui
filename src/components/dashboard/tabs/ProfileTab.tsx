import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Shield, Settings, Bell, Copy, ExternalLink, Wifi } from 'lucide-react'
import { type DashboardData } from '../../../types/dashboard'
import { useAccount, useBalance, useEnsName, useDisconnect } from 'wagmi'
import { useVaultStats } from '../../../hooks/contracts/useGetVaults'
import { formatCurrency } from '../../../utils/formatters'
import '../../../styles/header-compact.css'

interface ProfileTabProps {
  data: DashboardData
  isPrivacyMode: boolean
  onRefetch: () => void
  userAddress: string // Now used in the component
  onDisconnect: () => void
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  data,
  isPrivacyMode,
  userAddress, // Now properly used
  onDisconnect
}) => {
  const [activeSection, setActiveSection] = useState('general')
  const [copiedAddress, setCopiedAddress] = useState(false)
  const { profile } = data
  
  // Real wallet data
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address: address as `0x${string}` })
  const { data: balance } = useBalance({ address: address as `0x${string}` })
  const { disconnect } = useDisconnect()
  const { stats: vaultStats } = useVaultStats(address as `0x${string}`)
  
  // Use real data instead of mock data
  const realProfile = {
    address: address || userAddress,
    ensName: ensName || null,
    balance: balance ? parseFloat(balance.formatted) : 0,
    totalAssets: vaultStats.totalLockedValue || 0,
    activeVaults: vaultStats.activeVaults || 0,
    totalVaults: vaultStats.totalVaults || 0,
    successRate: vaultStats.totalVaults > 0 ? Math.round((vaultStats.withdrawnVaults / vaultStats.totalVaults) * 100) : 0,
    joinDate: new Date().toISOString() // Could be improved with real join date from first vault
  }

  const sections = [
    { id: 'general', label: 'General', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ]

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   })
  // }
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  return (
    <div>
      {/* Profile Header - Compact */}
      <section style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="row justify-content-center"
          >
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="heading_text text-white mb-1" style={{ fontSize: '1.4rem', fontWeight: '600' }}>
                    Profile Settings
                  </h3>
                  <p className="text-gray mb-0" style={{ opacity: '0.8', fontSize: '0.9rem' }}>
                    Manage your account and preferences
                  </p>
                </div>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center me-3">
                    <Wifi className="me-2" style={{ width: '16px', height: '16px', color: isConnected ? '#10B981' : '#EF4444' }} />
                    <span className={`small ${isConnected ? 'text-success' : 'text-danger'}`}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Profile Overview Cards - Match Overview Tab Style */}
      <section style={{ paddingTop: '0rem', paddingBottom: '1.5rem' }}>
        <div className="container">
          <div className="row g-3">
            {/* Wallet Balance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0, duration: 0.3 }}
              className="col-lg-3 col-md-6 col-sm-6"
            >
              <div
                className="ico_iconbox_block"
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  padding: '1.25rem',
                  minHeight: '140px'
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="text-start flex-grow-1">
                    <p className="text-gray mb-1" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
                      Wallet Balance
                    </p>
                    <h3 className="heading_text text-white mb-0" style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: '1.2' }}>
                      {isPrivacyMode ? '••••••' : formatCurrency(realProfile.balance)}
                    </h3>
                    <p className="mt-1" style={{ fontSize: '0.75rem', opacity: '0.7' }}>
                      {balance?.symbol || 'ETH'}
                    </p>
                  </div>
                  <div
                    className="iconbox_icon d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))',
                      borderRadius: '10px',
                      fontSize: '1.2rem',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    💳
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Active Vaults Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="col-lg-3 col-md-6 col-sm-6"
            >
              <div
                className="ico_iconbox_block"
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  padding: '1.25rem',
                  minHeight: '140px'
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="text-start flex-grow-1">
                    <p className="text-gray mb-1" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
                      Active Vaults
                    </p>
                    <h3 className="heading_text text-white mb-0" style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: '1.2' }}>
                      {realProfile.activeVaults}
                    </h3>
                    <p className="mt-1" style={{ fontSize: '0.75rem', opacity: '0.7' }}>
                      {realProfile.totalVaults} total created
                    </p>
                  </div>
                  <div
                    className="iconbox_icon d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))',
                      borderRadius: '10px',
                      fontSize: '1.2rem',
                      border: '1px solid rgba(139, 92, 246, 0.3)'
                    }}
                  >
                    🔒
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Success Rate Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="col-lg-3 col-md-6 col-sm-6"
            >
              <div
                className="ico_iconbox_block"
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  padding: '1.25rem',
                  minHeight: '140px'
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="text-start flex-grow-1">
                    <p className="text-gray mb-1" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
                      Success Rate
                    </p>
                    <h3 className="heading_text text-white mb-0" style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: '1.2' }}>
                      {realProfile.successRate}%
                    </h3>
                    <p className="mt-1" style={{ fontSize: '0.75rem', opacity: '0.7' }}>
                      Commitment discipline
                    </p>
                  </div>
                  <div
                    className="iconbox_icon d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
                      borderRadius: '10px',
                      fontSize: '1.2rem',
                      border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    🎯
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Locked Value Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="col-lg-3 col-md-6 col-sm-6"
            >
              <div
                className="ico_iconbox_block"
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  padding: '1.25rem',
                  minHeight: '140px'
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="text-start flex-grow-1">
                    <p className="text-gray mb-1" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
                      Locked Value
                    </p>
                    <h3 className="heading_text text-white mb-0" style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: '1.2' }}>
                      {isPrivacyMode ? '••••••' : formatCurrency(realProfile.totalAssets)}
                    </h3>
                    <p className="mt-1" style={{ fontSize: '0.75rem', opacity: '0.7' }}>
                      In active vaults
                    </p>
                  </div>
                  <div
                    className="iconbox_icon d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))',
                      borderRadius: '10px',
                      fontSize: '1.2rem',
                      border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    💰
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Navigation */}
      <section style={{ paddingTop: '0rem', paddingBottom: '0' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <div
                className="d-flex justify-content-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '0.3rem',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}
              >
                <ul className="nav d-flex align-items-center gap-1" role="tablist" style={{ margin: 0, padding: 0 }}>
                  {sections.map((section) => {
                    const IconComponent = section.icon
                    return (
                      <li key={section.id} className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${activeSection === section.id ? "active" : ""}`}
                          type="button"
                          role="tab"
                          onClick={() => setActiveSection(section.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            minWidth: '120px',
                            justifyContent: 'center',
                            padding: '0.6rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeSection === section.id
                              ? 'linear-gradient(135deg, #6f42c1, #9d5be8)'
                              : 'transparent',
                            color: activeSection === section.id ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                            fontWeight: activeSection === section.id ? '600' : '500',
                            transition: 'all 0.3s ease',
                            transform: activeSection === section.id ? 'translateY(-1px)' : 'none',
                            boxShadow: activeSection === section.id ? '0 4px 15px rgba(111, 66, 193, 0.3)' : 'none',
                            fontSize: '0.85rem'
                          }}
                        >
                          <IconComponent style={{ width: '16px', height: '16px' }} />
                          <span>{section.label}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Section Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="row justify-content-center"
        >
          <div className="col-lg-10">
            {activeSection === 'general' && (
              <div className="row">
                <div className="col-lg-6 mb-4">
                  <div className="ico_iconbox_block p-4">
                    <h3 className="iconbox_title text-white mb-4">Account Information</h3>
                    <div className="space-y-4">
                      <div className="mb-3">
                        <label className="text-secondary mb-2 d-block">Wallet Address</label>
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <span className="text-white" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                            {realProfile.address}
                          </span>
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => copyToClipboard(realProfile.address)}
                              className="btn btn-sm"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: copiedAddress ? '#10B981' : 'rgba(255, 255, 255, 0.7)',
                                padding: '4px'
                              }}
                              title="Copy address"
                            >
                              <Copy style={{ width: '14px', height: '14px' }} />
                            </button>
                            <button
                              onClick={() => window.open(`https://etherscan.io/address/${realProfile.address}`, '_blank')}
                              className="btn btn-sm"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255, 255, 255, 0.7)',
                                padding: '4px'
                              }}
                              title="View on Etherscan"
                            >
                              <ExternalLink style={{ width: '14px', height: '14px' }} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="text-secondary mb-2 d-block">ENS Name</label>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '12px'
                        }}>
                          <span className="text-white">{realProfile.ensName || 'Not set'}</span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="text-secondary mb-2 d-block">Risk Profile</label>
                        <select 
                          className="form-control"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'white'
                          }}
                          defaultValue={profile.riskProfile}
                        >
                          <option value="Conservative">Conservative</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Aggressive">Aggressive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 mb-4">
                  <div className="ico_iconbox_block p-4">
                    <h3 className="iconbox_title text-white mb-4">Portfolio Statistics</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Active Vaults', value: realProfile.activeVaults, icon: '🔒' },
                        { label: 'Total Vaults', value: realProfile.totalVaults, icon: '📊', color: 'text-info' },
                        { label: 'Success Rate', value: `${realProfile.successRate}%`, icon: '🎯', color: 'text-success' },
                        { 
                          label: 'Locked Value', 
                          value: isPrivacyMode ? '••••••' : formatCurrency(realProfile.totalAssets),
                          icon: '💰',
                          color: 'text-warning'
                        },
                        { label: 'Network', value: balance?.symbol || 'Ethereum', icon: '🌐' }
                      ].map((stat, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center p-3" style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '8px'
                        }}>
                          <span className="text-secondary d-flex align-items-center">
                            <span className="me-2">{stat.icon}</span>
                            {stat.label}
                          </span>
                          <span className={`fw-bold ${stat.color || 'text-white'}`}>
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="ico_iconbox_block p-4">
                <h3 className="iconbox_title text-white mb-4">Security Settings</h3>
                <p className="text-secondary text-center">
                  Advanced security features coming soon
                </p>
                <div className="text-center mt-4">
                  <span style={{ fontSize: '3rem' }}>🔒</span>
                  <p className="text-secondary mt-2">Two-factor authentication, biometric login, and more</p>
                </div>
              </div>
            )}

            {(activeSection === 'preferences' || activeSection === 'notifications') && (
              <div className="ico_iconbox_block p-4">
                <h3 className="iconbox_title text-white mb-4">
                  {activeSection === 'preferences' ? 'App Preferences' : 'Notification Settings'}
                </h3>
                <p className="text-secondary text-center">
                  {activeSection === 'preferences' 
                    ? 'Customize your app experience and preferences'
                    : 'Manage your notification preferences and alerts'
                  }
                </p>
                <div className="text-center mt-4">
                  <span style={{ fontSize: '3rem' }}>🚧</span>
                  <p className="text-secondary mt-2">Coming Soon</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

      {/* Disconnect Section */}
      <section style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div
                className="ico_iconbox_block"
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  padding: '1.25rem'
                }}
              >
                <div className="row align-items-center">
                  <div className="col-lg-2 text-center">
                    <div style={{ fontSize: '2.5rem' }}>⚠️</div>
                  </div>
                  <div className="col-lg-8">
                    <h4 className="text-white mb-2">Wallet Connection</h4>
                    <p className="text-secondary mb-0" style={{ fontSize: '0.9rem' }}>
                      Disconnect your wallet to end this session securely. Your vaults will remain safe on the blockchain.
                    </p>
                  </div>
                  <div className="col-lg-2 text-center">
                    <button 
                      onClick={() => {
                        disconnect()
                        onDisconnect()
                      }}
                      className="compact-action-btn"
                      style={{
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        border: '1px solid rgba(239, 68, 68, 0.5)'
                      }}
                    >
                      <span className="btn_wrapper">
                        <span className="btn_label">Disconnect</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}