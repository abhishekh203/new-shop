/**
 * Light Theme Color System
 * 
 * Color tokens based on the actual design patterns used in the application.
 * All colors optimized for light theme.
 */

// ============================================================================
// CORE COLORS
// ============================================================================
export const CoreColors = {
  White: '#FFFFFF',
  Black: '#000000',
}

// ============================================================================
// BRAND COLORS (Based on actual usage)
// ============================================================================
export const Teal = {
  50: '#F0FDFA',
  100: '#CCFBF1',
  200: '#99F6E4',
  300: '#5EEAD4',
  400: '#2DD4BF',
  500: '#14B8A6',
  600: '#0D9488',
  700: '#0F766E',
  800: '#115E59',
  900: '#134E4A',
  950: '#042F2E',
}

export const Cyan = {
  50: '#ECFEFF',
  100: '#CFFAFE',
  200: '#A5F3FC',
  300: '#67E8F9',
  400: '#22D3EE',
  500: '#06B6D4',
  600: '#0891B2',
  700: '#0E7490',
  800: '#155E75',
  900: '#164E63',
  950: '#083344',
}

export const Blue = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6',
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
  950: '#172554',
}

// ============================================================================
// NEUTRAL COLORS (Gray Scale)
// ============================================================================
export const Gray = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
  950: '#030712',
}

// ============================================================================
// SEMANTIC COLORS
// ============================================================================
export const Green = {
  50: '#F0FDF4',
  100: '#DCFCE7',
  200: '#BBF7D0',
  300: '#86EFAC',
  400: '#4ADE80',
  500: '#22C55E',
  600: '#16A34A',
  700: '#15803D',
  800: '#166534',
  900: '#14532D',
  950: '#052E16',
}

export const Red = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  300: '#FCA5A5',
  400: '#F87171',
  500: '#EF4444',
  600: '#DC2626',
  700: '#B91C1C',
  800: '#991B1B',
  900: '#7F1D1D',
  950: '#450A0A',
}

export const Orange = {
  50: '#FFF7ED',
  100: '#FFEDD5',
  200: '#FED7AA',
  300: '#FDBA74',
  400: '#FB923C',
  500: '#F97316',
  600: '#EA580C',
  700: '#C2410C',
  800: '#9A3412',
  900: '#7C2D12',
  950: '#431407',
}

export const Amber = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#F59E0B',
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
  950: '#451A03',
}

export const Purple = {
  50: '#FAF5FF',
  100: '#F3E8FF',
  200: '#E9D5FF',
  300: '#D8B4FE',
  400: '#C084FC',
  500: '#A855F7',
  600: '#9333EA',
  700: '#7E22CE',
  800: '#6B21A8',
  900: '#581C87',
  950: '#3B0764',
}

export const Pink = {
  50: '#FDF2F8',
  100: '#FCE7F3',
  200: '#FBCFE8',
  300: '#F9A8D4',
  400: '#F472B6',
  500: '#EC4899',
  600: '#DB2777',
  700: '#BE185D',
  800: '#9F1239',
  900: '#831843',
  950: '#500724',
}

// ============================================================================
// LIGHT THEME TOKENS (Semantic naming)
// ============================================================================
export const LightTheme = {
  // Backgrounds
  background: CoreColors.White,
  backgroundSecondary: Gray[50],
  backgroundTertiary: Gray[100],
  surface: CoreColors.White,
  surfaceElevated: Gray[50],
  
  // Text Colors
  textPrimary: Gray[900],
  textSecondary: Gray[600],
  textTertiary: Gray[500],
  textMuted: Gray[400],
  textInverse: CoreColors.White,
  
  // Brand Colors
  primary: Teal[500],
  primaryLight: Teal[400],
  primaryDark: Teal[600],
  secondary: Cyan[500],
  secondaryLight: Cyan[400],
  secondaryDark: Cyan[600],
  accent: Blue[500],
  
  // Status Colors
  success: Green[500],
  warning: Amber[500],
  error: Red[500],
  info: Blue[500],
  
  // Borders
  border: Gray[200],
  borderLight: Gray[100],
  borderDark: Gray[300],
  
  // Interactive States
  hover: Gray[50],
  active: Gray[100],
  focus: Blue[500],
  
  // Shadows
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
}

// ============================================================================
// GRADIENT COLORS (Common gradients used)
// ============================================================================
export const Gradients = {
  primary: `linear-gradient(to right, ${Teal[500]}, ${Cyan[500]})`,
  primaryHover: `linear-gradient(to right, ${Teal[600]}, ${Cyan[600]})`,
  secondary: `linear-gradient(to right, ${Blue[500]}, ${Cyan[500]})`,
  accent: `linear-gradient(to right, ${Orange[500]}, ${Red[500]})`,
  success: `linear-gradient(to right, ${Green[500]}, ${Green[600]})`,
  textPrimary: `linear-gradient(to right, ${CoreColors.White}, ${Gray[100]}, ${Gray[300]})`,
  textBrand: `linear-gradient(to right, ${Teal[400]}, ${Cyan[400]}, ${Blue[400]})`,
  backgroundHero: `linear-gradient(to bottom right, ${Gray[900]}, ${CoreColors.Black}, ${Gray[800]})`,
}

// ============================================================================
// EXPORT
// ============================================================================
export const colors = {
  core: CoreColors,
  teal: Teal,
  cyan: Cyan,
  blue: Blue,
  gray: Gray,
  green: Green,
  red: Red,
  orange: Orange,
  amber: Amber,
  purple: Purple,
  pink: Pink,
  theme: LightTheme,
  gradients: Gradients,
}

export default colors
