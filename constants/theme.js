/**
 * Theme constants for the app
 */

/**
 * Light theme colors
 */
export const lightTheme = {
  primary: '#2563EB',
  primaryVariant: '#1E40AF',
  secondary: '#60A5FA',
  secondaryVariant: '#3B82F6',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#F3F4F6',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  text: '#111827',
  textSecondary: '#4B5563',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  shadow: '#000000',
  divider: '#E5E7EB',
  overlay: 'rgba(0, 0, 0, 0.5)',
  ripple: 'rgba(0, 0, 0, 0.1)',
};

/**
 * Dark theme colors
 */
export const darkTheme = {
  primary: '#3B82F6',
  primaryVariant: '#60A5FA',
  secondary: '#60A5FA',
  secondaryVariant: '#93C5FD',
  background: '#111827',
  surface: '#1F2937',
  surfaceVariant: '#374151',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
  info: '#60A5FA',
  text: '#F9FAFB',
  textSecondary: '#E5E7EB',
  textTertiary: '#9CA3AF',
  border: '#374151',
  shadow: '#000000',
  divider: '#374151',
  overlay: 'rgba(0, 0, 0, 0.7)',
  ripple: 'rgba(255, 255, 255, 0.1)',
};

/**
 * Font sizes for different elements
 */
export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

/**
 * Spacing values for padding, margin, etc.
 */
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 56,
  '5xl': 64,
};

/**
 * Border radius values
 */
export const borderRadius = {
  none: 0,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

/**
 * Shadow styles for different elevations
 */
export const shadows = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  base: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.0,
    elevation: 2,
  },
  md: {
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 3.0,
    elevation: 3,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4.0,
    elevation: 4,
  },
  xl: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8.0,
    elevation: 6,
  },
  '2xl': {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.36,
    shadowRadius: 10.0,
    elevation: 8,
  },
};