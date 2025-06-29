import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  X,
  ExternalLink,
  Copy,
  Loader2,
  Shield,
  Timer,
  Target
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AutoWithdrawNotificationProps {
  isVisible: boolean
  vaultId: number
  amount: string
  tokenSymbol: string
  status: 'checking' | 'unlocking' | 'withdrawing' | 'success' | 'failed' | 'confirming'
  reason?: 'time-met' | 'price-met' | 'combo-met'
  onClose?: () => void
  className?: string
  txHash?: string
  estimatedTime?: number
  currentStep?: number
  totalSteps?: number
  errorDetails?: string
}

export const AutoWithdrawNotification: React.FC<AutoWithdrawNotificationProps> = ({
  isVisible,
  vaultId,
  amount,
  tokenSymbol,
  status,
  reason = 'time-met',
  onClose,
  className = '',
  txHash,
  estimatedTime = 30,
  currentStep = 1,
  totalSteps = 3,
  errorDetails
}) => {
  const [progress, setProgress] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (!isVisible || status === 'success' || status === 'failed') return

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)

      // More realistic progress based on status and steps
      const stepProgress = (currentStep / totalSteps) * 100
      const baseProgress = Math.max(stepProgress - 20, 0)

      if (status === 'checking') {
        setProgress(prev => Math.min(prev + 2, Math.max(baseProgress + 15, 25)))
      } else if (status === 'unlocking') {
        setProgress(prev => Math.min(prev + 1.5, Math.max(baseProgress + 35, 50)))
      } else if (status === 'confirming') {
        setProgress(prev => Math.min(prev + 1, Math.max(baseProgress + 55, 75)))
      } else if (status === 'withdrawing') {
        setProgress(prev => Math.min(prev + 0.8, Math.max(baseProgress + 75, 90)))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isVisible, status, currentStep, totalSteps])

  useEffect(() => {
    if (status === 'success') {
      setProgress(100)
    }
  }, [status])

  // Auto-close success notifications after 8 seconds
  useEffect(() => {
    if (status === 'success' && onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [status, onClose])

  const copyTxHash = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash)
      toast.success('Transaction hash copied!', {
        duration: 2000,
        style: {
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10B981'
        }
      })
    }
  }

  const openExplorer = () => {
    if (txHash) {
      // Avalanche Fuji testnet explorer
      window.open(`https://testnet.snowtrace.io/tx/${txHash}`, '_blank')
    }
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'checking':
        return {
          icon: Clock,
          color: 'text-blue-400',
          bgColor: 'from-blue-500/10 to-blue-600/20',
          borderColor: 'border-blue-500/40',
          glowColor: 'shadow-blue-500/20',
          title: 'Checking Vault Conditions',
          message: `Verifying unlock conditions for vault #${vaultId}...`,
          stepText: 'Validating conditions'
        }
      case 'unlocking':
        return {
          icon: Zap,
          color: 'text-yellow-400',
          bgColor: 'from-yellow-500/10 to-yellow-600/20',
          borderColor: 'border-yellow-500/40',
          glowColor: 'shadow-yellow-500/20',
          title: 'Unlocking Vault',
          message: `Conditions met! Unlocking vault #${vaultId}...`,
          stepText: 'Executing unlock'
        }
      case 'confirming':
        return {
          icon: Shield,
          color: 'text-orange-400',
          bgColor: 'from-orange-500/10 to-orange-600/20',
          borderColor: 'border-orange-500/40',
          glowColor: 'shadow-orange-500/20',
          title: 'Confirming Transaction',
          message: `Waiting for blockchain confirmation...`,
          stepText: 'Confirming on blockchain'
        }
      case 'withdrawing':
        return {
          icon: DollarSign,
          color: 'text-purple-400',
          bgColor: 'from-purple-500/10 to-purple-600/20',
          borderColor: 'border-purple-500/40',
          glowColor: 'shadow-purple-500/20',
          title: 'Auto-Withdrawing Funds',
          message: `Transferring ${amount} ${tokenSymbol} to your wallet...`,
          stepText: 'Processing withdrawal'
        }
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bgColor: 'from-green-500/10 to-green-600/20',
          borderColor: 'border-green-500/40',
          glowColor: 'shadow-green-500/20',
          title: 'Withdrawal Successful!',
          message: `Successfully transferred ${amount} ${tokenSymbol} to your wallet`,
          stepText: 'Complete'
        }
      case 'failed':
        return {
          icon: AlertTriangle,
          color: 'text-red-400',
          bgColor: 'from-red-500/10 to-red-600/20',
          borderColor: 'border-red-500/40',
          glowColor: 'shadow-red-500/20',
          title: 'Withdrawal Failed',
          message: errorDetails || `Failed to auto-withdraw. Vault #${vaultId} is now unlocked for manual withdrawal.`,
          stepText: 'Error occurred'
        }
      default:
        return {
          icon: Loader2,
          color: 'text-gray-400',
          bgColor: 'from-gray-500/10 to-gray-600/20',
          borderColor: 'border-gray-500/40',
          glowColor: 'shadow-gray-500/20',
          title: 'Processing',
          message: 'Processing vault operation...',
          stepText: 'Initializing'
        }
    }
  }

  const getReasonText = () => {
    switch (reason) {
      case 'time-met':
        return { text: 'Time lock period completed', icon: Timer }
      case 'price-met':
        return { text: 'Price target reached', icon: Target }
      case 'combo-met':
        return { text: 'Both conditions met', icon: CheckCircle }
      default:
        return { text: 'Unlock conditions satisfied', icon: CheckCircle }
    }
  }



  const getEstimatedTimeRemaining = () => {
    const elapsed = timeElapsed
    const remaining = Math.max(estimatedTime - elapsed, 0)
    if (remaining === 0) return 'Almost done...'
    return `~${remaining}s remaining`
  }

  const config = getStatusConfig()
  const IconComponent = config.icon
  const reasonInfo = getReasonText()
  const ReasonIcon = reasonInfo.icon

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
            className={`bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-2xl p-5 border ${config.borderColor} shadow-2xl ${config.glowColor} backdrop-blur-xl`}
            layout
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  className={`${config.color} relative`}
                  animate={status === 'checking' || status === 'unlocking' || status === 'confirming' || status === 'withdrawing' ?
                    { rotate: 360 } : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: status === 'success' || status === 'failed' ? 0 : Infinity,
                    ease: "linear"
                  }}
                >
                  <IconComponent className="w-7 h-7" />
                  {(status === 'checking' || status === 'unlocking' || status === 'confirming' || status === 'withdrawing') && (
                    <motion.div
                      className={`absolute -inset-1 rounded-full border-2 ${config.borderColor} opacity-30`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-base">{config.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <ReasonIcon className="w-3 h-3 text-gray-400" />
                    <p className="text-gray-400 text-xs">{reasonInfo.text}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Expand/Collapse Button */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/50"
                  title={isExpanded ? "Collapse details" : "Expand details"}
                >
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TrendingUp className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Close Button */}
                {(status === 'success' || status === 'failed') && onClose && (
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/50"
                    title="Close notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Message */}
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">{config.message}</p>

            {/* Progress Section - Show during processing */}
            {(status === 'checking' || status === 'unlocking' || status === 'confirming' || status === 'withdrawing') && (
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                  <span className="font-medium">{config.stepText}</span>
                  <div className="flex items-center space-x-2">
                    <span>{Math.round(progress)}%</span>
                    <span className="text-gray-500">•</span>
                    <span>{getEstimatedTimeRemaining()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${config.bgColor.replace('/10', '/60').replace('/20', '/80')} rounded-full relative`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: [-100, 200] }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </motion.div>
                </div>

                {/* Step Indicators */}
                <div className="flex justify-between mt-3">
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <div
                      key={i}
                      className={`flex items-center space-x-1 ${
                        i + 1 <= currentStep ? config.color : 'text-gray-600'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          i + 1 <= currentStep
                            ? `bg-current`
                            : 'bg-gray-600'
                        }`}
                      />
                      <span className="text-xs font-medium">
                        {i + 1 === 1 && 'Check'}
                        {i + 1 === 2 && 'Unlock'}
                        {i + 1 === 3 && 'Confirm'}
                        {i + 1 === 4 && 'Withdraw'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vault Info */}
            <div className={`bg-gradient-to-r ${config.bgColor} rounded-xl p-4 border ${config.borderColor} backdrop-blur-sm`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-white font-semibold text-sm">Vault #{vaultId}</div>
                  <div className="text-gray-300 text-lg font-bold">{amount} {tokenSymbol}</div>
                </div>
                <div className={`${config.color}`}>
                  {status === 'success' ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : status === 'failed' ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-6 h-6" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Transaction Hash */}
              {txHash && (
                <div className="border-t border-gray-600/30 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs font-medium">Transaction</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={copyTxHash}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700/50"
                        title="Copy transaction hash"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={openExplorer}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700/50"
                        title="View on explorer"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-300 text-xs font-mono mt-1 truncate">
                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </div>
                </div>
              )}
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 border-t border-gray-600/30 pt-4"
                >
                  <div className="space-y-3">
                    {/* Processing Time */}
                    {(status === 'checking' || status === 'unlocking' || status === 'confirming' || status === 'withdrawing') && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Processing time:</span>
                        <span className="text-gray-300 font-mono">{timeElapsed}s</span>
                      </div>
                    )}

                    {/* Current Step Details */}
                    {(status === 'checking' || status === 'unlocking' || status === 'confirming' || status === 'withdrawing') && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Current step:</span>
                        <span className="text-gray-300">{currentStep} of {totalSteps}</span>
                      </div>
                    )}

                    {/* Network Info */}
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Network:</span>
                      <span className="text-gray-300">Avalanche Fuji</span>
                    </div>

                    {/* Gas Info */}
                    {(status === 'confirming' || status === 'withdrawing') && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Gas status:</span>
                        <span className="text-yellow-400">Optimizing...</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success/Error Actions */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <div className="text-sm text-green-400 font-medium">
                    Funds successfully transferred to your wallet
                  </div>
                </div>
                {txHash && (
                  <div className="mt-2 text-xs text-green-300">
                    Transaction confirmed on blockchain
                  </div>
                )}
              </motion.div>
            )}

            {status === 'failed' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <div className="text-sm text-red-400 font-medium">
                    Auto-withdrawal failed
                  </div>
                </div>
                <div className="mt-2 text-xs text-red-300">
                  Vault is unlocked - try manual withdrawal from vault details
                </div>
                {errorDetails && (
                  <div className="mt-2 text-xs text-gray-400 font-mono">
                    Error: {errorDetails}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
