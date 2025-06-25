import { type DashboardData } from '../../types/dashboard'

export class MockAPIService {
  private static delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static async getDashboardData(address: string): Promise<DashboardData> {
    await this.delay(1500)

    return {
      profile: {
        address,
        ensName: 'crypto-whale.eth',
        joinDate: '2024-01-15',
        riskProfile: 'Conservative',
        totalAssets: 2847329.45,
        activeVaults: 12,
        totalReturns: 187432.89,
        successRate: 87
      },
      portfolio: {
        totalValue: 2847329.45,
        change24h: 2.34,
        allocation: [
          { asset: 'Ethereum', symbol: 'ETH', amount: 445.2, value: 1423664.73, percentage: 50, change24h: 3.45, chain: 'Ethereum' },
          { asset: 'Bitcoin', symbol: 'WBTC', amount: 8.3, value: 569465.89, percentage: 20, change24h: -1.23, chain: 'Ethereum' },
          { asset: 'USD Coin', symbol: 'USDC', amount: 427099, value: 427099.42, percentage: 15, change24h: 0.01, chain: 'Ethereum' },
          { asset: 'Avalanche', symbol: 'AVAX', amount: 7123, value: 284732.95, percentage: 10, change24h: 5.67, chain: 'Avalanche' },
          { asset: 'Arbitrum', symbol: 'ARB', amount: 142366, value: 142366.46, percentage: 5, change24h: 2.89, chain: 'Arbitrum' }
        ]
      },
      transactions: [
        {
          id: 1,
          type: 'vault_create',
          asset: 'ETH',
          amount: 100,
          date: '2024-06-24T10:30:00Z',
          status: 'active',
          conditions: 'Time Lock: 6 months'
        },
        {
          id: 2,
          type: 'vault_execute',
          asset: 'BTC',
          amount: 2.5,
          date: '2024-06-23T15:45:00Z',
          status: 'completed',
          conditions: 'Price Target: $70,000'
        },
        {
          id: 3,
          type: 'cross_chain_transfer',
          asset: 'USDC',
          amount: 50000,
          date: '2024-06-22T09:15:00Z',
          status: 'completed',
          conditions: 'Avalanche → Ethereum'
        }
      ],
      aiInsights: {
        riskScore: 23,
        confidence: 89,
        marketSentiment: 'Bullish',
        recommendations: [
          {
            id: 'rec_1',
            type: 'opportunity',
            title: 'Optimal ETH Entry Point',
            description: 'Based on your trading history, ETH shows 78% probability of reaching $4,200 within 3 months.',
            action: 'Consider creating a commitment vault',
            confidence: 89,
            priority: 'high',
            createdAt: Date.now()
          },
          {
            id: 'rec_2',
            type: 'warning',
            title: 'High Concentration Risk',
            description: 'Your portfolio shows 70% allocation to volatile assets. Consider diversification.',
            action: 'Rebalance portfolio',
            confidence: 94,
            priority: 'medium',
            createdAt: Date.now() - 3600000
          },
          {
            id: 'rec_3',
            type: 'suggestion',
            title: 'Cross-Chain Yield Opportunity',
            description: 'Avalanche offers 12% APY on USDC. Your current 15% USDC allocation could benefit.',
            action: 'Explore yield farming',
            confidence: 76,
            priority: 'low',
            createdAt: Date.now() - 7200000
          }
        ]
      },
      vaults: [
        {
          id: 1,
          asset: 'ETH',
          amount: 100,
          value: 320000,
          condition: 'Time Lock',
          target: '6 months',
          progress: 45,
          status: 'active',
          createdAt: '2024-01-15',
          expiresAt: '2024-07-15',
          aiScore: 85,
          message: 'Remember: You created this during the market dip to avoid panic selling.'
        },
        {
          id: 2,
          asset: 'BTC',
          amount: 5,
          value: 340000,
          condition: 'Price Target',
          target: '$75,000',
          progress: 78,
          status: 'active',
          createdAt: '2024-02-01',
          currentPrice: 68500,
          targetPrice: 75000,
          aiScore: 92,
          message: 'BTC consolidation phase - perfect for long-term holding.'
        },
        {
          id: 3,
          asset: 'AVAX',
          amount: 2000,
          value: 80000,
          condition: 'Smart Combo',
          target: '$50 OR 3 months',
          progress: 25,
          status: 'active',
          createdAt: '2024-03-01',
          aiScore: 67,
          message: 'Avalanche ecosystem growth - high potential but volatile.'
        }
      ]
    }
  }

//   static async getVaultDetails(vaultId: number) {
//     await this.delay(500)
//     // Return detailed vault information
//     return {
//       // Extended vault data
//     }
//   }

//   static async getAIAnalysis(address: string) {
//     await this.delay(1000)
//     // Return AI analysis
//     return {
//       // AI analysis data
//     }
//   }
}