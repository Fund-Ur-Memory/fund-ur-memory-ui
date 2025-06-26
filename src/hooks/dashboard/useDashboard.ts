// src/hooks/dashboard/useDashboard.ts - Final fixed version with proper window type handling
import { useState, useEffect, useCallback } from 'react'
import { type DashboardData } from '../../types/dashboard'
import { MockAPIService } from '../../services/api/mockAPI'
import toast from 'react-hot-toast'

// Extend window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

interface UseDashboardReturn {
  data: DashboardData | null
  loading: boolean
  error: string | null
  activeTab: string
  setActiveTab: (tab: string) => void
  isPrivacyMode: boolean
  setIsPrivacyMode: (isPrivate: boolean) => void
  refetch: () => Promise<void>
  isRefetching: boolean
  lastUpdated: Date | null
}

export const useDashboard = (userAddress: string): UseDashboardReturn => {
  const [data, setData] = useState<DashboardData | null>(null)
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

  const fetchDashboardData = useCallback(async (isRefetch = false) => {
    if (!userAddress) {
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
      const loadingDelay = isRefetch ? 800 : 2000
      await new Promise(resolve => setTimeout(resolve, loadingDelay))
      
      const dashboardData = await MockAPIService.getDashboardData(userAddress)
      
      setData(dashboardData)
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
  }, [userAddress])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden && data) {
        fetchDashboardData(true)
      }
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [fetchDashboardData, data])

  useEffect(() => {
    const handleFocus = () => {
      if (data && !loading && !isRefetching) {
        const timeSinceLastUpdate = lastUpdated 
          ? Date.now() - lastUpdated.getTime() 
          : Infinity
        
        if (timeSinceLastUpdate > 2 * 60 * 1000) {
          fetchDashboardData(true)
        }
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [data, loading, isRefetching, lastUpdated, fetchDashboardData])

  const refetch = useCallback(async () => {
    await fetchDashboardData(true)
  }, [fetchDashboardData])

  const enhancedSetActiveTab = useCallback((tab: string) => {
    setActiveTab(tab)
    
    // Track tab analytics with proper type checking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'dashboard_tab_change', {
        tab_name: tab,
        user_address: userAddress
      })
    }
  }, [userAddress])

  const enhancedSetIsPrivacyMode = useCallback((isPrivate: boolean) => {
    setIsPrivacyMode(isPrivate)
    
    toast.success(
      isPrivate ? 'Privacy mode enabled' : 'Privacy mode disabled',
      {
        icon: isPrivate ? '🔒' : '👁️',
        duration: 2000
      }
    )
    
    // Track privacy mode analytics with proper type checking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'privacy_mode_toggle', {
        privacy_enabled: isPrivate,
        user_address: userAddress
      })
    }
  }, [userAddress])

  return {
    data,
    loading,
    error,
    activeTab,
    setActiveTab: enhancedSetActiveTab,
    isPrivacyMode,
    setIsPrivacyMode: enhancedSetIsPrivacyMode,
    refetch,
    isRefetching,
    lastUpdated
  }
}