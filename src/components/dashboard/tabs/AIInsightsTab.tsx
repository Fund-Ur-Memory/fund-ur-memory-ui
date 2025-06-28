import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, TrendingUp, AlertTriangle, Target } from 'lucide-react'
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
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div className="d-flex align-items-center">
                        <div
                          className="me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.1))',
                            borderRadius: '12px',
                            fontSize: '1.4rem',
                            border: '1px solid rgba(34, 197, 94, 0.3)'
                          }}
                        >
                          📊
                        </div>
                        <div>
                          <h3 className="text-white mb-1" style={{ fontSize: '1.3rem', fontWeight: '600' }}>
                            Market Analysis
                          </h3>
                          <p className="text-gray mb-0" style={{ fontSize: '0.85rem', opacity: '0.8' }}>
                            Current market conditions and trends
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-4">
                        <motion.div
                          whileHover={{ y: -3, scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            backdropFilter: 'blur(10px)',
                            padding: '1.25rem',
                            height: '100%',
                            cursor: 'default'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(34, 197, 94, 0.6)'
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.15)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(34, 197, 94, 0.3)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="text-gray" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
                              Market Sentiment
                            </span>
                            <span style={{ fontSize: '1.2rem' }}>📈</span>
                          </div>
                          <h4 className="text-white mb-0" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
                            {insights.market.data.sentiment}
                          </h4>
                        </motion.div>
                      </div>

                      <div className="col-md-4">
                        <motion.div
                          whileHover={{ y: -3, scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            backdropFilter: 'blur(10px)',
                            padding: '1.25rem',
                            height: '100%',
                            cursor: 'default'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.6)'
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.15)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.3)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="text-gray" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
                              Trend Direction
                            </span>
                            <span style={{ fontSize: '1.2rem' }}>🚀</span>
                          </div>
                          <h4 className="text-white mb-0" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
                            {insights.market.data.trend}
                          </h4>
                        </motion.div>
                      </div>

                      <div className="col-md-4">
                        <motion.div
                          whileHover={{ y: -3, scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            backdropFilter: 'blur(10px)',
                            padding: '1.25rem',
                            height: '100%',
                            cursor: 'default'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(245, 158, 11, 0.6)'
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.15)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(245, 158, 11, 0.3)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="text-gray" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
                              Volatility Level
                            </span>
                            <span style={{ fontSize: '1.2rem' }}>⚡</span>
                          </div>
                          <h4 className="text-white mb-0" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
                            {insights.market.data.volatility}
                          </h4>
                        </motion.div>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(111, 66, 193, 0.3)',
                        backdropFilter: 'blur(10px)',
                        padding: '1.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.border = '1px solid rgba(111, 66, 193, 0.6)'
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(111, 66, 193, 0.15)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.border = '1px solid rgba(111, 66, 193, 0.3)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div className="d-flex align-items-center mb-3">
                        <div
                          className="me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, rgba(111, 66, 193, 0.2), rgba(147, 51, 234, 0.1))',
                            borderRadius: '10px',
                            fontSize: '1.2rem',
                            border: '1px solid rgba(111, 66, 193, 0.3)'
                          }}
                        >
                          🤖
                        </div>
                        <h5 className="text-white mb-0" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                          AI Market Recommendation
                        </h5>
                      </div>
                      <p className="text-gray mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.6', opacity: '0.9' }}>
                        {insights.market.data.recommendation}
                      </p>
                    </motion.div>
                  </div>
                )}

                {selectedInsight === 'behavioral' && (
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div className="d-flex align-items-center">
                        <div
                          className="me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(124, 58, 237, 0.1))',
                            borderRadius: '12px',
                            fontSize: '1.4rem',
                            border: '1px solid rgba(147, 51, 234, 0.3)'
                          }}
                        >
                          🧠
                        </div>
                        <div>
                          <h3 className="text-white mb-1" style={{ fontSize: '1.3rem', fontWeight: '600' }}>
                            Behavioral Patterns
                          </h3>
                          <p className="text-gray mb-0" style={{ fontSize: '0.85rem', opacity: '0.8' }}>
                            Your trading psychology and patterns
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <motion.div
                          whileHover={{ y: -3, scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            backdropFilter: 'blur(10px)',
                            padding: '1.25rem',
                            height: '100%',
                            cursor: 'default'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.6)'
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.15)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.3)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="text-gray" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
                              Trading Style
                            </span>
                            <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                          </div>
                          <h4 className="text-white mb-0" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
                            {insights.behavioral.data.tradingStyle}
                          </h4>
                        </motion.div>
                      </div>

                      <div className="col-md-6">
                        <motion.div
                          whileHover={{ y: -3, scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            backdropFilter: 'blur(10px)',
                            padding: '1.25rem',
                            height: '100%',
                            cursor: 'default'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(16, 185, 129, 0.6)'
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.15)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(16, 185, 129, 0.3)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="text-gray" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
                              Risk Tolerance
                            </span>
                            <span style={{ fontSize: '1.2rem' }}>⚖️</span>
                          </div>
                          <h4 className="text-white mb-0" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
                            {insights.behavioral.data.riskTolerance}
                          </h4>
                        </motion.div>
                      </div>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-4">
                        <motion.div
                          whileHover={{ y: -3, scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            backdropFilter: 'blur(10px)',
                            padding: '1.25rem',
                            height: '100%',
                            cursor: 'default'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(245, 158, 11, 0.6)'
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.15)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(245, 158, 11, 0.3)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="text-gray" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
                              Hold Time
                            </span>
                            <span style={{ fontSize: '1.2rem' }}>⏰</span>
                          </div>
                          <h4 className="text-white mb-0" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
                            {insights.behavioral.data.averageHoldTime}d
                          </h4>
                        </motion.div>
                      </div>

                      <div className="col-md-4">
                        <motion.div
                          whileHover={{ y: -3, scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(168, 85, 247, 0.3)',
                            backdropFilter: 'blur(10px)',
                            padding: '1.25rem',
                            height: '100%',
                            cursor: 'default'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(168, 85, 247, 0.6)'
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(168, 85, 247, 0.15)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(168, 85, 247, 0.3)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="text-gray" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
                              Trade Frequency
                            </span>
                            <span style={{ fontSize: '1.2rem' }}>📈</span>
                          </div>
                          <h4 className="text-white mb-0" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
                            {insights.behavioral.data.tradeFrequency}/mo
                          </h4>
                        </motion.div>
                      </div>

                      <div className="col-md-4">
                        <motion.div
                          whileHover={{ y: -3, scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            backdropFilter: 'blur(10px)',
                            padding: '1.25rem',
                            height: '100%',
                            cursor: 'default'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(34, 197, 94, 0.6)'
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.15)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(34, 197, 94, 0.3)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="text-gray" style={{ fontSize: '0.8rem', opacity: '0.8', fontWeight: '500' }}>
                              Diversification
                            </span>
                            <span style={{ fontSize: '1.2rem' }}>🌐</span>
                          </div>
                          <h4 className="text-white mb-0" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
                            {insights.behavioral.data.diversificationScore}%
                          </h4>
                        </motion.div>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <motion.div
                          whileHover={{ y: -3 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            backdropFilter: 'blur(10px)',
                            padding: '1.5rem',
                            height: '100%'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(239, 68, 68, 0.6)'
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.15)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(239, 68, 68, 0.3)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <div className="d-flex align-items-center mb-3">
                            <div
                              className="me-3 d-flex align-items-center justify-content-center"
                              style={{
                                width: '40px',
                                height: '40px',
                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
                                borderRadius: '10px',
                                fontSize: '1.2rem',
                                border: '1px solid rgba(239, 68, 68, 0.3)'
                              }}
                            >
                              ⚠️
                            </div>
                            <h5 className="text-white mb-0" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                              Emotional Triggers
                            </h5>
                          </div>
                          <div className="d-flex flex-wrap gap-2">
                            {insights.behavioral.data.emotionalTriggers.map((trigger: string, index: number) => (
                              <span key={index} className="badge" style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: 'rgba(239, 68, 68, 0.9)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                padding: '0.5rem 0.75rem',
                                fontSize: '0.8rem',
                                fontWeight: '500'
                              }}>
                                {trigger}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      </div>

                      <div className="col-md-6">
                        <motion.div
                          whileHover={{ y: -3 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            backdropFilter: 'blur(10px)',
                            padding: '1.5rem',
                            height: '100%'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(34, 197, 94, 0.6)'
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.15)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(34, 197, 94, 0.3)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <div className="d-flex align-items-center mb-3">
                            <div
                              className="me-3 d-flex align-items-center justify-content-center"
                              style={{
                                width: '40px',
                                height: '40px',
                                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.1))',
                                borderRadius: '10px',
                                fontSize: '1.2rem',
                                border: '1px solid rgba(34, 197, 94, 0.3)'
                              }}
                            >
                              ✅
                            </div>
                            <h5 className="text-white mb-0" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                              Success Factors
                            </h5>
                          </div>
                          <div className="d-flex flex-wrap gap-2">
                            {insights.behavioral.data.successFactors.map((factor: string, index: number) => (
                              <span key={index} className="badge" style={{
                                background: 'rgba(34, 197, 94, 0.15)',
                                color: 'rgba(34, 197, 94, 0.9)',
                                border: '1px solid rgba(34, 197, 94, 0.3)',
                                borderRadius: '8px',
                                padding: '0.5rem 0.75rem',
                                fontSize: '0.8rem',
                                fontWeight: '500'
                              }}>
                                {factor}
                              </span>
                            ))}
                          </div>
                        </motion.div>
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
              <div
                className="ico_iconbox_block"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  padding: '1.5rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)'
                }}
              >
                {/* Header with Icon */}
                <div className="d-flex align-items-center mb-4">
                  <div
                    className="me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.2))',
                      borderRadius: '12px',
                      border: '1px solid rgba(139, 92, 246, 0.3)'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>💡</span>
                  </div>
                  <div>
                    <h3 className="heading_text text-white mb-1" style={{ fontSize: '1.3rem', fontWeight: '600' }}>
                      Personalized Recommendations
                    </h3>
                    <p className="text-gray mb-0" style={{ fontSize: '0.85rem', opacity: '0.8' }}>
                      AI-powered insights tailored to your trading patterns
                    </p>
                  </div>
                </div>

                {/* Recommendations Grid */}
                <div className="row g-3">
                  {personalizedRecommendations.slice(0, 6).map((recommendation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="col-lg-6 col-md-12"
                    >
                      <div
                        className="d-flex align-items-start p-3"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.3s ease',
                          minHeight: '100px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <div
                          className="me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: '36px',
                            height: '36px',
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.15))',
                            borderRadius: '8px',
                            border: '1px solid rgba(139, 92, 246, 0.2)'
                          }}
                        >
                          <span style={{ fontSize: '1rem' }}>🎯</span>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <span className="text-gray" style={{ fontSize: '0.75rem', fontWeight: '500', opacity: '0.8' }}>
                              Recommendation #{index + 1}
                            </span>
                          </div>
                          <p className="text-white mb-0" style={{ 
                            fontSize: '0.85rem', 
                            lineHeight: '1.4',
                            fontWeight: '400'
                          }}>
                            {recommendation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-gray" style={{ fontSize: '0.75rem', opacity: '0.6' }}>
                      💡 Based on your trading patterns and market analysis
                    </span>
                    <span className="text-gray" style={{ fontSize: '0.75rem', opacity: '0.6' }}>
                      {personalizedRecommendations.length} insights available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}