import React from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { Card } from '../../ui/Card'
import { type Vault } from '../../../types/dashboard'
import { formatCurrency, formatDate } from '../../../utils/formatters'
import { generateGradient } from '../../../utils/helpers'

interface VaultCardProps {
  vault: Vault
  isPrivate?: boolean
  onClick?: () => void
  delay?: number
}

export const VaultCard: React.FC<VaultCardProps> = ({
  vault,
  isPrivate = false,
  onClick,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card onClick={onClick} hover={!!onClick}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${generateGradient(vault.asset)} rounded-full flex items-center justify-center`}>
              <span className="text-white font-bold">{vault.asset}</span>
            </div>
            <div>
              <h3 className="text-white font-bold">{vault.asset} Vault</h3>
              <p className="text-gray-400 text-sm">{vault.condition}</p>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            vault.aiScore >= 80 ? 'bg-green-500/20 text-green-400' :
            vault.aiScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            AI: {vault.aiScore}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Amount</span>
            <span className="text-white font-medium">
              {isPrivate ? '••••' : vault.amount} {vault.asset}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Value</span>
            <span className="text-white font-medium">
              {formatCurrency(vault.value, isPrivate)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Target</span>
            <span className="text-white font-medium">{vault.target}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Created</span>
            <span className="text-white font-medium">{formatDate(vault.createdAt)}</span>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-white">{vault.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${vault.progress}%` }}
                transition={{ delay: delay + 0.5, duration: 1 }}
              />
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                vault.status === 'active' ? 'bg-green-400' :
                vault.status === 'completed' ? 'bg-blue-400' :
                'bg-red-400'
              }`} />
              <span className="text-sm text-gray-400 capitalize">{vault.status}</span>
            </div>
            
            {vault.condition === 'Time Lock' && (
              <div className="flex items-center text-purple-400">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-xs">Time Lock</span>
              </div>
            )}
          </div>

          {/* Message from past self */}
          <div className="bg-gray-800/50 rounded-lg p-3 mt-4">
            <p className="text-xs text-gray-400 mb-1">Message from past you:</p>
            <p className="text-sm text-gray-300 italic">"{vault.message}"</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}