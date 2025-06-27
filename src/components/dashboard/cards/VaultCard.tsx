import React from 'react'
import { Card } from '../../ui/Card'

interface VaultCardProps {
  vault: {
    id: number
    asset: string
    amount: number
    value: number
    condition: string
    target: string
    progress: number
    status: string
    createdAt: string
    aiScore: number
    message: string
  }
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getAssetGradient = (asset: string) => {
    const gradients: Record<string, string> = {
      ETH: 'from-blue-500 to-purple-600',
      BTC: 'from-orange-500 to-yellow-600',
      USDC: 'from-green-500 to-blue-600',
      AVAX: 'from-red-500 to-pink-600',
      ARB: 'from-blue-600 to-cyan-600'
    }
    return gradients[asset] || 'from-gray-500 to-gray-600'
  }

  return (
    <div 
      style={{ animationDelay: `${delay}ms` }}
      className="animate-fade-in-up"
    >
      <Card onClick={onClick} hover={!!onClick}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${getAssetGradient(vault.asset)} rounded-full flex items-center justify-center`}>
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
              {isPrivate ? '••••••' : `$${vault.value.toLocaleString()}`}
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
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${vault.progress}%` }}
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
              <div className="flex items-center text-white">
                <span className="text-sm">⏰ Time Lock</span>
              </div>
            )}
          </div>

          {/* Message from past self */}
          <div className="bg-gray-800/50 rounded-lg p-3 mt-4 border-l-4 border-purple-500">
            <p className="text-xs text-gray-400 mb-1">Message from past you:</p>
            <p className="text-sm text-gray-300 italic">"{vault.message}"</p>
          </div>
        </div>
      </Card>
    </div>
  )
}