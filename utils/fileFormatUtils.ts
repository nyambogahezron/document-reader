export const getFileExtension = (filenameOrUri: string): string => {
	if (!filenameOrUri) return '';

	const filename =
		filenameOrUri.split('/').pop()?.split('#')[0]?.split('?')[0] || '';

	const ext = filename.split('.').pop()?.toLowerCase() || '';

	return ext === filename ? '' : ext;
};

export const getFilenameFromUri = (uri: string): string => {
	if (!uri) return '';

	return uri.split('/').pop()?.split('#')[0]?.split('?')[0] || '';
};

export const getMimeType = (extension: string): string => {
	const mimeTypes: Record<string, string> = {
		// PDF
		pdf: 'application/pdf',

		// Microsoft Office
		doc: 'application/msword',
		docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		xls: 'application/vnd.ms-excel',
		xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		ppt: 'application/vnd.ms-powerpoint',
		pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

		// Text files
		txt: 'text/plain',
		rtf: 'application/rtf',
		csv: 'text/csv',

		// Images
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
		gif: 'image/gif',
		bmp: 'image/bmp',
		webp: 'image/webp',
		svg: 'image/svg+xml',

		// Audio
		mp3: 'audio/mpeg',
		wav: 'audio/wav',
		m4a: 'audio/mp4',
		aac: 'audio/aac',

		// Video
		mp4: 'video/mp4',
		avi: 'video/x-msvideo',
		mov: 'video/quicktime',
		wmv: 'video/x-ms-wmv',

		// Archives
		zip: 'application/zip',
		rar: 'application/vnd.rar',
		'7z': 'application/x-7z-compressed',
		tar: 'application/x-tar',
		gz: 'application/gzip',

		// Web
		html: 'text/html',
		htm: 'text/html',
		css: 'text/css',
		js: 'application/javascript',
		json: 'application/json',
		xml: 'application/xml',

		// eBooks
		epub: 'application/epub+zip',
		mobi: 'application/x-mobipocket-ebook',

		// Others
		exe: 'application/vnd.microsoft.portable-executable',
		dmg: 'application/x-apple-diskimage',
		iso: 'application/x-iso9660-image',
	};

	return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};

export const isDocumentSupported = (extension: string): boolean => {
	const supportedFormats = [
		'pdf',
		'txt',
		'doc',
		'docx',
		'xls',
		'xlsx',
		'ppt',
		'pptx',
		'rtf',
		'csv',
		'html',
		'htm',
		'xml',
		'json',
		'jpg',
		'jpeg',
		'png',
		'gif',
		'bmp',
		'webp',
		'svg',
	];

	return supportedFormats.includes(extension.toLowerCase());
};

export const getFileCategory = (extension: string): string => {
	const ext = extension.toLowerCase();

	if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) {
		return 'document';
	}

	if (['xls', 'xlsx', 'csv'].includes(ext)) {
		return 'spreadsheet';
	}

	if (['ppt', 'pptx'].includes(ext)) {
		return 'presentation';
	}

	if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) {
		return 'image';
	}

	if (['mp3', 'wav', 'm4a', 'aac'].includes(ext)) {
		return 'audio';
	}

	if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) {
		return 'video';
	}

	if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
		return 'archive';
	}

	if (['html', 'htm', 'css', 'js', 'json', 'xml'].includes(ext)) {
		return 'web';
	}

	if (['epub', 'mobi'].includes(ext)) {
		return 'ebook';
	}

	return 'other';
};

