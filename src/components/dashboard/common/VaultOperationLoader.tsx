import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Shield,
  Loader
} from 'lucide-react'

interface VaultOperationLoaderProps {
  isVisible: boolean
  operation: 'withdraw' | 'auto-withdraw' | 'emergency-withdraw' | 'price-check' | 'creating' | 'unlocking'
  vaultId?: number
  amount?: string
  tokenSymbol?: string
  status?: 'pending' | 'confirming' | 'success' | 'error'
  txHash?: string
  onClose?: () => void
  className?: string
  estimatedTime?: number
  currentStep?: number
  totalSteps?: number
  message?: string
}

export const VaultOperationLoader: React.FC<VaultOperationLoaderProps> = ({
  isVisible,
  operation,
  vaultId,
  amount,
  tokenSymbol = 'ETH',
  status = 'pending',
  txHash,
  onClose,
  className = '',
  estimatedTime = 30,
  currentStep = 1,
  message
}) => {
  const [progress, setProgress] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    if (!isVisible || status === 'success' || status === 'error') return

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)

      // Simulate progress based on operation type
      if (status === 'pending') {
        setProgress(prev => Math.min(prev + 2, 40))
      } else if (status === 'confirming') {
        setProgress(prev => Math.min(prev + 1.5, 85))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isVisible, status])

  useEffect(() => {
    if (status === 'success') {
      setProgress(100)
    }
  }, [status])

  const getOperationConfig = () => {
    switch (operation) {
      case 'withdraw':
        return {
          title: 'Withdrawing Funds',
          icon: Download,
          color: 'text-blue-500',
          bgColor: 'from-blue-500/20 to-blue-600/20',
          borderColor: 'border-blue-500/30',
          description: `Claiming ${amount} ${tokenSymbol} from vault #${vaultId}`,
          steps: [
            'Initiating withdrawal request',
            'Confirming transaction on blockchain',
            'Transferring funds to your wallet'
          ]
        }
      case 'auto-withdraw':
        return {
          title: 'Auto-Withdrawal in Progress',
          icon: Zap,
          color: 'text-purple-500',
          bgColor: 'from-purple-500/20 to-purple-600/20',
          borderColor: 'border-purple-500/30',
          description: `Automatically releasing ${amount} ${tokenSymbol} from vault #${vaultId}`,
          steps: [
            'Checking vault unlock conditions',
            'Executing automated withdrawal',
            'Transferring funds to your wallet'
          ]
        }
      case 'emergency-withdraw':
        return {
          title: 'Emergency Withdrawal',
          icon: AlertTriangle,
          color: 'text-red-500',
          bgColor: 'from-red-500/20 to-red-600/20',
          borderColor: 'border-red-500/30',
          description: `Emergency exit from vault #${vaultId} (10% penalty applies)`,
          steps: [
            'Initiating emergency protocol',
            'Processing penalty calculation',
            'Transferring remaining funds'
          ]
        }
      case 'price-check':
        return {
          title: 'Checking Price Conditions',
          icon: TrendingUp,
          color: 'text-green-500',
          bgColor: 'from-green-500/20 to-green-600/20',
          borderColor: 'border-green-500/30',
          description: `Monitoring ${tokenSymbol} price targets for vault #${vaultId}`,
          steps: [
            'Fetching current market price',
            'Comparing with target conditions',
            'Updating vault status'
          ]
        }
      case 'creating':
        return {
          title: 'Creating Vault',
          icon: Shield,
          color: 'text-purple-500',
          bgColor: 'from-purple-500/20 to-purple-600/20',
          borderColor: 'border-purple-500/30',
          description: `Setting up your ${amount} ${tokenSymbol} commitment vault`,
          steps: [
            'Validating vault parameters',
            'Deploying smart contract',
            'Locking your funds securely'
          ]
        }
      case 'unlocking':
        return {
          title: 'Unlocking Vault',
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'from-yellow-500/20 to-yellow-600/20',
          borderColor: 'border-yellow-500/30',
          description: `Vault #${vaultId} conditions have been met`,
          steps: [
            'Verifying unlock conditions',
            'Updating vault status',
            'Preparing funds for withdrawal'
          ]
        }
      default:
        return {
          title: 'Processing',
          icon: Loader,
          color: 'text-gray-500',
          bgColor: 'from-gray-500/20 to-gray-600/20',
          borderColor: 'border-gray-500/30',
          description: 'Processing your request...',
          steps: ['Initializing', 'Processing', 'Completing']
        }
    }
  }

  const config = getOperationConfig()
  const IconComponent = config.icon

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case 'error':
        return <AlertTriangle className="w-8 h-8 text-red-500" />
      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <IconComponent className={`w-8 h-8 ${config.color}`} />
          </motion.div>
        )
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'success':
        return {
          title: 'Operation Successful!',
          subtitle: operation === 'auto-withdraw'
            ? 'Funds have been automatically transferred to your wallet'
            : 'Your transaction has been completed successfully'
        }
      case 'error':
        return {
          title: 'Operation Failed',
          subtitle: 'Please try again or contact support if the issue persists'
        }
      case 'confirming':
        return {
          title: 'Confirming Transaction',
          subtitle: 'Waiting for blockchain confirmation...'
        }
      default:
        return {
          title: config.title,
          subtitle: config.description
        }
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 ${className}`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-md w-full border ${config.borderColor} shadow-2xl`}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                className="mb-4 flex justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
              >
                {getStatusIcon()}
              </motion.div>

              <motion.h2
                className="text-xl font-bold text-white mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {getStatusMessage().title}
              </motion.h2>

              <motion.p
                className="text-gray-400 text-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {message || getStatusMessage().subtitle}
              </motion.p>
            </div>

            {/* Progress Steps - Only show during processing */}
            {(status === 'pending' || status === 'confirming') && (
              <div className="space-y-3 mb-6">
                {config.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
                      index < currentStep
                        ? `bg-gradient-to-r ${config.bgColor} border ${config.borderColor}`
                        : 'bg-gray-800/50 border border-gray-700/50'
                    }`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`flex-shrink-0 ${
                      index < currentStep ? config.color : 'text-gray-500'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : index === currentStep ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-current" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        index < currentStep ? 'text-white' : 'text-gray-400'
                      }`}>
                        {step}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Progress Bar */}
            {(status === 'pending' || status === 'confirming') && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
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

            {/* Transaction Hash */}
            {txHash && (
              <motion.div
                className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-xs text-gray-400 mb-1">Transaction Hash</div>
                <div className="text-sm text-white font-mono break-all">
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </div>
              </motion.div>
            )}

            {/* Time Elapsed */}
            {(status === 'pending' || status === 'confirming') && (
              <div className="text-center text-xs text-gray-500">
                Time elapsed: {timeElapsed}s / ~{estimatedTime}s
              </div>
            )}

            {/* Close Button for Success/Error */}
            {(status === 'success' || status === 'error') && onClose && (
              <motion.button
                onClick={onClose}
                className="w-full mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Close
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
