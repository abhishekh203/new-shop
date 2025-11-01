/**
 * Animation System
 * 
 * Duration, easing, and animation presets.
 */

// ============================================================================
// DURATIONS
// ============================================================================
export const durations = {
  fastest: '50ms',
  faster: '100ms',
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '400ms',
  slowest: '500ms',
}

// ============================================================================
// EASINGS
// ============================================================================
export const easings = {
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
}

// ============================================================================
// KEYFRAMES (Object format for CSS-in-JS)
// ============================================================================
export const keyframes = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  slideUp: {
    from: { transform: 'translateY(100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideDown: {
    from: { transform: 'translateY(-100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
}

// ============================================================================
// ANIMATION PRESETS
// ============================================================================
export const animations = {
  fadeIn: `${durations.normal} ${easings.out}`,
  fadeOut: `${durations.normal} ${easings.in}`,
  slideUp: `${durations.normal} ${easings.out}`,
  slideDown: `${durations.normal} ${easings.out}`,
  scaleIn: `${durations.normal} ${easings.spring}`,
}

// ============================================================================
// EXPORT
// ============================================================================
export default {
  durations,
  easings,
  keyframes,
  animations,
}
