import React from 'react'
import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  width?: number | string
  height?: number | string
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  animation?: 'pulse' | 'wave' | 'shimmer'
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  className = '',
  variant = 'rectangular',
  animation = 'shimmer'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full'
      case 'rounded':
        return 'rounded-lg'
      case 'text':
        return 'rounded'
      default:
        return 'rounded-md'
    }
  }

  const getAnimationClasses = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse'
      case 'wave':
        return 'animate-bounce'
      default:
        return ''
    }
  }

  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: { x: '100%' }
  }

  return (
    <div
      className={`bg-gray-700 relative overflow-hidden ${getVariantClasses()} ${getAnimationClasses()} ${className}`}
      style={{ width, height }}
    >
      {animation === 'shimmer' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}
    </div>
  )
}

// Specialized skeleton components for vault cards
export const VaultCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    className={`vault-card-container ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="ico_iconbox_block p-4" style={{
      background: 'rgba(17, 24, 39, 0.6)',
      border: '1px solid rgba(107, 114, 128, 0.2)',
      borderRadius: '12px',
      minHeight: '260px'
    }}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <SkeletonLoader variant="circular" width={50} height={50} />
        <SkeletonLoader width={80} height={24} />
      </div>

      {/* Title skeleton */}
      <div className="mb-3">
        <SkeletonLoader width="70%" height={20} className="mb-2" />
        <SkeletonLoader width="90%" height={16} />
      </div>

      {/* Amount skeleton */}
      <div className="mb-4">
        <SkeletonLoader width="50%" height={24} className="mb-1" />
        <SkeletonLoader width="40%" height={16} />
      </div>

      {/* Progress skeleton */}
      <div className="mb-4">
        <SkeletonLoader width="100%" height={8} variant="rounded" />
      </div>

      {/* Status skeleton */}
      <div className="flex justify-between items-center">
        <SkeletonLoader width={60} height={20} />
        <SkeletonLoader width={80} height={32} variant="rounded" />
      </div>
    </div>
  </motion.div>
)

// Dashboard metrics skeleton
export const MetricCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    className={`ico_iconbox_block p-4 ${className}`}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    style={{
      background: 'rgba(17, 24, 39, 0.6)',
      border: '1px solid rgba(107, 114, 128, 0.2)',
      borderRadius: '12px'
    }}
  >
    <div className="flex items-center justify-between mb-3">
      <SkeletonLoader variant="circular" width={40} height={40} />
      <SkeletonLoader width={60} height={16} />
    </div>
    
    <SkeletonLoader width="80%" height={24} className="mb-2" />
    <SkeletonLoader width="60%" height={16} />
  </motion.div>
)

// Table row skeleton
export const TableRowSkeleton: React.FC<{ columns?: number; className?: string }> = ({ 
  columns = 4, 
  className = '' 
}) => (
  <motion.tr
    className={className}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    {Array.from({ length: columns }, (_, index) => (
      <td key={index} className="p-3">
        <SkeletonLoader 
          width={index === 0 ? '80%' : '60%'} 
          height={16} 
        />
      </td>
    ))}
  </motion.tr>
)

// Loading state wrapper component
export const LoadingStateWrapper: React.FC<{
  isLoading: boolean
  skeleton: React.ReactNode
  children: React.ReactNode
  className?: string
}> = ({ isLoading, skeleton, children, className = '' }) => (
  <motion.div
    className={className}
    layout
    transition={{ duration: 0.3 }}
  >
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {skeleton}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
)

// Grid skeleton for vault listings
export const VaultGridSkeleton: React.FC<{ count?: number; className?: string }> = ({ 
  count = 4, 
  className = '' 
}) => (
  <div className={`row g-2 ${className}`}>
    {Array.from({ length: count }, (_, index) => (
      <motion.div
        key={index}
        className="col-lg-6 col-md-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <VaultCardSkeleton />
      </motion.div>
    ))}
  </div>
)

// Import AnimatePresence for LoadingStateWrapper
import { AnimatePresence } from 'framer-motion'
