/**
 * Theme constants for the app
 */
import { Colors } from '../types';

/**
 * Light theme colors
 */
export const lightTheme: Colors = {
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
export const darkTheme: Colors = {
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
	overlay: 'rgba(0, 0, 0, 0.3)',
	ripple: 'rgba(255, 255, 255, 0.1)',
};

/**
 * Common spacing values
 */
export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 48,
};

/**
 * Common border radius values
 */
export const borderRadius = {
	sm: 4,
	md: 8,
	lg: 12,
	xl: 16,
	round: 50,
};

/**
 * Typography scale
 */
export const typography = {
	h1: {
		fontSize: 32,
		fontFamily: 'Inter_700Bold',
		lineHeight: 40,
	},
	h2: {
		fontSize: 28,
		fontFamily: 'Inter_600SemiBold',
		lineHeight: 36,
	},
	h3: {
		fontSize: 24,
		fontFamily: 'Inter_600SemiBold',
		lineHeight: 32,
	},
	h4: {
		fontSize: 20,
		fontFamily: 'Inter_600SemiBold',
		lineHeight: 28,
	},
	h5: {
		fontSize: 18,
		fontFamily: 'Inter_500Medium',
		lineHeight: 24,
	},
	h6: {
		fontSize: 16,
		fontFamily: 'Inter_500Medium',
		lineHeight: 22,
	},
	body1: {
		fontSize: 16,
		fontFamily: 'Inter_400Regular',
		lineHeight: 24,
	},
	body2: {
		fontSize: 14,
		fontFamily: 'Inter_400Regular',
		lineHeight: 20,
	},
	caption: {
		fontSize: 12,
		fontFamily: 'Inter_400Regular',
		lineHeight: 16,
	},
	button: {
		fontSize: 16,
		fontFamily: 'Inter_500Medium',
		lineHeight: 20,
	},
};

/**
 * Shadow styles
 */
export const shadows = {
	sm: {
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	md: {
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	lg: {
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 5,
	},
	xl: {
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.2,
		shadowRadius: 16,
		elevation: 8,
	},
};

/**
 * Animation durations
 */
export const animations = {
	fast: 150,
	normal: 300,
	slow: 500,
};
