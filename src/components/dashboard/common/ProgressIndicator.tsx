import React from 'react'
import { motion } from 'framer-motion'
import { Check, Clock, AlertCircle, Zap } from 'lucide-react'

interface ProgressStep {
  id: string
  label: string
  description?: string
  status: 'pending' | 'active' | 'completed' | 'error'
  icon?: React.ReactNode
}

interface ProgressIndicatorProps {
  steps?: ProgressStep[]
  currentStep?: number
  variant?: 'linear' | 'circular' | 'steps' | 'transaction'
  size?: 'sm' | 'md' | 'lg'
  showLabels?: boolean
  className?: string
  progress?: number // 0-100 for linear/circular variants
  color?: 'purple' | 'blue' | 'green' | 'orange'
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps = [],
  currentStep = 0,
  variant = 'linear',
  size = 'md',
  showLabels = true,
  className = '',
  progress = 0,
  color = 'purple'
}) => {
  const colorClasses = {
    purple: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      background: 'rgba(139, 92, 246, 0.1)',
      border: 'rgba(139, 92, 246, 0.3)'
    },
    blue: {
      primary: '#3B82F6',
      secondary: '#60A5FA',
      background: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.3)'
    },
    green: {
      primary: '#10B981',
      secondary: '#34D399',
      background: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.3)'
    },
    orange: {
      primary: '#F59E0B',
      secondary: '#FBBF24',
      background: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.3)'
    }
  }

  const sizeClasses = {
    sm: { height: '4px', circle: '24px', step: '32px' },
    md: { height: '6px', circle: '32px', step: '40px' },
    lg: { height: '8px', circle: '48px', step: '56px' }
  }

  const colors = colorClasses[color]
  const sizes = sizeClasses[size]

  const renderLinearProgress = () => (
    <div className={`w-full ${className}`}>
      <div 
        className="relative rounded-full overflow-hidden bg-gray-700"
        style={{ height: sizes.height }}
      >
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ 
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: [-32, 300] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      {showLabels && (
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>0%</span>
          <span className="font-medium" style={{ color: colors.primary }}>
            {Math.round(progress)}%
          </span>
          <span>100%</span>
        </div>
      )}
    </div>
  )

  const renderCircularProgress = () => {
    const radius = parseInt(sizes.circle) / 2 - 4
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
      <div className={`relative ${className}`} style={{ width: sizes.circle, height: sizes.circle }}>
        <svg
          className="transform -rotate-90"
          width={sizes.circle}
          height={sizes.circle}
        >
          {/* Background circle */}
          <circle
            cx={parseInt(sizes.circle) / 2}
            cy={parseInt(sizes.circle) / 2}
            r={radius}
            stroke="rgba(107, 114, 128, 0.3)"
            strokeWidth="4"
            fill="transparent"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={parseInt(sizes.circle) / 2}
            cy={parseInt(sizes.circle) / 2}
            r={radius}
            stroke={colors.primary}
            strokeWidth="4"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    )
  }

  const renderStepsProgress = () => (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Step indicator */}
          <motion.div
            className="relative flex items-center justify-center rounded-full border-2"
            style={{
              width: sizes.step,
              height: sizes.step,
              borderColor: step.status === 'completed' || step.status === 'active' 
                ? colors.primary 
                : 'rgba(107, 114, 128, 0.3)',
              backgroundColor: step.status === 'completed' 
                ? colors.primary 
                : step.status === 'active'
                ? colors.background
                : 'transparent'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {step.status === 'completed' && (
              <Check className="w-4 h-4 text-white" />
            )}
            {step.status === 'active' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4" style={{ color: colors.primary }} />
              </motion.div>
            )}
            {step.status === 'error' && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            {step.status === 'pending' && (
              <Clock className="w-4 h-4 text-gray-500" />
            )}
            
            {step.icon && step.status === 'pending' && (
              <div className="text-gray-500">{step.icon}</div>
            )}
          </motion.div>

          {/* Step label */}
          {showLabels && (
            <div className="ml-3 flex-1">
              <div className="text-sm font-medium text-white">
                {step.label}
              </div>
              {step.description && (
                <div className="text-xs text-gray-400">
                  {step.description}
                </div>
              )}
            </div>
          )}

          {/* Connector line */}
          {index < steps.length - 1 && (
            <motion.div
              className="flex-1 h-0.5 mx-4"
              style={{
                backgroundColor: currentStep > index 
                  ? colors.primary 
                  : 'rgba(107, 114, 128, 0.3)'
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )

  const renderTransactionProgress = () => {
    const transactionSteps = [
      { label: 'Preparing', status: progress > 0 ? 'completed' : 'active' },
      { label: 'Signing', status: progress > 25 ? 'completed' : progress > 0 ? 'active' : 'pending' },
      { label: 'Broadcasting', status: progress > 50 ? 'completed' : progress > 25 ? 'active' : 'pending' },
      { label: 'Confirming', status: progress > 75 ? 'completed' : progress > 50 ? 'active' : 'pending' },
      { label: 'Complete', status: progress >= 100 ? 'completed' : 'pending' }
    ]

    return (
      <div className={`space-y-3 ${className}`}>
        {transactionSteps.map((step, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
              style={{
                borderColor: step.status === 'completed' || step.status === 'active' 
                  ? colors.primary 
                  : 'rgba(107, 114, 128, 0.3)',
                backgroundColor: step.status === 'completed' 
                  ? colors.primary 
                  : 'transparent'
              }}
            >
              {step.status === 'completed' && (
                <Check className="w-3 h-3 text-white" />
              )}
              {step.status === 'active' && (
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
            
            <span 
              className={`text-sm ${
                step.status === 'completed' || step.status === 'active' 
                  ? 'text-white font-medium' 
                  : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>
    )
  }

  switch (variant) {
    case 'circular':
      return renderCircularProgress()
    case 'steps':
      return renderStepsProgress()
    case 'transaction':
      return renderTransactionProgress()
    default:
      return renderLinearProgress()
  }
}

// Specialized transaction progress component
export const TransactionProgress: React.FC<{
  status: 'preparing' | 'signing' | 'broadcasting' | 'confirming' | 'completed' | 'error'
  txHash?: string
  className?: string
}> = ({ status, txHash, className = '' }) => {
  const getProgress = () => {
    switch (status) {
      case 'preparing': return 10
      case 'signing': return 30
      case 'broadcasting': return 60
      case 'confirming': return 85
      case 'completed': return 100
      case 'error': return 0
      default: return 0
    }
  }

  return (
    <div className={className}>
      <ProgressIndicator
        variant="transaction"
        progress={getProgress()}
        color={status === 'error' ? 'orange' : 'purple'}
      />
      
      {txHash && (
        <motion.div
          className="mt-3 p-2 bg-gray-800 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-xs text-gray-400">Transaction Hash:</div>
          <div className="text-xs font-mono text-purple-400 break-all">
            {txHash}
          </div>
        </motion.div>
      )}
    </div>
  )
}
