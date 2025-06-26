// src/components/dashboard/Dashboard.tsx - Fixed sizing and layout
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useEnsName, useBalance, useDisconnect } from "wagmi";
import { OverviewTab } from "./tabs/OverviewTab";
import { VaultsTab } from "./tabs/VaultsTab";
import { AIInsightsTab } from "./tabs/AIInsightsTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { LoadingSpinner } from "./common/LoadingSpinner";
import { useDashboard } from "../../hooks/dashboard/useDashboard";

// Import the existing components for consistency
import Header from "../Header";
import Footer from "../Footer";
import Scrollbar from "../Scrollbar";
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";

interface DashboardProps {
  userAddress: string;
  onDisconnect: () => void;
}

// Error Boundary Component
class DashboardErrorBoundary extends React.Component<
  { children: React.ReactNode; onReset: () => void },
  { hasError: boolean; error: Error | null }
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
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
                    <div className="ico_iconbox_block p-5 text-center">
                      <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" style={{ width: '4rem', height: '4rem' }} />
                      <h2 className="heading_text text-white mb-4">Something went wrong</h2>
                      <p className="text-secondary mb-4">
                        We encountered an unexpected error while loading the dashboard.
                      </p>
                      <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <button 
                          onClick={() => {
                            this.setState({ hasError: false, error: null });
                            this.props.onReset();
                          }}
                          className="ico_creative_btn"
                        >
                          <span className="btn_wrapper">
                            <span className="btn_label">Try Again</span>
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
                            <span className="btn_label">Go Home</span>
                          </span>
                        </button>
                      </div>
                      {this.state.error && (
                        <details className="mt-4 text-left">
                          <summary className="text-secondary cursor-pointer text-sm">
                            Error Details
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-800 rounded text-xs text-red-300 overflow-auto" style={{
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px'
                          }}>
                            {this.state.error.toString()}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      );
    }

    return this.props.children;
  }
}

// Connection Status Component
const ConnectionStatus: React.FC<{ isOnline: boolean }> = ({ isOnline }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="position-fixed"
    style={{
      top: '1rem',
      right: '1rem',
      zIndex: 9999,
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      backdropFilter: 'blur(10px)',
      background: isOnline 
        ? 'rgba(34, 197, 94, 0.2)' 
        : 'rgba(239, 68, 68, 0.2)',
      border: isOnline 
        ? '1px solid rgba(34, 197, 94, 0.3)' 
        : '1px solid rgba(239, 68, 68, 0.3)'
    }}
  >
    <div className="d-flex align-items-center">
      {isOnline ? <Wifi className="w-4 h-4 me-2" style={{ width: '1rem', height: '1rem' }} /> : <WifiOff className="w-4 h-4 me-2" style={{ width: '1rem', height: '1rem' }} />}
      <span className={`small fw-medium ${isOnline ? 'text-success' : 'text-danger'}`}>
        {isOnline ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  </motion.div>
)

// Loading Screen Component
const DashboardLoadingScreen: React.FC = () => {
  const { address } = useAccount()
  
  return (
    <div className="index_ico page_wrapper">
      <Header />
      <main className="page_content">
        <section className="ico_hero_section section_decoration text-center" style={{ 
          backgroundImage: `url(${"/images/shapes/shape_net_ico_hero_section_bg.svg"})`,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center"
        }}>
          <div className="container">
            <div className="text-center">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                }}
                className="mx-auto mb-4"
                style={{
                  width: '4rem',
                  height: '4rem',
                  background: 'linear-gradient(135deg, #6f42c1, #9d5be8)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span className="text-white fw-bold" style={{ fontSize: '1.5rem' }}>F</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="heading_text text-white mb-2">
                  Analyzing Your Wallet
                </h2>
                <p className="text-secondary mb-4">
                  Connected to: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Wallet'}
                </p>
                <p className="text-secondary mb-6">
                  AI agents are reviewing your transaction history and building personalized insights...
                </p>
                
                {/* Progress steps */}
                <div className="mx-auto" style={{ maxWidth: '28rem' }}>
                  <div className="row">
                    {[
                      { step: 1, label: "Connecting to blockchain", delay: 0 },
                      { step: 2, label: "Analyzing transaction history", delay: 1 },
                      { step: 3, label: "Generating AI insights", delay: 2 },
                      { step: 4, label: "Preparing dashboard", delay: 3 }
                    ].map(({ step, label, delay }) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: delay * 0.5 }}
                        className="col-12 mb-3"
                      >
                        <div className="d-flex align-items-center text-start">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: delay * 0.5 + 0.2 }}
                            className="me-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: '1.5rem',
                              height: '1.5rem',
                              background: 'linear-gradient(135deg, #6f42c1, #9d5be8)',
                              borderRadius: '50%'
                            }}
                          >
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: delay * 0.5 + 0.4 }}
                              className="text-white fw-bold"
                              style={{ fontSize: '0.75rem' }}
                            >
                              {step}
                            </motion.span>
                          </motion.div>
                          <span className="text-secondary">{label}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

