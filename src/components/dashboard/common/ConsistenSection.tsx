// src/components/dashboard/common/ConsistentSection.tsx - Fixed file name and imports
import React from 'react'
import { getDashboardSectionClasses } from '../../../utils/dashboardHelpers'

interface ConsistentSectionProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
  variant?: 'default' | 'highlighted'
  centerContent?: boolean
}

export const ConsistentSection: React.FC<ConsistentSectionProps> = ({
  children,
  title,
  subtitle,
  className = '',
  variant = 'default',
  centerContent = true
}) => {
  return (
    <section className={`section_space pb-0 ${className}`}>
      <div className="container">
        {(title || subtitle) && (
          <div className={`row justify-content-center mb-4 ${centerContent ? '' : 'text-start'}`}>
            <div className="col-lg-10">
              <div className={`ico_heading_block ${centerContent ? 'text-center' : ''}`}>
                {title && <h2 className="heading_text mb-0 text-white">{title}</h2>}
                {subtitle && <p className="text-secondary mt-3">{subtitle}</p>}
              </div>
            </div>
          </div>
        )}
        
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {variant === 'highlighted' ? (
              <div className={getDashboardSectionClasses('highlighted')}>
                {children}
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// src/components/common/ConsistentButton.tsx - Reusable button component
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