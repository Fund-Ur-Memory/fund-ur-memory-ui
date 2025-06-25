import { useState, useEffect } from 'react'
import {type DashboardData } from '../../types/dashboard'
import { MockAPIService } from '../../services/api/mockAPI'

export const useDashboard = (userAddress: string) => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isPrivacyMode, setIsPrivacyMode] = useState(false)

  const fetchDashboardData = async () => {
    if (!userAddress) return

    setLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const dashboardData = await MockAPIService.getDashboardData(userAddress)
      setData(dashboardData)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress])

  return {
    data,
    loading,
    error,
    activeTab,
    setActiveTab,
    isPrivacyMode,
    setIsPrivacyMode,
    refetch: fetchDashboardData
  }
}