import { useState, useEffect, useCallback } from 'react'
import { type DashboardData, type WalletAnalysisResponse } from '../../types/dashboard'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'
import { fumAgentService } from '../../services/fumAgentService'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

interface UseDashboardReturn {
  data: DashboardData | null
  walletAnalysis: WalletAnalysisResponse | null
  loading: boolean
  error: string | null
  activeTab: string
  setActiveTab: (tab: string) => void
  isPrivacyMode: boolean
  setIsPrivacyMode: (isPrivate: boolean) => void
  refetch: () => Promise<void>
  isRefetching: boolean
  lastUpdated: Date | null
  fetchWalletAnalysis: (walletAddress: string) => Promise<WalletAnalysisResponse | null>
}

export const useDashboard = (): UseDashboardReturn => {
  const { address } = useAccount()
  const [data, setData] = useState<DashboardData | null>(null)
  const [walletAnalysis, setWalletAnalysis] = useState<WalletAnalysisResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefetching, setIsRefetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isPrivacyMode, setIsPrivacyMode] = useState(() => {
    const saved = localStorage.getItem('fum-privacy-mode')
    return saved ? JSON.parse(saved) : false
  })
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    localStorage.setItem('fum-privacy-mode', JSON.stringify(isPrivacyMode))
  }, [isPrivacyMode])

  const fetchWalletAnalysis = async (walletAddress: string) => {
    try {
      const analysis = await fumAgentService.analyzeWallet(walletAddress)
      setWalletAnalysis(analysis)
      return analysis
    } catch (err) {
      console.error('Failed to fetch wallet analysis:', err)
      setError('Failed to fetch wallet analysis')
      return null
    }
  }

  const fetchDashboardData = useCallback(async (isRefetch = false) => {
    if (!address) {
      setError('No user address provided')
      setLoading(false)
      return
    }

    if (isRefetch) {
      setIsRefetching(true)
    } else {
      setLoading(true)
    }

    setError(null)

    try {
      const loadingDelay = isRefetch ? 300 : 1000
      await new Promise(resolve => setTimeout(resolve, loadingDelay))

      const analysis = await fetchWalletAnalysis(address)
      
      const mockData: DashboardData = {
        profile: {
          address,
          joinDate: '2024-01-15',
          riskProfile: analysis?.data?.riskTolerance === 'AGGRESSIVE' ? 'Aggressive' : 
                      analysis?.data?.riskTolerance === 'MODERATE' ? 'Moderate' : 'Conservative',
          totalAssets: 125000,
          activeVaults: 3,
          totalReturns: 15.5,
          successRate: 78
        },
        portfolio: {
          totalValue: 125000,
          change24h: 2.5,
          allocation: [
            { asset: 'Ethereum', symbol: 'ETH', amount: 12.5, value: 45000, percentage: 36, change24h: 2.1, chain: 'Ethereum' },
            { asset: 'Bitcoin', symbol: 'BTC', amount: 0.8, value: 35000, percentage: 28, change24h: 1.8, chain: 'Bitcoin' },
            { asset: 'Solana', symbol: 'SOL', amount: 150, value: 25000, percentage: 20, change24h: 3.2, chain: 'Solana' },
            { asset: 'Avalanche', symbol: 'AVAX', amount: 200, value: 20000, percentage: 16, change24h: 1.5, chain: 'Avalanche' }
          ]
        },
        transactions: [
          { id: 1, type: 'vault_create', asset: 'ETH', amount: 5, date: '2024-01-20', status: 'active', conditions: 'Time Lock: 30 days' },
          { id: 2, type: 'vault_execute', asset: 'BTC', amount: 0.2, date: '2024-01-18', status: 'completed', transactionHash: '0x123...' },
          { id: 3, type: 'swap', asset: 'SOL', amount: 50, date: '2024-01-15', status: 'completed', transactionHash: '0x456...' }
        ],
        aiInsights: {
          riskScore: analysis?.data?.riskScore || 65,
          confidence: analysis?.data?.confidencePercentage || 78,
          marketSentiment: analysis?.data?.marketAnalysis?.sentiment === 'BULLISH' ? 'Bullish' : 
                          analysis?.data?.marketAnalysis?.sentiment === 'BEARISH' ? 'Bearish' : 'Neutral',
          recommendations: analysis?.data?.personalizedRecommendations?.map((rec, index) => ({
            id: `rec-${index}`,
            type: 'suggestion',
            title: rec.split('**')[1]?.replace('**', '') || 'Recommendation',
            description: rec,
            action: 'view_details',
            confidence: analysis?.data?.confidencePercentage || 78,
            priority: 'medium',
            createdAt: Date.now()
          })) || [],
          personalizedRecommendations: analysis?.data?.personalizedRecommendations || [
            "Your trading patterns indicate high risk. Consider implementing strict stop-losses and reducing position sizes.",
            "High-frequency trading may lead to increased transaction costs and emotional decisions. Consider longer holding periods.",
            "Short holding periods often indicate emotional trading. Consider implementing a minimum 30-day holding rule.",
            "While markets are bullish, maintain discipline and avoid FOMO-driven decisions.",
            "Consider using commitment vaults to lock positions and prevent emotional decisions during market volatility.",
            "Consider implementing a systematic investment plan with regular rebalancing to reduce emotional decision-making."
          ]
        },
        vaults: [
          { id: 1, asset: 'ETH', amount: 5, value: 18000, condition: 'Time Lock', target: '30 days', progress: 60, status: 'active', createdAt: '2024-01-20', expiresAt: '2024-02-19', aiScore: 85, message: 'Strong long-term hold potential' },
          { id: 2, asset: 'BTC', amount: 0.3, value: 13000, condition: 'Price Target', target: '$45,000', progress: 25, status: 'active', createdAt: '2024-01-18', currentPrice: 43750, targetPrice: 45000, aiScore: 72, message: 'Price target within reach' },
          { id: 3, asset: 'SOL', amount: 100, value: 17000, condition: 'Smart Combo', target: 'Time + Price', progress: 40, status: 'active', createdAt: '2024-01-15', expiresAt: '2024-02-14', currentPrice: 170, targetPrice: 200, aiScore: 68, message: 'Balanced risk-reward profile' }
        ]
      }

      setData(mockData)
      setLastUpdated(new Date())

      if (isRefetch) {
        toast.success('Dashboard data updated successfully')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data'
      setError(errorMessage)
      console.error('Dashboard error:', err)

      if (isRefetch) {
        toast.error('Failed to refresh dashboard data')
      } else {
        toast.error('Failed to load dashboard')
      }
    } finally {
      setLoading(false)
      setIsRefetching(false)
    }
  }, [address])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const refetch = useCallback(async () => {
    await fetchDashboardData(true)
  }, [fetchDashboardData])

  const enhancedSetActiveTab = useCallback((tab: string) => {
    setActiveTab(tab)

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'dashboard_tab_change', {
        tab_name: tab,
        user_address: address
      })
    }
  }, [address])

  const enhancedSetIsPrivacyMode = useCallback((isPrivate: boolean) => {
    setIsPrivacyMode(isPrivate)

    toast.success(
      isPrivate ? 'Privacy mode enabled' : 'Privacy mode disabled',
      {
        icon: isPrivate ? '🔒' : '👁️',
        duration: 2000
      }
    )

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'privacy_mode_toggle', {
        privacy_enabled: isPrivate,
        user_address: address
      })
    }
  }, [address])

  return {
    data,
    walletAnalysis,
    loading,
    error,
    activeTab,
    setActiveTab: enhancedSetActiveTab,
    isPrivacyMode,
    setIsPrivacyMode: enhancedSetIsPrivacyMode,
    refetch,
    isRefetching,
    lastUpdated,
    fetchWalletAnalysis
  }
}