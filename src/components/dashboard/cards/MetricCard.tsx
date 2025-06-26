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
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  iconColor = 'text-purple-400',
  isPrivate = false,
  delay = 0,
  subtitle,
  onClick
}) => {
  const displayValue = typeof value === 'number' 
    ? formatCurrency(value, isPrivate) 
    : value

  const getIconEmoji = (iconColor: string) => {
    const iconMap: Record<string, string> = {
      'text-purple-400': '🔮',
      'text-green-400': '💚',
      'text-blue-400': '💙',
      'text-red-400': '❤️',
      'text-yellow-400': '💛',
    }
    return iconMap[iconColor] || '📊'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="col-lg-3 col-md-6 mb-4"
    >
      <div 
        className="ico_iconbox_block text-center p-4"
        onClick={onClick}
        style={{ 
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          ...(onClick ? {
            ':hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 10px 30px rgba(111, 66, 193, 0.3)'
            }
          } : {})
        }}
        onMouseEnter={(e) => {
          if (onClick) {
            e.currentTarget.style.transform = 'translateY(-5px)'
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(111, 66, 193, 0.3)'
          }
        }}
        onMouseLeave={(e) => {
          if (onClick) {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }
        }}
      >
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="text-start flex-grow-1">
            <p className="text-secondary mb-1 small">{title}</p>
            <h3 className="heading_text text-white mb-0" style={{ fontSize: '1.8rem' }}>
              {displayValue}
            </h3>
            {subtitle && (
              <p className="text-muted small mt-1">{subtitle}</p>
            )}
          </div>
          <div 
            className="iconbox_icon d-flex align-items-center justify-content-center"
            style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, rgba(111, 66, 193, 0.2), rgba(157, 91, 232, 0.2))',
              borderRadius: '12px',
              fontSize: '1.5rem'
            }}
          >
            {getIconEmoji(iconColor)}
          </div>
        </div>
        
        {change !== undefined && (
          <div className="d-flex align-items-center">
            <span className={`small ${change >= 0 ? 'text-success' : 'text-danger'}`}>
              {change >= 0 ? '📈' : '📉'} {formatPercentage(change)} 24h
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}