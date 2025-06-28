import { type AIRecommendation } from '../types/dashboard'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const calculatePortfolioChange = (allocation: any[]): number => {
  const totalValue = allocation.reduce((sum, asset) => sum + asset.value, 0)
  const totalChange = allocation.reduce((sum, asset) => sum + (asset.value * asset.change24h / 100), 0)
  return (totalChange / totalValue) * 100
}

export const getRiskLevel = (score: number): 'low' | 'medium' | 'high' => {
  if (score < 30) return 'low'
  if (score < 70) return 'medium'
  return 'high'
}

export const getPriorityIcon = (priority: AIRecommendation['priority']): string => {
  switch (priority) {
    case 'high': return '🔴'
    case 'medium': return '🟡'
    case 'low': return '🟢'
    default: return '⚪'
  }
}

export const sortRecommendationsByPriority = (recommendations: AIRecommendation[]): AIRecommendation[] => {
  const priorityOrder = { high: 3, medium: 2, low: 1 }
  return [...recommendations].sort((a, b) => 
    priorityOrder[b.priority] - priorityOrder[a.priority] || 
    b.confidence - a.confidence
  )
}

export const truncateAddress = (address: string, start: number = 6, end: number = 4): string => {
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export const generateGradient = (asset: string): string => {
  const gradients = {
    ETH: 'from-blue-500 to-purple-600',
    BTC: 'from-orange-500 to-yellow-600',
    USDC: 'from-green-500 to-blue-600',
    AVAX: 'from-red-500 to-pink-600',
    ARB: 'from-blue-600 to-cyan-600'
  }
  return gradients[asset as keyof typeof gradients] || 'from-gray-500 to-gray-600'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toString()
}

export const getMaxTimeValue = (timeUnit: string): number => {
  switch (timeUnit) {
    case 'minutes': return 60 * 24 * 30
    case 'hours': return 24 * 30
    case 'days': return 365
    case 'months': return 24
    case 'years': return 5
    default: return 24
  }
}

export const getDefaultTimeValue = (timeUnit: string): number => {
  switch (timeUnit) {
    case 'minutes': return 30
    case 'hours': return 24
    case 'days': return 30
    case 'months': return 6
    case 'years': return 1
    default: return 6
  }
}