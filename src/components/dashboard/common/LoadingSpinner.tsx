import React from 'react'
import { motion } from 'framer-motion'
import { Loader, Zap, Clock, Download, Shield, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
  variant?: 'default' | 'pulse' | 'dots' | 'orbit' | 'blockchain' | 'vault' | 'withdraw' | 'auto-withdraw' | 'price-check'
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'white' | 'gold'
  showProgress?: boolean
  progress?: number
  subText?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Loading...',
  className = '',
  variant = 'default',
  color = 'purple',
  showProgress = false,
  progress = 0,
  subText
}) => {
  const sizeClasses = {
    xs: { spinner: 'h-3 w-3', text: 'text-xs' },
    sm: { spinner: 'h-4 w-4', text: 'text-xs' },
    md: { spinner: 'h-8 w-8', text: 'text-sm' },
    lg: { spinner: 'h-12 w-12', text: 'text-base' },
    xl: { spinner: 'h-16 w-16', text: 'text-lg' }
  }

  const colorClasses = {
    purple: 'text-purple-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    orange: 'text-orange-500',
    white: 'text-white',
    gold: 'text-yellow-500'
  }

  const renderSpinner = () => {
    const baseClass = `${sizeClasses[size].spinner} ${colorClasses[color]}`

    switch (variant) {
      case 'pulse':
        return (
          <motion.div
            className={`${baseClass} rounded-full border-2 border-current`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full bg-current ${colorClasses[color]}`}
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )

      case 'orbit':
        return (
          <div className={`relative ${sizeClasses[size].spinner}`}>
            <motion.div
              className={`absolute inset-0 rounded-full border-2 border-current ${colorClasses[color]} opacity-20`}
            />
            <motion.div
              className={`absolute top-0 left-1/2 w-1 h-1 rounded-full bg-current ${colorClasses[color]} -translate-x-1/2`}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ transformOrigin: `0 ${parseInt(sizeClasses[size].spinner.split('-')[1]) * 4}px` }}
            />
          </div>
        )

      case 'blockchain':
        return (
          <motion.div className={`${baseClass} relative`}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Shield className="absolute inset-0" />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Zap className="w-full h-full" />
            </motion.div>
          </motion.div>
        )

      case 'vault':
        return (
          <motion.div className={`${baseClass} relative`}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Zap className="absolute inset-0" />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Clock className="w-full h-full opacity-30" />
            </motion.div>
          </motion.div>
        )

      case 'withdraw':
        return (
          <motion.div className={`${baseClass} relative`}>
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Download className="absolute inset-0" />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              animate={{
                y: [0, -2, 0],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <DollarSign className="w-full h-full opacity-50" />
            </motion.div>
          </motion.div>
        )

      case 'auto-withdraw':
        return (
          <motion.div className={`${baseClass} relative`}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Zap className="absolute inset-0" />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.9, 0.3]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Download className="w-full h-full" />
            </motion.div>
          </motion.div>
        )

      case 'price-check':
        return (
          <motion.div className={`${baseClass} relative`}>
            <motion.div
              animate={{ 
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <TrendingUp className="absolute inset-0" />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              animate={{
                rotate: [360, 180, 0],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <TrendingDown className="w-full h-full opacity-50" />
            </motion.div>
          </motion.div>
        )

      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Loader className={baseClass} />
          </motion.div>
        )
    }
  }

  return (
    <motion.div
      className={`flex flex-col items-center justify-center ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {renderSpinner()}

      {showProgress && (
        <div className="w-24 h-1 bg-gray-700 rounded-full mt-3 overflow-hidden">
          <motion.div
            className={`h-full bg-current ${colorClasses[color]} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      )}

      {text && (
        <motion.p
          className={`text-gray-300 ${sizeClasses[size].text} mt-2 text-center font-medium`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}

      {subText && (
        <motion.p
          className="text-gray-500 text-xs mt-1 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {subText}
        </motion.p>
      )}
    </motion.div>
  )
}
