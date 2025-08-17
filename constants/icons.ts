/**
 * Constants for icons used throughout the app
 */

/**
 * Icons for different document types
 */
export const DOCUMENT_ICONS: Record<string, string> = {
	pdf: 'picture-as-pdf',
	doc: 'description',
	docx: 'description',
	xls: 'table-chart',
	xlsx: 'table-chart',
	ppt: 'slideshow',
	pptx: 'slideshow',
	txt: 'text-snippet',
	csv: 'table-rows',
	md: 'notes',
	json: 'code',
	xml: 'code',
	html: 'code',
	css: 'code',
	js: 'code',
	ts: 'code',
	jsx: 'code',
	tsx: 'code',
	image: 'image',
	jpg: 'image',
	jpeg: 'image',
	png: 'image',
	gif: 'image',
	svg: 'image',
	webp: 'image',
	bmp: 'image',
	audio: 'music-note',
	mp3: 'music-note',
	wav: 'music-note',
	m4a: 'music-note',
	aac: 'music-note',
	video: 'movie',
	mp4: 'movie',
	avi: 'movie',
	mov: 'movie',
	wmv: 'movie',
	archive: 'folder-zip',
	zip: 'folder-zip',
	rar: 'folder-zip',
	'7z': 'folder-zip',
	tar: 'folder-zip',
	gz: 'folder-zip',
	epub: 'menu-book',
	mobi: 'menu-book',
	default: 'insert-drive-file',
};

/**
 * Navigation related icons
 */
export const NAVIGATION_ICONS: Record<string, string> = {
	home: 'home',
	documents: 'folder',
	favorites: 'star',
	recent: 'history',
	settings: 'settings',
	user: 'person',
	back: 'arrow-back',
	forward: 'arrow-forward',
	up: 'arrow-upward',
	down: 'arrow-downward',
	close: 'close',
	menu: 'menu',
	search: 'search',
	filter: 'filter-list',
	sort: 'sort',
	grid: 'grid-view',
	list: 'view-list',
	share: 'share',
	download: 'download',
	upload: 'upload',
	delete: 'delete',
	edit: 'edit',
	add: 'add',
	remove: 'remove',
	refresh: 'refresh',
};

/**
 * Action related icons
 */
export const ACTION_ICONS: Record<string, string> = {
	bookmark: 'bookmark',
	bookmarkBorder: 'bookmark-border',
	favorite: 'favorite',
	favoriteBorder: 'favorite-border',
	share: 'share',
	download: 'download',
	delete: 'delete',
	edit: 'edit',
	copy: 'content-copy',
	move: 'drive-file-move',
	rename: 'edit',
	info: 'info',
	preview: 'visibility',
	print: 'print',
	save: 'save',
	open: 'open-in-new',
	openWith: 'open-with',
	more: 'more-vert',
	options: 'more-horiz',
	settings: 'settings',
	help: 'help',
	feedback: 'feedback',
};

/**
 * Status related icons
 */
export const STATUS_ICONS: Record<string, string> = {
	success: 'check-circle',
	error: 'error',
	warning: 'warning',
	info: 'info',
	loading: 'hourglass-empty',
	sync: 'sync',
	offline: 'cloud-off',
	online: 'cloud-done',
	secure: 'lock',
	insecure: 'lock-open',
	verified: 'verified',
	unverified: 'new-releases',
};

/**
 * UI related icons
 */
export const UI_ICONS: Record<string, string> = {
	expand: 'expand-more',
	collapse: 'expand-less',
	chevronLeft: 'chevron-left',
	chevronRight: 'chevron-right',
	chevronUp: 'keyboard-arrow-up',
	chevronDown: 'keyboard-arrow-down',
	radio: 'radio-button-unchecked',
	radioSelected: 'radio-button-checked',
	checkbox: 'check-box-outline-blank',
	checkboxSelected: 'check-box',
	toggle: 'toggle-off',
	toggleSelected: 'toggle-on',
	visibility: 'visibility',
	visibilityOff: 'visibility-off',
	fullscreen: 'fullscreen',
	fullscreenExit: 'fullscreen-exit',
};

/**
 * Get icon for document type
 */
export const getDocumentTypeIcon = (fileExtension: string): string => {
	const ext = fileExtension.toLowerCase();
	return DOCUMENT_ICONS[ext] || DOCUMENT_ICONS.default;
};

export const CATEGORY_ICONS = {
	recent: {
		name: 'history',
		color: '#4CAF50',
	},
	pdfs: {
		name: 'picture-as-pdf',
		color: '#F44336',
	},
	documents: {
		name: 'description',
		color: '#2196F3',
	},
	spreadsheets: {
		name: 'table-chart',
		color: '#FF9800',
	},
	presentations: {
		name: 'slideshow',
		color: '#9C27B0',
	},
	images: {
		name: 'image',
		color: '#E91E63',
	},
	all: {
		name: 'folder',
		color: '#607D8B',
	},
};

export const getDocumentIconColor = (fileExtension: string): string => {
	const ext = fileExtension.toLowerCase();

	const iconColors: Record<string, string> = {
		pdf: '#FF4444',
		doc: '#2B5CE6',
		docx: '#2B5CE6',
		xls: '#10B981',
		xlsx: '#10B981',
		ppt: '#F59E0B',
		pptx: '#F59E0B',
		txt: '#6B7280',
		csv: '#10B981',
		image: '#8B5CF6',
		audio: '#F59E0B',
		video: '#EF4444',
		archive: '#374151',
		default: '#6B7280',
	};

	// Check for category-level matches
	if (ext.match(/^(jpg|jpeg|png|gif|svg|webp|bmp)$/)) {
		return iconColors.image;
	}
	if (ext.match(/^(mp3|wav|m4a|aac|ogg)$/)) {
		return iconColors.audio;
	}
	if (ext.match(/^(mp4|avi|mov|wmv|mkv)$/)) {
		return iconColors.video;
	}
	if (ext.match(/^(zip|rar|7z|tar|gz)$/)) {
		return iconColors.archive;
	}

	return iconColors[ext] || iconColors.default;
};
