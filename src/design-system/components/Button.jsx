import React from 'react'
import { colors, typography, spacing, borderRadius, shadows } from '../foundations'

/**
 * Button Component
 * 
 * Reusable button component following the design system.
 */

export const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      className = '',
      disabled = false,
      isLoading = false,
      icon,
      iconPosition = 'left',
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Variant styles
    const variantStyles = {
      primary: {
        background: colors.gradients.primary,
        color: colors.core.White,
        hoverBackground: colors.gradients.primaryHover,
      },
      secondary: {
        background: colors.gradients.secondary,
        color: colors.core.White,
        hoverBackground: `linear-gradient(to right, ${colors.blue[600]}, ${colors.cyan[600]})`,
      },
      outline: {
        background: 'transparent',
        color: colors.theme.textPrimary,
        border: `2px solid ${colors.theme.border}`,
        hoverBackground: colors.theme.hover,
      },
      ghost: {
        background: 'transparent',
        color: colors.theme.textPrimary,
        hoverBackground: colors.theme.hover,
      },
      danger: {
        background: colors.theme.error,
        color: colors.core.White,
        hoverBackground: colors.red[600],
      },
      success: {
        background: colors.theme.success,
        color: colors.core.White,
        hoverBackground: colors.green[600],
      },
    }

    // Size styles
    const sizeStyles = {
      small: {
        padding: `${spacing[2]} ${spacing[4]}`,
        fontSize: typography.fontSize.sm,
        borderRadius: borderRadius.lg,
      },
      medium: {
        padding: `${spacing[3]} ${spacing[6]}`,
        fontSize: typography.fontSize.base,
        borderRadius: borderRadius['2xl'],
      },
      large: {
        padding: `${spacing[4]} ${spacing[8]}`,
        fontSize: typography.fontSize.lg,
        borderRadius: borderRadius['2xl'],
      },
    }

    const variantStyle = variantStyles[variant] || variantStyles.primary
    const sizeStyle = sizeStyles[size] || sizeStyles.medium

    const buttonStyle = {
      ...typography.textStyles.body,
      ...sizeStyle,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[2],
      background: variantStyle.background,
      color: variantStyle.color,
      border: variantStyle.border || 'none',
      fontWeight: typography.fontWeight.bold,
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 200ms ease-in-out',
      boxShadow: variant === 'primary' || variant === 'secondary' ? shadows.lg : shadows.none,
      outline: 'none',
    }

    return (
      <button
        ref={ref}
        type={type}
        className={className}
        disabled={disabled || isLoading}
        onClick={onClick}
        style={buttonStyle}
        onMouseEnter={(e) => {
          if (!disabled && !isLoading && variantStyle.hoverBackground) {
            e.currentTarget.style.background = variantStyle.hoverBackground
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !isLoading) {
            e.currentTarget.style.background = variantStyle.background
          }
        }}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin"
              style={{ width: '16px', height: '16px' }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && <span>{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === 'right' && <span>{icon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
