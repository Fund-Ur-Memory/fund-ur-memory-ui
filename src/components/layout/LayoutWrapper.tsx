// src/components/layout/LayoutWrapper.tsx
import React from 'react'
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Link } from "react-scroll"

interface LayoutWrapperProps {
  children: React.ReactNode
  showNavigation?: boolean
  currentPage?: 'home' | 'dashboard' | 'profile'
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ 
  children, 
  showNavigation = true,
  currentPage = 'home'
}) => {
  const handleNavigation = (path: string) => {
    window.location.href = path
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/images/shapes/shape_net_ico_hero_section_bg.svg')] opacity-20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <header className="relative z-50 bg-black/20 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button 
                onClick={() => handleNavigation('/')}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-2xl font-bold text-white">Fund Ur Memory</span>
              </button>
            </div>
            
            {/* Navigation */}
            {showNavigation && (
              <nav className="hidden md:flex space-x-8">
                <button
                  onClick={() => handleNavigation('/')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === 'home'
                      ? 'text-purple-400 bg-purple-400/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  HOME
                </button>
                
                {currentPage === 'home' ? (
                  <>
                    <Link
                      to="id_ico_about_section"
                      spy={true}
                      smooth={true}
                      duration={500}
                      offset={-100}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all cursor-pointer"
                    >
                      ABOUT F.U.M
                    </Link>
                    <Link
                      to="id_ico_service_section"
                      spy={true}
                      smooth={true}
                      duration={500}
                      offset={-100}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all cursor-pointer"
                    >
                      PROTOCOL FEATURES
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavigation('/dashboard')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        currentPage === 'dashboard'
                          ? 'text-purple-400 bg-purple-400/20'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      DASHBOARD
                    </button>
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        currentPage === 'profile'
                          ? 'text-purple-400 bg-purple-400/20'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      PROFILE
                    </button>
                  </>
                )}
              </nav>
            )}
            
            {/* Connect Wallet Button */}
            <div className="flex items-center">
              <div className="ico_btn_outline flex items-center space-x-2 px-4 py-2 border border-purple-500/50 rounded-lg bg-purple-500/10 backdrop-blur-sm">
                <span className="text-purple-400">
                  <i className="fa-solid fa-user"></i>
                </span>
                <ConnectButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-lg border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center space-x-8 mb-6">
              {currentPage === 'home' ? (
                <Link
                  spy={true}
                  smooth={true}
                  duration={500}
                  offset={-100}
                  className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer"
                  to="id_ico_about_section"
                >
                  About
                </Link>
              ) : (
                <>
                  <button 
                    onClick={() => handleNavigation('/')}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => handleNavigation('/dashboard')}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => handleNavigation('/profile')}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Profile
                  </button>
                </>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              Copyright© 2025 F.U.M Protocol. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Updated Dashboard Header that matches the landing page style
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
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'vaults', label: 'Vaults', icon: '🔒' },
    { id: 'ai', label: 'AI Insights', icon: '🧠' },
    { id: 'profile', label: 'Profile', icon: '⚙️' }
  ]

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="bg-black/20 backdrop-blur-lg border-b border-gray-700 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            
            {/* User Info */}
            <div className="flex items-center space-x-3 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">
                {truncateAddress(userAddress)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Privacy Toggle */}
            <button
              onClick={() => onPrivacyToggle(!isPrivacyMode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isPrivacyMode 
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/50' 
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700'
              }`}
            >
              <span>{isPrivacyMode ? '🔒' : '👁️'}</span>
              <span className="text-sm">{isPrivacyMode ? 'Private' : 'Public'}</span>
            </button>
            
            {/* Notifications */}
            <button className="relative p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors">
              <span className="text-lg">🔔</span>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>
            
            {/* Disconnect Button */}
            <button
              onClick={onDisconnect}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}