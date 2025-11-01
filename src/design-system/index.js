/**
 * Design System
 * 
 * Main entry point for the design system.
 * Export all foundations and components.
 */

// Export foundations
export * from './foundations'

// Export components
export * from './components'

// Default export with everything organized
import foundations from './foundations'
import components from './components'

export default {
  ...foundations,
  components,
}