// Error Screen Component
const DashboardErrorScreen: React.FC<{ 
  error: string; 
  onRetry: () => void; 
  onGoHome: () => void;
}> = ({ error, onRetry, onGoHome }) => (
  <div className="index_ico page_wrapper">
    <Header />
    <main className="page_content">
      <section className="ico_hero_section section_decoration text-center" style={{ 
        backgroundImage: `url(${"/images/shapes/shape_net_ico_hero_section_bg.svg"})`,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center"
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="row justify-content-center"
          >
            <div className="col-lg-8">
              <div className="ico_iconbox_block p-5 text-center">
                <div className="mb-4 d-flex align-items-center justify-content-center" style={{
                  width: '5rem',
                  height: '5rem',
                  background: 'rgba(239, 68, 68, 0.2)',
                  borderRadius: '50%',
                  margin: '0 auto'
                }}>
                  <AlertCircle className="text-danger" style={{ width: '2.5rem', height: '2.5rem' }} />
                </div>
                
                <h2 className="heading_text text-white mb-2">
                  Error Loading Dashboard
                </h2>
                <p className="text-secondary mb-4">{error}</p>
                
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <button onClick={onRetry} className="ico_creative_btn">
                    <span className="btn_wrapper">
                      <span className="btn_icon_left">
                        <RefreshCw style={{ width: '1rem', height: '1rem' }} />
                      </span>
                      <span className="btn_label">Try Again</span>
                    </span>
                  </button>
                  <button 
                    onClick={onGoHome} 
                    className="ico_creative_btn"
                    style={{
                      background: 'linear-gradient(135deg, #374151, #4b5563)'
                    }}
                  >
                    <span className="btn_wrapper">
                      <span className="btn_label">Go to Home</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
)

// Custom Dashboard Header that matches existing design
const DashboardHeader: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
  isPrivacyMode: boolean;
  onPrivacyToggle: (isPrivate: boolean) => void;
  userAddress: string;
  onRefresh?: () => void;
  isRefetching?: boolean;
  lastUpdated?: Date | null;
  ensName?: string | null;
  balance?: string;
}> = ({ 
  activeTab, 
  onTabChange, 
  isPrivacyMode, 
  onPrivacyToggle, 
  userAddress,
  onRefresh,
  isRefetching,
  lastUpdated,
  ensName,
  balance
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'vaults', label: 'Vaults', icon: '🔒' },
    { id: 'ai', label: 'AI Insights', icon: '🧠' },
    { id: 'profile', label: 'Profile', icon: '⚙️' }
  ];

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never'
    const now = Date.now()
    const diff = now - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    return date.toLocaleDateString()
  }

  return (
    <section className="ico_hero_section section_decoration text-center" style={{ 
      backgroundImage: `url(${"/images/shapes/shape_net_ico_hero_section_bg.svg"})`,
    }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h1 className="hero_title text-white mb-2" data-aos="fade-up">
              Dashboard Overview
            </h1>
            <p className="hero_subtitle mb-2" data-aos="fade-up">
              {ensName || `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`}
              {balance && ` • ${balance} MON`}
            </p>
            {lastUpdated && (
              <p className="text-secondary small">
                Last updated: {formatLastUpdated(lastUpdated)}
              </p>
            )}
          </div>
          <div className="col-lg-4">
            <div className="d-flex justify-content-end align-items-center flex-wrap gap-2">
              <button
                onClick={() => onPrivacyToggle(!isPrivacyMode)}
                className="ico_creative_btn"
                style={{ 
                  minWidth: 'auto', 
                  padding: '0.5rem 1rem',
                  background: isPrivacyMode 
                    ? 'linear-gradient(135deg, #6f42c1, #9d5be8)' 
                    : 'linear-gradient(135deg, #374151, #4b5563)'
                }}
              >
                <span className="btn_wrapper">
                  <span className="btn_label">
                    {isPrivacyMode ? '🔒 Private' : '👁️ Public'}
                  </span>
                </span>
              </button>
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={isRefetching}
                  className="ico_creative_btn"
                  style={{ 
                    minWidth: 'auto', 
                    padding: '0.5rem 1rem',
                    opacity: isRefetching ? 0.7 : 1
                  }}
                >
                  <span className="btn_wrapper">
                    <span className="btn_label">
                      {isRefetching ? '⟳ Refreshing...' : '🔄 Refresh'}
                    </span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="row justify-content-center mt-4">
          <div className="col-lg-10">
            <ul className="nav unordered_list justify-content-center" role="tablist">
              {tabs.map((tab) => (
                <li key={tab.id} className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                    type="button"
                    role="tab"
                    onClick={() => onTabChange(tab.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      minWidth: '120px',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: '1.2em' }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main Dashboard Component
export const Dashboard: React.FC<DashboardProps> = ({
  userAddress,
  onDisconnect,
}) => {
  const {
    data,
    loading,
    error,
    activeTab,
    setActiveTab,
    isPrivacyMode,
    setIsPrivacyMode,
    refetch,
    isRefetching,
    lastUpdated
  } = useDashboard(userAddress);

  // Real Web3 hooks for additional data
  const { isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address: userAddress as `0x${string}` })
  const { data: balance } = useBalance({ address: userAddress as `0x${string}` })
  const { disconnect } = useDisconnect()

  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle wallet disconnection
  React.useEffect(() => {
    if (!isConnected) {
      onDisconnect()
    }
  }, [isConnected, onDisconnect])

  // Enhanced disconnect handler
  const handleDisconnect = () => {
    disconnect()
    onDisconnect()
  }

  // Loading state
  if (loading) {
    return <DashboardLoadingScreen />;
  }

  // Error state
  if (error || !data) {
    return (
      <DashboardErrorScreen
        error={error || "Failed to load dashboard data"}
        onRetry={refetch}
        onGoHome={() => window.location.href = '/'}
      />
    );
  }

  const renderActiveTab = () => {
    const tabProps = {
      data,
      isPrivacyMode,
      onRefetch: refetch,
    };

    switch (activeTab) {
      case "overview":
        return <OverviewTab {...tabProps} />;
      case "vaults":
        return <VaultsTab {...tabProps} />;
      case "ai":
        return <AIInsightsTab {...tabProps} />;
      case "profile":
        return <ProfileTab {...tabProps} userAddress={userAddress} onDisconnect={handleDisconnect} />;
      default:
        return <OverviewTab {...tabProps} />;
    }
  };

  return (
    <DashboardErrorBoundary onReset={refetch}>
      <div className="index_ico page_wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Connection Status Indicator */}
        <ConnectionStatus isOnline={isOnline} />
        
        {/* Header */}
        <Header />
        
        <main className="page_content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Dashboard Header */}
          <DashboardHeader
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isPrivacyMode={isPrivacyMode}
            onPrivacyToggle={setIsPrivacyMode}
            userAddress={userAddress}
            onRefresh={refetch}
            isRefetching={isRefetching}
            lastUpdated={lastUpdated}
            ensName={ensName}
            balance={balance ? `${parseFloat(balance.formatted).toFixed(4)}` : undefined}
          />

          {/* Main Content */}
          <div style={{ 
            flex: 1, 
            minHeight: 0, // Important for flex children
            paddingBottom: '2rem',
            overflow: 'auto' // Allow scrolling if needed
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ height: '100%' }}
              >
                {renderActiveTab()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Refresh Overlay */}
          <AnimatePresence>
            {isRefetching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="position-fixed"
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(4px)',
                  zIndex: 9998,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="ico_iconbox_block p-4 text-center"
                  style={{
                    background: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(107, 114, 128, 0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <LoadingSpinner size="lg" />
                  <p className="text-white fw-medium mt-3 mb-0">Refreshing data...</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <Scrollbar />
        </main>
        
        <Footer />
      </div>
    </DashboardErrorBoundary>
  );
};