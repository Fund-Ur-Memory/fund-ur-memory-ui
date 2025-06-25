import React from 'react'
import { motion } from 'framer-motion'
import { Shield, TrendingUp, ArrowRightLeft, ChevronRight } from 'lucide-react'
import { Card } from '../../ui/Card'
import { type Transaction } from '../../../types/dashboard'
import { formatDate } from '../../../utils/formatters'

interface ActivityCardProps {
  transactions: Transaction[]
  isPrivate?: boolean
  onViewAll?: () => void
  maxItems?: number
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  transactions,
  isPrivate = false,
  onViewAll,
  maxItems = 3
}) => {
  const displayTransactions = transactions.slice(0, maxItems)

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'vault_create':
        return Shield
      case 'vault_execute':
        return TrendingUp
      case 'cross_chain_transfer':
        return ArrowRightLeft
      default:
        return ArrowRightLeft
    }
  }

  const getTransactionLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'vault_create':
        return 'Vault Created'
      case 'vault_execute':
        return 'Vault Executed'
      case 'cross_chain_transfer':
        return 'Cross-Chain Transfer'
      case 'swap':
        return 'Token Swap'
      default:
        return 'Transaction'
    }
  }

  const getIconColor = (type: Transaction['type']) => {
    switch (type) {
      case 'vault_create':
        return 'text-purple-400 bg-purple-500/20'
      case 'vault_execute':
        return 'text-green-400 bg-green-500/20'
      case 'cross_chain_transfer':
        return 'text-blue-400 bg-blue-500/20'
      default:
        return 'text-gray-400 bg-gray-500/20'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          {onViewAll && (
            <button 
              onClick={onViewAll}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {displayTransactions.map((tx, index) => {
            const Icon = getTransactionIcon(tx.type)
            const iconColor = getIconColor(tx.type)
            
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {getTransactionLabel(tx.type)}
                    </p>
                    <p className="text-gray-400 text-sm">{tx.conditions || 'No conditions'}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-medium">
                    {isPrivate ? '••••' : tx.amount} {tx.asset}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {formatDate(tx.date)}
                  </p>
                  <div className="flex items-center justify-end mt-1">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      tx.status === 'completed' ? 'bg-green-400' :
                      tx.status === 'active' ? 'bg-blue-400' :
                      tx.status === 'pending' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`} />
                    <span className="text-xs text-gray-500 capitalize">{tx.status}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
        
        {transactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No recent activity</p>
          </div>
        )}
      </Card>
    </motion.div>
  )
}