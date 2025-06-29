import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'

interface AutoWithdrawNotification {
  id: string
  vaultId: number
  amount: string
  tokenSymbol: string
  status: 'checking' | 'unlocking' | 'withdrawing' | 'success' | 'failed'
  reason: 'time-met' | 'price-met' | 'combo-met'
  timestamp: number
}

export const useAutoWithdrawNotifications = () => {
  const [notifications, setNotifications] = useState<AutoWithdrawNotification[]>([])
  const { address, isConnected } = useAccount()

  // Simulate checking for auto-withdraw conditions
  useEffect(() => {
    if (!isConnected || !address) return

    const checkInterval = setInterval(() => {
      // This would normally check vault conditions via smart contract
      // For demo purposes, we'll simulate random auto-withdrawals
      const shouldTrigger = Math.random() < 0.1 // 10% chance every 30 seconds

      if (shouldTrigger) {
        triggerAutoWithdraw({
          vaultId: Math.floor(Math.random() * 10) + 1,
          amount: (Math.random() * 5 + 0.1).toFixed(2),
          tokenSymbol: ['ETH', 'AVAX'][Math.floor(Math.random() * 2)],
          reason: ['time-met', 'price-met', 'combo-met'][Math.floor(Math.random() * 3)] as any
        })
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(checkInterval)
  }, [isConnected, address])

  const triggerAutoWithdraw = useCallback((params: {
    vaultId: number
    amount: string
    tokenSymbol: string
    reason: 'time-met' | 'price-met' | 'combo-met'
  }) => {
    const notificationId = `auto-withdraw-${params.vaultId}-${Date.now()}`
    
    const newNotification: AutoWithdrawNotification = {
      id: notificationId,
      vaultId: params.vaultId,
      amount: params.amount,
      tokenSymbol: params.tokenSymbol,
      status: 'checking',
      reason: params.reason,
      timestamp: Date.now()
    }

    setNotifications(prev => [...prev, newNotification])

    // Simulate the auto-withdraw process
    setTimeout(() => {
      updateNotificationStatus(notificationId, 'unlocking')
    }, 2000)

    setTimeout(() => {
      updateNotificationStatus(notificationId, 'withdrawing')
    }, 5000)

    setTimeout(() => {
      // 90% success rate
      const success = Math.random() < 0.9
      updateNotificationStatus(notificationId, success ? 'success' : 'failed')
      
      // Auto-remove successful notifications after 5 seconds
      if (success) {
        setTimeout(() => {
          removeNotification(notificationId)
        }, 5000)
      }
    }, 8000)
  }, [])

  const updateNotificationStatus = useCallback((id: string, status: AutoWithdrawNotification['status']) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, status }
          : notification
      )
    )
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Manual trigger for testing
  const triggerTestAutoWithdraw = useCallback(() => {
    triggerAutoWithdraw({
      vaultId: 42,
      amount: '1.5',
      tokenSymbol: 'ETH',
      reason: 'time-met'
    })
  }, [triggerAutoWithdraw])

  return {
    notifications,
    triggerAutoWithdraw,
    removeNotification,
    clearAllNotifications,
    triggerTestAutoWithdraw // For testing purposes
  }
}
