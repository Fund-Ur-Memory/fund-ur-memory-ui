// src/components/dashboard/DashboardHeader.tsx - Fixed version with complete JSX
import React from 'react'
import { TrendingUp, Shield, Archive, Brain, Settings, Bell, RefreshCw, Clock } from 'lucide-react'
import { PrivacyToggle } from './common/PrivacyToggle'
import { Button } from '../ui/Button'
import { motion } from 'framer-motion'

interface DashboardHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isPrivacyMode: boolean
  onPrivacyToggle: (isPrivate: boolean) => void
  onDisconnect: () => void
  userAddress: string
  notifications?: number
  isRefetching?: boolean
  lastUpdated?: Date | null
  onRefresh?: () => void
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeTab,
  onTabChange,
  isPrivacyMode,
  onPrivacyToggle,
  onDisconnect,
  userAddress,
  notifications = 0,
  isRefetching = false,
  lastUpdated,
  onRefresh
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'vaults', label: 'Vaults', icon: Shield },
    { id: 'history', label: 'History', icon: Archive },
    { id: 'ai', label: 'AI Insights', icon: Brain },
    { id: 'profile', label: 'Profile', icon: Settings }
  ]

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never'

    const now = Date.now()
    const diff = now - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <header className="bg-black/20 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">Cipher Dashboard</h1>
            </div>

            {/* Last Updated Info */}
            {lastUpdated && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:flex items-center space-x-2 text-gray-400 text-sm"
              >
                <Clock className="w-4 h-4" />
                <span>Updated {formatLastUpdated(lastUpdated)}</span>
              </motion.div>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-white bg-purple-400/20 shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* User Address */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">
                {truncateAddress(userAddress)}
              </span>
            </div>

            {/* Refresh Button */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefetching}
                className={`p-2 bg-gray-800 rounded-lg transition-all ${
                  isRefetching
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-700'
                }`}
                title="Refresh dashboard data"
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-400 ${isRefetching ? 'animate-spin' : ''}`}
                />
              </button>
            )}

            {/* Privacy Toggle */}
            <PrivacyToggle
              isPrivate={isPrivacyMode}
              onToggle={onPrivacyToggle}
            />

            {/* Notifications */}
            <button className="relative p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              {notifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"
                >
                  {notifications > 9 ? '9+' : notifications}
                </motion.span>
              )}
            </button>

            {/* Disconnect Button */}
            <Button
              variant="danger"
              size="sm"
              onClick={onDisconnect}
            >
              Disconnect
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 flex items-center justify-center py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-1" />
                <span className="hidden xs:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}