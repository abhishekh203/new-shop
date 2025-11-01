/**
 * Serif-Friendly Warm Theme Configuration
 * This theme provides a classic, elegant design with warm tones
 * that perfectly complement serif typography.
 */

export const serifTheme = {
  // Typography
  fontFamily: {
    serif: '"Georgia", "Times New Roman", "Times", serif',
    body: '"Georgia", "Times New Roman", "Times", serif',
    heading: '"Georgia", "Times New Roman", "Times", serif',
  },

  // Color Palette - Warm Tones
  colors: {
    // Backgrounds
    background: {
      primary: 'bg-amber-50',
      secondary: 'bg-orange-50',
      tertiary: 'bg-yellow-50',
      card: 'bg-white/90',
      cardHover: 'bg-white',
      overlay: 'bg-white/95',
    },

    // Text Colors
    text: {
      primary: 'text-gray-800',
      secondary: 'text-gray-700',
      tertiary: 'text-gray-600',
      muted: 'text-gray-500',
      accent: 'text-amber-700',
      accentHover: 'text-amber-800',
    },

    // Border Colors
    border: {
      primary: 'border-amber-200/60',
      secondary: 'border-amber-300/60',
      hover: 'border-amber-300/80',
      accent: 'border-amber-400/80',
    },

    // Button Colors
    button: {
      primary: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700',
      secondary: 'bg-white/80 hover:bg-amber-100/80',
      danger: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700',
      success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
      text: 'text-gray-700 hover:text-amber-800',
      textPrimary: 'text-white',
    },

    // Badge/Accent Colors
    accent: {
      primary: 'bg-gradient-to-r from-amber-600 to-orange-600',
      secondary: 'bg-gradient-to-r from-amber-400 to-orange-400',
      text: 'bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent',
    },

    // Shadows
    shadow: {
      card: 'shadow-lg',
      cardHover: 'shadow-xl hover:shadow-amber-300/20',
      button: 'shadow-lg',
    },
  },

  // Gradients
  gradients: {
    background: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
    card: 'bg-gradient-to-br from-white/90 to-amber-50/80',
    overlay: 'bg-gradient-to-br from-white/95 to-amber-50/95',
    button: 'bg-gradient-to-r from-amber-600 to-orange-600',
    accent: 'bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent',
  },

  // Spacing
  spacing: {
    cardPadding: 'p-5',
    sectionPadding: 'py-16',
    containerPadding: 'px-4 sm:px-6 lg:px-8',
  },

  // Border Radius
  radius: {
    card: 'rounded-2xl',
    button: 'rounded-xl',
    badge: 'rounded-full',
    input: 'rounded-xl',
  },

  // Transitions
  transitions: {
    default: 'transition-all duration-300',
    hover: 'hover:transition-all hover:duration-300',
  },
};

/**
 * Helper function to apply theme styles
 */
export const applySerifTheme = (componentType, variant = 'default') => {
  const baseStyles = {
    card: `${serifTheme.colors.background.card} ${serifTheme.colors.border.primary} ${serifTheme.radius.card} ${serifTheme.colors.shadow.card}`,
    button: `${serifTheme.colors.button.primary} ${serifTheme.radius.button} ${serifTheme.transitions.default}`,
    input: `${serifTheme.colors.background.card} ${serifTheme.colors.border.secondary} ${serifTheme.radius.input} ${serifTheme.transitions.default}`,
    badge: `${serifTheme.colors.accent.primary} ${serifTheme.radius.badge}`,
  };

  return baseStyles[componentType] || '';
};

/**
 * Theme provider component wrapper
 */
export const getThemeStyles = () => ({
  fontFamily: serifTheme.fontFamily.serif,
  colors: serifTheme.colors,
  gradients: serifTheme.gradients,
});
