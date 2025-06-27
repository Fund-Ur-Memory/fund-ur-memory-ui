import React from 'react'
import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'circle' | 'button' | 'vault-card' | 'metric-card'
  width?: string | number
  height?: string | number
  className?: string
  count?: number
  animated?: boolean
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width = '100%',
  height = '1rem',
  className = '',
  count = 1,
  animated = true
}) => {
  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: { x: '100%' },
  }

  const pulseVariants = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
  }

  const getSkeletonStyle = () => {
    const baseStyle = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
    }

    switch (variant) {
      case 'circle':
        return {
          ...baseStyle,
          borderRadius: '50%',
          aspectRatio: '1',
        }
      case 'button':
        return {
          ...baseStyle,
          borderRadius: '8px',
          height: '40px',
        }
      case 'card':
        return {
          ...baseStyle,
          borderRadius: '12px',
          height: '200px',
        }
      default:
        return {
          ...baseStyle,
          borderRadius: '4px',
        }
    }
  }

  const renderSkeleton = (index: number = 0) => (
    <motion.div
      key={index}
      className={`relative overflow-hidden bg-gray-700/30 ${className}`}
      style={getSkeletonStyle()}
      initial="initial"
      animate="animate"
      variants={animated ? pulseVariants : undefined}
      transition={animated ? {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      } : undefined}
    >
      {animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          variants={shimmerVariants}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}
    </motion.div>
  )

  if (count === 1) {
    return renderSkeleton()
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, index) => renderSkeleton(index))}
    </div>
  )
}

// Specialized skeleton components
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
        <SkeletonLoader variant="circle" width={50} height={50} />
        <SkeletonLoader width={80} height={24} />
      </div>

      {/* Title skeleton */}
      <SkeletonLoader width="70%" height={20} className="mb-3" />
      
      {/* Amount skeleton */}
      <SkeletonLoader width="50%" height={24} className="mb-4" />
      
      {/* Message skeleton */}
      <div className="space-y-2 mb-4">
        <SkeletonLoader width="100%" height={16} />
        <SkeletonLoader width="80%" height={16} />
        <SkeletonLoader width="60%" height={16} />
      </div>

      {/* Status skeleton */}
      <div className="flex items-center justify-between">
        <SkeletonLoader width={100} height={32} />
        <SkeletonLoader variant="circle" width={8} height={8} />
      </div>
    </div>
  </motion.div>
)

export const MetricCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    className={`ico_iconbox_block p-4 ${className}`}
    style={{
      background: 'rgba(17, 24, 39, 0.6)',
      border: '1px solid rgba(107, 114, 128, 0.2)',
      borderRadius: '12px',
      minHeight: '120px'
    }}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center justify-between mb-3">
      <SkeletonLoader variant="circle" width={40} height={40} />
      <SkeletonLoader width={60} height={20} />
    </div>
    
    <SkeletonLoader width="80%" height={28} className="mb-2" />
    <SkeletonLoader width="60%" height={16} />
  </motion.div>
)

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
          width={index === 0 ? "80%" : index === columns - 1 ? "60%" : "100%"} 
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
    {isLoading ? skeleton : children}
  </motion.div>
)
