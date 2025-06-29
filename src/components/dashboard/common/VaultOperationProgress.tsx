import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  Clock, 
  Zap, 
  Shield, 
  DollarSign, 
  AlertTriangle,
  Loader2,
  ExternalLink,
  Copy,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

interface OperationStep {
  id: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  estimatedTime: number
}

interface VaultOperationProgressProps {
  isVisible: boolean
  operation: 'withdraw' | 'emergency-withdraw' | 'create-vault'
  vaultId?: number
  amount?: string
  tokenSymbol?: string
  status: 'pending' | 'checking' | 'unlocking' | 'confirming' | 'processing' | 'success' | 'error'
  currentStep: number
  totalSteps: number
  txHash?: string
  error?: string
  onClose?: () => void
  onRetry?: () => void
}

export const VaultOperationProgress: React.FC<VaultOperationProgressProps> = ({
  isVisible,
  operation,
  vaultId,
  amount,
  tokenSymbol,
  status,
  currentStep,
  totalSteps,
  txHash,
  error,
  onClose,
  onRetry
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [progress, setProgress] = useState(0)

  const operationSteps: Record<string, OperationStep[]> = {
    withdraw: [
      { id: 'check', label: 'Checking', description: 'Verifying vault conditions', icon: Clock, estimatedTime: 5 },
      { id: 'unlock', label: 'Unlocking', description: 'Unlocking vault funds', icon: Zap, estimatedTime: 10 },
      { id: 'confirm', label: 'Confirming', description: 'Blockchain confirmation', icon: Shield, estimatedTime: 15 },
      { id: 'withdraw', label: 'Withdrawing', description: 'Transferring funds', icon: DollarSign, estimatedTime: 10 }
    ],
    'emergency-withdraw': [
      { id: 'validate', label: 'Validating', description: 'Checking emergency conditions', icon: AlertTriangle, estimatedTime: 3 },
      { id: 'penalty', label: 'Calculating', description: 'Computing penalty amount', icon: Clock, estimatedTime: 5 },
      { id: 'confirm', label: 'Confirming', description: 'Blockchain confirmation', icon: Shield, estimatedTime: 15 },
      { id: 'withdraw', label: 'Withdrawing', description: 'Emergency fund transfer', icon: DollarSign, estimatedTime: 10 }
    ],
    'create-vault': [
      { id: 'validate', label: 'Validating', description: 'Checking vault parameters', icon: Clock, estimatedTime: 3 },
      { id: 'prepare', label: 'Preparing', description: 'Preparing transaction', icon: Zap, estimatedTime: 5 },
      { id: 'confirm', label: 'Confirming', description: 'Blockchain confirmation', icon: Shield, estimatedTime: 15 },
      { id: 'create', label: 'Creating', description: 'Vault creation complete', icon: CheckCircle, estimatedTime: 5 }
    ]
  }

  const steps = operationSteps[operation] || operationSteps.withdraw

  useEffect(() => {
    if (!isVisible || status === 'success' || status === 'error') return

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
      
      // Calculate progress based on current step and time
      const stepProgress = ((currentStep - 1) / totalSteps) * 100
      const timeProgress = Math.min((timeElapsed / getTotalEstimatedTime()) * 100, 95)
      setProgress(Math.max(stepProgress, timeProgress))
    }, 1000)

    return () => clearInterval(interval)
  }, [isVisible, status, currentStep, totalSteps, timeElapsed])

  useEffect(() => {
    if (status === 'success') {
      setProgress(100)
    }
  }, [status])

  const getTotalEstimatedTime = () => {
    return steps.reduce((total, step) => total + step.estimatedTime, 0)
  }

  const getEstimatedTimeRemaining = () => {
    const totalTime = getTotalEstimatedTime()
    const remaining = Math.max(totalTime - timeElapsed, 0)
    if (remaining === 0) return 'Almost done...'
    return `~${remaining}s remaining`
  }

  const getOperationTitle = () => {
    switch (operation) {
      case 'withdraw':
        return 'Withdrawing Vault'
      case 'emergency-withdraw':
        return 'Emergency Withdrawal'
      case 'create-vault':
        return 'Creating Vault'
      default:
        return 'Processing Operation'
    }
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          color: 'text-green-400',
          bgColor: 'from-green-500/10 to-green-600/20',
          borderColor: 'border-green-500/40',
          title: 'Operation Successful!',
          message: operation === 'withdraw' 
            ? `Successfully withdrew ${amount} ${tokenSymbol} from vault #${vaultId}`
            : operation === 'emergency-withdraw'
            ? `Emergency withdrawal completed for vault #${vaultId}`
            : 'Vault created successfully'
        }
      case 'error':
        return {
          color: 'text-red-400',
          bgColor: 'from-red-500/10 to-red-600/20',
          borderColor: 'border-red-500/40',
          title: 'Operation Failed',
          message: error || 'An unexpected error occurred'
        }
      default:
        return {
          color: 'text-blue-400',
          bgColor: 'from-blue-500/10 to-blue-600/20',
          borderColor: 'border-blue-500/40',
          title: getOperationTitle(),
          message: `Processing ${operation.replace('-', ' ')} operation...`
        }
    }
  }

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
      window.open(`https://testnet.snowtrace.io/tx/${txHash}`, '_blank')
    }
  }

  const config = getStatusConfig()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            className={`bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-2xl p-6 border ${config.borderColor} shadow-2xl backdrop-blur-xl max-w-md w-full`}
            layout
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <motion.div
                  className={`${config.color}`}
                  animate={status === 'pending' || status === 'checking' || status === 'unlocking' || status === 'confirming' || status === 'processing' ? 
                    { rotate: 360 } : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: status === 'success' || status === 'error' ? 0 : Infinity,
                    ease: "linear"
                  }}
                >
                  {status === 'success' ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : status === 'error' ? (
                    <AlertTriangle className="w-8 h-8" />
                  ) : (
                    <Loader2 className="w-8 h-8" />
                  )}
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-lg">{config.title}</h3>
                  {vaultId && (
                    <p className="text-gray-400 text-sm">Vault #{vaultId}</p>
                  )}
                </div>
              </div>
              
              {(status === 'success' || status === 'error') && onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Message */}
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">{config.message}</p>

            {/* Progress Bar */}
            {status !== 'success' && status !== 'error' && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <div className="flex items-center space-x-2">
                    <span>{Math.round(progress)}%</span>
                    <span className="text-gray-500">•</span>
                    <span>{getEstimatedTimeRemaining()}</span>
                  </div>
                </div>
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
              </div>
            )}

            {/* Steps */}
            <div className="space-y-3 mb-6">
              {steps.map((step, index) => {
                const stepNumber = index + 1
                const isActive = stepNumber === currentStep
                const isCompleted = stepNumber < currentStep || status === 'success'
                const IconComponent = step.icon

                return (
                  <motion.div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      isActive 
                        ? `bg-blue-500/10 border border-blue-500/30` 
                        : isCompleted
                        ? 'bg-green-500/10 border border-green-500/30'
                        : 'bg-gray-700/30 border border-gray-600/30'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      isCompleted 
                        ? 'bg-green-500/20 text-green-400' 
                        : isActive 
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-600/20 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <IconComponent className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className={`font-medium text-sm ${
                        isCompleted 
                          ? 'text-green-400' 
                          : isActive 
                          ? 'text-blue-400'
                          : 'text-gray-500'
                      }`}>
                        {step.label}
                      </div>
                      <div className="text-xs text-gray-400">
                        {step.description}
                      </div>
                    </div>

                    <div className="text-xs">
                      {isCompleted && (
                        <span className="text-green-400 font-medium">✓</span>
                      )}
                      {isActive && (
                        <motion.span 
                          className="text-blue-400 font-medium"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          ...
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Transaction Hash */}
            {txHash && (
              <div className={`bg-gradient-to-r ${config.bgColor} rounded-lg p-3 border ${config.borderColor} mb-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-400 text-xs font-medium">Transaction Hash</div>
                    <div className="text-gray-300 text-xs font-mono mt-1">
                      {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    </div>
                  </div>
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
              </div>
            )}

            {/* Actions */}
            {(status === 'success' || status === 'error') && (
              <div className="flex items-center space-x-3">
                {status === 'error' && onRetry && (
                  <button
                    onClick={onRetry}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Try Again
                  </button>
                )}
                {onClose && (
                  <button
                    onClick={onClose}
                    className={`${status === 'error' && onRetry ? 'flex-1' : 'w-full'} bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors`}
                  >
                    {status === 'success' ? 'Done' : 'Close'}
                  </button>
                )}
              </div>
            )}

            {/* Processing Info */}
            {status !== 'success' && status !== 'error' && (
              <div className="text-center text-xs text-gray-500">
                Processing time: {timeElapsed}s
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
