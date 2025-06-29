import { Clock, Zap } from "lucide-react"
import { Target } from "lucide-react"

export const DASHBOARD_TABS = [
  { id: 'overview', label: 'Overview', icon: 'TrendingUp' },
  { id: 'vaults', label: 'Vaults', icon: 'Shield' },
  { id: 'ai', label: 'AI Insights', icon: 'Brain' },
  { id: 'profile', label: 'Profile', icon: 'Settings' }
] as const

export const ASSET_ICONS = {
  ETH: '🔷',
  BTC: '₿',
  USDC: '💵',
  AVAX: '🔺',
  ARB: '🔵'
} as const

export const RISK_COLORS = {
  low: 'text-green-400 bg-green-500/20',
  medium: 'text-yellow-400 bg-yellow-500/20',
  high: 'text-red-400 bg-red-500/20'
} as const

export const RECOMMENDATION_TYPES = {
  opportunity: {
    color: 'text-green-400 bg-green-500/20',
    icon: 'TrendingUp'
  },
  warning: {
    color: 'text-red-400 bg-red-500/20',
    icon: 'AlertTriangle'
  },
  suggestion: {
    color: 'text-blue-400 bg-blue-500/20',
    icon: 'Brain'
  }
} as const

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 }
  }
} as const

export const COMMITMENT_CONDITIONS = [
  {
    id: 'TIME_BASED',
    title: 'times',
    description: 'Lock for specific duration',
    icon: Clock,
    color: '#0E9462',
    available: true
  },
  {
    id: 'PRICE_TARGET',
    title: 'price',
    description: 'Unlock at target price',
    icon: Target,
    color: '#FFCC00',
    available: true
  },
  {
    id: 'COMBO',
    title: 'combo (Coming Soon)',
    description: 'Time + Price combination',
    icon: Zap,
    color: '#8B5CF6',
    available: false
  }
]

export const TIME_UNITS = [
  { value: 'minutes', label: 'minutes', shortLabel: 'min' },
  { value: 'hours', label: 'hours', shortLabel: 'hrs' },
  { value: 'days', label: 'days', shortLabel: 'days' },
  { value: 'months', label: 'months', shortLabel: 'mos' },
  { value: 'years', label: 'years', shortLabel: 'yrs' }
]

export const SUPPORTED_TOKENS = [
  { symbol: 'AVAX', name: 'Avalanche', color: '#E84142', available: true },
  { symbol: 'ETH', name: '(Coming Soon)', color: '#627EEA', available: false },
  { symbol: 'MONAD', name: '(Coming Soon)', color: '#8B5CF6', available: false }
]
