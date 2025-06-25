import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardHeader } from './DashboardHeader'
import { OverviewTab } from './tabs/OverviewTab'
import { VaultsTab } from './tabs/VaultsTab'
import { AIInsightsTab } from './tabs/AIInsightsTab'
// import { ProfileTab } from './tabs/ProfileTab'
import { LoadingSpinner } from './common/LoadingSpinner'
import { useDashboard } from '../../hooks/dashboard/useDashboard'

interface DashboardProps {
  userAddress: string
  onDisconnect: () => void
}

export const Dashboard: React.FC<DashboardProps> = ({ userAddress, onDisconnect }) => {
  const {
    data,
    loading,
    error,
    activeTab,
    setActiveTab,
    isPrivacyMode,
    setIsPrivacyMode,
    refetch
  } = useDashboard(userAddress)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h2 className="text-2xl font-bold text-white mb-2 mt-4">Analyzing Your Wallet</h2>
          <p className="text-gray-400">AI agents are reviewing your transaction history...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-4">{error || 'Failed to load dashboard data'}</p>
          <button
            onClick={refetch}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const renderActiveTab = () => {
    const tabProps = {
      data,
      isPrivacyMode,
      onRefetch: refetch
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewTab {...tabProps} />
      case 'vaults':
        return <VaultsTab {...tabProps} />
      case 'ai':
        return <AIInsightsTab {...tabProps} />
    //   case 'profile':
    //     return <ProfileTab {...tabProps} />
      default:
        return <OverviewTab {...tabProps} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <DashboardHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isPrivacyMode={isPrivacyMode}
        onPrivacyToggle={setIsPrivacyMode}
        onDisconnect={onDisconnect}
        userAddress={userAddress}
        notifications={3} // Mock notification count
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}