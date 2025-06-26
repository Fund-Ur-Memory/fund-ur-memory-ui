export const getDashboardSectionClasses = (variant: 'default' | 'highlighted' | 'warning' | 'success' = 'default') => {
  const baseClasses = 'ico_iconbox_block p-4'
  
  const variantClasses = {
    default: '',
    highlighted: 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30',
    warning: 'bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/30',
    success: 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30'
  }
  
  return `${baseClasses} ${variantClasses[variant]}`
}

export const getStatusBadgeStyle = (status: string) => {
  const statusStyles = {
    active: {
      background: 'rgba(34, 197, 94, 0.2)',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      color: '#86efac'
    },
    completed: {
      background: 'rgba(59, 130, 246, 0.2)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      color: '#93c5fd'
    },
    pending: {
      background: 'rgba(251, 191, 36, 0.2)',
      border: '1px solid rgba(251, 191, 36, 0.3)',
      color: '#fde047'
    },
    failed: {
      background: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      color: '#fca5a5'
    }
  }
  
  return statusStyles[status as keyof typeof statusStyles] || statusStyles.pending
}