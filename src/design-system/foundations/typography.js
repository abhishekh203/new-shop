/**
 * Typography System
 * 
 * Font families, sizes, weights, and text styles for the design system.
 */

// ============================================================================
// FONT FAMILIES
// ============================================================================
export const fontFamilies = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
}

// ============================================================================
// FONT SIZES
// ============================================================================
export const fontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
  '6xl': '3.75rem', // 60px
  '7xl': '4.5rem',  // 72px
}

// ============================================================================
// LINE HEIGHTS
// ============================================================================
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
}

// ============================================================================
// FONT WEIGHTS
// ============================================================================
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
}

// ============================================================================
// LETTER SPACING
// ============================================================================
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
}

// ============================================================================
// TEXT STYLES (Presets)
// ============================================================================
export const textStyles = {
  // Display
  display: {
    fontSize: fontSize['7xl'],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.black,
    letterSpacing: letterSpacing.tight,
  },
  
  // Headings
  h1: {
    fontSize: fontSize['5xl'],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.black,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize: fontSize['4xl'],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontSize: fontSize.xl,
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.normal,
  },
  h6: {
    fontSize: fontSize.lg,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.normal,
  },
  
  // Body
  bodyLarge: {
    fontSize: fontSize.xl,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  
  // Labels
  label: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
  },
  labelSmall: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
  },
  
  // Special
  caption: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  overline: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase',
  },
}

// ============================================================================
// EXPORT
// ============================================================================
export const typography = {
  fontFamily: fontFamilies,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
  textStyles,
}

export default typography
