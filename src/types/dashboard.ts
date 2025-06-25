export interface UserProfile {
  address: string
  ensName?: string
  joinDate: string
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive'
  totalAssets: number
  activeVaults: number
  totalReturns: number
  successRate: number
}

export interface AssetAllocation {
  asset: string
  symbol: string
  amount: number
  value: number
  percentage: number
  change24h: number
  chain: string
}

export interface Portfolio {
  totalValue: number
  change24h: number
  allocation: AssetAllocation[]
}

export interface Transaction {
  id: number
  type: 'vault_create' | 'vault_execute' | 'cross_chain_transfer' | 'swap'
  asset: string
  amount: number
  date: string
  status: 'active' | 'completed' | 'pending' | 'failed'
  conditions?: string
  transactionHash?: string
}

export interface AIRecommendation {
  id: string
  type: 'opportunity' | 'warning' | 'suggestion'
  title: string
  description: string
  action: string
  confidence: number
  priority: 'low' | 'medium' | 'high'
  createdAt: number
}

export interface Vault {
  id: number
  asset: string
  amount: number
  value: number
  condition: 'Time Lock' | 'Price Target' | 'Smart Combo'
  target: string
  progress: number
  status: 'active' | 'completed' | 'cancelled'
  createdAt: string
  expiresAt?: string
  currentPrice?: number
  targetPrice?: number
  aiScore: number
  message: string
}

export interface AIInsights {
  riskScore: number
  confidence: number
  marketSentiment: 'Bullish' | 'Bearish' | 'Neutral'
  recommendations: AIRecommendation[]
}

export interface DashboardData {
  profile: UserProfile
  portfolio: Portfolio
  transactions: Transaction[]
  aiInsights: AIInsights
  vaults: Vault[]
}