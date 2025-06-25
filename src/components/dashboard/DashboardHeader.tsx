import React from 'react'
import { TrendingUp, Shield, Brain, Settings, Bell } from 'lucide-react'
import { PrivacyToggle } from './common/PrivacyToggle'
import { Button } from '../ui/Button'

interface DashboardHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isPrivacyMode: boolean
  onPrivacyToggle: (isPrivate: boolean) => void
  onDisconnect: () => void
  userAddress: string
  notifications?: number
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeTab,
  onTabChange,
  isPrivacyMode,
  onPrivacyToggle,
  onDisconnect,
  userAddress,
  notifications = 0
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'vaults', label: 'Vaults', icon: Shield },
    { id: 'ai', label: 'AI Insights', icon: Brain },
    { id: 'profile', label: 'Profile', icon: Settings }
  ]

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="bg-black/20 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">F.U.M Dashboard</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-10 md:flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-purple-400 bg-purple-400/20 shadow-lg'
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
          <div className="flex items-center space-x-4">
            {/* User Address */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-300">
                {truncateAddress(userAddress)}
              </span>
            </div>
            
            {/* Privacy Toggle */}
            <PrivacyToggle 
              isPrivate={isPrivacyMode}
              onToggle={onPrivacyToggle}
            />
            
            {/* Notifications */}
            <button className="relative p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  {notifications > 9 ? '9+' : notifications}
                </span>
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
          <div className="flex space-x-1 bg-gray-800 rounded-xl p-1">
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