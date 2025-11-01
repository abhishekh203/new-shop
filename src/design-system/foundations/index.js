/**
 * Design System Foundations
 * 
 * Central export for all foundation elements.
 */

import { colors } from './colors'
import { typography, textStyles } from './typography'
import { spacing, borderRadius, shadows, zIndex } from './spacing'
import { durations, easings, keyframes, animations } from './animations'

export { colors, default as colorTokens } from './colors'
export { typography, textStyles, default as typographyTokens } from './typography'
export { spacing, borderRadius, shadows, zIndex, default as spacingTokens } from './spacing'
export { durations, easings, keyframes, animations, default as animationTokens } from './animations'

export default {
  colors,
  typography,
  textStyles,
  spacing: { spacing, borderRadius, shadows, zIndex },
  animations: { durations, easings, keyframes, animations },
}
