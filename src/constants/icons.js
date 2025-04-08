/**
 * Constants for icons used throughout the app
 */

/**
 * Icons for different document types
 */
export const DOCUMENT_ICONS = {
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
  image: 'image',
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  svg: 'image',
  webp: 'image',
  audio: 'music-note',
  mp3: 'music-note',
  mp4: 'movie',
  video: 'movie',
  zip: 'folder-zip',
  rar: 'folder-zip',
  default: 'insert-drive-file',
};

/**
 * Navigation related icons
 */
export const NAVIGATION_ICONS = {
  home: 'home',
  documents: 'folder',
  favorites: 'star',
  recent: 'history',
  settings: 'settings',
  user: 'person',
  back: 'arrow-back',
  forward: 'arrow-forward',
  close: 'close',
  menu: 'menu',
};

/**
 * Action icons
 */
export const ACTION_ICONS = {
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  share: 'share',
  download: 'cloud-download',
  upload: 'cloud-upload',
  search: 'search',
  bookmark: 'bookmark',
  bookmarkBorder: 'bookmark-border',
  favorite: 'favorite',
  favoriteBorder: 'favorite-border',
  more: 'more-vert',
  moreHoriz: 'more-horiz',
  sort: 'sort',
  filter: 'filter-list',
  copy: 'content-copy',
  paste: 'content-paste',
  cut: 'content-cut',
};

/**
 * Category icons
 */
export const CATEGORY_ICONS = {
  all: 'apps',
  documents: 'description',
  images: 'photo',
  videos: 'movie',
  audio: 'music-note',
  archives: 'folder-zip',
  code: 'code',
  recent: 'history',
  bookmarks: 'bookmark',
};

/**
 * Feedback and status icons
 */
export const FEEDBACK_ICONS = {
  success: 'check-circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
  help: 'help',
  loading: 'refresh',
};

/**
 * Get the appropriate icon for a document type
 * @param {string} type - File extension or type
 * @returns {object} Icon configuration
 */
export const getDocumentTypeIcon = (type) => {
  if (!type) return DOCUMENT_ICONS.default;
  
  const lowerType = type.toLowerCase();
  return DOCUMENT_ICONS[lowerType] || DOCUMENT_ICONS.default;
};