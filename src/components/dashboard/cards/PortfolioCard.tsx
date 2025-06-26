"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { PieChart, BarChart3, TrendingUp, RefreshCw } from "lucide-react"
import type { AssetAllocation } from "../../../types/dashboard"

interface PortfolioCardProps {
  allocation: AssetAllocation[]
  totalValue: number
  change24h: number
  isPrivate: boolean
  onRebalance: () => void
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  allocation,
  totalValue,
  change24h,
  isPrivate,
  onRebalance,
}) => {
  const [viewMode, setViewMode] = useState<"pie" | "list">("pie")

  const formatValue = (value: number) => {
    if (isPrivate) return "••••••"
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toFixed(2)}`
  }

  const getAssetColor = (index: number) => {
    const colors = [
      { from: "#8b5cf6", to: "#7c3aed" }, // purple
      { from: "#3b82f6", to: "#2563eb" }, // blue
      { from: "#10b981", to: "#059669" }, // green
      { from: "#f59e0b", to: "#d97706" }, // yellow
      { from: "#ef4444", to: "#dc2626" }, // red
      { from: "#6366f1", to: "#4f46e5" }, // indigo
    ]
    return colors[index % colors.length]
  }

  const radius = 60
  const circumference = 2 * Math.PI * radius
  let cumulativePercentage = 0

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Portfolio Allocation</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <span className="text-2xl font-bold text-white">{formatValue(totalValue)}</span>
              <span
                className={`text-sm font-medium flex items-center space-x-1 ${
                  change24h >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                <TrendingUp className={`w-4 h-4 ${change24h < 0 ? "rotate-180" : ""}`} />
                <span>
                  {change24h >= 0 ? "+" : ""}
                  {change24h.toFixed(2)}% 24h
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-white/5 rounded-xl p-1">
              <button
                onClick={() => setViewMode("pie")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "pie" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <PieChart className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onRebalance}
              className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Chart Section */}
          <div className="flex items-center justify-center">
            {viewMode === "pie" ? (
              <div className="relative w-48 h-48 sm:w-52 sm:h-52">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  {allocation.map((asset, index) => {
                    const strokeDasharray = `${(asset.percentage / 100) * circumference} ${circumference}`
                    const strokeDashoffset = (-cumulativePercentage * circumference) / 100
                    cumulativePercentage += asset.percentage

                    return (
                      <circle
                        key={asset.asset}
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke={`url(#gradient-${index})`}
                        strokeWidth="10"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out hover:stroke-opacity-80"
                        style={{
                          animationDelay: `${index * 0.2}s`,
                        }}
                      />
                    )
                  })}

                  {/* Gradients */}
                  <defs>
                    {allocation.map((_, index) => {
                      const colors = getAssetColor(index)
                      return (
                        <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={colors.from} />
                          <stop offset="100%" stopColor={colors.to} />
                        </linearGradient>
                      )
                    })}
                  </defs>
                </svg>

                {/* Center Info */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-400 text-xs sm:text-sm">Total Value</p>
                    <p className="text-white font-bold text-sm sm:text-lg">{formatValue(totalValue)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-sm space-y-3">
                {allocation.map((asset, index) => (
                  <div key={asset.asset} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium text-sm">{asset.symbol}</span>
                      <span className="text-gray-400 text-sm">{asset.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{
                          background: `linear-gradient(to right, ${getAssetColor(index).from}, ${getAssetColor(index).to})`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${asset.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Asset List */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4 text-center">Asset Breakdown</h4>
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {allocation.map((asset, index) => (
                <motion.div
                  key={asset.asset}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                      style={{
                        background: `linear-gradient(to right, ${getAssetColor(index).from}, ${getAssetColor(index).to})`,
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm sm:text-base truncate">{asset.symbol}</p>
                      <p className="text-gray-400 text-xs sm:text-sm truncate">{asset.asset}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-medium text-sm sm:text-base">{formatValue(asset.value)}</p>
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-gray-400 text-xs sm:text-sm">{asset.percentage.toFixed(1)}%</span>
                      <span className={`text-xs sm:text-sm font-medium ${asset.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {asset.change24h >= 0 ? "+" : ""}
                        {asset.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}