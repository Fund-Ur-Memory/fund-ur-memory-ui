import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  RefreshCw,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { useDemoRealTimePrice } from '../../hooks/demo/useDemoRealTimePrice'

interface RealTimePriceDemoProps {
  contractAddress?: string
  tokenSymbol?: string
  className?: string
}

export const RealTimePriceDemo: React.FC<RealTimePriceDemoProps> = ({
  contractAddress,
  tokenSymbol = 'ETH',
  className = ''
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1m' | '5m' | '15m'>('5m')

  const {
    priceHistory,
    currentPrice,
    priceChange,
    isMonitoring,
    isRealTimeReady,
    startMonitoring,
    stopMonitoring,
    refreshChainlinkPrice,
    getDemoRecommendations
  } = useDemoRealTimePrice(contractAddress)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'info': return <Info className="w-4 h-4 text-blue-500" />
      default: return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className={`bg-gray-900 rounded-xl p-6 border border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            Real-Time Price Demo
          </h3>
          <p className="text-gray-400 text-sm">
            {tokenSymbol}/USD Price Monitoring for Hackathon Demo
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isMonitoring
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isMonitoring ? (
              <>
                <Pause className="w-4 h-4 mr-2 inline" />
                Stop Demo
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2 inline" />
                Start Demo
              </>
            )}
          </button>

          <button
            onClick={refreshChainlinkPrice}
            className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            title="Force Chainlink Price Update"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current Price Display */}
      {currentPrice && (
        <motion.div
          className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4 mb-6 border border-purple-500/30"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-white mb-1">
                {formatPrice(currentPrice.price)}
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">
                  Last updated: {formatTime(currentPrice.timestamp)}
                </span>
                {currentPrice.isStale && (
                  <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">
                    STALE
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className={`flex items-center text-lg font-semibold ${
                priceChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {priceChange >= 0 ? (
                  <TrendingUp className="w-5 h-5 mr-1" />
                ) : (
                  <TrendingDown className="w-5 h-5 mr-1" />
                )}
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </div>
              <div className="text-gray-400 text-sm">
                Freshness: {currentPrice.freshness}s ago
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Demo Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Monitoring Status</span>
            <div className={`w-3 h-3 rounded-full ${
              isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
            }`} />
          </div>
          <div className="text-white font-semibold">
            {isMonitoring ? 'Active' : 'Stopped'}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Real-Time Ready</span>
            {isRealTimeReady ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Clock className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <div className="text-white font-semibold">
            {isRealTimeReady ? 'Yes' : 'Simulated'}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Price Updates</span>
            <Zap className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-white font-semibold">
            {priceHistory.length} points
          </div>
        </div>
      </div>

      {/* Demo Recommendations */}
      {getDemoRecommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">Demo Recommendations</h4>
          <div className="space-y-2">
            {getDemoRecommendations.map((rec, index) => (
              <motion.div
                key={index}
                className={`p-3 rounded-lg border ${
                  rec.type === 'success'
                    ? 'bg-green-500/10 border-green-500/30'
                    : rec.type === 'warning'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-blue-500/10 border-blue-500/30'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-3">
                  {getRecommendationIcon(rec.type)}
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium mb-1">
                      {rec.message}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {rec.action}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Price History Chart (Simple) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-semibold">Price History</h4>
          <div className="flex space-x-1">
            {(['1m', '5m', '15m'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  selectedTimeframe === timeframe
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 h-32 flex items-end space-x-1 overflow-hidden">
          {priceHistory.slice(-20).map((point, index) => {
            const height = Math.max(10, (point.price / Math.max(...priceHistory.map(p => p.price))) * 100)
            return (
              <motion.div
                key={index}
                className={`flex-1 rounded-t ${
                  point.source === 'chainlink' ? 'bg-purple-500' : 'bg-blue-500'
                }`}
                style={{ height: `${height}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.3 }}
                title={`${formatPrice(point.price)} at ${formatTime(point.timestamp)}`}
              />
            )
          })}
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Purple: Chainlink | Blue: Simulated</span>
          <span>{priceHistory.length > 0 ? formatTime(priceHistory[priceHistory.length - 1]?.timestamp) : 'No data'}</span>
        </div>
      </div>

      {/* Demo Instructions */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-2">Hackathon Demo Tips</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Start monitoring to see simulated real-time price updates</li>
          <li>• Purple bars show actual Chainlink data, blue bars show simulated data</li>
          <li>• Use "Force Update" to trigger Chainlink price checks</li>
          <li>• Price-based vaults will unlock when targets are hit</li>
          <li>• Best demo experience when Chainlink price is fresh (&lt;5 min old)</li>
        </ul>
      </div>
    </div>
  )
}
