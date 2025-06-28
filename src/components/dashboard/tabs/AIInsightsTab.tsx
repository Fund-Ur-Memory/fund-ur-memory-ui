import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, TrendingUp, AlertTriangle, Target } from 'lucide-react'
import { SimpleRecommendationCard } from '../cards/AIRecommendationCard'
import { type DashboardData, type WalletAnalysisResponse } from '../../../types/dashboard'
import '../../../styles/header-compact.css'

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
      {/* AI Score Overview Cards - Match Overview Tab Style */}
      <section style={{ paddingTop: '1rem', paddingBottom: '1.5rem' }}>
        <div className="container">
          <div className="row g-3">
            {/* AI Risk Score Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0, duration: 0.3 }}
              className="col-lg-3 col-md-6 col-sm-6"
            >
              <div
                className="ico_iconbox_block"
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  padding: '1.25rem',
                  minHeight: '140px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="text-start flex-grow-1">
                    <p className="text-gray mb-1" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
                      AI Risk Score
                    </p>
                    <h3 className="heading_text text-white mb-0" style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: '1.2' }}>
                      {walletAnalysis?.data?.riskScore || aiInsights.riskScore}/100
                    </h3>
                    <p className="mt-1" style={{ fontSize: '0.75rem', opacity: '0.7' }}>
                      {walletAnalysis?.data?.confidencePercentage || aiInsights.confidence}% confidence
                    </p>
                  </div>
                  <div
                    className="iconbox_icon d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))',
                      borderRadius: '10px',
                      fontSize: '1.2rem',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🧠
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Market Sentiment Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="col-lg-3 col-md-6 col-sm-6"
            >
              <div
                className="ico_iconbox_block"
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  padding: '1.25rem',
                  minHeight: '140px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="text-start flex-grow-1">
                    <p className="text-gray mb-1" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
                      Market Sentiment
                    </p>
                    <h3 className="heading_text text-white mb-0" style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: '1.2' }}>
                      {insights.market.data.sentiment}
                    </h3>
                    <p className="mt-1" style={{ fontSize: '0.75rem', opacity: '0.7' }}>
                      {insights.market.data.trend} trend
                    </p>
                  </div>
                  <div
                    className="iconbox_icon d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))',
                      borderRadius: '10px',
                      fontSize: '1.2rem',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    📈
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Risk Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="col-lg-3 col-md-6 col-sm-6"
            >
              <div
                className="ico_iconbox_block"
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  padding: '1.25rem',
                  minHeight: '140px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="text-start flex-grow-1">
                    <p className="text-gray mb-1" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
                      Risk Profile
                    </p>
                    <h3 className="heading_text text-white mb-0" style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: '1.2' }}>
                      {insights.behavioral.data.tradingStyle}
                    </h3>
                    <p className="mt-1" style={{ fontSize: '0.75rem', opacity: '0.7' }}>
                      {insights.behavioral.data.riskTolerance} risk tolerance
                    </p>
                  </div>
                  <div
                    className="iconbox_icon d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
                      borderRadius: '10px',
                      fontSize: '1.2rem',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🛡️
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trading Insights Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="col-lg-3 col-md-6 col-sm-6"
            >
              <div
                className="ico_iconbox_block"
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  padding: '1.25rem',
                  minHeight: '140px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="text-start flex-grow-1">
                    <p className="text-gray mb-1" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
                      Hold Time
                    </p>
                    <h3 className="heading_text text-white mb-0" style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: '1.2' }}>
                      {insights.behavioral.data.averageHoldTime}d
                    </h3>
                    <p className="mt-1" style={{ fontSize: '0.75rem', opacity: '0.7' }}>
                      {insights.behavioral.data.tradeFrequency} trades/month
                    </p>
                  </div>
                  <div
                    className="iconbox_icon d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))',
                      borderRadius: '10px',
                      fontSize: '1.2rem',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    ⏰
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Analysis Header */}
      <section style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="row justify-content-center"
          >
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="heading_text text-white mb-1" style={{ fontSize: '1.4rem', fontWeight: '600' }}>
                    Detailed AI Analysis
                  </h3>
                  <p className="text-gray mb-0" style={{ opacity: '0.8', fontSize: '0.9rem' }}>
                    Powered by ElizaOS Agent Maker <Brain className="ms-1" style={{ width: '16px', height: '16px' }} />
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Insight Categories Navigation */}
      <section style={{ paddingTop: '0rem', paddingBottom: '0' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <div
                className="d-flex justify-content-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '0.3rem',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  maxWidth: '400px',
                  margin: '0 auto'
                }}
              >
                <ul className="nav d-flex align-items-center gap-1" role="tablist" style={{ margin: 0, padding: 0 }}>
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
                          gap: '0.4rem',
                          minWidth: '140px',
                          justifyContent: 'center',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          border: 'none',
                          background: selectedInsight === key
                            ? 'linear-gradient(135deg, #6f42c1, #9d5be8)'
                            : 'transparent',
                          color: selectedInsight === key ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                          fontWeight: selectedInsight === key ? '600' : '500',
                          transition: 'all 0.3s ease',
                          transform: selectedInsight === key ? 'translateY(-1px)' : 'none',
                          boxShadow: selectedInsight === key ? '0 4px 15px rgba(111, 66, 193, 0.3)' : 'none',
                          fontSize: '0.85rem'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedInsight !== key) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                            e.currentTarget.style.color = '#fff'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedInsight !== key) {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
                          }
                        }}
                      >
                        <span style={{ fontSize: '1em' }}>{insight.icon}</span>
                        <span>{insight.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
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
            <div className="col-12">
              <div
                className="ico_iconbox_block"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  padding: '1.25rem'
                }}
              >
                {selectedInsight === 'market' && (
                  <div>
                    <div className="d-flex align-items-center mb-4">
                      <span style={{ fontSize: '2rem', marginRight: '1rem' }}>📊</span>
                      <h3 className="iconbox_title text-white mb-0">Market Conditions</h3>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-4 mb-3">
                        <div
                          className="p-3"
                          style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            borderRadius: '10px',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.2)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <h6 className="text-secondary mb-1" style={{ fontSize: '0.8rem', fontWeight: '500' }}>Market Sentiment</h6>
                          <h5 className="text-success mb-0 d-flex align-items-center" style={{ fontSize: '1rem', fontWeight: '600' }}>
                            📈 {insights.market.data.sentiment}
                          </h5>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div
                          className="p-3"
                          style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '10px',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.2)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <h6 className="text-secondary mb-1" style={{ fontSize: '0.8rem', fontWeight: '500' }}>Trend Direction</h6>
                          <h5 className="text-info mb-0 d-flex align-items-center" style={{ fontSize: '1rem', fontWeight: '600' }}>
                            🚀 {insights.market.data.trend}
                          </h5>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div
                          className="p-3"
                          style={{
                            background: 'rgba(245, 158, 11, 0.1)',
                            borderRadius: '10px',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.2)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <h6 className="text-secondary mb-1" style={{ fontSize: '0.8rem', fontWeight: '500' }}>Volatility</h6>
                          <h5 className="text-warning mb-0 d-flex align-items-center" style={{ fontSize: '1rem', fontWeight: '600' }}>
                            ⚡ {insights.market.data.volatility}
                          </h5>
                        </div>
                      </div>
                    </div>

                    <div
                      className="p-3"
                      style={{
                        background: 'rgba(111, 66, 193, 0.1)',
                        borderRadius: '10px',
                        border: '1px solid rgba(111, 66, 193, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(111, 66, 193, 0.2)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <h6 className="text-secondary mb-2" style={{ fontSize: '0.85rem', fontWeight: '500' }}>🤖 AI Recommendation</h6>
                      <p className="text-white mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{insights.market.data.recommendation}</p>
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
      <section style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="row justify-content-center"
          >
            <div className="col-12">
              <div className="mb-3">
                <h3 className="heading_text text-white mb-1" style={{ fontSize: '1.4rem', fontWeight: '600' }}>
                  Personalized Recommendations
                </h3>
                <p className="text-gray mb-0" style={{ opacity: '0.8', fontSize: '0.9rem' }}>
                  AI-powered insights tailored to your trading patterns
                </p>
              </div>
              <div
                className="ico_iconbox_block"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  padding: '1.25rem'
                }}
              >
                <div className="row">
                  {personalizedRecommendations.slice(0, 4).map((recommendation, index) => (
                    <div key={index} className="col-lg-6 mb-3">
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