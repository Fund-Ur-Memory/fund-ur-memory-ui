import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '../../ui/Card'
import { type AssetAllocation } from '../../../types/dashboard'
import { formatCurrency, formatPercentage } from '../../../utils/formatters'
import { generateGradient } from '../../../utils/helpers'

interface PortfolioCardProps {
  allocation: AssetAllocation[]
  totalValue: number
  change24h: number
  isPrivate?: boolean
  onRebalance?: () => void
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  allocation,
  isPrivate = false,
  onRebalance
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Portfolio Allocation</h3>
          {onRebalance && (
            <button 
              onClick={onRebalance}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            >
              Rebalance
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {allocation.map((asset, index) => (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${generateGradient(asset.symbol)} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{asset.symbol}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{asset.asset}</p>
                  <p className="text-gray-400 text-sm">{asset.percentage.toFixed(1)}% allocation</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-white font-medium">
                  {formatCurrency(asset.value, isPrivate)}
                </p>
                <div className="flex items-center">
                  {asset.change24h >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                  )}
                  <span className={`text-sm ${
                    asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatPercentage(asset.change24h)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}