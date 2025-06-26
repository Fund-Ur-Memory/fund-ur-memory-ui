// src/components/dashboard/tabs/AIInsightsTab.tsx - Consistent UI version
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'
import { AIRecommendationCard } from '../cards/AIRecommendationCard'
import { type DashboardData } from '../../../types/dashboard'
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
      icon: '📊',
      data: {
        sentiment: aiInsights.marketSentiment,
        trend: 'Upward',
        volatility: 'Medium',
        recommendation: 'Favorable conditions for long-term commitments'
      }
    },
    behavioral: {
      title: 'Behavioral Patterns',
      icon: '🧠',
      data: {
        tradingStyle: 'Conservative',
        emotionalTriggers: ['Market crashes', 'FOMO events'],
        successFactors: ['Time-based locks', 'Clear exit strategies'],
        riskTolerance: 'Medium-Low'
      }
    },
    predictions: {
      title: 'AI Predictions',
      icon: '🔮',
      data: {
        eth_3month: { price: 4200, confidence: 78 },
        btc_6month: { price: 85000, confidence: 65 },
        portfolio_1year: { return: 23.5, confidence: 82 }
      }
    }
  }

  const sortedRecommendations = sortRecommendationsByPriority(aiInsights.recommendations)

  return (
    <div>
      {/* Header Section */}
      <section className="section_space pb-0">
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
                  Powered by AWS Bedrock Multi-Agent System
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Health Score Section */}
      <section className="section_space pb-0">
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
                  <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 }}
                      style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}
                    >
                      {aiInsights.riskScore}
                    </motion.div>
                  </div>
                </div>
                
                <h5 className="text-white mb-2">Low Risk Profile</h5>
                <p className="text-secondary mb-0">
                  {aiInsights.confidence}% confidence based on your trading history
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Insight Categories Navigation */}
      <section className="section_space pb-0">
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
      <section className="section_space pb-0">
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
                    
                    <div className="row">
                      <div className="col-md-6 mb-4">
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
                      <div className="col-md-6 mb-4">
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

                {selectedInsight === 'predictions' && (
                  <div>
                    <div className="d-flex align-items-center mb-4">
                      <span style={{ fontSize: '2rem', marginRight: '1rem' }}>🔮</span>
                      <h3 className="iconbox_title text-white mb-0">AI Price Predictions</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { label: 'ETH (3 months)', price: insights.predictions.data.eth_3month.price, confidence: insights.predictions.data.eth_3month.confidence, color: '#22c55e' },
                        { label: 'BTC (6 months)', price: insights.predictions.data.btc_6month.price, confidence: insights.predictions.data.btc_6month.confidence, color: '#3b82f6' },
                        { label: 'Portfolio Return (1 year)', price: insights.predictions.data.portfolio_1year.return, confidence: insights.predictions.data.portfolio_1year.confidence, color: '#8b5cf6', isPercentage: true }
                      ].map((prediction, index) => (
                        <div key={index} className="p-3 mb-3" style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px'
                        }}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="text-white mb-0">{prediction.label}</h6>
                            <span className="fw-bold" style={{ color: prediction.color }}>
                              {prediction.isPercentage ? '+' : '$'}{prediction.price.toLocaleString()}{prediction.isPercentage ? '%' : ''}
                            </span>
                          </div>
                          <div className="progress" style={{ height: '6px', background: 'rgba(255,255,255,0.1)' }}>
                            <motion.div 
                              className="progress-bar"
                              style={{ 
                                background: prediction.color,
                                borderRadius: '3px'
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${prediction.confidence}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                            />
                          </div>
                          <p className="text-secondary mb-0 small mt-1">
                            {prediction.confidence}% confidence
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detailed Recommendations */}
      <section className="section_space">
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
                  {sortedRecommendations.map((rec, index) => (
                    <div key={rec.id} className="col-lg-6 mb-4">
                      <AIRecommendationCard
                        recommendation={rec}
                        delay={index * 0.1}
                        onAction={() => console.log('Execute recommendation:', rec.action)}
                        onLearnMore={() => console.log('Learn more about:', rec.title)}
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