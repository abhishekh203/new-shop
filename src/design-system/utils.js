/**
 * Design System Utilities
 * 
 * Helper functions to use design system tokens easily.
 */

import { colors, typography, spacing, borderRadius, shadows } from './foundations'

/**
 * Get color value from design system
 */
export const getColor = (path) => {
  const keys = path.split('.')
  let value = colors
  for (const key of keys) {
    value = value[key]
    if (!value) return null
  }
  return value
}

/**
 * Get spacing value
 */
export const getSpacing = (size) => spacing[size] || size

/**
 * Get typography style object
 */
export const getTextStyle = (style) => typography.textStyles[style] || {}

/**
 * Get border radius
 */
export const getRadius = (size) => borderRadius[size] || size

/**
 * Get shadow
 */
export const getShadow = (size) => {
  if (typeof shadows[size] === 'string') return shadows[size]
  return shadows[size] || shadows.base
}

/**
 * Helper to create style object with design system tokens
 */
export const createStyle = (styles) => {
  const result = {}
  
  for (const [key, value] of Object.entries(styles)) {
    if (key === 'color' && typeof value === 'string' && value.includes('.')) {
      result[key] = getColor(value)
    } else if (key === 'backgroundColor' && typeof value === 'string' && value.includes('.')) {
      result[key] = getColor(value)
    } else if (key === 'padding' || key === 'margin' || key === 'gap') {
      result[key] = getSpacing(value)
    } else if (key === 'borderRadius') {
      result[key] = getRadius(value)
    } else if (key === 'boxShadow') {
      result[key] = getShadow(value)
    } else {
      result[key] = value
    }
  }
  
  return result
}

/**
 * Convert design system color to Tailwind class name
 * Returns the hex value for use in style props
 */
export const colorToStyle = (colorPath) => {
  const color = getColor(colorPath)
  return color || colorPath
}

export default {
  getColor,
  getSpacing,
  getTextStyle,
  getRadius,
  getShadow,
  createStyle,
  colorToStyle,
}

