import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'
import { SimpleRecommendationCard } from '../cards/AIRecommendationCard'
import { type DashboardData, type WalletAnalysisResponse } from '../../../types/dashboard'

interface AIInsightsTabProps {
  data: DashboardData
  walletAnalysis: WalletAnalysisResponse | null
  isPrivacyMode: boolean
  onRefetch: () => void
}

export const AIInsightsTab: React.FC<AIInsightsTabProps> = ({
  data,
  walletAnalysis,
}) => {
  const [selectedInsight, setSelectedInsight] = useState('market')
  const { aiInsights } = data

  // Get personalized recommendations from wallet analysis or fallback to aiInsights
  const personalizedRecommendations = walletAnalysis?.data?.personalizedRecommendations || 
    aiInsights.personalizedRecommendations || [
      "Your trading patterns indicate high risk. Consider implementing strict stop-losses and reducing position sizes.",
      "High-frequency trading may lead to increased transaction costs and emotional decisions. Consider longer holding periods.",
      "Short holding periods often indicate emotional trading. Consider implementing a minimum 30-day holding rule.",
      "While markets are bullish, maintain discipline and avoid FOMO-driven decisions.",
      "Consider using commitment vaults to lock positions and prevent emotional decisions during market volatility.",
      "Consider implementing a systematic investment plan with regular rebalancing to reduce emotional decision-making."
    ]

  const insights = {
    market: {
      title: 'Market Analysis',
      icon: '📊',
      data: {
        sentiment: walletAnalysis?.data?.marketAnalysis?.sentiment || aiInsights.marketSentiment,
        trend: walletAnalysis?.data?.marketAnalysis?.trendDirection || 'Upward',
        volatility: 'Medium',
        recommendation: walletAnalysis?.data?.marketAnalysis?.aiRecommendation || 'Favorable conditions for long-term commitments'
      }
    },
    behavioral: {
      title: 'Behavioral Patterns',
      icon: '🧠',
      data: {
        tradingStyle: walletAnalysis?.data?.riskTolerance === 'AGGRESSIVE' ? 'Aggressive' : 
                     walletAnalysis?.data?.riskTolerance === 'MODERATE' ? 'Moderate' : 'Conservative',
        emotionalTriggers: walletAnalysis?.data?.userTradingFactors?.emotionalTradingIndicators || ['Market crashes', 'FOMO events'],
        successFactors: ['Time-based locks', 'Clear exit strategies'],
        riskTolerance: walletAnalysis?.data?.riskProfile === 'HIGH_RISK' ? 'High' : 
                      walletAnalysis?.data?.riskProfile === 'MEDIUM_RISK' ? 'Medium' : 'Low',
        averageHoldTime: walletAnalysis?.data?.userTradingFactors?.averageHoldTime || 12.5,
        tradeFrequency: walletAnalysis?.data?.userTradingFactors?.tradeFrequency || 8.2,
        diversificationScore: walletAnalysis?.data?.userTradingFactors?.diversificationScore || 45.8
      }
    }
  }

  return (
    <div>
      {/* Header Section */}
      <section style={{ paddingTop: '2rem', paddingBottom: '0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="row justify-content-center mb-4"
          >
            <div className="col-lg-10">
              <div className="ico_heading_block text-center">
                <h2 className="heading_text mb-0 text-white">AI Insights & Analysis</h2>
                <p className="text-secondary mt-3 d-flex align-items-center justify-content-center">
                  <Brain className="me-2" style={{ width: '20px', height: '20px' }} />
                  Powered by ElizaOS Agent Maker
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Health Score Section */}
      <section style={{ paddingTop: '1rem', paddingBottom: '0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="row justify-content-center"
          >
            <div className="col-lg-6">
              <div className="ico_iconbox_block text-center p-5" style={{
                background: 'linear-gradient(135deg, rgba(111, 66, 193, 0.2), rgba(157, 91, 232, 0.2))',
                border: '1px solid rgba(111, 66, 193, 0.4)'
              }}>
                <h3 className="heading_text text-white mb-4">Your AI Risk Score</h3>

                {/* Circular Progress */}
                <div className="position-relative mx-auto mb-4" style={{ width: '150px', height: '150px' }}>
                  <svg
                    className="position-absolute"
                    style={{ transform: 'rotate(-90deg)', width: '150px', height: '150px' }}
                    viewBox="0 0 36 36"
                  >
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="3"
                    />
                    <motion.path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeDasharray={`${walletAnalysis?.data?.riskScore || aiInsights.riskScore}, 100`}
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${walletAnalysis?.data?.riskScore || aiInsights.riskScore}, 100` }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 }}
                      style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}
                    >
                      {walletAnalysis?.data?.riskScore || aiInsights.riskScore}
                    </motion.div>
                  </div>
                </div>

                <h5 className="text-white mb-2">
                  {walletAnalysis?.data?.riskProfile === 'HIGH_RISK' ? 'High Risk Profile' :
                   walletAnalysis?.data?.riskProfile === 'MEDIUM_RISK' ? 'Medium Risk Profile' : 'Low Risk Profile'}
                </h5>
                <p className="text-secondary mb-0">
                  {walletAnalysis?.data?.confidencePercentage || aiInsights.confidence}% confidence based on your trading history
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Insight Categories Navigation */}
      <section style={{ paddingTop: '1rem', paddingBottom: '0' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <ul className="nav unordered_list justify-content-center" role="tablist">
                {Object.entries(insights).map(([key, insight]) => (
                  <li key={key} className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${selectedInsight === key ? "active" : ""}`}
                      type="button"
                      role="tab"
                      onClick={() => setSelectedInsight(key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        minWidth: '160px',
                        justifyContent: 'center'
                      }}
                    >
                      <span style={{ fontSize: '1.2em' }}>{insight.icon}</span>
                      {insight.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Insight Content */}
      <section style={{ paddingTop: '1rem', paddingBottom: '0' }}>
        <div className="container">
          <motion.div
            key={selectedInsight}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="row justify-content-center"
          >
            <div className="col-lg-10">
              <div className="ico_iconbox_block p-4">
                {selectedInsight === 'market' && (
                  <div>
                    <div className="d-flex align-items-center mb-4">
                      <span style={{ fontSize: '2rem', marginRight: '1rem' }}>📊</span>
                      <h3 className="iconbox_title text-white mb-0">Market Conditions</h3>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-6 mb-3">
                        <div className="p-3" style={{
                          background: 'rgba(34, 197, 94, 0.1)',
                          borderRadius: '8px',
                          border: '1px solid rgba(34, 197, 94, 0.3)'
                        }}>
                          <h6 className="text-secondary mb-1">Market Sentiment</h6>
                          <h5 className="text-success mb-0 d-flex align-items-center">
                            📈 {insights.market.data.sentiment}
                          </h5>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="p-3" style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          borderRadius: '8px',
                          border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}>
                          <h6 className="text-secondary mb-1">Trend Direction</h6>
                          <h5 className="text-info mb-0 d-flex align-items-center">
                            🚀 {insights.market.data.trend}
                          </h5>
                        </div>
                      </div>
                    </div>

                    <div className="p-3" style={{
                      background: 'rgba(111, 66, 193, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(111, 66, 193, 0.3)'
                    }}>
                      <h6 className="text-secondary mb-2">🤖 AI Recommendation</h6>
                      <p className="text-white mb-0">{insights.market.data.recommendation}</p>
                    </div>
                  </div>
                )}

                {selectedInsight === 'behavioral' && (
                  <div>
                    <div className="d-flex align-items-center mb-4">
                      <span style={{ fontSize: '2rem', marginRight: '1rem' }}>🧠</span>
                      <h3 className="iconbox_title text-white mb-0">Your Trading Patterns</h3>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-6 mb-3">
                        <div className="p-3" style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px'
                        }}>
                          <h6 className="text-secondary mb-2">Trading Style</h6>
                          <p className="text-white mb-0 d-flex align-items-center">
                            🛡️ {insights.behavioral.data.tradingStyle}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="p-3" style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px'
                        }}>
                          <h6 className="text-secondary mb-2">Risk Tolerance</h6>
                          <p className="text-white mb-0 d-flex align-items-center">
                            ⚖️ {insights.behavioral.data.riskTolerance}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-4 mb-3">
                        <div className="p-3" style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px'
                        }}>
                          <h6 className="text-secondary mb-2">Average Hold Time</h6>
                          <p className="text-white mb-0 d-flex align-items-center">
                            ⏰ {insights.behavioral.data.averageHoldTime} days
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="p-3" style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px'
                        }}>
                          <h6 className="text-secondary mb-2">Trade Frequency</h6>
                          <p className="text-white mb-0 d-flex align-items-center">
                            📈 {insights.behavioral.data.tradeFrequency} trades/month
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="p-3" style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px'
                        }}>
                          <h6 className="text-secondary mb-2">Diversification</h6>
                          <p className="text-white mb-0 d-flex align-items-center">
                            🌐 {insights.behavioral.data.diversificationScore}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h6 className="text-secondary mb-3">⚠️ Emotional Triggers</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {insights.behavioral.data.emotionalTriggers.map((trigger: string, index: number) => (
                          <span key={index} className="badge" style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#fca5a5',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            padding: '0.5rem 1rem'
                          }}>
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h6 className="text-secondary mb-3">✅ Success Factors</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {insights.behavioral.data.successFactors.map((factor: string, index: number) => (
                          <span key={index} className="badge" style={{
                            background: 'rgba(34, 197, 94, 0.2)',
                            color: '#86efac',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            padding: '0.5rem 1rem'
                          }}>
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Personalized Recommendations */}
      <section style={{ paddingTop: '1rem', paddingBottom: '3rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="row justify-content-center"
          >
            <div className="col-lg-10">
              <div className="ico_iconbox_block p-4">
                <div className="d-flex align-items-center mb-4">
                  <span style={{ fontSize: '2rem', marginRight: '1rem' }}>🎯</span>
                  <h3 className="iconbox_title text-white mb-0">Personalized Recommendations</h3>
                </div>

                <div className="row">
                  {personalizedRecommendations.map((recommendation, index) => (
                    <div key={index} className="col-lg-6 mb-4">
                      <SimpleRecommendationCard
                        recommendation={recommendation}
                        index={index}
                        delay={index * 0.1}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}