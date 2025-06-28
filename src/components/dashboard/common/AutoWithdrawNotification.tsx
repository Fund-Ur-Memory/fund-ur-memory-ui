import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  DollarSign,
  TrendingUp,
  X
} from 'lucide-react'

interface AutoWithdrawNotificationProps {
  isVisible: boolean
  vaultId: number
  amount: string
  tokenSymbol: string
  status: 'checking' | 'unlocking' | 'withdrawing' | 'success' | 'failed'
  reason?: 'time-met' | 'price-met' | 'combo-met'
  onClose?: () => void
  className?: string
}

export const AutoWithdrawNotification: React.FC<AutoWithdrawNotificationProps> = ({
  isVisible,
  vaultId,
  amount,
  tokenSymbol,
  status,
  reason = 'time-met',
  onClose,
  className = ''
}) => {
  const [progress, setProgress] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    if (!isVisible || status === 'success' || status === 'failed') return

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
      
      // Simulate progress based on status
      if (status === 'checking') {
        setProgress(prev => Math.min(prev + 3, 30))
      } else if (status === 'unlocking') {
        setProgress(prev => Math.min(prev + 2, 70))
      } else if (status === 'withdrawing') {
        setProgress(prev => Math.min(prev + 1.5, 95))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isVisible, status])

  useEffect(() => {
    if (status === 'success') {
      setProgress(100)
    }
  }, [status])

  const getStatusConfig = () => {
    switch (status) {
      case 'checking':
        return {
          icon: Clock,
          color: 'text-blue-500',
          bgColor: 'from-blue-500/20 to-blue-600/20',
          borderColor: 'border-blue-500/30',
          title: 'Checking Vault Conditions',
          message: `Verifying unlock conditions for vault #${vaultId}...`
        }
      case 'unlocking':
        return {
          icon: Zap,
          color: 'text-yellow-500',
          bgColor: 'from-yellow-500/20 to-yellow-600/20',
          borderColor: 'border-yellow-500/30',
          title: 'Unlocking Vault',
          message: `Conditions met! Unlocking vault #${vaultId}...`
        }
      case 'withdrawing':
        return {
          icon: DollarSign,
          color: 'text-purple-500',
          bgColor: 'from-purple-500/20 to-purple-600/20',
          borderColor: 'border-purple-500/30',
          title: 'Auto-Withdrawing Funds',
          message: `Automatically transferring ${amount} ${tokenSymbol} to your wallet...`
        }
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'from-green-500/20 to-green-600/20',
          borderColor: 'border-green-500/30',
          title: 'Auto-Withdrawal Complete!',
          message: `Successfully transferred ${amount} ${tokenSymbol} to your wallet`
        }
      case 'failed':
        return {
          icon: AlertTriangle,
          color: 'text-red-500',
          bgColor: 'from-red-500/20 to-red-600/20',
          borderColor: 'border-red-500/30',
          title: 'Auto-Withdrawal Failed',
          message: `Failed to auto-withdraw. Vault #${vaultId} is now unlocked for manual withdrawal.`
        }
      default:
        return {
          icon: Clock,
          color: 'text-gray-500',
          bgColor: 'from-gray-500/20 to-gray-600/20',
          borderColor: 'border-gray-500/30',
          title: 'Processing',
          message: 'Processing vault operation...'
        }
    }
  }

  const getReasonText = () => {
    switch (reason) {
      case 'time-met':
        return 'Time lock period completed'
      case 'price-met':
        return 'Price target reached'
      case 'combo-met':
        return 'Both time and price conditions met'
      default:
        return 'Unlock conditions satisfied'
    }
  }

  const config = getStatusConfig()
  const IconComponent = config.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className={`fixed top-4 right-4 z-50 max-w-sm ${className}`}
        >
          <motion.div
            className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border ${config.borderColor} shadow-2xl backdrop-blur-md`}
            layout
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <motion.div
                  className={`${config.color}`}
                  animate={status === 'checking' || status === 'unlocking' || status === 'withdrawing' ? 
                    { rotate: 360 } : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: status === 'success' || status === 'failed' ? 0 : Infinity,
                    ease: "linear"
                  }}
                >
                  <IconComponent className="w-6 h-6" />
                </motion.div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{config.title}</h3>
                  <p className="text-gray-400 text-xs">{getReasonText()}</p>
                </div>
              </div>
              
              {(status === 'success' || status === 'failed') && onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Message */}
            <p className="text-gray-300 text-sm mb-3">{config.message}</p>

            {/* Progress Bar - Only show during processing */}
            {(status === 'checking' || status === 'unlocking' || status === 'withdrawing') && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${config.bgColor.replace('/20', '')} rounded-full relative`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: [-100, 200] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            )}

            {/* Vault Info */}
            <div className={`bg-gradient-to-r ${config.bgColor} rounded-lg p-3 border ${config.borderColor}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium text-sm">Vault #{vaultId}</div>
                  <div className="text-gray-300 text-xs">{amount} {tokenSymbol}</div>
                </div>
                <div className={`${config.color}`}>
                  {status === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : status === 'failed' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <TrendingUp className="w-5 h-5" />
                  )}
                </div>
              </div>
            </div>

            {/* Time Elapsed - Only show during processing */}
            {(status === 'checking' || status === 'unlocking' || status === 'withdrawing') && (
              <div className="text-center text-xs text-gray-500 mt-2">
                Processing time: {timeElapsed}s
              </div>
            )}

            {/* Success/Error Actions */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-center"
              >
                <div className="text-xs text-green-400">
                  ✓ Funds successfully transferred to your wallet
                </div>
              </motion.div>
            )}

            {status === 'failed' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-center"
              >
                <div className="text-xs text-red-400">
                  ⚠ Please try manual withdrawal from vault details
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
