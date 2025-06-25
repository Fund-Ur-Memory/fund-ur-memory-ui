import React from 'react'
import { motion } from 'framer-motion'
import { type  LucideIcon } from 'lucide-react'
import { Card } from '../../ui/Card'
import { formatCurrency, formatPercentage } from '../../../utils/formatters'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
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
  icon: Icon,
  iconColor = 'text-purple-400',
  isPrivate = false,
  delay = 0,
  subtitle,
  onClick
}) => {
  const displayValue = typeof value === 'number' 
    ? formatCurrency(value, isPrivate) 
    : value

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card onClick={onClick} hover={!!onClick}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-3xl font-bold text-white">{displayValue}</p>
            {subtitle && (
              <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`bg-${iconColor.split('-')[1]}-500/20 p-3 rounded-xl`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
        {change !== undefined && (
          <div className="flex items-center mt-4">
            <span className={`text-sm ${
              change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatPercentage(change)} 24h
            </span>
          </div>
        )}
      </Card>
    </motion.div>
  )
}