// src/App.tsx - Real Web3 integration with Wagmi
import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'
import { injected } from 'wagmi/connectors'
import HomePage from "./components/HomePage"
import ErrorPage from "./components/ErrorPage"
import { Dashboard } from './components/dashboard/Dashboard'

import "@rainbow-me/rainbowkit/styles.css"
import GlobalAOSProvider from "./GlobalAOSProvider/GlobalAOSProvider"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import toast from "react-hot-toast"

// Import config from separate file
import { config } from './components/config/wagmi'

// Import existing components for consistency
import Header from "./components/Header"
import Footer from "./components/Footer"
import Scrollbar from "./components/Scrollbar"

// Enhanced Profile Component with real Web3 integration
const ProfilePage = () => {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  
  const handleDisconnect = () => {
    disconnect()
    toast.success('Wallet disconnected successfully')
    // Navigate to home after disconnect
    setTimeout(() => {
      window.location.href = '/'
    }, 1000)
  }

  // Redirect if not connected
  if (!isConnected || !address) {
    return <ConnectionGuard />
  }

  return (
    <div className="index_ico page_wrapper">
      <Header />
      <main className="page_content">
        {/* Hero Section */}
        <section className="ico_hero_section section_decoration text-center" style={{ 
          backgroundImage: `url(${"/images/shapes/shape_net_ico_hero_section_bg.svg"})`,
          minHeight: "auto",
          paddingTop: "2rem",
          paddingBottom: "2rem"
        }}>
          <div className="container">
            <h1 className="hero_title text-white mb-4" data-aos="fade-up">
              Profile Settings
            </h1>
            <p className="hero_subtitle" data-aos="fade-up">
              Manage your account preferences and security settings
            </p>
          </div>
        </section>

        {/* Profile Content */}
        <section className="section_space">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                {/* Profile Card */}
                <div className="row mb-5">
                  <div className="col-lg-4">
                    <div className="ico_iconbox_block text-center p-4">
                      <div className="mb-3" style={{
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, #6f42c1, #9d5be8)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}>
                        <span style={{ fontSize: '2.5rem', color: 'white', fontWeight: 'bold' }}>
                          {ensName ? ensName[0].toUpperCase() : address.slice(2, 4).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="iconbox_title text-white mb-2">
                        {ensName || `${address.slice(0, 6)}...${address.slice(-4)}`}
                      </h3>
                      <p className="text-secondary mb-2">
                        <span className="badge bg-success me-2">🟢</span>
                        Connected
                      </p>
                      <p className="text-secondary mb-4">Conservative Trader</p>
                      <button
                        onClick={handleDisconnect}
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
                  
                  {/* Settings */}
                  <div className="col-lg-8">
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
                              {address}
                            </span>
                          </div>
                        </div>
                        
                        {ensName && (
                          <div className="mb-3">
                            <label className="text-secondary mb-2 d-block">ENS Name</label>
                            <div style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '8px',
                              padding: '12px'
                            }}>
                              <span className="text-white">{ensName}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="mb-3">
                          <label className="text-secondary mb-2 d-block">Network</label>
                          <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            padding: '12px'
                          }}>
                            <span className="text-white">Monad Testnet</span>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label className="text-secondary mb-2 d-block">Risk Profile</label>
                          <select className="form-control" style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'white'
                          }}>
                            <option value="Conservative">Conservative</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Aggressive">Aggressive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="ico_iconbox_block p-4">
                  <h3 className="iconbox_title text-white mb-4">Privacy Settings</h3>
                  <div className="row">
                    {[
                      { label: 'Hide Portfolio Amounts', enabled: true },
                      { label: 'Private Transaction History', enabled: false },
                      { label: 'Anonymous Analytics', enabled: true }
                    ].map((setting, index) => (
                      <div key={index} className="col-md-6 mb-3">
                        <div className="d-flex justify-content-between align-items-center p-3" style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '8px'
                        }}>
                          <span className="text-white">{setting.label}</span>
                          <div className="form-check form-switch">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              defaultChecked={setting.enabled}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="text-center mt-5">
                  <ul className="btns_group unordered_list justify-content-center p-0">
                    <li>
                      <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="ico_creative_btn"
                      >
                        <span className="btn_wrapper">
                          <span className="btn_label">View Dashboard</span>
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => toast('Export feature coming soon!')}
                        className="ico_creative_btn"
                        style={{
                          background: 'linear-gradient(135deg, #374151, #4b5563)'
                        }}
                      >
                        <span className="btn_wrapper">
                          <span className="btn_label">Export Data</span>
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Scrollbar />
      </main>
      <Footer />
    </div>
  )
}

