import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import '../../styles/create-vault-modal.css'

/**
 * Demo component to showcase the improved USD to AVAX input design
 */
export const AmountInputDemo: React.FC = () => {
  const [usdAmount, setUsdAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Simulated AVAX conversion
  const avaxPrice = 42.50
  const avaxAmount = usdAmount ? (parseFloat(usdAmount) / avaxPrice).toFixed(4) : ''

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  const toggleError = () => {
    setHasError(!hasError)
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Improved USD Input Design
        </h2>
        
        {/* Main Amount Input */}
        <div className="amount-input-container mb-6">
          <div className={`amount-input-wrapper ${
            usdAmount && parseFloat(usdAmount) > 0 ? 'has-value' : ''
          } ${hasError ? 'has-error' : ''}`}>
            <div className="currency-symbol">$</div>
            <input
              type="number"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              placeholder="0.00"
              className="amount-input-field"
              min="0"
              step="0.01"
            />
            <div className="currency-code">USD</div>
          </div>
          
          {/* AVAX Conversion Info */}
          <div className="conversion-info">
            {isLoading ? (
              <motion.div 
                className="conversion-loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>Getting price...</span>
              </motion.div>
            ) : hasError ? (
              <motion.div 
                className="conversion-error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="error-icon">⚠</span>
                <span>Price unavailable</span>
                <button
                  type="button"
                  onClick={toggleError}
                  className="retry-btn"
                >
                  Retry
                </button>
              </motion.div>
            ) : avaxAmount ? (
              <motion.div 
                className="conversion-success"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="conversion-amount">
                  <span className="amount">{avaxAmount}</span>
                  <span className="token">AVAX</span>
                </div>
                <div className="price-info">
                  <span className="price-label">1 AVAX = ${avaxPrice.toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="refresh-btn"
                    title="Refresh price"
                  >
                    <RefreshCw className={`refresh-icon ${isLoading ? 'spinning' : ''}`} />
                  </button>
                </div>
              </motion.div>
            ) : usdAmount && parseFloat(usdAmount) > 0 ? (
              <motion.div 
                className="conversion-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span>Enter amount to see AVAX conversion</span>
              </motion.div>
            ) : null}
          </div>
        </div>

        {/* Demo Controls */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Demo Controls</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Test Loading
            </button>
            
            <button
              onClick={toggleError}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Toggle Error
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setUsdAmount('100')}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
            >
              $100
            </button>
            <button
              onClick={() => setUsdAmount('500')}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
            >
              $500
            </button>
            <button
              onClick={() => setUsdAmount('1000')}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
            >
              $1000
            </button>
          </div>
        </div>

        {/* Design Features */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-white font-semibold mb-3">Design Improvements</h4>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>✅ Clean, professional input design</li>
            <li>✅ Clear currency symbol and code</li>
            <li>✅ Smooth animations and transitions</li>
            <li>✅ Visual feedback for different states</li>
            <li>✅ Loading, error, and success states</li>
            <li>✅ Mobile-responsive design</li>
            <li>✅ Accessible focus states</li>
            <li>✅ Real-time price display</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
