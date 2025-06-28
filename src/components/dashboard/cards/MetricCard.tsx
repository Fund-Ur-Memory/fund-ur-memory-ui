// src/components/dashboard/cards/MetricCard.tsx - Final fixed version with proper icon types
import React from 'react'
import { motion } from 'framer-motion'
import { type LucideIcon } from 'lucide-react'
import { formatCurrency, formatPercentage } from '../../../utils/formatters'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon // Proper Lucide icon type
  iconColor?: string
  isPrivate?: boolean
  delay?: number
  subtitle?: string
  onClick?: () => void
  valueType?: 'currency' | 'count' | 'percentage' | 'custom' // Add explicit value type
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  iconColor = 'text-white',
  isPrivate = false,
  delay = 0,
  subtitle,
  onClick,
  valueType = 'currency' // Default to currency for backward compatibility
}) => {
  // Debug log to see what values are being passed
  if (title === 'Total Portfolio' || title === 'Active Vaults') {
    console.log(`📊 MetricCard ${title}:`, { value, change, isPrivate, subtitle, valueType })
  }
  
  const displayValue = (() => {
    if (typeof value === 'string') return value
    
    switch (valueType) {
      case 'currency':
        return formatCurrency(value, isPrivate)
      case 'count':
        return isPrivate ? '••••' : value.toString()
      case 'percentage':
        return isPrivate ? '••••' : `${value}%`
      case 'custom':
        return isPrivate ? '••••' : value.toString()
      default:
        return formatCurrency(value, isPrivate)
    }
  })()

  const getIconEmoji = (iconColor: string) => {
    const iconMap: Record<string, string> = {
      'text-white': '🔮',
      'text-green-400': '💚',
      'text-blue-400': '💙',
      'text-red-400': '❤️',
      'text-yellow-400': '💛',
    }
    return iconMap[iconColor] || '📊'
  }

  const getIconGradient = (iconColor: string) => {
    const gradientMap: Record<string, string> = {
      'text-white': 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
      'text-green-400': 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))',
      'text-blue-400': 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
      'text-red-400': 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
      'text-yellow-400': 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))',
    }
    return gradientMap[iconColor] || 'linear-gradient(135deg, rgba(111, 66, 193, 0.2), rgba(157, 91, 232, 0.1))'
  }

  const getBorderColor = (iconColor: string) => {
    const borderMap: Record<string, string> = {
      'text-white': 'rgba(255, 255, 255, 0.3)',
      'text-green-400': 'rgba(16, 185, 129, 0.3)',
      'text-blue-400': 'rgba(59, 130, 246, 0.3)',
      'text-red-400': 'rgba(239, 68, 68, 0.3)',
      'text-yellow-400': 'rgba(245, 158, 11, 0.3)',
    }
    return borderMap[iconColor] || 'rgba(111, 66, 193, 0.3)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="col-lg-3 col-md-6 col-sm-6"
    >
      <div
        className="ico_iconbox_block"
        onClick={onClick}
        style={{
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
          border: `1px solid ${getBorderColor(iconColor)}`,
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          padding: '1.25rem',
          minHeight: '140px',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          const borderColor = getBorderColor(iconColor)
          const glowElement = e.currentTarget.querySelector('.card-glow') as HTMLElement
          if (onClick) {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
            e.currentTarget.style.boxShadow = `0 12px 30px ${borderColor.replace('0.3', '0.25')}`
            e.currentTarget.style.border = `2px solid ${borderColor.replace('0.3', '0.6')}`
          } else {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)'
            e.currentTarget.style.boxShadow = `0 8px 20px ${borderColor.replace('0.3', '0.2')}`
            e.currentTarget.style.border = `1px solid ${borderColor.replace('0.3', '0.5')}`
          }
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))'
          if (glowElement) {
            glowElement.style.opacity = '1'
          }
        }}
        onMouseLeave={(e) => {
          const glowElement = e.currentTarget.querySelector('.card-glow') as HTMLElement
          e.currentTarget.style.transform = 'translateY(0) scale(1)'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.border = `1px solid ${getBorderColor(iconColor)}`
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))'
          if (glowElement) {
            glowElement.style.opacity = '0'
          }
        }}
      >
        {/* Animated background gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, transparent 30%, ${getBorderColor(iconColor).replace('0.3', '0.05')} 50%, transparent 70%)`,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none'
          }}
          className="card-glow"
        />
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="text-start flex-grow-1">
            <p className="text-gray mb-1" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
              {title}
            </p>
            <h3 className="heading_text text-white mb-0" style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: '1.2' }}>
              {displayValue}
            </h3>
            {subtitle && (
              <p className="mt-1" style={{ fontSize: '0.75rem', opacity: '0.7' }}>
                {subtitle}
              </p>
            )}
          </div>
          <div
            className="iconbox_icon d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: '40px',
              height: '40px',
              background: getIconGradient(iconColor),
              borderRadius: '10px',
              fontSize: '1.2rem',
              border: `1px solid ${getBorderColor(iconColor)}`,
              transition: 'all 0.3s ease'
            }}
          >
            {getIconEmoji(iconColor)}
          </div>
        </div>

        {change !== undefined && (
          <div className="d-flex align-items-center justify-content-start">
            <div
              className={`d-flex align-items-center px-2 py-1 rounded-pill `}
              style={{
                backgroundColor: change >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${change >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                fontSize: '0.75rem',
                fontWeight: '500',
                boxShadow: change >= 0 ? '0 0 10px rgba(16, 185, 129, 0.1)' : '0 0 10px rgba(239, 68, 68, 0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              <span className="me-1">{change >= 0 ? '📈' : '📉'}</span>
              <span className={change >= 0 ? 'text-success' : 'text-danger'}>
                {formatPercentage(change)} 24h
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}