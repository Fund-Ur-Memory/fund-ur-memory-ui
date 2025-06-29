import React from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PrivacyToggleProps {
  isPrivate: boolean
  onToggle: (isPrivate: boolean) => void
  className?: string
}

export const PrivacyToggle: React.FC<PrivacyToggleProps> = ({ 
  isPrivate, 
  onToggle, 
  className = '' 
}) => {
  return (
    <button
      onClick={() => onToggle(!isPrivate)}
      className={`flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors ${className}`}
    >
      {isPrivate ? (
        <EyeOff className="w-4 h-4 text-white" />
      ) : (
        <Eye className="w-4 h-4 text-gray-400" />
      )}
      <span className="text-sm text-gray-300">
        {isPrivate ? 'Private' : 'Public'}
      </span>
    </button>
  )
}