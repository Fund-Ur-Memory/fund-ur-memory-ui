import React from 'react'

interface ConsistentButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  loading?: boolean
}

export const ConsistentButton: React.FC<ConsistentButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  loading = false
}) => {
  const getButtonClasses = () => {
    let classes = ''
    
    switch (variant) {
      case 'primary':
        classes = 'ico_creative_btn'
        break
      case 'secondary':
        classes = 'btn btn-outline-light'
        break
      case 'outline':
        classes = 'btn btn-outline-primary'
        break
    }
    
    if (size === 'sm') classes += ' btn-sm'
    if (size === 'lg') classes += ' btn-lg'
    if (disabled || loading) classes += ' opacity-50 cursor-not-allowed'
    
    return `${classes} ${className}`
  }

  return (
    <button
      className={getButtonClasses()}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {variant === 'primary' ? (
        <span className="btn_wrapper">
          {loading && (
            <span className="btn_icon_left">
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            </span>
          )}
          <span className="btn_label">{children}</span>
        </span>
      ) : (
        <>
          {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
          {children}
        </>
      )}
    </button>
  )
}