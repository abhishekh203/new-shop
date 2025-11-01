import React from 'react'
import { colors, spacing, borderRadius, shadows, typography } from '../foundations'

/**
 * Card Component
 * 
 * Flexible card component with variants.
 */

export const Card = React.forwardRef(
  (
    {
      children,
      variant = 'default',
      padding = 'medium',
      className = '',
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: {
        background: colors.core.White,
        border: `1px solid ${colors.theme.border}`,
        boxShadow: shadows.md,
      },
      elevated: {
        background: colors.core.White,
        border: 'none',
        boxShadow: shadows.xl,
      },
      outlined: {
        background: 'transparent',
        border: `2px solid ${colors.theme.border}`,
        boxShadow: shadows.none,
      },
      subtle: {
        background: colors.theme.backgroundSecondary,
        border: 'none',
        boxShadow: shadows.none,
      },
    }

    const paddingStyles = {
      none: spacing[0],
      small: spacing[4],
      medium: spacing[6],
      large: spacing[8],
    }

    const style = {
      ...variantStyles[variant],
      padding: paddingStyles[padding],
      borderRadius: borderRadius['2xl'],
    }

    return (
      <div
        ref={ref}
        className={className}
        style={style}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

/**
 * CardHeader Component
 */
export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={className}
      style={{ marginBottom: spacing[4] }}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * CardTitle Component
 */
export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3
      className={className}
      style={typography.textStyles.h3}
      {...props}
    >
      {children}
    </h3>
  )
}

/**
 * CardDescription Component
 */
export const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p
      className={className}
      style={{
        ...typography.textStyles.bodySmall,
        color: colors.theme.textSecondary,
      }}
      {...props}
    >
      {children}
    </p>
  )
}

/**
 * CardContent Component
 */
export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export default Card
