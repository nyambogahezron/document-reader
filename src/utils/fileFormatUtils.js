/**
 * Utility functions for file format handling
 */

/**
 * Extract file extension from filename or URI
 * @param {string} filenameOrUri - The filename or URI to get extension from
 * @returns {string} The file extension without dot (e.g., 'pdf', 'docx')
 */
export const getFileExtension = (filenameOrUri) => {
  if (!filenameOrUri) return '';
  
  // Extract filename from URI if needed
  const filename = filenameOrUri.split('/').pop().split('#')[0].split('?')[0];
  
  // Get extension
  const ext = filename.split('.').pop().toLowerCase();
  
  // Return empty string if no extension found
  return ext === filename ? '' : ext;
};

/**
 * Extract filename from a URI
 * @param {string} uri - The URI to extract filename from
 * @returns {string} The filename
 */
export const getFilenameFromUri = (uri) => {
  if (!uri) return '';
  
  // Extract filename from URI
  const filename = uri.split('/').pop().split('#')[0].split('?')[0];
  return filename;
};

/**
 * Get mime type based on file extension
 * @param {string} extension - File extension without dot
 * @returns {string} The corresponding MIME type
 */
export const getMimeType = (extension) => {
  const mimeTypes = {
    // Text files
    txt: 'text/plain',
    csv: 'text/csv',
    html: 'text/html',
    css: 'text/css',
    md: 'text/markdown',
    
    // Document files
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    rtf: 'application/rtf',
    
    // Spreadsheet files
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    
    // Presentation files
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    
    // Image files
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    
    // Audio files
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    
    // Video files
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    
    // Data files
    json: 'application/json',
    xml: 'application/xml',
    
    // Archive files
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    
    // Code files
    js: 'application/javascript',
    py: 'text/x-python',
    java: 'text/x-java',
  };
  
  const ext = extension ? extension.toLowerCase() : '';
  return mimeTypes[ext] || 'application/octet-stream';
};

/**
 * Check if a file type is supported by the app
 * @param {string} extensionOrFilename - File extension or filename
 * @returns {boolean} True if supported, false otherwise
 */
export const isDocumentSupported = (extensionOrFilename) => {
  // Extract extension if filename is provided
  const extension = extensionOrFilename.includes('.')
    ? getFileExtension(extensionOrFilename)
    : extensionOrFilename;
  
  // List of supported file types
  const supportedTypes = [
    // Documents
    'pdf', 'doc', 'docx', 'rtf', 'txt', 'md',
    
    // Spreadsheets
    'xls', 'xlsx', 'csv',
    
    // Presentations
    'ppt', 'pptx',
    
    // Images
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp',
    
    // Data
    'json', 'xml',
    
    // Web
    'html', 'css', 'js',
  ];
  
  return supportedTypes.includes(extension.toLowerCase());
};

/**
 * Format file size in human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0 || bytes === undefined || bytes === null) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(1);
  
  return `${parseFloat(size)} ${units[i]}`;
};

/**
 * Get friendly document type name
 * @param {string} type - File extension
 * @returns {string} Human-readable document type
 */
export const getDocumentTypeName = (type) => {
  const typeMap = {
    // Documents
    pdf: 'PDF Document',
    doc: 'Word Document',
    docx: 'Word Document',
    rtf: 'Rich Text Document',
    txt: 'Text File',
    md: 'Markdown File',
    
    // Spreadsheets
    xls: 'Excel Spreadsheet',
    xlsx: 'Excel Spreadsheet',
    csv: 'CSV File',
    
    // Presentations
    ppt: 'PowerPoint Presentation',
    pptx: 'PowerPoint Presentation',
    
    // Images
    jpg: 'JPEG Image',
    jpeg: 'JPEG Image',
    png: 'PNG Image',
    gif: 'GIF Image',
    bmp: 'Bitmap Image',
    svg: 'SVG Image',
    webp: 'WebP Image',
    
    // Data
    json: 'JSON File',
    xml: 'XML File',
    
    // Web
    html: 'HTML File',
    css: 'CSS File',
    js: 'JavaScript File',
  };
  
  if (!type) return 'Unknown File';
  return typeMap[type.toLowerCase()] || 'Unknown File';
};

/**
 * Get the icon name for a file type
 * @param {string} type - File extension
 * @returns {string} Material icon name
 */
export const getFileIconName = (type) => {
  const iconMap = {
    // Documents
    pdf: 'picture-as-pdf',
    doc: 'description',
    docx: 'description',
    rtf: 'description',
    txt: 'text-snippet',
    md: 'text-snippet',
    
    // Spreadsheets
    xls: 'table-chart',
    xlsx: 'table-chart',
    csv: 'table-chart',
    
    // Presentations
    ppt: 'slideshow',
    pptx: 'slideshow',
    
    // Images
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    bmp: 'image',
    svg: 'image',
    webp: 'image',
    
    // Data
    json: 'code',
    xml: 'code',
    
    // Web
    html: 'code',
    css: 'code',
    js: 'code',
  };
  
  if (!type) return 'insert-drive-file';
  return iconMap[type.toLowerCase()] || 'insert-drive-file';
};

/**
 * Format timestamp into readable date
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  
  // Check if the date is today
  if (date.toDateString() === now.toDateString()) {
    return 'Today';
  }
  
  // Check if the date is yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  // Format as day and month if this year
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  
  // Format with year for older dates
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};