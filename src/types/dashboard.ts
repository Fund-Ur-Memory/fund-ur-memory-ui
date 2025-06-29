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
  personalizedRecommendations: string[]
}

export interface MarketAnalysis {
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
  trendDirection: 'UPWARD' | 'DOWNWARD' | 'SIDEWAYS'
  aiRecommendation: string
}

export interface UserTradingFactors {
  averageHoldTime: number
  tradeFrequency: number
  volatilityTolerance: number
  diversificationScore: number
  emotionalTradingIndicators: string[]
  ethActivity: number
  avaxActivity: number
}

export interface MarketData {
  fearGreedIndex: number
  marketCapChange24h: number
  btcChange24h: number
  ethChange24h: number
  solChange24h: number
}

export interface WalletAnalysisResponse {
  success: boolean
  data?: {
    response: string
    action: string
    character: string
    riskScore: number
    confidencePercentage: number
    riskProfile: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK'
    marketAnalysis: MarketAnalysis
    userTradingFactors: UserTradingFactors
    riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
    personalizedRecommendations: string[]
    walletAddress: string
    marketData: MarketData
  }
  error?: string
}

export interface DashboardData {
  profile: UserProfile
  portfolio: Portfolio
  transactions: Transaction[]
  aiInsights: AIInsights
  vaults: Vault[]
}

// Indexer API response types
export interface IndexerVault {
  id: string
  owner: string
  token: string
  amount: string
  unlockTime: string
  targetPrice: string
  priceUp: string
  priceDown: string
  conditionType: number
  status: number
  createdAt: string
  updatedAt: string
  title: string
  message: string
  autoWithdraw: boolean
  creationTxHash: string
  creationBlockNumber: string
  unlockedAt: string | null
  unlockedTxHash: string | null
  withdrawnAt: string | null
  withdrawnTxHash: string | null
  emergencyWithdrawnAt: string | null
  emergencyPenalty: string | null
  emergencyTxHash: string | null
  insight: string | null
}

export interface VaultResponse {
  success: boolean
  vaults: IndexerVault[]
  message?: string
}

export interface AIInsightRequest {
  vaultId: string
  insight: string
  analysis?: string
}

export interface AIInsightResponse {
  success: boolean
  data?: {
    id: string
    vaultId: string
    insight: string
    createdAt: string
  }
  message?: string
}

export interface BaseAnalysis {
  amount?: number;
  tokenSymbol?: string;
  currentPrice?: number;
}

export interface TimeBasedAnalysis extends BaseAnalysis {
  score: number;
  recommendation: string;
  factors: string[];
  riskLevel: string;
  behavioralInsights: string[];
  marketConditions: string[];
  suggestedOptimizations: string[];
  fearGreedInsights: string[];
  expectedReturn?: {
    duration: number;
    durationUnit: string;
    initialInvestment: number;
    predictedValue: number;
    expectedReturn: number;
    expectedReturnPercentage: number;
    bestCaseScenario: number;
    worstCaseScenario: number;
    confidence: number;
    pricePredictions?: Array<{
      targetDate: string;
      predictedPrice: number;
      confidence: number;
      priceChange: number;
      priceChangePercentage: number;
      factors: string[];
    }>;
  };
  pricePredictions?: Array<{
    targetDate: string;
    predictedPrice: number;
    confidence: number;
    priceChange: number;
    priceChangePercentage: number;
    factors: string[];
  }>;
}

// Price-based commitment analysis
export interface PriceBasedAnalysis extends BaseAnalysis {
  upTarget: number;
  downTarget: number;
  upTargetAnalysis: {
    targetPrice: number;
    targetType: 'UP' | 'DOWN';
    expectedDays: number;
    confidence: number;
    probability: number;
    riskFactors: string[];
    marketConditions: string[];
  };
  downTargetAnalysis: {
    targetPrice: number;
    targetType: 'UP' | 'DOWN';
    expectedDays: number;
    confidence: number;
    probability: number;
    riskFactors: string[];
    marketConditions: string[];
  };
  overallRisk: string;
  expectedReturn: {
    upScenario: number;
    downScenario: number;
    weightedAverage: number;
    bestCase: number;
    worstCase: number;
  };
  insights: string[];
  recommendations: string[];
  timeToReachTargets: {
    upTarget: number;
    downTarget: number;
    averageTime: number;
  };
}