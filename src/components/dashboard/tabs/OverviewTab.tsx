import React from 'react'
import { TrendingUp, DollarSign, Shield, Brain } from 'lucide-react'
import { MetricCard } from '../cards/MetricCard'
import { PortfolioCard } from '../cards/PortfolioCard'
import { AIRecommendationCard } from '../cards/AIRecommendationCard'
import { ActivityCard } from '../cards/ActivityCard'
import { type DashboardData } from '../../../types/dashboard'

interface OverviewTabProps {
  data: DashboardData
  isPrivacyMode: boolean
  onRefetch: () => void
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  isPrivacyMode
}) => {
  const { profile, portfolio, transactions, aiInsights } = data

  return (
    <div className="space-y-8">
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Portfolio"
          value={portfolio.totalValue}
          change={portfolio.change24h}
          icon={DollarSign}
          iconColor="text-green-400"
          isPrivate={isPrivacyMode}
          delay={0}
        />
        
        <MetricCard
          title="Active Vaults"
          value={profile.activeVaults}
          icon={Shield}
          iconColor="text-purple-400"
          delay={0.1}
          subtitle="3 expiring soon"
        />
        
        <MetricCard
          title="Total Returns"
          value={profile.totalReturns}
          change={12.4}
          icon={TrendingUp}
          iconColor="text-blue-400"
          isPrivate={isPrivacyMode}
          delay={0.2}
        />
        
        <MetricCard
          title="Success Rate"
          value={`${profile.successRate}%`}
          icon={Brain}
          iconColor="text-green-400"
          delay={0.3}
          subtitle="Above average"
        />
      </div>

      {/* Portfolio Allocation */}
      <PortfolioCard
        allocation={portfolio.allocation}
        totalValue={portfolio.totalValue}
        change24h={portfolio.change24h}
        isPrivate={isPrivacyMode}
        onRebalance={() => console.log('Rebalance portfolio')}
      />

      {/* AI Recommendations Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">AI Recommendations</h3>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {aiInsights.recommendations.slice(0, 2).map((rec, index) => (
            <AIRecommendationCard
              key={rec.id}
              recommendation={rec}
              delay={0.5 + index * 0.1}
              onAction={() => console.log('Execute recommendation:', rec.action)}
              onLearnMore={() => console.log('Learn more about:', rec.title)}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <ActivityCard
        transactions={transactions}
        isPrivate={isPrivacyMode}
        onViewAll={() => console.log('View all transactions')}
      />
    </div>
  )
}