// Connection Guard Component with real Web3 integration
const ConnectionGuard = ({ children }: { children?: React.ReactNode }) => {
  const { isConnected, isConnecting } = useAccount()
  const { connect, isPending } = useConnect()

  const handleConnect = () => {
    connect({ connector: injected() })
  }

  if (isConnected && children) {
    return <>{children}</>
  }

  return (
    <div className="index_ico page_wrapper">
      <Header />
      <main className="page_content">
        <section className="ico_hero_section section_decoration text-center" style={{ 
          backgroundImage: `url(${"/images/shapes/shape_net_ico_hero_section_bg.svg"})`,
          minHeight: "80vh",
          display: "flex",
          alignItems: "center"
        }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="text-center">
                  <div className="mb-4" style={{ fontSize: "4rem" }}>
                    {isConnecting || isPending ? '⏳' : '🔒'}
                  </div>
                  <h2 className="heading_text text-white mb-4">
                    {isConnecting || isPending ? 'Connecting Wallet...' : 'Connect Your Wallet'}
                  </h2>
                  <p className="text-secondary mb-4">
                    {isConnecting || isPending 
                      ? 'Please approve the connection in your wallet'
                      : 'Please connect your wallet to access the dashboard and manage your commitment vaults.'
                    }
                  </p>
                  
                  {!isConnecting && !isPending && (
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                      <button
                        onClick={handleConnect}
                        className="ico_creative_btn"
                      >
                        <span className="btn_wrapper">
                          <span className="btn_label">Connect Wallet</span>
                        </span>
                      </button>
                      
                      <button
                        onClick={() => window.location.href = '/'}
                        className="ico_creative_btn"
                        style={{
                          background: 'linear-gradient(135deg, #374151, #4b5563)'
                        }}
                      >
                        <span className="btn_wrapper">
                          <span className="btn_label">Go to Home Page</span>
                        </span>
                      </button>
                    </div>
                  )}
                  
                  {(isConnecting || isPending) && (
                    <div className="ico_progress mt-4">
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          role="progressbar"
                          style={{ 
                            width: "75%",
                            background: "linear-gradient(135deg, #6f42c1, #9d5be8)"
                          }}
                          aria-valuenow={75}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

// Loading screen for navigation
const LoadingScreen = ({ message = "Loading..." }: { message?: string }) => (
  <div className="index_ico page_wrapper">
    <Header />
    <main className="page_content">
      <section className="ico_hero_section section_decoration text-center" style={{ 
        backgroundImage: `url(${"/images/shapes/shape_net_ico_hero_section_bg.svg"})`,
        minHeight: "80vh",
        display: "flex",
        alignItems: "center"
      }}>
        <div className="container">
          <div className="text-center">
            <div className="ico_progress">
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ 
                    width: "75%",
                    background: "linear-gradient(135deg, #6f42c1, #9d5be8)"
                  }}
                  aria-valuenow={75}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
            </div>
            <h2 className="heading_text text-white mt-4">{message}</h2>
            <p className="text-secondary">Please wait while we set things up...</p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
)

// Main App Component with real Web3 integration
function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [isLoading, setIsLoading] = useState(false)
  
  // Real Web3 hooks
  const { address, isConnected, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    // Listen for browser navigation (back/forward buttons)
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Enhanced navigation with loading states
  const navigate = (path: string, requiresAuth = false) => {
    if (requiresAuth && !isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    
    // Simulate navigation delay for better UX
    setTimeout(() => {
      window.history.pushState({}, '', path)
      setCurrentPath(path)
      setIsLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 300)
  }

  // Enhanced disconnect handler
  const handleDisconnect = () => {
    disconnect()
    toast.success('Wallet disconnected successfully')
    navigate('/')
  }

  // Handle connection state changes
  useEffect(() => {
    if (isConnected && address) {
      toast.success(`Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`)
    }
  }, [isConnected, address])

  // Loading screen during navigation
  if (isLoading) {
    return <LoadingScreen message="Navigating..." />
  }

  // Loading screen during wallet connection
  if (isConnecting) {
    return <LoadingScreen message="Connecting Wallet..." />
  }

  // Enhanced routing logic with real Web3 state
  const renderPage = () => {
    try {
      switch (currentPath) {
        case '/':
          return <HomePage />
        
        case '/dashboard':
          if (!isConnected || !address) {
            return <ConnectionGuard />
          }
          return (
            <Dashboard 
              userAddress={address} 
              onDisconnect={handleDisconnect}
            />
          )
        
        case '/profile':
          return <ProfilePage />
        
        default:
          return <ErrorPage />
      }
    } catch (error) {
      console.error('Page rendering error:', error)
      return <ErrorPage />
    }
  }

  return (
    <div className="index_ico page_wrapper">
      {renderPage()}
    </div>
  )
}

// Main App wrapper with providers
function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 3,
      },
    },
  })

  return (
    <GlobalAOSProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <AppContent />
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(17, 24, 39, 0.95)',
                  color: '#fff',
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '14px',
                  fontWeight: '500'
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </GlobalAOSProvider>
  )
}

export default App