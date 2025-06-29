import React from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X, 
  ExternalLink,
  Copy,
  Loader2,
  Clock,
  DollarSign,
  Zap
} from 'lucide-react'
import toast from 'react-hot-toast'

export interface EnhancedToastProps {
  type: 'success' | 'error' | 'info' | 'warning' | 'loading'
  title: string
  message: string
  txHash?: string
  duration?: number
  showProgress?: boolean
  progress?: number
  onClose?: () => void
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
  }>
}

export const EnhancedToast: React.FC<EnhancedToastProps> = ({
  type,
  title,
  message,
  txHash,
  duration = 5000,
  showProgress = false,
  progress = 0,
  onClose,
  actions = []
}) => {
  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bgColor: 'from-green-500/10 to-green-600/20',
          borderColor: 'border-green-500/40',
          glowColor: 'shadow-green-500/20'
        }
      case 'error':
        return {
          icon: AlertTriangle,
          color: 'text-red-400',
          bgColor: 'from-red-500/10 to-red-600/20',
          borderColor: 'border-red-500/40',
          glowColor: 'shadow-red-500/20'
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400',
          bgColor: 'from-yellow-500/10 to-yellow-600/20',
          borderColor: 'border-yellow-500/40',
          glowColor: 'shadow-yellow-500/20'
        }
      case 'loading':
        return {
          icon: Loader2,
          color: 'text-blue-400',
          bgColor: 'from-blue-500/10 to-blue-600/20',
          borderColor: 'border-blue-500/40',
          glowColor: 'shadow-blue-500/20'
        }
      default:
        return {
          icon: Info,
          color: 'text-blue-400',
          bgColor: 'from-blue-500/10 to-blue-600/20',
          borderColor: 'border-blue-500/40',
          glowColor: 'shadow-blue-500/20'
        }
    }
  }

  const config = getConfig()
  const IconComponent = config.icon

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

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-xl p-4 border ${config.borderColor} shadow-2xl ${config.glowColor} backdrop-blur-xl max-w-md`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <motion.div
            className={`${config.color}`}
            animate={type === 'loading' ? { rotate: 360 } : {}}
            transition={{
              duration: 2,
              repeat: type === 'loading' ? Infinity : 0,
              ease: "linear"
            }}
          >
            <IconComponent className="w-6 h-6" />
          </motion.div>
          <div>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/50"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Message */}
      <p className="text-gray-300 text-sm mb-3 leading-relaxed">{message}</p>

      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${config.bgColor.replace('/10', '/60').replace('/20', '/80')} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Transaction Hash */}
      {txHash && (
        <div className={`bg-gradient-to-r ${config.bgColor} rounded-lg p-3 border ${config.borderColor} mb-3`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-xs font-medium">Transaction</div>
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
      {actions.length > 0 && (
        <div className="flex items-center space-x-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                action.variant === 'primary'
                  ? `${config.color} bg-current/10 hover:bg-current/20 border border-current/30`
                  : 'text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// Enhanced toast functions
export const enhancedToast = {
  success: (title: string, message: string, options?: Partial<EnhancedToastProps>) => {
    return toast.custom((t) => (
      <EnhancedToast
        type="success"
        title={title}
        message={message}
        onClose={() => toast.dismiss(t.id)}
        {...options}
      />
    ), { duration: options?.duration || 5000 })
  },

  error: (title: string, message: string, options?: Partial<EnhancedToastProps>) => {
    return toast.custom((t) => (
      <EnhancedToast
        type="error"
        title={title}
        message={message}
        onClose={() => toast.dismiss(t.id)}
        {...options}
      />
    ), { duration: options?.duration || 8000 })
  },

  loading: (title: string, message: string, options?: Partial<EnhancedToastProps>) => {
    return toast.custom((t) => (
      <EnhancedToast
        type="loading"
        title={title}
        message={message}
        onClose={() => toast.dismiss(t.id)}
        {...options}
      />
    ), { duration: Infinity })
  },

  info: (title: string, message: string, options?: Partial<EnhancedToastProps>) => {
    return toast.custom((t) => (
      <EnhancedToast
        type="info"
        title={title}
        message={message}
        onClose={() => toast.dismiss(t.id)}
        {...options}
      />
    ), { duration: options?.duration || 5000 })
  },

  warning: (title: string, message: string, options?: Partial<EnhancedToastProps>) => {
    return toast.custom((t) => (
      <EnhancedToast
        type="warning"
        title={title}
        message={message}
        onClose={() => toast.dismiss(t.id)}
        {...options}
      />
    ), { duration: options?.duration || 6000 })
  },

  // Specialized vault operation toasts
  vaultOperation: {
    withdrawing: (vaultId: number, amount: string, token: string, txHash?: string) => {
      return enhancedToast.loading(
        'Withdrawing Vault',
        `Processing withdrawal of ${amount} ${token} from vault #${vaultId}`,
        {
          txHash,
          showProgress: true,
          progress: 25
        }
      )
    },

    withdrawSuccess: (vaultId: number, amount: string, token: string, txHash?: string) => {
      return enhancedToast.success(
        'Withdrawal Successful!',
        `Successfully withdrew ${amount} ${token} from vault #${vaultId}`,
        {
          txHash,
          actions: [
            {
              label: 'View Transaction',
              onClick: () => txHash && window.open(`https://testnet.snowtrace.io/tx/${txHash}`, '_blank'),
              variant: 'primary'
            }
          ]
        }
      )
    },

    withdrawError: (vaultId: number, error: string) => {
      return enhancedToast.error(
        'Withdrawal Failed',
        `Failed to withdraw from vault #${vaultId}: ${error}`,
        {
          actions: [
            {
              label: 'Try Again',
              onClick: () => window.location.reload(),
              variant: 'primary'
            }
          ]
        }
      )
    },

    emergencyWithdraw: (vaultId: number, penalty: string, txHash?: string) => {
      return enhancedToast.warning(
        'Emergency Withdrawal',
        `Emergency withdrawal initiated for vault #${vaultId}. Penalty: ${penalty}%`,
        {
          txHash,
          duration: 10000
        }
      )
    }
  }
}
