import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'
import { AIRecommendationCard } from '../cards/AIRecommendationCard'
import { Card } from '../../ui/Card'
import {type DashboardData } from '../../../types/dashboard'
import { sortRecommendationsByPriority } from '../../../utils/helpers'

interface AIInsightsTabProps {
  data: DashboardData
  isPrivacyMode: boolean
  onRefetch: () => void
}

export const AIInsightsTab: React.FC<AIInsightsTabProps> = ({
  data,
}) => {
  const [selectedInsight, setSelectedInsight] = useState('market')
  const { aiInsights } = data

  const insights = {
    market: {
      title: 'Market Analysis',
      data: {
        sentiment: aiInsights.marketSentiment,
        trend: 'Upward',
        volatility: 'Medium',
        recommendation: 'Favorable conditions for long-term commitments'
      }
    },
    behavioral: {
      title: 'Behavioral Patterns',
      data: {
        tradingStyle: 'Conservative',
        emotionalTriggers: ['Market crashes', 'FOMO events'],
        successFactors: ['Time-based locks', 'Clear exit strategies'],
        riskTolerance: 'Medium-Low'
      }
    },
    predictions: {
      title: 'AI Predictions',
      data: {
        eth_3month: { price: 4200, confidence: 78 },
        btc_6month: { price: 85000, confidence: 65 },
        portfolio_1year: { return: 23.5, confidence: 82 }
      }
    }
  }

  const sortedRecommendations = sortRecommendationsByPriority(aiInsights.recommendations)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">AI Insights & Analysis</h2>
        <div className="flex items-center space-x-2">
          <Brain className="w-6 h-6 text-purple-400" />
          <span className="text-gray-400">Powered by AWS Bedrock</span>
        </div>
      </div>

      {/* AI Health Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Your AI Risk Score</h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="3"
                />
                <motion.path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeDasharray={`${aiInsights.riskScore}, 100`}
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${aiInsights.riskScore}, 100` }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span 
                  className="text-3xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {aiInsights.riskScore}
                </motion.span>
              </div>
            </div>
            <p className="text-gray-300 mb-2">Low Risk Profile</p>
            <p className="text-gray-400 text-sm">
              {aiInsights.confidence}% confidence based on your trading history
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Insight Categories */}
      <div className="flex space-x-1 bg-gray-800 rounded-xl p-1">
        {Object.entries(insights).map(([key, insight]) => (
          <button
            key={key}
            onClick={() => setSelectedInsight(key)}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedInsight === key
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {insight.title}
          </button>
        ))}
      </div>

      {/* Insight Content */}
      <motion.div
        key={selectedInsight}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card>
          {selectedInsight === 'market' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">Market Conditions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm">Market Sentiment</h4>
                  <p className="text-green-400 font-bold text-lg">
                    {insights.market.data.sentiment}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm">Trend Direction</h4>
                  <p className="text-blue-400 font-bold text-lg">
                    {insights.market.data.trend}
                  </p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-gray-400 text-sm mb-2">AI Recommendation</h4>
                <p className="text-white">{insights.market.data.recommendation}</p>
              </div>
            </div>
          )}

          {selectedInsight === 'behavioral' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">Your Trading Patterns</h3>
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm mb-2">Trading Style</h4>
                  <p className="text-white font-medium">
                    {insights.behavioral.data.tradingStyle}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm mb-2">Emotional Triggers</h4>
                  <div className="space-y-1">
                    {insights.behavioral.data.emotionalTriggers.map((trigger: string, index: number) => (
                      <span key={index} className="inline-block bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm mr-2">
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm mb-2">Success Factors</h4>
                  <div className="space-y-1">
                    {insights.behavioral.data.successFactors.map((factor: string, index: number) => (
                      <span key={index} className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm mr-2">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedInsight === 'predictions' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">AI Price Predictions</h3>
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">ETH (3 months)</h4>
                    <span className="text-green-400 font-bold">
                      ${insights.predictions.data.eth_3month.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className="bg-green-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${insights.predictions.data.eth_3month.confidence}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    {insights.predictions.data.eth_3month.confidence}% confidence
                  </p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">BTC (6 months)</h4>
                    <span className="text-blue-400 font-bold">
                      ${insights.predictions.data.btc_6month.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className="bg-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${insights.predictions.data.btc_6month.confidence}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    {insights.predictions.data.btc_6month.confidence}% confidence
                  </p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">Portfolio Return (1 year)</h4>
                    <span className="text-purple-400 font-bold">
                      +{insights.predictions.data.portfolio_1year.return}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className="bg-purple-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${insights.predictions.data.portfolio_1year.confidence}%` }}
                      transition={{ duration: 1, delay: 0.9 }}
                    />
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    {insights.predictions.data.portfolio_1year.confidence}% confidence
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Detailed Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <h3 className="text-xl font-bold text-white mb-6">Personalized Recommendations</h3>
          <div className="space-y-4">
            {sortedRecommendations.map((rec, index) => (
              <AIRecommendationCard
                key={rec.id}
                recommendation={rec}
                delay={index * 0.1}
                onAction={() => console.log('Execute recommendation:', rec.action)}
                onLearnMore={() => console.log('Learn more about:', rec.title)}
              />
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}