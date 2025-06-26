import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { type DashboardData } from '../../../types/dashboard'

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
  const { profile } = data

  const sections = [
    { id: 'general', label: 'General', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section className="section_space pb-0">
      <div className="container">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="row justify-content-center mb-5"
        >
          <div className="col-lg-10">
            <div className="ico_heading_block text-center">
              <h2 className="heading_text mb-0 text-white">Profile Settings</h2>
              <p className="text-secondary mt-3">Manage your account preferences and security settings</p>
            </div>
          </div>
        </motion.div>

        {/* Profile Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="row justify-content-center mb-5"
        >
          <div className="col-lg-10">
            <div className="ico_iconbox_block text-center p-5" style={{
              background: 'linear-gradient(135deg, rgba(111, 66, 193, 0.1), rgba(157, 91, 232, 0.1))',
              border: '1px solid rgba(111, 66, 193, 0.3)',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="row align-items-center">
                <div className="col-lg-3 text-center">
                  <div className="mx-auto mb-3" style={{
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, #6f42c1, #9d5be8)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '2.5rem', color: 'white', fontWeight: 'bold' }}>
                      {profile.ensName ? profile.ensName[0].toUpperCase() : 'F'}
                    </span>
                  </div>
                </div>
                <div className="col-lg-6">
                  <h3 className="heading_text text-white mb-2">
                    {profile.ensName || `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`}
                  </h3>
                  <div className="d-flex justify-content-center flex-wrap gap-3 text-secondary">
                    <span>🏆 {profile.riskProfile} Trader</span>
                    <span>📅 Joined {formatDate(profile.joinDate)}</span>
                    <span>✅ {profile.successRate}% Success Rate</span>
                  </div>
                </div>
                <div className="col-lg-3 text-center">
                  <p className="text-secondary mb-1">Total Assets</p>
                  <h4 className="heading_text text-white">
                    {isPrivacyMode ? '••••••' : `$${(profile.totalAssets / 1000000).toFixed(1)}M`}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section Navigation */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <ul className="nav unordered_list justify-content-center" role="tablist">
              {sections.map((section) => (
                <li key={section.id} className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeSection === section.id ? "active" : ""}`}
                    type="button"
                    role="tab"
                    onClick={() => setActiveSection(section.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      minWidth: '140px',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: '1.2em' }}>{section.icon}</span>
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

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
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '12px'
                        }}>
                          <span className="text-white" style={{ fontFamily: 'monospace' }}>
                            {userAddress}
                          </span>
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
                          <span className="text-white">{profile.ensName || 'Not set'}</span>
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
                        { label: 'Active Vaults', value: profile.activeVaults, icon: '🔒' },
                        { 
                          label: 'Total Returns', 
                          value: isPrivacyMode ? '••••••' : `$${(profile.totalReturns / 1000).toFixed(0)}K`,
                          icon: '📈',
                          color: 'text-success'
                        },
                        { label: 'Success Rate', value: `${profile.successRate}%`, icon: '🎯', color: 'text-info' },
                        { label: 'Join Date', value: formatDate(profile.joinDate), icon: '📅' }
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
        <div className="row justify-content-center mt-5">
          <div className="col-lg-6 text-center">
            <div className="ico_iconbox_block p-4" style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <h4 className="text-white mb-3">Wallet Connection</h4>
              <p className="text-secondary mb-4">
                Disconnect your wallet to end this session securely
              </p>
              <button 
                onClick={onDisconnect}
                className="ico_creative_btn"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)'
                }}
              >
                <span className="btn_wrapper">
                  <span className="btn_label">Disconnect Wallet</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}