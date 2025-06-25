import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hover = false 
}) => {
  const hoverClass = hover ? 'hover:shadow-xl hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300' : ''
  const clickClass = onClick ? 'cursor-pointer' : ''
  
  return (
    <div 
      className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 ${hoverClass} ${clickClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}