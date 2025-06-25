// src/App.tsx - Fixed version using separate config
import { useState, useEffect } from 'react'
import HomePage from "./components/HomePage"
import ErrorPage from "./components/ErrorPage"
import { Dashboard } from './components/dashboard/Dashboard'
import { LayoutWrapper } from './components/layout/LayoutWrapper'

import "@rainbow-me/rainbowkit/styles.css"
import GlobalAOSProvider from "./GlobalAOSProvider/GlobalAOSProvider"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"

// Import config from separate file
import { config } from './components/config/wagmi'

// Profile Component (placeholder)
const ProfilePage = () => {
  const [userAddress] = useState('0x742d35Cc6e3A9e45E85D19b8b4b9B1a9A4f1234b9') // Mock address
  
  const handleDisconnect = () => {
    // Handle wallet disconnection
    console.log('Disconnecting wallet...')
  }

  return (
    <LayoutWrapper currentPage="profile">
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Profile Settings</h1>
            <p className="text-gray-400 text-lg">Manage your account preferences and security settings</p>
          </div>
          
          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">F</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                  </h3>
                  <p className="text-gray-400 mb-4">Conservative Trader</p>
                  <button
                    onClick={handleDisconnect}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            </div>
            
            {/* Settings */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-6">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Wallet Address</label>
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                      <span className="text-white font-mono">{userAddress}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Risk Profile</label>
                    <select className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white">
                      <option>Conservative</option>
                      <option>Moderate</option>
                      <option>Aggressive</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-6">Privacy Settings</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Hide Portfolio Amounts', enabled: true },
                    { label: 'Private Transaction History', enabled: false },
                    { label: 'Anonymous Analytics', enabled: true }
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                      <span className="text-white">{setting.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}

function App() {
  const queryClient = new QueryClient()
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    // Listen for browser navigation (back/forward buttons)
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Simple routing logic
  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage />
      case '/dashboard':
        return (
          <Dashboard 
            userAddress="0x742d35Cc6e3A9e45E85D19b8b4b9B1a9A4f1234b9" 
            onDisconnect={() => {
              console.log('Disconnecting wallet...')
              // Handle wallet disconnection logic
            }} 
          />
        )
      case '/profile':
        return <ProfilePage />
      default:
        return <ErrorPage />
    }
  }

  return (
    <GlobalAOSProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <div className="index_ico page_wrapper">
              {renderPage()}
            </div>
            <Toaster 
              position="top-center"
              toastOptions={{
                style: {
                  background: 'rgba(17, 24, 39, 0.95)',
                  color: '#fff',
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  backdropFilter: 'blur(10px)'
                }
              }}
            />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </GlobalAOSProvider>
  )
}

export default App