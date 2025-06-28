// src/services/vaultsAnalysisService.ts
// Service for fetching AI-powered vault analysis insights

export interface TimeDistribution {
  shortTerm: number
  mediumTerm: number
  longTerm: number
}

export interface TopToken {
  token: string
  count: number
  totalValue: number
}

export interface MarketData {
  btc: number
  eth: number
  sol: number
  sentiment: string
  volatility: string
  fearGreedIndex: number
  marketCapChange24h: number
  btcChange24h: number
  ethChange24h: number
  solChange24h: number
  timestamp: number
}

export interface VaultsAnalysisData {
  response: string
  action: string
  character: string
  totalVaults: number
  activeVaults: number | null
  completedVaults: number
  emergencyWithdrawnVaults: number
  successRate: number
  totalValueLocked: number
  averageAmount: number
  averageLockDuration: number
  timeDistribution: TimeDistribution
  topTokens: TopToken[]
  commonPatterns: string[]
  riskInsights: string[]
  behavioralInsights: string[]
  marketInsights: string[]
  recommendations: string[]
  marketData?: MarketData
}

export interface VaultsAnalysisResponse {
  success: boolean
  data?: VaultsAnalysisData
  error?: string
}

// Cache for analysis data to prevent excessive API calls
const analysisCache = new Map<string, { data: VaultsAnalysisResponse; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

/**
 * Fetch AI-powered vault analysis insights
 */
export const fetchVaultsAnalysis = async (text = "Analyze community vault patterns and provide insights"): Promise<VaultsAnalysisResponse> => {
  try {
    // Check cache first
    const cacheKey = text
    const cached = analysisCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('🎯 Using cached vaults analysis')
      return cached.data
    }

    console.log('🔍 Fetching fresh vaults analysis from API...')

    const response = await fetch('https://fund-ur-memory-agents-production.up.railway.app/api/vaults-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data: VaultsAnalysisResponse = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch vaults analysis')
    }

    // Cache the successful result
    analysisCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    })

    console.log('✅ Vaults analysis fetched successfully:', {
      totalVaults: data.data?.totalVaults,
      successRate: data.data?.successRate,
      totalValueLocked: data.data?.totalValueLocked
    })

    return data

  } catch (error) {
    console.error('❌ Failed to fetch vaults analysis:', error)
    
    // Return error response
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Clear analysis cache (useful for manual refresh)
 */
export const clearVaultsAnalysisCache = (): void => {
  analysisCache.clear()
  console.log('🗑️ Vaults analysis cache cleared')
}

/**
 * Get cache status for debugging
 */
export const getAnalysisCacheStatus = (): { size: number; keys: string[] } => {
  return {
    size: analysisCache.size,
    keys: Array.from(analysisCache.keys())
  }
}

/**
 * Parse markdown insights from AI response
 */
export const parseMarkdownInsights = (response: string): { sections: Record<string, string[]> } => {
  const sections: Record<string, string[]> = {}
  
  try {
    const lines = response.split('\n')
    let currentSection = ''
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      // Check for section headers (## or ###)
      if (trimmedLine.startsWith('##') || trimmedLine.startsWith('###')) {
        currentSection = trimmedLine.replace(/^#+\s*/, '').replace(/\*\*/g, '')
        sections[currentSection] = []
      } else if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
        // Bullet points
        if (currentSection && sections[currentSection]) {
          sections[currentSection].push(trimmedLine.replace(/^[•-]\s*/, ''))
        }
      } else if (trimmedLine && currentSection && !trimmedLine.startsWith('**') && !trimmedLine.startsWith('#')) {
        // Regular content lines
        if (sections[currentSection]) {
          sections[currentSection].push(trimmedLine)
        }
      }
    }
  } catch (error) {
    console.warn('Failed to parse markdown insights:', error)
  }
  
  return { sections }
}

/**
 * Format success rate with color coding
 */
export const formatSuccessRate = (rate: number): { color: string; emoji: string; label: string } => {
  if (rate >= 90) {
    return { color: '#10B981', emoji: '🟢', label: 'Excellent' }
  } else if (rate >= 80) {
    return { color: '#F59E0B', emoji: '🟡', label: 'Good' }
  } else if (rate >= 60) {
    return { color: '#F97316', emoji: '🟠', label: 'Fair' }
  } else {
    return { color: '#EF4444', emoji: '🔴', label: 'Needs Improvement' }
  }
}

/**
 * Format market sentiment with emoji
 */
export const formatMarketSentiment = (sentiment: string): { emoji: string; label: string; color: string } => {
  const lowerSentiment = sentiment.toLowerCase()
  
  if (lowerSentiment.includes('greed')) {
    return { emoji: '🐂', label: 'Greed', color: '#10B981' }
  } else if (lowerSentiment.includes('fear')) {
    return { emoji: '🐻', label: 'Fear', color: '#EF4444' }
  } else {
    return { emoji: '⚖️', label: 'Neutral', color: '#6B7280' }
  }
}