import React from 'react'
import { motion } from 'framer-motion'
import { Loader, Zap, Clock } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
  variant?: 'default' | 'pulse' | 'dots' | 'orbit' | 'blockchain' | 'vault'
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'white'
  showProgress?: boolean
  progress?: number
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Loading...',
  className = '',
  variant = 'default',
  color = 'purple',
  showProgress = false,
  progress = 0
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
    white: 'text-white'
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
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 border border-current ${colorClasses[color]} rounded-sm`}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )

      case 'vault':
        return (
          <motion.div
            className={`${baseClass} relative`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Zap className="absolute inset-0" />
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
          className={`text-gray-400 ${sizeClasses[size].text} mt-2 text-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  )
}