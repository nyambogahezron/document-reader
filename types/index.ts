// Navigation types
export interface DocumentViewerParams {
	uri: string;
	name: string;
	type: string;
}

export interface NavigationProps {
	goBack: () => void;
}

// Document types
export interface DocumentInfo {
	name: string;
	type: string;
	uri: string;
	size: string;
	lastModified: string;
	[key: string]: any; // Allow indexing for sorting
}

export interface Document {
	uri: string;
	name: string;
	type: string;
	size: number;
	lastModified: Date;
	isBookmarked?: boolean;
	thumbnailPath?: string;
	category?: string;
	tags?: string[];
} // Theme types
export interface Colors {
	primary: string;
	primaryVariant: string;
	secondary: string;
	secondaryVariant: string;
	background: string;
	surface: string;
	surfaceVariant: string;
	error: string;
	success: string;
	warning: string;
	info: string;
	text: string;
	textSecondary: string;
	textTertiary: string;
	border: string;
	shadow: string;
	divider: string;
	overlay: string;
	ripple: string;
}

export interface ThemeContextType {
	isDark: boolean;
	colors: Colors;
	setScheme: (scheme: 'light' | 'dark' | 'auto') => void;
}

// Animation types
export interface AnimatedValueType {
	setValue: (value: number) => void;
	interpolate: (config: any) => any;
	// Add other animated value methods as needed
}

// Document Viewer Component Props
export interface DocumentViewerProps {
	uri: string;
	type?: string;
	onPageChange?: (page: number) => void;
	onLoadComplete?: (total: number) => void;
	onError?: (error: { message: string }) => void;
	style?: any;
	pageMargin?: number;
	showPageIndicator?: boolean;
	enablePinchGesture?: boolean;
	enableDoubleTapZoom?: boolean;
	enableAnnotationRendering?: boolean;
	horizontalSwipe?: boolean;
	password?: string;
	cacheEnabled?: boolean;
	textContent?: string;
}

// Safe Area Insets
export interface SafeAreaInsets {
	top: number;
	bottom: number;
	left: number;
	right: number;
}