export const getFileTypeName = (extension: string): string => {
	const typeNames: Record<string, string> = {
		pdf: 'PDF Document',
		doc: 'Word Document',
		docx: 'Word Document',
		txt: 'Text File',
		rtf: 'Rich Text Format',

		xls: 'Excel Spreadsheet',
		xlsx: 'Excel Spreadsheet',
		csv: 'CSV File',

		ppt: 'PowerPoint Presentation',
		pptx: 'PowerPoint Presentation',

		jpg: 'JPEG Image',
		jpeg: 'JPEG Image',
		png: 'PNG Image',
		gif: 'GIF Image',
		bmp: 'Bitmap Image',
		webp: 'WebP Image',
		svg: 'SVG Vector Image',

		mp3: 'MP3 Audio',
		wav: 'WAV Audio',
		m4a: 'M4A Audio',
		aac: 'AAC Audio',

		mp4: 'MP4 Video',
		avi: 'AVI Video',
		mov: 'QuickTime Video',
		wmv: 'Windows Media Video',

		zip: 'ZIP Archive',
		rar: 'RAR Archive',
		'7z': '7-Zip Archive',
		tar: 'TAR Archive',
		gz: 'GZIP Archive',

		html: 'HTML Document',
		htm: 'HTML Document',
		css: 'CSS Stylesheet',
		js: 'JavaScript File',
		json: 'JSON File',
		xml: 'XML File',

		epub: 'EPUB eBook',
		mobi: 'Mobipocket eBook',
	};

	return (
		typeNames[extension.toLowerCase()] || `${extension.toUpperCase()} File`
	);
};

export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isImageFile = (extension: string): boolean => {
	const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
	return imageExtensions.includes(extension.toLowerCase());
};

export const isVideoFile = (extension: string): boolean => {
	const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
	return videoExtensions.includes(extension.toLowerCase());
};

export const isAudioFile = (extension: string): boolean => {
	const audioExtensions = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'wma', 'flac'];
	return audioExtensions.includes(extension.toLowerCase());
};

export const isTextFile = (extension: string): boolean => {
	const textExtensions = [
		'txt',
		'rtf',
		'md',
		'csv',
		'json',
		'xml',
		'html',
		'htm',
		'css',
		'js',
		'ts',
		'jsx',
		'tsx',
	];
	return textExtensions.includes(extension.toLowerCase());
};

export const getViewerType = (
	extension: string
): 'pdf' | 'image' | 'text' | 'web' | 'unsupported' => {
	const ext = extension.toLowerCase();

	if (ext === 'pdf') {
		return 'pdf';
	}

	if (isImageFile(ext)) {
		return 'image';
	}

	if (isTextFile(ext) || ['html', 'htm'].includes(ext)) {
		return 'web';
	}

	if (['txt', 'rtf', 'csv', 'json', 'xml'].includes(ext)) {
		return 'text';
	}

	return 'unsupported';
};

export const formatDate = (date: string | Date): string => {
	try {
		const dateObj = typeof date === 'string' ? new Date(date) : date;

		if (isNaN(dateObj.getTime())) {
			return 'Unknown date';
		}

		const now = new Date();
		const diff = now.getTime() - dateObj.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (days === 0) {
			return 'Today';
		} else if (days === 1) {
			return 'Yesterday';
		} else if (days < 7) {
			return `${days} days ago`;
		} else if (days < 30) {
			const weeks = Math.floor(days / 7);
			return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
		} else {
			return dateObj.toLocaleDateString();
		}
	} catch (error) {
		return 'Unknown date';
	}
};

export const getDocumentTypeName = (extension: string): string => {
	const ext = extension.toLowerCase();

	const typeNames: Record<string, string> = {
		pdf: 'PDF Document',
		doc: 'Word Document',
		docx: 'Word Document',
		xls: 'Excel Spreadsheet',
		xlsx: 'Excel Spreadsheet',
		ppt: 'PowerPoint Presentation',
		pptx: 'PowerPoint Presentation',
		txt: 'Text File',
		rtf: 'Rich Text Document',
		csv: 'CSV File',
		json: 'JSON File',
		xml: 'XML File',
		html: 'HTML File',
		htm: 'HTML File',
		md: 'Markdown File',
		jpg: 'JPEG Image',
		jpeg: 'JPEG Image',
		png: 'PNG Image',
		gif: 'GIF Image',
		svg: 'SVG Image',
		webp: 'WebP Image',
		bmp: 'Bitmap Image',
		mp3: 'MP3 Audio',
		wav: 'WAV Audio',
		m4a: 'M4A Audio',
		aac: 'AAC Audio',
		mp4: 'MP4 Video',
		avi: 'AVI Video',
		mov: 'QuickTime Video',
		wmv: 'WMV Video',
		zip: 'ZIP Archive',
		rar: 'RAR Archive',
		'7z': '7-Zip Archive',
		tar: 'TAR Archive',
		gz: 'Gzip Archive',
	};

	return typeNames[ext] || 'Unknown Type';
};
