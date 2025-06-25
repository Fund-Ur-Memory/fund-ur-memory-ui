import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle, Brain, ChevronRight } from 'lucide-react'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { type AIRecommendation } from '../../../types/dashboard'
import { getPriorityIcon } from '../../../utils/helpers'

interface AIRecommendationCardProps {
  recommendation: AIRecommendation
  onAction?: () => void
  onLearnMore?: () => void
  delay?: number
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  recommendation,
  onAction,
  onLearnMore,
  delay = 0
}) => {
  const getIcon = () => {
    switch (recommendation.type) {
      case 'opportunity':
        return TrendingUp
      case 'warning':
        return AlertTriangle
      case 'suggestion':
        return Brain
      default:
        return Brain
    }
  }

  const getIconColor = () => {
    switch (recommendation.type) {
      case 'opportunity':
        return 'text-green-400 bg-green-500/20'
      case 'warning':
        return 'text-red-400 bg-red-500/20'
      case 'suggestion':
        return 'text-blue-400 bg-blue-500/20'
      default:
        return 'text-gray-400 bg-gray-500/20'
    }
  }

  const Icon = getIcon()
  const iconColor = getIconColor()

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card hover>
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h4 className="text-white font-medium">{recommendation.title}</h4>
                <span className="text-lg">{getPriorityIcon(recommendation.priority)}</span>
              </div>
              {/* <span className="text-gray-400 text-xs">
                {formatTimeAgo(recommendation.createdAt)}
              </span> */}
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{recommendation.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {onAction && (
                  <Button
                    size="sm"
                    onClick={onAction}
                    className="text-xs"
                  >
                    {recommendation.action}
                  </Button>
                )}
                
                {onLearnMore && (
                  <button 
                    onClick={onLearnMore}
                    className="text-gray-400 hover:text-white text-sm flex items-center transition-colors"
                  >
                    Learn More
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  recommendation.priority === 'high' ? 'bg-red-400' :
                  recommendation.priority === 'medium' ? 'bg-yellow-400' :
                  'bg-green-400'
                }`} />
                <span className="text-gray-500 text-xs">
                  {recommendation.confidence}% confidence
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}