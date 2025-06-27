import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Zap, Shield, CheckCircle, AlertCircle, Loader } from 'lucide-react'

interface WalletConnectionAnimationProps {
  isVisible: boolean
  onComplete?: () => void
  status?: 'connecting' | 'success' | 'error'
  walletName?: string
  className?: string
}

export const WalletConnectionAnimation: React.FC<WalletConnectionAnimationProps> = ({
  isVisible,
  onComplete,
  status = 'connecting',
  walletName = 'Wallet',
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    { 
      id: 'detecting', 
      label: 'Detecting Wallet', 
      icon: <Wallet className="w-6 h-6" />,
      description: 'Searching for available wallets...'
    },
    { 
      id: 'connecting', 
      label: 'Establishing Connection', 
      icon: <Zap className="w-6 h-6" />,
      description: 'Connecting to your wallet...'
    },
    { 
      id: 'securing', 
      label: 'Securing Connection', 
      icon: <Shield className="w-6 h-6" />,
      description: 'Verifying security protocols...'
    },
    { 
      id: 'finalizing', 
      label: 'Finalizing Setup', 
      icon: <CheckCircle className="w-6 h-6" />,
      description: 'Setting up your dashboard...'
    }
  ]

  useEffect(() => {
    if (!isVisible || status !== 'connecting') return

    const stepDuration = 1500 // 1.5 seconds per step
    const progressInterval = 50 // Update progress every 50ms

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (steps.length * (stepDuration / progressInterval)))
        if (newProgress >= 100) {
          clearInterval(progressTimer)
          setTimeout(() => onComplete?.(), 500)
          return 100
        }
        return newProgress
      })
    }, progressInterval)

    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepTimer)
          return prev
        }
        return prev + 1
      })
    }, stepDuration)

    return () => {
      clearInterval(progressTimer)
      clearInterval(stepTimer)
    }
  }, [isVisible, status, onComplete, steps.length])

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-500" />
      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader className="w-12 h-12 text-purple-500" />
          </motion.div>
        )
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'success':
        return {
          title: 'Connection Successful!',
          subtitle: `${walletName} is now connected to F.U.M`
        }
      case 'error':
        return {
          title: 'Connection Failed',
          subtitle: 'Please try again or check your wallet'
        }
      default:
        return {
          title: 'Connecting Wallet',
          subtitle: 'Please wait while we set things up...'
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
          className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center ${className}`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700 shadow-2xl"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="mb-4 flex justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
              >
                {getStatusIcon()}
              </motion.div>
              
              <motion.h2
                className="text-2xl font-bold text-white mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {getStatusMessage().title}
              </motion.h2>
              
              <motion.p
                className="text-gray-400"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {getStatusMessage().subtitle}
              </motion.p>
            </div>

            {/* Progress Steps - Only show during connecting */}
            {status === 'connecting' && (
              <div className="space-y-4 mb-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                      index === currentStep 
                        ? 'bg-purple-500/20 border border-purple-500/30' 
                        : index < currentStep 
                        ? 'bg-green-500/10 border border-green-500/20' 
                        : 'bg-gray-800/50 border border-gray-700/50'
                    }`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      className={`flex-shrink-0 ${
                        index === currentStep 
                          ? 'text-purple-400' 
                          : index < currentStep 
                          ? 'text-green-400' 
                          : 'text-gray-500'
                      }`}
                      animate={index === currentStep ? { 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{ 
                        duration: 1.5, 
                        repeat: index === currentStep ? Infinity : 0 
                      }}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        step.icon
                      )}
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className={`font-medium ${
                        index === currentStep 
                          ? 'text-purple-300' 
                          : index < currentStep 
                          ? 'text-green-300' 
                          : 'text-gray-400'
                      }`}>
                        {step.label}
                      </div>
                      {index === currentStep && (
                        <motion.div
                          className="text-sm text-gray-500 mt-1"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {step.description}
                        </motion.div>
                      )}
                    </div>
                    
                    {index === currentStep && (
                      <motion.div
                        className="flex-shrink-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader className="w-4 h-4 text-purple-400" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Progress Bar - Only show during connecting */}
            {status === 'connecting' && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    {/* Shimmer effect */}
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

            {/* Wallet Info */}
            <motion.div
              className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-white">{walletName}</div>
                  <div className="text-sm text-gray-400">
                    {status === 'connecting' && 'Establishing secure connection...'}
                    {status === 'success' && 'Connected successfully'}
                    {status === 'error' && 'Connection failed'}
                  </div>
                </div>
                <div className="ml-auto">
                  {status === 'connecting' && (
                    <motion.div
                      className="w-3 h-3 bg-yellow-500 rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  {status === 'success' && (
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  )}
                  {status === 'error' && (
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </div>
              </div>
            </motion.div>

            {/* Floating particles effect */}
            {status === 'connecting' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {Array.from({ length: 6 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60"
                    initial={{ 
                      x: Math.random() * 400, 
                      y: Math.random() * 300,
                      scale: 0 
                    }}
                    animate={{ 
                      y: [null, -20, null],
                      scale: [0, 1, 0],
                      opacity: [0, 0.6, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      delay: i * 0.5,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
