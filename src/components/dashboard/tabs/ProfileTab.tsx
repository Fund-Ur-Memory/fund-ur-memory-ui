import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { type DashboardData } from '../../../types/dashboard'

interface ProfileTabProps {
  data: DashboardData
  isPrivacyMode: boolean
  onRefetch: () => void
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  data,
  isPrivacyMode
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="text-gray-400">Connected</span>
        </div>
      </div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {profile.ensName ? profile.ensName[0].toUpperCase() : profile.address.slice(2, 4).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">
                {profile.ensName || `${profile.address.slice(0, 6)}...${profile.address.slice(-4)}`}
              </h3>
              <div className="flex items-center space-x-4 text-gray-300">
                <span>🏆 {profile.riskProfile} Trader</span>
                <span>📅 Joined {formatDate(profile.joinDate)}</span>
                <span>✅ {profile.successRate}% Success Rate</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Total Assets</p>
              <p className="text-2xl font-bold text-white">
                {isPrivacyMode ? '••••••' : `$${(profile.totalAssets / 1000000).toFixed(1)}M`}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Section Navigation */}
      <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeSection === section.id
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <span className="text-lg">{section.icon}</span>
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      {/* Section Content */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeSection === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-xl font-bold text-white mb-6">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Wallet Address</label>
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <span className="text-white font-mono">{profile.address}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">ENS Name</label>
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <span className="text-white">{profile.ensName || 'Not set'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Risk Profile</label>
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <span className="text-white">{profile.riskProfile}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-white mb-6">Portfolio Statistics</h3>
              <div className="space-y-4">
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Active Vaults</span>
                    <span className="text-white font-bold">{profile.activeVaults}</span>
                  </div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Returns</span>
                    <span className="text-green-400 font-bold">
                      {isPrivacyMode ? '••••••' : `$${(profile.totalReturns / 1000).toFixed(0)}K`}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Success Rate</span>
                    <span className="text-blue-400 font-bold">{profile.successRate}%</span>
                  </div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Join Date</span>
                    <span className="text-white">{formatDate(profile.joinDate)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-xl font-bold text-white mb-6">Security Settings</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                    <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                  </div>
                  <Button variant="secondary" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Biometric Authentication</h4>
                    <p className="text-gray-400 text-sm">Use fingerprint or face ID</p>
                  </div>
                  <Button variant="secondary" size="sm">Setup</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Session Timeout</h4>
                    <p className="text-gray-400 text-sm">Auto-logout after inactivity</p>
                  </div>
                  <select className="bg-gray-700 text-white rounded px-3 py-1 text-sm">
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>4 hours</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-white mb-6">Privacy Controls</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Transaction Privacy</h4>
                    <p className="text-gray-400 text-sm">Hide transaction amounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={isPrivacyMode} />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Analytics Sharing</h4>
                    <p className="text-gray-400 text-sm">Share data for AI improvements</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'preferences' && (
          <Card>
            <h3 className="text-xl font-bold text-white mb-6">App Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Default Currency</label>
                <select className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>ETH</option>
                  <option>BTC</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Theme</label>
                <select className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white">
                  <option>Dark</option>
                  <option>Light</option>
                  <option>Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Language</label>
                <select className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Timezone</label>
                <select className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white">
                  <option>UTC</option>
                  <option>EST</option>
                  <option>PST</option>
                  <option>CET</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <Button>Save Preferences</Button>
            </div>
          </Card>
        )}

        {activeSection === 'notifications' && (
          <Card>
            <h3 className="text-xl font-bold text-white mb-6">Notification Settings</h3>
            <div className="space-y-4">
              {[
                { label: 'Vault Execution Alerts', description: 'Get notified when vaults execute', enabled: true },
                { label: 'AI Recommendations', description: 'Receive AI-powered trading suggestions', enabled: true },
                { label: 'Price Alerts', description: 'Notifications for price targets', enabled: false },
                { label: 'Security Alerts', description: 'Important security notifications', enabled: true },
                { label: 'Weekly Reports', description: 'Weekly portfolio performance summary', enabled: true },
                { label: 'Marketing Updates', description: 'Product updates and announcements', enabled: false }
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">{notification.label}</h4>
                    <p className="text-gray-400 text-sm">{notification.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={notification.enabled} />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  )
}